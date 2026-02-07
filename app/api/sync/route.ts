// ==============================================
// POST /api/sync
// ==============================================
// Endpoint para sincronizar datos del Regenmon local → Hub
// Actualiza stats, puntos, y otorga tokens $FRUTA

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { SyncRegenmonSchema } from "@/app/lib/validations";
import { checkRateLimit } from "@/app/lib/ratelimit";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";
import { calculateTokenReward, awardTokens } from "@/app/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    // ==============================================
    // VALIDAR BODY
    // ==============================================
    const body = await req.json();
    const data = SyncRegenmonSchema.parse(body);

    // ==============================================
    // RATE LIMITING POR REGENMON ID
    // ==============================================
    const { success, remaining } = await checkRateLimit(`sync:${data.regenmonId}`);

    if (!success) {
      throw new ApiError(
        429,
        "Too many sync requests. Please wait before syncing again.",
        { remaining, resetIn: "60 seconds" }
      );
    }

    // ==============================================
    // BUSCAR REGENMON
    // ==============================================
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id: data.regenmonId },
    });

    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found", {
        regenmonId: data.regenmonId,
      });
    }

    if (!regenmon.isActive) {
      throw new ApiError(403, "This Regenmon is inactive and cannot be synced");
    }

    // ==============================================
    // CALCULAR PUNTOS NUEVOS Y TOKENS
    // ==============================================
    const pointsGained = Math.max(0, data.totalPoints - regenmon.totalPoints);
    let tokensEarned = 0;

    if (pointsGained > 0) {
      tokensEarned = await calculateTokenReward(pointsGained);
    }

    // ==============================================
    // ACTUALIZAR EN TRANSACCIÓN
    // ==============================================
    const updated = await prisma.$transaction(async (tx) => {
      // Actualizar Regenmon
      const updated = await tx.registeredRegenmon.update({
        where: { id: data.regenmonId },
        data: {
          stats: data.stats,
          totalPoints: data.totalPoints,
          lastSynced: new Date(),
        },
      });

      // Crear snapshot histórico
      await tx.snapshot.create({
        data: {
          regenmonId: data.regenmonId,
          balance: updated.balance,
          totalPoints: data.totalPoints,
          trainingHistory: data.trainingHistory,
        },
      });

      return updated;
    });

    // ==============================================
    // OTORGAR TOKENS (si hay puntos nuevos)
    // ==============================================
    let newBalance = updated.balance;

    if (tokensEarned > 0) {
      newBalance = await awardTokens(
        data.regenmonId,
        tokensEarned,
        `Training reward: ${pointsGained} points earned`,
        {
          pointsGained,
          totalPoints: data.totalPoints,
          trainingCount: data.trainingHistory.length,
        }
      );
    }

    // ==============================================
    // RESPUESTA
    // ==============================================
    return successResponse({
      balance: newBalance,
      tokensEarned,
      totalPoints: data.totalPoints,
      lastSynced: updated.lastSynced,
      message: tokensEarned > 0
        ? `Earned ${tokensEarned} $FRUTA tokens! 🎉`
        : "Synced successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
