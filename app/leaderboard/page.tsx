// ==============================================
// LEADERBOARD PAGE (NES.css)
// ==============================================
// Ranking pixel art de Regenmons

"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { Card } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const { leaderboard, pagination, isLoading, error } = useLeaderboard(page, 10);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--red)" }}>⚠️ Error loading leaderboard</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "2rem", color: "var(--orange)" }}>
          🏆 Leaderboard
        </h1>

        {leaderboard.length === 0 ? (
          <Card centered style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              No Regenmons registered yet. Be the first!
            </p>
            <Link href="/register">
              <Button variant="success">Register Regenmon →</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Leaderboard List */}
            <div style={{ marginBottom: "2rem" }}>
              {leaderboard.map((regenmon: any) => (
                <Card key={regenmon.id} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1.5rem", alignItems: "center" }}>
                    {/* Rank */}
                    <div style={{ textAlign: "center", fontSize: "2rem" }}>
                      {regenmon.rank <= 3 ? (
                        regenmon.rank === 1 ? "🥇" :
                        regenmon.rank === 2 ? "🥈" : "🥉"
                      ) : (
                        <span style={{ fontSize: "1.5rem" }}>#{regenmon.rank}</span>
                      )}
                    </div>

                    {/* Regenmon Info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                        <img
                          src={regenmon.sprite}
                          alt={regenmon.name}
                          style={{ width: "48px", height: "48px", imageRendering: "pixelated" }}
                        />
                        <div>
                          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>{regenmon.name}</h3>
                          <p style={{ fontSize: "0.7rem", color: "var(--orange)" }}>by {regenmon.ownerName} • Stage {regenmon.stage}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "2rem", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                        <span>⭐ {regenmon.totalPoints.toLocaleString()} pts</span>
                        <span style={{ color: "var(--orange)" }}>🍎 {regenmon.balance} $FRUTA</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div>
                      <Link href={`/regenmon/${regenmon.id}`}>
                        <Button variant="primary" style={{ padding: "0.5rem 1rem", fontSize: "0.7rem" }}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <Button
                  variant="primary"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  ← Prev
                </Button>
                <span style={{ fontSize: "0.8rem" }}>
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="primary"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
