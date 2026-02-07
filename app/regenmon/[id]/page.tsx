// ==============================================
// REGENMON DETAIL PAGE (NES.css)
// ==============================================
// Página individual pixel art con barras de progreso

"use client";

import { useParams } from "next/navigation";
import { useRegenmon } from "../../hooks/useRegenmon";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function RegenmonPage() {
  const params = useParams();
  const id = params.id as string;
  const { regenmon, isLoading, error } = useRegenmon(id);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !regenmon) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card centered style={{ maxWidth: "400px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem" }}>😢</div>
              <h2 style={{ fontSize: "1.5rem", margin: "1rem 0" }}>Not Found</h2>
              <p style={{ fontSize: "0.8rem" }}>This Regenmon does not exist</p>
            </div>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const stats = regenmon.stats as any;

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {/* Header with Sprite */}
        <Card centered style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src={regenmon.sprite}
            alt={regenmon.name}
            style={{ width: "128px", height: "128px", margin: "0 auto 1rem", imageRendering: "pixelated" }}
          />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{regenmon.name}</h1>
          <p style={{ fontSize: "0.8rem", color: "#92cc41" }}>
            by {regenmon.ownerName} • Stage {regenmon.stage}
          </p>
          {!regenmon.isActive && (
            <div className="nes-badge" style={{ marginTop: "1rem" }}>
              <span className="is-error">⚠️ Inactive</span>
            </div>
          )}
        </Card>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>⭐</div>
              <div style={{ fontSize: "1.8rem", color: "#f7d51d", margin: "0.5rem 0" }}>
                {regenmon.totalPoints}
              </div>
              <div style={{ fontSize: "0.7rem" }}>Total Points</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>🍎</div>
              <div style={{ fontSize: "1.8rem", color: "#92cc41", margin: "0.5rem 0" }}>
                {regenmon.balance}
              </div>
              <div style={{ fontSize: "0.7rem" }}>$FRUTA</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>👁️</div>
              <div style={{ fontSize: "1.8rem", color: "#209cee", margin: "0.5rem 0" }}>
                {regenmon.totalVisits}
              </div>
              <div style={{ fontSize: "0.7rem" }}>Visits</div>
            </div>
          </Card>
        </div>

        {/* Status Bars (NES.css progress) */}
        <Card style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Regenmon Status</h3>

          {/* Happiness */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              <span>😊 Happiness</span>
              <span>{stats.happiness}/100</span>
            </div>
            <progress className="nes-progress is-warning" value={stats.happiness} max="100"></progress>
          </div>

          {/* Energy */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              <span>⚡ Energy</span>
              <span>{stats.energy}/100</span>
            </div>
            <progress className="nes-progress is-primary" value={stats.energy} max="100"></progress>
          </div>

          {/* Hunger */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              <span>🍖 Hunger</span>
              <span>{stats.hunger}/100</span>
            </div>
            <progress className="nes-progress is-success" value={stats.hunger} max="100"></progress>
          </div>
        </Card>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href={regenmon.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="success" style={{ fontSize: "0.9rem" }}>
              🎮 Visit Student App →
            </Button>
          </a>
          <p style={{ fontSize: "0.7rem", marginTop: "1.5rem", color: "#92cc41" }}>
            Last sync: {new Date(regenmon.lastSynced).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
