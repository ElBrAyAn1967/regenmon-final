// ==============================================
// POST /api/regenmon/[id]/gift
// ==============================================
// Enviar tokens $FRUTA como regalo a otro Regenmon

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { GiftTokensSchema } from "@/app/lib/validations";
import { checkRateLimit, getClientIP } from "@/app/lib/ratelimit";
import { handleApiError, ApiError, successResponse } from "@/app/lib/errors";

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
    const data = GiftTokensSchema.parse(body);

    // No puedes regalarte a ti mismo
    if (data.fromRegenmonId === targetId) {
      throw new ApiError(400, "You cannot gift tokens to yourself");
    }

    // ==============================================
    // RATE LIMITING
    // ==============================================
    const ip = getClientIP(req.headers);
    const { success } = await checkRateLimit(`gift:${ip}`);
    if (!success) {
      throw new ApiError(429, "Too many gift requests. Please wait before gifting again.");
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
    if (sender.balance < data.amount) {
      throw new ApiError(400, `Insufficient balance. Have ${sender.balance} $FRUTA, need ${data.amount} $FRUTA`);
    }

    // ==============================================
    // EJECUTAR TRANSACCIÓN (TRANSFERENCIA)
    // ==============================================
    const result = await prisma.$transaction(async (tx) => {
      // 1. Descontar tokens del remitente
      const updatedSender = await tx.registeredRegenmon.update({
        where: { id: data.fromRegenmonId },
        data: { balance: { decrement: data.amount } },
      });

      // 2. Agregar tokens al receptor
      const updatedTarget = await tx.registeredRegenmon.update({
        where: { id: targetId },
        data: { balance: { increment: data.amount } },
      });

      // 3. Registrar transacción del remitente (gasto)
      await tx.tokenTransaction.create({
        data: {
          regenmonId: data.fromRegenmonId,
          type: "reward",
          amount: -data.amount,
          balanceBefore: sender.balance,
          balanceAfter: updatedSender.balance,
          reason: `Gift to ${target.name} (owned by ${target.ownerName})`,
          metadata: { targetId, targetName: target.name, type: "gift_sent" },
        },
      });

      // 4. Registrar transacción del receptor (recibió regalo)
      await tx.tokenTransaction.create({
        data: {
          regenmonId: targetId,
          type: "reward",
          amount: data.amount,
          balanceBefore: target.balance,
          balanceAfter: updatedTarget.balance,
          reason: `Gift from ${sender.name} (owned by ${sender.ownerName})`,
          metadata: { fromId: data.fromRegenmonId, fromName: sender.name, type: "gift_received" },
        },
      });

      return { updatedSender, updatedTarget };
    });

    // ==============================================
    // RESPUESTA
    // ==============================================
    return successResponse({
      message: `You sent ${data.amount} $FRUTA to ${target.name}! 🎁`,
      senderBalance: result.updatedSender.balance,
      targetName: target.name,
      amount: data.amount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
