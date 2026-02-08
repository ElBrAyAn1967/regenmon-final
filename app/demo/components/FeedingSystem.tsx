// ==============================================
// FEEDING SYSTEM COMPONENT - Session 3
// ==============================================
// Icono de engrane con info popup + botón alimentar integrado en RegenmonDisplay

"use client";

import { useState } from "react";

interface FeedingSystemProps {
  regenmon: any;
  onFeed: () => void;
}

const FEED_COST = 10;

export function FeedingSystem({ regenmon, onFeed }: FeedingSystemProps) {
  const [isFeeding, setIsFeeding] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const canFeed = regenmon.balance >= FEED_COST;
  const isSatisfied = regenmon.stats.hunger < 30;

  const handleFeed = () => {
    if (!canFeed || isFeeding) return;
    setIsFeeding(true);
    setTimeout(() => {
      onFeed();
      setIsFeeding(false);
    }, 500);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
      {/* Feed Button */}
      <button
        className={`nes-btn ${canFeed ? "is-success" : "is-warning"}`}
        onClick={handleFeed}
        disabled={!canFeed || isFeeding}
        style={{ fontSize: "0.55rem", padding: "0.3rem 0.6rem" }}
      >
        {isFeeding ? "🍎 ..." : "🍎 Alimentar (-10)"}
      </button>

      {/* Gear icon for info */}
      <div style={{ position: "relative" }}>
        <button
          className="nes-btn"
          onClick={() => setShowInfo(!showInfo)}
          style={{ fontSize: "0.6rem", padding: "0.25rem 0.4rem", cursor: "pointer" }}
        >
          ⚙️
        </button>

        {/* Info popup */}
        {showInfo && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: "0.5rem",
              padding: "0.6rem",
              backgroundColor: "var(--bg-card-light)",
              border: "2px solid var(--border-color)",
              borderRadius: "4px",
              fontSize: "0.55rem",
              whiteSpace: "nowrap",
              zIndex: 50,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <p style={{ marginBottom: "0.3rem" }}>
              <strong>Costo:</strong> {FEED_COST} $FRUTA
            </p>
            <p style={{ marginBottom: "0.3rem" }}>
              <strong>Efecto:</strong> -30 hambre, +5 felicidad
            </p>
            <p style={{ color: "var(--fg-muted)" }}>
              Balance: <span style={{ color: "var(--yellow)" }}>{regenmon.balance}</span> tokens
            </p>
            <p style={{ marginTop: "0.3rem" }}>
              Hambre: <span style={{
                color: regenmon.stats.hunger >= 70 ? "var(--red)" : regenmon.stats.hunger >= 40 ? "var(--yellow)" : "var(--green)"
              }}>{regenmon.stats.hunger}%</span>
            </p>
            {!canFeed && (
              <p style={{ color: "var(--red)", marginTop: "0.3rem" }}>Sin tokens suficientes</p>
            )}
            {isSatisfied && (
              <p style={{ color: "var(--green)", marginTop: "0.3rem" }}>Regenmon satisfecho</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
