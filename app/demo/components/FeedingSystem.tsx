// ==============================================
// FEEDING SYSTEM COMPONENT - Session 3
// ==============================================
// Sistema para gastar tokens y reducir hambre

"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

interface FeedingSystemProps {
  regenmon: any;
  onFeed: () => void;
}

const FEED_COST = 10;

export function FeedingSystem({ regenmon, onFeed }: FeedingSystemProps) {
  const [isFeeding, setIsFeeding] = useState(false);

  const canFeed = regenmon.balance >= FEED_COST;
  const isSatisfied = regenmon.stats.hunger < 30;

  const handleFeed = () => {
    if (!canFeed || isFeeding) return;

    setIsFeeding(true);

    // Animation delay
    setTimeout(() => {
      onFeed();
      setIsFeeding(false);
    }, 500);
  };

  return (
    <Card>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>🍎 Alimentar</h3>

      {/* Info Box */}
      <div
        className="nes-container is-dark"
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          fontSize: "0.7rem"
        }}
      >
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Costo:</strong> {FEED_COST} $FRUTA
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Efecto:</strong> -30 hambre, +5 felicidad
        </p>
        <p style={{ color: "#aaa" }}>
          Tu balance: <span style={{ color: "#f7d51d" }}>{regenmon.balance}</span> tokens
        </p>
      </div>

      {/* Hunger Status */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "0.7rem" }}>🍎 Nivel de Hambre</span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: regenmon.stats.hunger >= 70 ? "#e76e55" : regenmon.stats.hunger >= 40 ? "#f7d51d" : "#92cc41"
            }}
          >
            {regenmon.stats.hunger}%
          </span>
        </div>
        <progress
          className="nes-progress is-warning"
          value={regenmon.stats.hunger}
          max="100"
          style={{ width: "100%", height: "20px" }}
        />
      </div>

      {/* Feed Button */}
      <Button
        variant={canFeed ? "success" : "disabled"}
        onClick={handleFeed}
        disabled={!canFeed || isFeeding}
        style={{ width: "100%" }}
      >
        {isFeeding ? "🍎 Alimentando..." : "🍎 Alimentar (-10 tokens)"}
      </Button>

      {/* Warnings/Success Messages */}
      {!canFeed && (
        <div
          className="nes-container is-rounded"
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#e76e5533",
            fontSize: "0.7rem",
            textAlign: "center"
          }}
        >
          <p>⚠️ No tienes suficientes tokens. ¡Entrena para ganar más!</p>
        </div>
      )}

      {isSatisfied && (
        <div
          className="nes-container is-rounded"
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#92cc4133",
            fontSize: "0.7rem",
            textAlign: "center"
          }}
        >
          <p>✅ Tu Regenmon está satisfecho</p>
        </div>
      )}

      {!isSatisfied && regenmon.stats.hunger >= 70 && (
        <div
          className="nes-container is-rounded"
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#e76e5533",
            fontSize: "0.7rem",
            textAlign: "center"
          }}
        >
          <p>🚨 ¡Tu Regenmon tiene mucha hambre!</p>
        </div>
      )}
    </Card>
  );
}
