// ==============================================
// DEMO STATE HOOK - localStorage Integration
// ==============================================
// Hook para gestionar estado completo del Regenmon DEMO
// Incluye decay de stats en tiempo real con dayjs

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";

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
  lastUpdated: number; // timestamp ms
  isDead: boolean;
}

// Base decay rates per minute (hunger = saciedad, 100=lleno, 0=hambriento)
const BASE_DECAY = {
  happiness: -2,
  energy: -1,
  hunger: -2,  // hunger drops over time (gets hungry)
};

// Interval for real-time updates (ms)
const TICK_INTERVAL = 30_000; // every 30 seconds

const DEFAULT_REGENMON: Omit<RegenmonData, "name" | "ownerName" | "sprite"> = {
  stage: 1,
  stats: {
    happiness: 80,
    energy: 70,
    hunger: 80,  // 100=lleno, 0=hambriento
  },
  totalPoints: 0,
  balance: 50,
  trainingHistory: [],
  isRegistered: false,
  lastUpdated: Date.now(),
  isDead: false,
};

/**
 * Calculate decayed stats based on elapsed time.
 * hunger = saciedad (100=lleno, 0=hambriento)
 * Stats interact like a real creature:
 * - Hungry (hunger <30) → happiness drops faster (irritable)
 * - Tired (energy <30) → happiness drops faster (grumpy)
 * - Happy (>70) → energy decays slower (motivated)
 */
function applyDecay(
  stats: RegenmonData["stats"],
  lastUpdated: number
): { stats: RegenmonData["stats"]; isDead: boolean } {
  const now = dayjs();
  const last = dayjs(lastUpdated);
  const elapsedMinutes = now.diff(last, "minute", true);

  if (elapsedMinutes <= 0) {
    return { stats, isDead: false };
  }

  // Dynamic decay rates based on current stat relationships
  let happinessRate = BASE_DECAY.happiness;
  let energyRate = BASE_DECAY.energy;
  const hungerRate = BASE_DECAY.hunger;

  // Hungry creature is unhappy (-1 extra happiness/min when hunger < 30)
  if (stats.hunger < 30) happinessRate -= 1;
  // Tired creature is grumpy (-1 extra happiness/min when energy < 30)
  if (stats.energy < 30) happinessRate -= 1;
  // Happy creature has more energy (halve energy decay when happiness > 70)
  if (stats.happiness > 70) energyRate = energyRate * 0.5;

  const newStats = {
    happiness: Math.max(0, Math.min(100, Math.round(stats.happiness + happinessRate * elapsedMinutes))),
    energy: Math.max(0, Math.min(100, Math.round(stats.energy + energyRate * elapsedMinutes))),
    hunger: Math.max(0, Math.min(100, Math.round(stats.hunger + hungerRate * elapsedMinutes))),
  };

  // Death condition: all stats at 0
  const isDead = newStats.happiness <= 0 && newStats.energy <= 0 && newStats.hunger <= 0;

  return { stats: newStats, isDead };
}

export function useDemoState() {
  const [regenmon, setRegenmon] = useState<RegenmonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save to localStorage helper
  const saveToStorage = useCallback((data: RegenmonData) => {
    localStorage.setItem("demo-regenmon", JSON.stringify(data));
  }, []);

  // Save regenmon state (updates lastUpdated)
  const saveRegenmon = useCallback((data: RegenmonData) => {
    const updated = { ...data, lastUpdated: Date.now() };
    setRegenmon(updated);
    saveToStorage(updated);
  }, [saveToStorage]);

  // Load from localStorage on mount + apply elapsed decay
  useEffect(() => {
    const saved = localStorage.getItem("demo-regenmon");
    if (saved) {
      try {
        const parsed: RegenmonData = JSON.parse(saved);

        // Migrate old data without lastUpdated
        if (!parsed.lastUpdated) {
          parsed.lastUpdated = Date.now();
          parsed.isDead = false;
        }

        // Don't decay if already dead
        if (parsed.isDead) {
          setRegenmon(parsed);
        } else {
          // Apply decay for time elapsed while away
          const { stats: decayedStats, isDead } = applyDecay(parsed.stats, parsed.lastUpdated);
          const updated = {
            ...parsed,
            stats: decayedStats,
            isDead,
            lastUpdated: Date.now(),
          };
          setRegenmon(updated);
          saveToStorage(updated);
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        localStorage.removeItem("demo-regenmon");
      }
    }
    setIsLoading(false);
  }, [saveToStorage]);

  // Real-time decay interval
  useEffect(() => {
    if (!regenmon || regenmon.isDead) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRegenmon(prev => {
        if (!prev || prev.isDead) return prev;

        const { stats: decayedStats, isDead } = applyDecay(prev.stats, prev.lastUpdated);
        const updated = {
          ...prev,
          stats: decayedStats,
          isDead,
          lastUpdated: Date.now(),
        };
        saveToStorage(updated);
        return updated;
      });
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [regenmon?.isDead, saveToStorage]);

  // Create new Regenmon (S1-1)
  const createRegenmon = useCallback((data: { name: string; ownerName: string; sprite: string }) => {
    const newRegenmon: RegenmonData = {
      ...DEFAULT_REGENMON,
      ...data,
      lastUpdated: Date.now(),
      isDead: false,
    };
    saveRegenmon(newRegenmon);
  }, [saveRegenmon]);

  // Reset Regenmon
  const resetRegenmon = useCallback(() => {
    localStorage.removeItem("demo-regenmon");
    localStorage.removeItem("demo-regenmon-chat");
    setRegenmon(null);
  }, []);

  // Revive Regenmon (after death)
  const reviveRegenmon = useCallback(() => {
    if (!regenmon) return;
    const revived: RegenmonData = {
      ...regenmon,
      stats: { happiness: 50, energy: 50, hunger: 50 },
      isDead: false,
      balance: Math.max(0, regenmon.balance - 20), // costs 20 tokens to revive
      lastUpdated: Date.now(),
    };
    saveRegenmon(revived);
  }, [regenmon, saveRegenmon]);

  // Stats Effects (S2-3)
  const applyStatsEffects = useCallback((effects: { happiness: number; energy: number; hunger: number }) => {
    if (!regenmon || regenmon.isDead) return;

    const newStats = {
      happiness: Math.max(0, Math.min(100, regenmon.stats.happiness + effects.happiness)),
      energy: Math.max(0, Math.min(100, regenmon.stats.energy + effects.energy)),
      hunger: Math.max(0, Math.min(100, regenmon.stats.hunger + effects.hunger)),
    };

    saveRegenmon({
      ...regenmon,
      stats: newStats,
    });
  }, [regenmon, saveRegenmon]);

  // Feed Regenmon - food fills hunger, gives energy, makes slightly happy
  const feedRegenmon = useCallback(() => {
    if (!regenmon || regenmon.balance < 10 || regenmon.isDead) return;

    const newStats = {
      hunger: Math.min(100, regenmon.stats.hunger + 30),   // fills up
      energy: Math.min(100, regenmon.stats.energy + 10),
      happiness: Math.min(100, regenmon.stats.happiness + 5),
    };

    saveRegenmon({
      ...regenmon,
      balance: regenmon.balance - 10,
      stats: newStats,
    });
  }, [regenmon, saveRegenmon]);

  // Reward Tokens (S3-3)
  const rewardTokens = useCallback((amount: number) => {
    if (!regenmon) return;

    saveRegenmon({
      ...regenmon,
      balance: regenmon.balance + amount,
    });
  }, [regenmon, saveRegenmon]);

  // Add Training - stats change based on score like a real creature
  // Great score → very happy but tired and hungry (hard work pays off!)
  // Bad score → sad, exhausted, hungry (frustrating effort)
  const addTraining = useCallback((result: { score: number; points: number; tokens: number; category: string }) => {
    if (!regenmon || regenmon.isDead) return;

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

    // Stat effects depend on training score
    let happinessDelta: number;
    let energyDelta: number;
    let hungerDelta: number;

    if (result.score >= 80) {
      // Excellent: proud and happy, but training is tiring and makes hungry
      happinessDelta = 15;
      energyDelta = -20;
      hungerDelta = -15;
    } else if (result.score >= 60) {
      // Good: moderately happy
      happinessDelta = 8;
      energyDelta = -15;
      hungerDelta = -12;
    } else if (result.score >= 40) {
      // Okay: slight happiness, still tiring
      happinessDelta = 3;
      energyDelta = -12;
      hungerDelta = -10;
    } else {
      // Poor: frustrated and exhausted
      happinessDelta = -10;
      energyDelta = -15;
      hungerDelta = -10;
    }

    const newStats = {
      happiness: Math.max(0, Math.min(100, regenmon.stats.happiness + happinessDelta)),
      energy: Math.max(0, Math.min(100, regenmon.stats.energy + energyDelta)),
      hunger: Math.max(0, Math.min(100, regenmon.stats.hunger + hungerDelta)),
    };

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
      balance: newBalance + (evolved ? 100 : 0),
      trainingHistory: newTrainingHistory,
      stats: newStats,
    });

    if (evolved) {
      alert(`🎉 ¡${regenmon.name} evolucionó a etapa ${newStage}! +100 tokens bonus`);
    }
  }, [regenmon, saveRegenmon]);

  return {
    regenmon,
    isLoading,
    createRegenmon,
    saveRegenmon,
    resetRegenmon,
    reviveRegenmon,
    applyStatsEffects,
    feedRegenmon,
    rewardTokens,
    addTraining,
  };
}
