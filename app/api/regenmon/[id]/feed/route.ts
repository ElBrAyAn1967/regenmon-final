// ==============================================
// POST /api/regenmon/[id]/feed
// ==============================================
// Alimentar al Regenmon de otro usuario
// Gasta 10 $FRUTA del remitente, reduce hambre del receptor

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { FeedOtherRegenmonSchema } from "@/app/lib/validations";
import { checkRateLimit, getClientIP } from "@/app/lib/ratelimit";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";

const FEED_COST = 10;
const HUNGER_REDUCTION = 30;
const HAPPINESS_BOOST = 5;

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
    const data = FeedOtherRegenmonSchema.parse(body);

    // No puedes alimentarte a ti mismo
    if (data.fromRegenmonId === targetId) {
      throw new ApiError(400, "You cannot feed your own Regenmon through this endpoint");
    }

    // ==============================================
    // RATE LIMITING
    // ==============================================
    const ip = getClientIP(req.headers);
    const { success } = await checkRateLimit(`feed:${ip}`);
    if (!success) {
      throw new ApiError(429, "Too many feed requests. Please wait before feeding again.");
    }

    // ==============================================
    // BUSCAR AMBOS REGENMONS
    // ==============================================
    const [sender, target] = await Promise.all([
      prisma.registeredRegenmon.findUnique({ where: { id: data.fromRegenmonId } }),
      prisma.registeredRegenmon.findUnique({ where: { id: targetId } }),
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
    if (sender.balance < FEED_COST) {
      throw new ApiError(400, `Insufficient balance. Have ${sender.balance} $FRUTA, need ${FEED_COST} $FRUTA`);
    }

    // ==============================================
    // EJECUTAR TRANSACCIÓN
    // ==============================================
    const result = await prisma.$transaction(async (tx) => {
      // 1. Descontar tokens del remitente
      const updatedSender = await tx.registeredRegenmon.update({
        where: { id: data.fromRegenmonId },
        data: { balance: { decrement: FEED_COST } },
      });

      // 2. Actualizar stats del receptor (reducir hambre, subir felicidad)
      const targetStats = target.stats as { happiness: number; energy: number; hunger: number };
      const newHunger = Math.max(0, targetStats.hunger - HUNGER_REDUCTION);
      const newHappiness = Math.min(100, targetStats.happiness + HAPPINESS_BOOST);

      const updatedTarget = await tx.registeredRegenmon.update({
        where: { id: targetId },
        data: {
          stats: {
            ...targetStats,
            hunger: newHunger,
            happiness: newHappiness,
          },
        },
      });

      // 3. Registrar transacción del remitente (gasto)
      await tx.tokenTransaction.create({
        data: {
          regenmonId: data.fromRegenmonId,
          type: "feed",
          amount: -FEED_COST,
          balanceBefore: sender.balance,
          balanceAfter: updatedSender.balance,
          reason: `Fed ${target.name} (owned by ${target.ownerName})`,
          metadata: { targetId, targetName: target.name },
        },
      });

      // 4. Registrar transacción del receptor (recibió comida)
      await tx.tokenTransaction.create({
        data: {
          regenmonId: targetId,
          type: "feed",
          amount: 0,
          balanceBefore: target.balance,
          balanceAfter: target.balance,
          reason: `Fed by ${sender.name} (owned by ${sender.ownerName})`,
          metadata: { fromId: data.fromRegenmonId, fromName: sender.name },
        },
      });

      return { updatedSender, updatedTarget };
    });

    // ==============================================
    // RESPUESTA
    // ==============================================
    return successResponse({
      message: `You fed ${target.name}! 🍎`,
      senderBalance: result.updatedSender.balance,
      targetName: target.name,
      cost: FEED_COST,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
