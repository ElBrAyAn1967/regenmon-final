// ==============================================
// TOKEN MANAGEMENT SYSTEM - $FRUTA
// ==============================================
// Sistema centralizado de tokens (NO blockchain)
// Backend controla todos los tokens desde la base de datos

import { prisma } from "./prisma";

// ==============================================
// OBTENER CONFIGURACIÓN DEL SISTEMA
// ==============================================
export async function getTokenConfig() {
  const config = await prisma.tokenSystemConfig.findFirst();

  // Si no existe configuración, retornar valores por defecto
  if (!config) {
    return {
      totalSupply: 100000,
      rewardRate: 0.5,
      feedCost: 10,
      evolutionBonus: 100,
    };
  }

  return config;
}

// ==============================================
// CALCULAR RECOMPENSA DE TOKENS
// ==============================================
/**
 * Calcula cuántos tokens $FRUTA otorgar según puntos ganados
 * @param points - Puntos ganados por el estudiante
 * @returns Cantidad de tokens a otorgar
 */
export async function calculateTokenReward(points: number): Promise<number> {
  const config = await getTokenConfig();
  const tokens = Math.floor(points * config.rewardRate);
  return Math.max(0, tokens); // Nunca negativo
}

// ==============================================
// OTORGAR TOKENS (REWARD)
// ==============================================
/**
 * Otorga tokens a un Regenmon y crea registro de transacción
 * @param regenmonId - ID del Regenmon
 * @param amount - Cantidad de tokens a otorgar
 * @param reason - Razón del otorgamiento
 * @param metadata - Datos adicionales opcionales
 * @returns Nuevo balance del Regenmon
 */
export async function awardTokens(
  regenmonId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
) {
  return await prisma.$transaction(async (tx) => {
    // Buscar Regenmon
    const regenmon = await tx.registeredRegenmon.findUnique({
      where: { id: regenmonId },
    });

    if (!regenmon) {
      throw new Error("Regenmon not found");
    }

    const balanceBefore = regenmon.balance;
    const balanceAfter = balanceBefore + amount;

    // Actualizar balance
    await tx.registeredRegenmon.update({
      where: { id: regenmonId },
      data: { balance: balanceAfter },
    });

    // Crear transacción
    await tx.tokenTransaction.create({
      data: {
        regenmonId,
        type: "reward",
        amount,
        balanceBefore,
        balanceAfter,
        reason,
        metadata: metadata || {},
      },
    });

    return balanceAfter;
  });
}

// ==============================================
// GASTAR TOKENS (SPEND)
// ==============================================
/**
 * Gasta tokens de un Regenmon y crea registro de transacción
 * @param regenmonId - ID del Regenmon
 * @param amount - Cantidad de tokens a gastar
 * @param reason - Razón del gasto
 * @param metadata - Datos adicionales opcionales
 * @returns Nuevo balance del Regenmon
 * @throws Error si no hay balance suficiente
 */
export async function spendTokens(
  regenmonId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
) {
  return await prisma.$transaction(async (tx) => {
    // Buscar Regenmon
    const regenmon = await tx.registeredRegenmon.findUnique({
      where: { id: regenmonId },
    });

    if (!regenmon) {
      throw new Error("Regenmon not found");
    }

    if (regenmon.balance < amount) {
      throw new Error(
        `Insufficient balance. Have ${regenmon.balance} $FRUTA, need ${amount} $FRUTA`
      );
    }

    const balanceBefore = regenmon.balance;
    const balanceAfter = balanceBefore - amount;

    // Actualizar balance
    await tx.registeredRegenmon.update({
      where: { id: regenmonId },
      data: { balance: balanceAfter },
    });

    // Determinar tipo de transacción según razón
    let transactionType: string = "admin_adjust";
    if (reason.toLowerCase().includes("feed")) {
      transactionType = "feed";
    } else if (reason.toLowerCase().includes("evolution")) {
      transactionType = "evolution";
    }

    // Crear transacción (monto negativo para gastos)
    await tx.tokenTransaction.create({
      data: {
        regenmonId,
        type: transactionType,
        amount: -amount, // Negativo para indicar gasto
        balanceBefore,
        balanceAfter,
        reason,
        metadata: metadata || {},
      },
    });

    return balanceAfter;
  });
}

// ==============================================
// OBTENER HISTORIAL DE TRANSACCIONES
// ==============================================
/**
 * Obtiene el historial de transacciones de un Regenmon
 * @param regenmonId - ID del Regenmon
 * @param limit - Cantidad máxima de transacciones a retornar
 * @returns Array de transacciones ordenadas por fecha (más reciente primero)
 */
export async function getTransactionHistory(
  regenmonId: string,
  limit: number = 20
) {
  return await prisma.tokenTransaction.findMany({
    where: { regenmonId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      amount: true,
      balanceBefore: true,
      balanceAfter: true,
      reason: true,
      createdAt: true,
    },
  });
}

// ==============================================
// BONUS POR EVOLUCIÓN
// ==============================================
/**
 * Otorga bonus de tokens cuando un Regenmon evoluciona
 * @param regenmonId - ID del Regenmon
 * @param newStage - Nuevo stage después de evolucionar
 * @returns Nuevo balance del Regenmon
 */
export async function awardEvolutionBonus(
  regenmonId: string,
  newStage: number
) {
  const config = await getTokenConfig();
  const bonus = config.evolutionBonus;

  return await awardTokens(
    regenmonId,
    bonus,
    `Evolution to stage ${newStage}`,
    { newStage, bonusAmount: bonus }
  );
}
