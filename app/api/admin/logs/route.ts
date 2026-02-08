// ==============================================
// ADMIN API - LOGS DE ACTIVIDAD
// ==============================================
// GET /api/admin/logs?page=1&limit=50&type=all

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

    // Query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const type = searchParams.get("type") || "all"; // all, transaction, visit, sync

    const skip = (page - 1) * limit;

    // Logs combinados de diferentes tablas
    let logs: any[] = [];

    if (type === "all" || type === "transaction") {
      const transactions = await prisma.tokenTransaction.findMany({
        take: limit,
        skip: type === "transaction" ? skip : 0,
        orderBy: { createdAt: "desc" },
        include: {
          regenmon: {
            select: {
              id: true,
              name: true,
              ownerName: true,
            },
          },
        },
      });

      logs.push(
        ...transactions.map((tx) => ({
          id: tx.id,
          type: "transaction",
          event: tx.type,
          regenmonId: tx.regenmonId,
          regenmonName: tx.regenmon.name,
          ownerName: tx.regenmon.ownerName,
          details: {
            amount: tx.amount,
            balanceBefore: tx.balanceBefore,
            balanceAfter: tx.balanceAfter,
            metadata: tx.metadata,
          },
          timestamp: tx.createdAt,
        }))
      );
    }

    if (type === "all" || type === "visit") {
      const visits = await prisma.visit.findMany({
        take: limit,
        skip: type === "visit" ? skip : 0,
        orderBy: { createdAt: "desc" },
        include: {
          regenmon: {
            select: {
              id: true,
              name: true,
              ownerName: true,
            },
          },
        },
      });

      logs.push(
        ...visits.map((visit) => ({
          id: visit.id,
          type: "visit",
          event: "page_visit",
          regenmonId: visit.regenmonId,
          regenmonName: visit.regenmon.name,
          ownerName: visit.regenmon.ownerName,
          details: {
            userAgent: (visit as any).userAgent,
            referrer: visit.referrer,
          },
          timestamp: visit.createdAt,
        }))
      );
    }

    if (type === "all" || type === "sync") {
      const syncs = await (prisma as any).syncSnapshot.findMany({
        take: limit,
        skip: type === "sync" ? skip : 0,
        orderBy: { createdAt: "desc" },
        include: {
          regenmon: {
            select: {
              id: true,
              name: true,
              ownerName: true,
            },
          },
        },
      });

      logs.push(
        ...syncs.map((sync: any) => ({
          id: sync.id,
          type: "sync",
          event: "data_sync",
          regenmonId: sync.regenmonId,
          regenmonName: sync.regenmon.name,
          ownerName: sync.regenmon.ownerName,
          details: {
            stats: sync.stats,
            stage: sync.stage,
            totalPoints: sync.totalPoints,
          },
          timestamp: sync.createdAt,
        }))
      );
    }

    // Ordenar por timestamp descendente
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limitar a la cantidad solicitada si es "all"
    if (type === "all") {
      logs = logs.slice(0, limit);
    }

    // Contar total para paginación
    let total = 0;
    if (type === "all") {
      const [txCount, visitCount, syncCount] = await Promise.all([
        prisma.tokenTransaction.count(),
        prisma.visit.count(),
        (prisma as any).syncSnapshot.count(),
      ]);
      total = txCount + visitCount + syncCount;
    } else if (type === "transaction") {
      total = await prisma.tokenTransaction.count();
    } else if (type === "visit") {
      total = await prisma.visit.count();
    } else if (type === "sync") {
      total = await (prisma as any).syncSnapshot.count();
    }

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Admin logs error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
