// ==============================================
// ADMIN API - ESTADÍSTICAS AVANZADAS
// ==============================================
// GET /api/admin/stats

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación de admin
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }

    // Estadísticas generales
    const [
      totalRegenmons,
      activeRegenmons,
      totalTokens,
      totalTransactions,
      totalVisits,
    ] = await Promise.all([
      prisma.registeredRegenmon.count(),
      prisma.registeredRegenmon.count({ where: { isActive: true } }),
      prisma.registeredRegenmon.aggregate({ _sum: { balance: true } }),
      prisma.tokenTransaction.count(),
      prisma.visit.count(),
    ]);

    // Top 10 Regenmons por puntos
    const topRegenmons = await prisma.registeredRegenmon.findMany({
      orderBy: { totalPoints: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        ownerName: true,
        totalPoints: true,
        balance: true,
        sprite: true,
      },
    });

    // Distribución de stages
    const stageDistribution = await prisma.$queryRaw<{ stage: number; count: bigint }[]>`
      SELECT stage, COUNT(*)::int as count
      FROM "RegisteredRegenmon"
      GROUP BY stage
      ORDER BY stage ASC
    `;

    // Transacciones por tipo (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactionsByType = await prisma.$queryRaw<{ type: string; count: bigint; total: bigint }[]>`
      SELECT type, COUNT(*)::int as count, SUM(amount)::int as total
      FROM "TokenTransaction"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY type
      ORDER BY count DESC
    `;

    // Actividad diaria (últimos 7 días) para gráfica
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyActivity = await prisma.$queryRaw<{ date: string; visits: bigint; transactions: bigint }[]>`
      SELECT
        DATE("createdAt") as date,
        COUNT(*)::int as visits,
        0 as transactions
      FROM "Visit"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const dailyTransactions = await prisma.$queryRaw<{ date: string; transactions: bigint }[]>`
      SELECT
        DATE("createdAt") as date,
        COUNT(*)::int as transactions
      FROM "TokenTransaction"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Combinar actividad diaria
    const activityMap = new Map();
    dailyActivity.forEach(item => {
      activityMap.set(item.date, { date: item.date, visits: Number(item.visits), transactions: 0 });
    });
    dailyTransactions.forEach(item => {
      const existing = activityMap.get(item.date) || { date: item.date, visits: 0, transactions: 0 };
      existing.transactions = Number(item.transactions);
      activityMap.set(item.date, existing);
    });

    const chartData = Array.from(activityMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRegenmons,
          activeRegenmons,
          inactiveRegenmons: totalRegenmons - activeRegenmons,
          totalTokensCirculating: totalTokens._sum.balance || 0,
          totalTransactions,
          totalVisits,
        },
        topRegenmons,
        stageDistribution: stageDistribution.map(item => ({
          stage: item.stage,
          count: Number(item.count),
        })),
        transactionsByType: transactionsByType.map(item => ({
          type: item.type,
          count: Number(item.count),
          total: Number(item.total),
        })),
        chartData,
      },
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
