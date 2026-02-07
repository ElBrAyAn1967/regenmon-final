// ==============================================
// GET /api/stats
// ==============================================
// Endpoint para obtener estadísticas globales del hub
// Para mostrar en homepage

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError, successResponse } from "@/app/lib/errors";

export async function GET(req: NextRequest) {
  try {
    // ==============================================
    // OBTENER TODAS LAS ESTADÍSTICAS EN PARALELO
    // ==============================================
    const [
      totalRegenmons,
      activeRegenmons,
      aggregations,
      topRegenmon,
      tokenStats,
      recentRegistrations,
    ] = await Promise.all([
      // Total de Regenmons registrados
      prisma.registeredRegenmon.count(),

      // Regenmons activos
      prisma.registeredRegenmon.count({
        where: { isActive: true },
      }),

      // Agregaciones de puntos y stage
      prisma.registeredRegenmon.aggregate({
        _sum: {
          totalPoints: true,
          balance: true,
        },
        _avg: {
          stage: true,
          totalPoints: true,
        },
      }),

      // Top Regenmon
      prisma.registeredRegenmon.findFirst({
        where: { isActive: true },
        orderBy: { totalPoints: "desc" },
        select: {
          name: true,
          ownerName: true,
          totalPoints: true,
          balance: true,
        },
      }),

      // Total de tokens distribuidos (solo rewards)
      prisma.tokenTransaction.aggregate({
        where: { type: "reward" },
        _sum: { amount: true },
      }),

      // Registros recientes (últimas 24 horas)
      prisma.registeredRegenmon.count({
        where: {
          registeredAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // ==============================================
    // RESPUESTA CON ESTADÍSTICAS
    // ==============================================
    return successResponse({
      totalRegenmons,
      activeRegenmons,
      inactiveRegenmons: totalRegenmons - activeRegenmons,
      totalPoints: aggregations._sum.totalPoints || 0,
      totalTokensInCirculation: aggregations._sum.balance || 0,
      totalTokensDistributed: tokenStats._sum.amount || 0,
      averageStage: Number(aggregations._avg.stage?.toFixed(1)) || 1.0,
      averagePoints: Number(aggregations._avg.totalPoints?.toFixed(0)) || 0,
      recentRegistrations24h: recentRegistrations,
      topRegenmon: topRegenmon
        ? {
            name: topRegenmon.name,
            owner: topRegenmon.ownerName,
            points: topRegenmon.totalPoints,
            balance: topRegenmon.balance,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Configuración de cache
export const revalidate = 300; // Revalidar cada 5 minutos
