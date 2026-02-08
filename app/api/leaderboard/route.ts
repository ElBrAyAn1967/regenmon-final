// ==============================================
// GET /api/leaderboard
// ==============================================
// Endpoint para obtener ranking de mejores Regenmons
// Soporta paginación: ?page=1&limit=10

import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError, paginatedResponse } from "@/app/lib/errors";
import { LeaderboardQuerySchema } from "@/app/lib/validations";

export async function GET(req: NextRequest) {
  try {
    // ==============================================
    // PARSEAR QUERY PARAMS
    // ==============================================
    const { searchParams } = new URL(req.url);
    const queryParams = LeaderboardQuerySchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    });

    const { page, limit } = queryParams;
    const skip = (page - 1) * limit;

    // ==============================================
    // OBTENER REGENMONS Y TOTAL
    // ==============================================
    const [regenmons, total] = await Promise.all([
      prisma.registeredRegenmon.findMany({
        where: { isActive: true },
        orderBy: [
          { totalPoints: "desc" },
          { balance: "desc" }, // Desempate por balance
          { registeredAt: "asc" }, // Desempate por antigüedad
        ],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          ownerName: true,
          sprite: true,
          stage: true,
          totalPoints: true,
          balance: true,
          registeredAt: true,
          lastSynced: true,
        },
      }),
      prisma.registeredRegenmon.count({
        where: { isActive: true },
      }),
    ]);

    // ==============================================
    // AGREGAR RANK A CADA REGENMON
    // ==============================================
    const leaderboard = regenmons.map((regenmon, index) => ({
      rank: skip + index + 1,
      ...regenmon,
    }));

    // ==============================================
    // RESPUESTA CON PAGINACIÓN
    // ==============================================
    return paginatedResponse(
      leaderboard,
      {
        page,
        limit,
        total,
      },
      `Found ${total} active Regenmons`
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
