// ==============================================
// HOMEPAGE - REGENMON HUB (NES.css)
// ==============================================
// Página principal con estadísticas en tiempo real

"use client";

import { useStats } from "./hooks/useStats";
import { Card } from "./components/ui/Card";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { Button } from "./components/ui/Button";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Link from "next/link";

export default function HomePage() {
  const { stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ErrorMessage message="Failed to load stats" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "2rem", color: "#92cc41", marginBottom: "1rem" }}>
            🎮 Regenmon Hub
          </h1>
          <p style={{ fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Bootcamp de programacion con Tamagotchis virtuales.
            <br />
            Aprende, entrena tu Regenmon, y gana tokens $FRUTA.
          </p>
        </div>

        {/* Demo Button - GRANDE */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
          <Link href="/demo">
            <button
              type="button"
              className="nes-btn is-success"
              style={{
                fontSize: "1.5rem",
                padding: "2rem 3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                minWidth: "300px",
              }}
            >
              <div style={{ fontSize: "4rem" }}>👾</div>
              <div>DEMO</div>
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>👾</div>
              <div style={{ fontSize: "2rem", color: "#209cee", margin: "1rem 0" }}>
                {stats?.totalRegenmons || 0}
              </div>
              <div style={{ fontSize: "0.8rem" }}>Regenmons</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>⭐</div>
              <div style={{ fontSize: "2rem", color: "#f7d51d", margin: "1rem 0" }}>
                {stats?.totalPoints?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: "0.8rem" }}>Total Points</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>🍎</div>
              <div style={{ fontSize: "2rem", color: "#92cc41", margin: "1rem 0" }}>
                {stats?.totalTokensDistributed?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: "0.8rem" }}>$FRUTA Tokens</div>
            </div>
          </Card>
        </div>

        {/* Top Regenmon */}
        {stats?.topRegenmon && (
          <Card centered style={{ maxWidth: "600px", margin: "3rem auto" }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>🏆 Top Regenmon</h3>
              <p>
                <strong>{stats.topRegenmon.name}</strong> by {stats.topRegenmon.owner}
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#92cc41" }}>
                {stats.topRegenmon.points} points • {stats.topRegenmon.balance} $FRUTA
              </p>
            </div>
          </Card>
        )}

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "3rem", flexWrap: "wrap" }}>
          <Link href="/register">
            <Button variant="primary">📝 Register Regenmon</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="warning">🏆 Leaderboard</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
