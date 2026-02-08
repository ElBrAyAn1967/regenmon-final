// ==============================================
// NAVBAR COMPONENT (NES.css)
// ==============================================
// Navegación principal con autenticación Privy

"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { Button } from "./ui/Button";

export function Navbar() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  return (
    <nav style={{
      padding: "0.25rem 1rem",
      backgroundColor: "var(--bg-card)",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--orange)", textDecoration: "none", fontWeight: "bold" }}>
          Regenmon Hub
        </Link>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.65rem", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--fg-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--fg-muted)"}
          >Home</Link>
          <Link href="/leaderboard" style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.65rem", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--fg-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--fg-muted)"}
          >Leaderboard</Link>
          <Link href="/register" style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.65rem", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--fg-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--fg-muted)"}
          >Register</Link>
          <Link href="/demo" style={{ color: "var(--orange)", textDecoration: "none", fontSize: "0.65rem", fontWeight: "bold" }}>Demo</Link>

          {ready && (
            <>
              {authenticated ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.6rem", color: "var(--fg-dim)" }}>{user?.email?.address?.split("@")[0] || "User"}</span>
                  <button className="nes-btn is-error" onClick={logout} style={{ fontSize: "0.55rem", padding: "0.15rem 0.5rem" }}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="nes-btn is-primary" onClick={login} style={{ fontSize: "0.55rem", padding: "0.15rem 0.5rem" }}>
                  Login
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
