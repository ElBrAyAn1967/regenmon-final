// ==============================================
// REGENMON DISPLAY COMPONENT - Session 1
// ==============================================
// Display principal tipo Game Boy con stats

"use client";

import { Card } from "@/app/components/ui/Card";

interface RegenmonData {
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
}

interface RegenmonDisplayProps {
  regenmon: RegenmonData;
}

export function RegenmonDisplay({ regenmon }: RegenmonDisplayProps) {
  const { name, ownerName, sprite, stage, stats, totalPoints, balance } = regenmon;

  // Stage labels
  const stageLabels = ["Bebé", "Joven", "Adulto"];
  const stageLabel = stageLabels[stage - 1] || "Bebé";

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem" }}>
      {/* Header con stats globales */}
      <div className="nes-container is-dark" style={{ marginBottom: "2rem", padding: "0.75rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: "0.75rem",
            textAlign: "center"
          }}
        >
          <div>
            <div style={{ fontSize: "0.6rem", color: "#aaa" }}>Stage</div>
            <div style={{ fontSize: "1.2rem", color: "#92cc41" }}>{stage}</div>
            <div style={{ fontSize: "0.6rem", color: "#aaa" }}>{stageLabel}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", color: "#aaa" }}>Points</div>
            <div style={{ fontSize: "1.2rem", color: "#f7d51d" }}>{totalPoints}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", color: "#aaa" }}>$FRUTA</div>
            <div style={{ fontSize: "1.2rem", color: "#209cee" }}>{balance} 🍎</div>
          </div>
        </div>
      </div>

      {/* Display principal estilo Game Boy */}
      <Card centered>
        <div style={{ textAlign: "center" }}>
          {/* Sprite Display - Estilo Game Boy con animación */}
          <div
            style={{
              padding: "3rem 2rem",
              background: "#92cc41",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "4px solid #0f380f",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(15, 56, 15, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                fontSize: "6rem",
                filter: "drop-shadow(2px 2px 0px #0f380f)",
                animation: "bounce 2s ease-in-out infinite"
              }}
            >
              {sprite}
            </div>
          </div>

          <style jsx>{`
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}</style>

          {/* Name + Owner */}
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{name}</h2>
          <p style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "1.5rem" }}>
            Dueño: {ownerName}
          </p>

          {/* Stats Bars con microinteracciones */}
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            {/* Happiness */}
            <div
              style={{ marginBottom: "1rem", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.7rem" }}>😊 Felicidad</span>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: stats.happiness >= 70 ? "#92cc41" : stats.happiness >= 40 ? "#f7d51d" : "#e76e55"
                }}>
                  {stats.happiness}%
                </span>
              </div>
              <progress
                className="nes-progress is-success"
                value={stats.happiness}
                max="100"
                style={{ width: "100%", height: "20px", transition: "all 0.3s ease" }}
              />
            </div>

            {/* Energy */}
            <div
              style={{ marginBottom: "1rem", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.7rem" }}>⚡ Energía</span>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: stats.energy >= 70 ? "#209cee" : stats.energy >= 40 ? "#f7d51d" : "#e76e55"
                }}>
                  {stats.energy}%
                </span>
              </div>
              <progress
                className="nes-progress is-primary"
                value={stats.energy}
                max="100"
                style={{ width: "100%", height: "20px", transition: "all 0.3s ease" }}
              />
            </div>

            {/* Hunger */}
            <div
              style={{ marginBottom: "1rem", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.7rem" }}>🍎 Hambre</span>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: stats.hunger >= 70 ? "#e76e55" : stats.hunger >= 40 ? "#f7d51d" : "#92cc41"
                }}>
                  {stats.hunger}%
                </span>
              </div>
              <progress
                className="nes-progress is-warning"
                value={stats.hunger}
                max="100"
                style={{ width: "100%", height: "20px", transition: "all 0.3s ease" }}
              />
            </div>
          </div>

          {/* Next Evolution Info */}
          {stage < 3 && (
            <div className="nes-container is-dark" style={{ fontSize: "0.7rem", padding: "0.5rem" }}>
              <p>
                🎯 Próxima evolución: {stage === 1 ? 500 : 1500} puntos
                {stage === 1 && " (Joven)"}
                {stage === 2 && " (Adulto)"}
              </p>
            </div>
          )}

          {stage === 3 && (
            <div className="nes-container is-dark" style={{ fontSize: "0.7rem", padding: "0.5rem", background: "#92cc4133" }}>
              <p>🏆 ¡Regenmon Adulto! Nivel máximo alcanzado</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
