// ==============================================
// GET /api/regenmon/[id]
// ==============================================
// Endpoint para ver un Regenmon público
// Registra visita para analytics

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";
import { getClientIP } from "@/app/lib/ratelimit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ==============================================
    // BUSCAR REGENMON CON CONTEO DE VISITAS
    // ==============================================
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    });

    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found", {
        regenmonId: id,
      });
    }

    // ==============================================
    // REGISTRAR VISITA (ASYNC - NO BLOQUEAR)
    // ==============================================
    const ip = getClientIP(req.headers);
    const referrer = req.headers.get("referer") || null;

    // Fire and forget - no esperar a que termine
    prisma.visit
      .create({
        data: {
          regenmonId: id,
          visitorIp: ip,
          referrer,
          // visitorCountry se puede agregar con un servicio de geolocalización
        },
      })
      .catch((error) => {
        console.error("Failed to register visit:", error);
      });

    // ==============================================
    // RESPUESTA CON DATOS PÚBLICOS
    // ==============================================
    return successResponse(
      {
        id: regenmon.id,
        name: regenmon.name,
        ownerName: regenmon.ownerName,
        sprite: regenmon.sprite,
        stage: regenmon.stage,
        stats: regenmon.stats,
        totalPoints: regenmon.totalPoints,
        balance: regenmon.balance,
        totalVisits: regenmon._count.visits + 1, // +1 por la visita actual
        registeredAt: regenmon.registeredAt,
        lastSynced: regenmon.lastSynced,
        isActive: regenmon.isActive,
      },
      undefined,
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Configuración de cache
export const revalidate = 60; // Revalidar cada 60 segundos
