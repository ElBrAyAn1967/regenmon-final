// ==============================================
// GET + POST /api/regenmon/[id]/messages
// ==============================================
// Leer y enviar mensajes a un Regenmon

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { SendMessageSchema } from "@/app/lib/validations";
import { checkRateLimit, getClientIP } from "@/app/lib/ratelimit";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";

// ==============================================
// GET: Leer mensajes de un Regenmon
// ==============================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que el Regenmon existe
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found");
    }

    // Parsear query params
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    // Obtener mensajes
    const messages = await prisma.message.findMany({
      where: { regenmonId: id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        fromRegenmonId: true,
        fromName: true,
        message: true,
        createdAt: true,
      },
    });

    return successResponse({
      messages,
      total: messages.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ==============================================
// POST: Enviar mensaje a un Regenmon
// ==============================================
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetId } = await params;

    // ==============================================
    // VALIDAR BODY
    // ==============================================
    const body = await req.json();
    const data = SendMessageSchema.parse(body);

    // No puedes enviarte mensajes a ti mismo
    if (data.fromRegenmonId === targetId) {
      throw new ApiError(400, "You cannot send a message to yourself");
    }

    // ==============================================
    // RATE LIMITING
    // ==============================================
    const ip = getClientIP(req.headers);
    const { success } = await checkRateLimit(`msg:${ip}`);
    if (!success) {
      throw new ApiError(429, "Too many messages. Please wait before sending another.");
    }

    // ==============================================
    // VERIFICAR QUE AMBOS REGENMONS EXISTEN
    // ==============================================
    const [sender, target] = await Promise.all([
      prisma.registeredRegenmon.findUnique({
        where: { id: data.fromRegenmonId },
        select: { id: true, isActive: true, name: true },
      }),
      prisma.registeredRegenmon.findUnique({
        where: { id: targetId },
        select: { id: true, isActive: true, name: true },
      }),
    ]);

    if (!sender) {
      throw new ApiError(404, "Sender Regenmon not found");
    }
    if (!target) {
      throw new ApiError(404, "Target Regenmon not found");
    }
    if (!sender.isActive) {
      throw new ApiError(403, "Sender Regenmon is inactive");
    }
    if (!target.isActive) {
      throw new ApiError(403, "Target Regenmon is inactive");
    }

    // ==============================================
    // CREAR MENSAJE
    // ==============================================
    const message = await prisma.message.create({
      data: {
        regenmonId: targetId,
        fromRegenmonId: data.fromRegenmonId,
        fromName: data.fromName,
        message: data.message,
      },
      select: {
        id: true,
        fromRegenmonId: true,
        fromName: true,
        message: true,
        createdAt: true,
      },
    });

    return successResponse(
      {
        message: message,
        targetName: target.name,
      },
      `Message sent to ${target.name}! 📨`,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
