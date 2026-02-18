// ==============================================
// GET /api/regenmon/[id]/activity
// ==============================================
// Actividad reciente de un Regenmon (feeds, gifts, mensajes)

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que el Regenmon existe
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id },
      select: { id: true, name: true, isActive: true },
    });

    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found");
    }

    // Parsear query params
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 30);

    // ==============================================
    // OBTENER ACTIVIDAD EN PARALELO
    // ==============================================
    const [transactions, messagesReceived] = await Promise.all([
      // Transacciones recibidas (feeds, gifts de otros)
      prisma.tokenTransaction.findMany({
        where: {
          regenmonId: id,
          OR: [
            { reason: { contains: "Fed by" } },
            { metadata: { path: ["type"], equals: "gift_received" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          type: true,
          amount: true,
          reason: true,
          metadata: true,
          createdAt: true,
        },
      }),
      // Mensajes recibidos
      prisma.message.findMany({
        where: { regenmonId: id },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          fromName: true,
          fromRegenmonId: true,
          message: true,
          createdAt: true,
        },
      }),
    ]);

    // ==============================================
    // COMBINAR Y ORDENAR POR FECHA
    // ==============================================
    const activity = [
      ...transactions.map((t) => ({
        id: t.id,
        type: t.reason?.includes("Fed by") ? "feed_received" as const : "gift_received" as const,
        description: t.reason || "",
        amount: t.amount,
        metadata: t.metadata,
        createdAt: t.createdAt,
      })),
      ...messagesReceived.map((m) => ({
        id: m.id,
        type: "message_received" as const,
        description: `${m.fromName}: "${m.message}"`,
        amount: 0,
        metadata: { fromRegenmonId: m.fromRegenmonId, fromName: m.fromName },
        createdAt: m.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return successResponse({
      regenmonName: regenmon.name,
      activity,
      total: activity.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
