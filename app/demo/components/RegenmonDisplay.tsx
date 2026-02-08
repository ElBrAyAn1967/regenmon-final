// ==============================================
// REGENMON DISPLAY COMPONENT - Session 1
// ==============================================
// Display principal tipo Game Boy con stats

"use client";

import { useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { FeedingSystem } from "./FeedingSystem";

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
  isDead?: boolean;
}

interface RegenmonDisplayProps {
  regenmon: RegenmonData;
  onFeed?: () => void;
  showChat?: boolean;
  onToggleChat?: () => void;
  activeTab?: "play" | "train" | "social";
  onTabChange?: (tab: "play" | "train" | "social") => void;
  onReset?: () => void;
  onRevive?: () => void;
}

export function RegenmonDisplay({ regenmon, onFeed, showChat, onToggleChat, activeTab, onTabChange, onReset, onRevive }: RegenmonDisplayProps) {
  const { name, ownerName, sprite, stage, stats, totalPoints, balance, isDead } = regenmon;
  const [showStats, setShowStats] = useState(false);

  // Stage labels
  const stageLabels = ["Bebé", "Joven", "Adulto"];
  const stageLabel = stageLabels[stage - 1] || "Bebé";

  return (
    <div style={{ margin: "0 auto", padding: "0" }}>
      {/* Display principal estilo Game Boy */}
      <Card centered>
        <div style={{ textAlign: "center", position: "relative" }}>
          {/* Top right buttons: Stats + Reset */}
          <div style={{ position: "absolute", top: "0", right: "0", zIndex: 10, display: "flex", gap: "0.3rem" }}>
            <button
              type="button"
              className="nes-btn"
              onClick={() => setShowStats(!showStats)}
              style={{ fontSize: "0.5rem", padding: "0.15rem 0.35rem", cursor: "pointer" }}
            >
              Stats
            </button>
            {onReset && (
              <button
                type="button"
                className="nes-btn is-error"
                onClick={() => {
                  if (confirm("¿Resetear tu Regenmon? Esto borrará todo el progreso.")) {
                    onReset();
                  }
                }}
                style={{ fontSize: "0.45rem", padding: "0.15rem 0.3rem", cursor: "pointer" }}
              >
                🔄
              </button>
            )}

            {showStats && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.3rem",
                  padding: "0.5rem 0.6rem",
                  backgroundColor: "var(--bg-card-light)",
                  border: "2px solid var(--border-color)",
                  borderRadius: "4px",
                  zIndex: 50,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  animation: "fadeIn 0.2s ease-out",
                  display: "flex",
                  gap: "0.8rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.45rem", color: "var(--fg-muted)" }}>Stage</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--orange)" }}>{stage}</div>
                  <div style={{ fontSize: "0.4rem", color: "var(--fg-muted)" }}>{stageLabel}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.45rem", color: "var(--fg-muted)" }}>Points</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--yellow)" }}>{totalPoints}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.45rem", color: "var(--fg-muted)" }}>$FRUTA</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--blue)" }}>{balance}</div>
                </div>
              </div>
            )}
          </div>

          {/* Sprite Display */}
          <div
            style={{
              padding: "1rem 0.75rem",
              background: isDead
                ? "linear-gradient(135deg, #1a1a2e, #2d2d44)"
                : "linear-gradient(135deg, var(--orange-dark), var(--orange))",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              border: isDead ? "4px solid #3a3a5c" : "4px solid var(--orange-dark)",
              cursor: isDead ? "default" : "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.5s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isDead) {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="regenmon-sprite"
              style={{
                fontSize: "3.5rem",
                filter: isDead
                  ? "grayscale(1) brightness(0.5)"
                  : "drop-shadow(2px 2px 0px rgba(0,0,0,0.3))",
                animation: isDead ? "none" : "bounce 2s ease-in-out infinite",
              }}
            >
              {sprite}
            </div>
            {isDead && (
              <div style={{
                position: "absolute",
                bottom: "0.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "1.5rem",
              }}>
                💀
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-8px);
              }
            }
          `}</style>

          {/* Name + Owner */}
          <h2 style={{ fontSize: "0.9rem", marginBottom: "0.15rem", color: isDead ? "var(--red)" : "var(--orange)" }}>{name}</h2>
          <p style={{ fontSize: "0.55rem", color: "var(--fg-muted)", marginBottom: "0.35rem" }}>
            Dueño: {ownerName}
          </p>

          {/* Death State */}
          {isDead ? (
            <div style={{ marginTop: "0.5rem" }}>
              <div
                className="nes-container is-dark"
                style={{
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: "2px solid var(--red)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "0.7rem", color: "var(--red)", marginBottom: "0.3rem", fontWeight: "bold" }}>
                  Tu Regenmon ha muerto!
                </p>
                <p style={{ fontSize: "0.5rem", color: "var(--fg-muted)", marginBottom: "0.5rem" }}>
                  No fue cuidado a tiempo. Felicidad, energia y hambre llegaron al limite.
                </p>
                {onRevive && (
                  <button
                    type="button"
                    className="nes-btn is-warning"
                    onClick={onRevive}
                    style={{ fontSize: "0.6rem", padding: "0.4rem 1rem", cursor: "pointer" }}
                  >
                    Revivir (-20 $FRUTA)
                  </button>
                )}
                {onRevive && balance < 20 && (
                  <p style={{ fontSize: "0.45rem", color: "var(--red)", marginTop: "0.3rem" }}>
                    No tienes suficientes tokens para revivir
                  </p>
                )}
              </div>
              {onReset && (
                <button
                  type="button"
                  className="nes-btn is-error"
                  onClick={() => {
                    if (confirm("¿Crear un nuevo Regenmon? Esto borrará todo el progreso.")) {
                      onReset();
                    }
                  }}
                  style={{ fontSize: "0.5rem", padding: "0.3rem 0.6rem", cursor: "pointer", width: "100%" }}
                >
                  Empezar de nuevo
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Tabs */}
              {onTabChange && (
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.35rem", justifyContent: "center" }}>
                  <button
                    className={`nes-btn ${activeTab === "play" ? "is-primary" : ""}`}
                    onClick={() => onTabChange("play")}
                    style={{ fontSize: "0.5rem", padding: "0.2rem 0.5rem" }}
                  >
                    🎮 Jugar
                  </button>
                  <button
                    className={`nes-btn ${activeTab === "train" ? "is-primary" : ""}`}
                    onClick={() => onTabChange("train")}
                    style={{ fontSize: "0.5rem", padding: "0.2rem 0.5rem" }}
                  >
                    🎓 Entrenar
                  </button>
                  <button
                    className={`nes-btn ${activeTab === "social" ? "is-primary" : ""}`}
                    onClick={() => onTabChange("social")}
                    style={{ fontSize: "0.5rem", padding: "0.2rem 0.5rem" }}
                  >
                    🌍 Social
                  </button>
                </div>
              )}

              {/* Play tab content: Stats, Feeding, Evolution */}
              {activeTab === "play" && (
                <>
                  {/* Stats Bars */}
                  <div style={{ textAlign: "left", marginBottom: "0.35rem" }}>
                    {/* Happiness */}
                    <div style={{ marginBottom: "0.3rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                        <span style={{ fontSize: "0.6rem" }}>Felicidad</span>
                        <span style={{
                          fontSize: "0.6rem",
                          fontWeight: "bold",
                          color: stats.happiness >= 70 ? "var(--green)" : stats.happiness >= 40 ? "var(--yellow)" : "var(--red)"
                        }}>
                          {stats.happiness}%
                        </span>
                      </div>
                      <progress
                        className={`nes-progress ${stats.happiness < 30 ? "is-error" : "is-success"}`}
                        value={stats.happiness}
                        max="100"
                        style={{ width: "100%", height: "12px" }}
                      />
                    </div>

                    {/* Energy */}
                    <div style={{ marginBottom: "0.3rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                        <span style={{ fontSize: "0.6rem" }}>Energia</span>
                        <span style={{
                          fontSize: "0.6rem",
                          fontWeight: "bold",
                          color: stats.energy >= 70 ? "var(--blue)" : stats.energy >= 40 ? "var(--yellow)" : "var(--red)"
                        }}>
                          {stats.energy}%
                        </span>
                      </div>
                      <progress
                        className={`nes-progress ${stats.energy < 30 ? "is-error" : "is-primary"}`}
                        value={stats.energy}
                        max="100"
                        style={{ width: "100%", height: "12px" }}
                      />
                    </div>

                    {/* Hunger */}
                    <div style={{ marginBottom: "0.3rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                        <span style={{ fontSize: "0.6rem" }}>Hambre</span>
                        <span style={{
                          fontSize: "0.6rem",
                          fontWeight: "bold",
                          color: stats.hunger >= 70 ? "var(--green)" : stats.hunger >= 40 ? "var(--yellow)" : "var(--red)"
                        }}>
                          {stats.hunger}%
                        </span>
                      </div>
                      <progress
                        className={`nes-progress ${stats.hunger < 30 ? "is-error" : "is-warning"}`}
                        value={stats.hunger}
                        max="100"
                        style={{ width: "100%", height: "12px" }}
                      />
                    </div>
                  </div>

                  {/* Feeding Button + Gear + Chat */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    {onFeed && (
                      <FeedingSystem regenmon={regenmon} onFeed={onFeed} />
                    )}
                    {onToggleChat && (
                      <button
                        type="button"
                        className={`nes-btn ${showChat ? "is-primary" : ""}`}
                        onClick={onToggleChat}
                        style={{ fontSize: "0.55rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}
                      >
                        Chat
                      </button>
                    )}
                  </div>

                  {/* Next Evolution Info */}
                  {stage < 3 && (
                    <div className="nes-container is-dark" style={{ fontSize: "0.55rem", padding: "0.4rem" }}>
                      <p>
                        Proxima evolucion: {stage === 1 ? 500 : 1500} puntos
                        {stage === 1 && " (Joven)"}
                        {stage === 2 && " (Adulto)"}
                      </p>
                    </div>
                  )}

                  {stage === 3 && (
                    <div className="nes-container is-dark" style={{ fontSize: "0.55rem", padding: "0.4rem", background: "rgba(245, 158, 11, 0.15)" }}>
                      <p style={{ color: "var(--orange)" }}>Regenmon Adulto! Nivel maximo alcanzado</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
