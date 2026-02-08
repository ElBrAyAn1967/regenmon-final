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
        <div className="text-center mb-4" style={{ paddingTop: "2rem" }}>
          <h1 className="home-title" style={{ fontSize: "2rem", color: "var(--fg-primary)", marginBottom: "1rem", lineHeight: "1.4" }}>
            <span style={{ color: "var(--orange)" }}>Regenmon</span> Hub
          </h1>
          <p className="home-subtitle" style={{ fontSize: "0.75rem", maxWidth: "700px", margin: "0 auto", lineHeight: "2", color: "var(--fg-muted)" }}>
            Bootcamp de programacion con Tamagotchis virtuales.
            <br />
            Aprende, entrena tu Regenmon, y gana tokens <span style={{ color: "var(--orange)" }}>$FRUTA</span>.
          </p>
        </div>

        {/* Demo Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Link href="/demo" style={{ textDecoration: "none" }}>
            <button
              type="button"
              className="nes-btn is-primary"
              style={{
                fontSize: "1.2rem",
                padding: "1.5rem 3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                minWidth: "220px",
              }}
            >
              <div style={{ fontSize: "3rem" }}>👾</div>
              <div>DEMO</div>
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="home-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>👾</div>
              <div className="home-stat-number" style={{ fontSize: "1.8rem", color: "var(--orange)", margin: "0.5rem 0" }}>
                {stats?.totalRegenmons || 0}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)" }}>Regenmons</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>⭐</div>
              <div className="home-stat-number" style={{ fontSize: "1.8rem", color: "var(--yellow)", margin: "0.5rem 0" }}>
                {stats?.totalPoints?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)" }}>Total Points</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>🍎</div>
              <div className="home-stat-number" style={{ fontSize: "1.8rem", color: "var(--orange)", margin: "0.5rem 0" }}>
                {stats?.totalTokensDistributed?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)" }}>$FRUTA Tokens</div>
            </div>
          </Card>
        </div>

        {/* Top Regenmon */}
        {stats?.topRegenmon && (
          <Card centered style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "var(--fg-primary)" }}>🏆 Top Regenmon</h3>
              <p style={{ fontSize: "0.8rem" }}>
                <strong style={{ color: "var(--orange)" }}>{stats.topRegenmon.name}</strong> by {stats.topRegenmon.owner}
              </p>
              <p style={{ fontSize: "0.7rem", marginTop: "0.5rem", color: "var(--orange)" }}>
                {stats.topRegenmon.points} points • {stats.topRegenmon.balance} $FRUTA
              </p>
            </div>
          </Card>
        )}

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap", paddingBottom: "2rem" }}>
          <Link href="/register">
            <Button variant="primary" style={{ fontSize: "0.75rem", padding: "0.6rem 1rem" }}>📝 Register</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="warning" style={{ fontSize: "0.75rem", padding: "0.6rem 1rem" }}>🏆 Leaderboard</Button>
          </Link>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .home-title {
            font-size: 1.3rem !important;
          }
          .home-subtitle {
            font-size: 0.6rem !important;
          }
          .home-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .home-stat-number {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </>
  );
}
