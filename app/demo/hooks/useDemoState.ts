// ==============================================
// DEMO STATE HOOK - localStorage Integration
// ==============================================
// Hook para gestionar estado completo del Regenmon DEMO

"use client";

import { useState, useEffect } from "react";

export interface RegenmonData {
  name: string;
  ownerName: string;
  sprite: string;
  stage: number;
  stats: {
    happiness: number;
    energy: number;
    hunger: number;
  };
  totalPoints: number;
  balance: number;
  trainingHistory: Array<{
    score: number;
    category: string;
    timestamp: number;
  }>;
  isRegistered: boolean;
  appUrl?: string;
}

const DEFAULT_REGENMON: Omit<RegenmonData, "name" | "ownerName" | "sprite"> = {
  stage: 1,
  stats: {
    happiness: 80,
    energy: 70,
    hunger: 30,
  },
  totalPoints: 0,
  balance: 50,
  trainingHistory: [],
  isRegistered: false,
};

export function useDemoState() {
  const [regenmon, setRegenmon] = useState<RegenmonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("demo-regenmon");
    if (saved) {
      try {
        setRegenmon(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        localStorage.removeItem("demo-regenmon");
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  const saveRegenmon = (data: RegenmonData) => {
    setRegenmon(data);
    localStorage.setItem("demo-regenmon", JSON.stringify(data));
  };

  // Create new Regenmon (S1-1)
  const createRegenmon = (data: { name: string; ownerName: string; sprite: string }) => {
    const newRegenmon: RegenmonData = {
      ...DEFAULT_REGENMON,
      ...data,
    };
    saveRegenmon(newRegenmon);
  };

  // Reset Regenmon
  const resetRegenmon = () => {
    localStorage.removeItem("demo-regenmon");
    setRegenmon(null);
  };

  // Stats Effects (S2-3)
  const applyStatsEffects = (effects: { happiness: number; energy: number; hunger: number }) => {
    if (!regenmon) return;

    const newStats = {
      happiness: Math.max(0, Math.min(100, regenmon.stats.happiness + effects.happiness)),
      energy: Math.max(0, Math.min(100, regenmon.stats.energy + effects.energy)),
      hunger: Math.max(0, Math.min(100, regenmon.stats.hunger + effects.hunger)),
    };

    saveRegenmon({
      ...regenmon,
      stats: newStats,
    });
  };

  // Feed Regenmon (S3-2)
  const feedRegenmon = () => {
    if (!regenmon || regenmon.balance < 10) return;

    const newStats = {
      ...regenmon.stats,
      hunger: Math.max(0, regenmon.stats.hunger - 30),
      happiness: Math.min(100, regenmon.stats.happiness + 5),
    };

    saveRegenmon({
      ...regenmon,
      balance: regenmon.balance - 10,
      stats: newStats,
    });
  };

  // Reward Tokens (S3-3)
  const rewardTokens = (amount: number) => {
    if (!regenmon) return;

    saveRegenmon({
      ...regenmon,
      balance: regenmon.balance + amount,
    });
  };

  // Add Training (S4-3)
  const addTraining = (result: { score: number; points: number; tokens: number; category: string }) => {
    if (!regenmon) return;

    const newTrainingHistory = [
      ...regenmon.trainingHistory,
      {
        score: result.score,
        category: result.category,
        timestamp: Date.now(),
      },
    ];

    const newTotalPoints = regenmon.totalPoints + result.points;
    const newBalance = regenmon.balance + result.tokens;

    // Check evolution
    let newStage = regenmon.stage;
    if (newTotalPoints >= 1500 && regenmon.stage < 3) {
      newStage = 3; // Adult
    } else if (newTotalPoints >= 500 && regenmon.stage < 2) {
      newStage = 2; // Young
    }

    const evolved = newStage > regenmon.stage;

    saveRegenmon({
      ...regenmon,
      stage: newStage,
      totalPoints: newTotalPoints,
      balance: newBalance + (evolved ? 100 : 0), // Evolution bonus
      trainingHistory: newTrainingHistory,
    });

    // Show evolution notification
    if (evolved) {
      alert(`🎉 ¡${regenmon.name} evolucionó a etapa ${newStage}! +100 tokens bonus`);
    }
  };

  return {
    regenmon,
    isLoading,
    createRegenmon,
    saveRegenmon,
    resetRegenmon,
    applyStatsEffects,
    feedRegenmon,
    rewardTokens,
    addTraining,
  };
}
