// ==============================================
// ADMIN API - AJUSTES MANUALES DE TOKENS
// ==============================================
// POST /api/admin/tokens/adjust

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiError } from "@/lib/errors";

const adjustSchema = z.object({
  regenmonId: z.string().min(1),
  amount: z.number().int(),
  reason: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación de admin
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }

    // Validar request body
    const body = await req.json();
    const { regenmonId, amount, reason } = adjustSchema.parse(body);

    // Buscar el Regenmon
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id: regenmonId },
    });

    if (!regenmon) {
      throw new ApiError("Regenmon not found", 404);
    }

    const balanceBefore = regenmon.balance;
    const balanceAfter = balanceBefore + amount;

    // Validar que el balance no sea negativo
    if (balanceAfter < 0) {
      throw new ApiError("Insufficient balance", 400);
    }

    // Actualizar balance y crear transacción con audit trail
    const [updatedRegenmon, transaction] = await prisma.$transaction([
      prisma.registeredRegenmon.update({
        where: { id: regenmonId },
        data: { balance: balanceAfter },
      }),
      prisma.tokenTransaction.create({
        data: {
          regenmonId,
          type: "admin_adjustment",
          amount,
          balanceBefore,
          balanceAfter,
          metadata: {
            reason,
            adminId: (session.user as any)?.id,
            adminEmail: session.user?.email,
            timestamp: new Date().toISOString(),
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        regenmon: updatedRegenmon,
        transaction,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: (error as any).errors },
        { status: 400 }
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Admin adjust error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
