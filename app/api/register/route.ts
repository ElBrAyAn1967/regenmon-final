// ==============================================
// POST /api/register
// ==============================================
// Endpoint para registrar un nuevo Regenmon en el hub

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { RegisterRegenmonSchema } from "@/app/lib/validations";
import { checkRateLimit, getClientIP } from "@/app/lib/ratelimit";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";

export async function POST(req: NextRequest) {
  try {
    // ==============================================
    // RATE LIMITING
    // ==============================================
    const ip = getClientIP(req.headers);
    const { success, remaining } = await checkRateLimit(`register:${ip}`);

    if (!success) {
      throw new ApiError(
        429,
        "Too many registration requests. Please try again later.",
        { remaining, resetIn: "60 seconds" }
      );
    }

    // ==============================================
    // VALIDAR BODY
    // ==============================================
    const body = await req.json();
    const data = RegisterRegenmonSchema.parse(body);

    // ==============================================
    // VERIFICAR URL ÚNICA
    // ==============================================
    const existingByUrl = await prisma.registeredRegenmon.findUnique({
      where: { appUrl: data.appUrl },
    });

    if (existingByUrl) {
      throw new ApiError(
        409,
        "A Regenmon with this URL already exists",
        { field: "appUrl", value: data.appUrl }
      );
    }

    // ==============================================
    // VERIFICAR SI EL USUARIO YA TIENE UN REGENMON
    // ==============================================
    if (data.privyUserId) {
      const existingByUser = await prisma.registeredRegenmon.findFirst({
        where: { privyUserId: data.privyUserId },
      });

      if (existingByUser) {
        throw new ApiError(
          409,
          "You already have a registered Regenmon",
          {
            field: "privyUserId",
            existingRegenmon: {
              id: existingByUser.id,
              name: existingByUser.name,
              appUrl: existingByUser.appUrl,
            },
          }
        );
      }
    }

    // ==============================================
    // CREAR REGISTRO
    // ==============================================
    const regenmon = await prisma.registeredRegenmon.create({
      data: {
        name: data.name,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail || null,
        privyUserId: data.privyUserId || null,
        appUrl: data.appUrl,
        sprite: data.sprite,
        stage: 1,
        stats: { happiness: 50, energy: 50, hunger: 50 },
        totalPoints: 0,
        balance: 0,
        isActive: true,
      },
    });

    // ==============================================
    // RESPUESTA
    // ==============================================
    return successResponse(
      {
        id: regenmon.id,
        name: regenmon.name,
        appUrl: regenmon.appUrl,
        balance: regenmon.balance,
        totalPoints: regenmon.totalPoints,
        registeredAt: regenmon.registeredAt,
      },
      "Regenmon registered successfully! 🎉",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
