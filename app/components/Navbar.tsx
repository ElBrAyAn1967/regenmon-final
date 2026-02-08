// ==============================================
// NAVBAR COMPONENT (NES.css)
// ==============================================
// Navegación principal con autenticación Privy

"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export function Navbar() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      padding: "0.25rem 0.75rem",
      backgroundColor: "var(--bg-card)",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: "0.75rem", color: "var(--orange)", textDecoration: "none", fontWeight: "bold", whiteSpace: "nowrap" }}>
          Regenmon Hub
        </Link>

        {/* Hamburger button - mobile only */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--fg-primary)",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "0.25rem",
          }}
          className="nav-hamburger"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.6rem" }}>Home</Link>
          <Link href="/leaderboard" style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.6rem" }}>Leaderboard</Link>
          <Link href="/register" style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.6rem" }}>Register</Link>
          <Link href="/demo" style={{ color: "var(--orange)", textDecoration: "none", fontSize: "0.6rem", fontWeight: "bold" }}>Demo</Link>

          {ready && (
            <>
              {authenticated ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.55rem", color: "var(--fg-dim)" }}>{user?.email?.address?.split("@")[0] || "User"}</span>
                  <button className="nes-btn is-error" onClick={logout} style={{ fontSize: "0.5rem", padding: "0.15rem 0.4rem" }}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="nes-btn is-primary" onClick={login} style={{ fontSize: "0.5rem", padding: "0.15rem 0.4rem" }}>
                  Login
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          display: "none",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "0.75rem 0.5rem",
          borderTop: "1px solid var(--border-color)",
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.6rem" }}>Home</Link>
          <Link href="/leaderboard" onClick={() => setMenuOpen(false)} style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.6rem" }}>Leaderboard</Link>
          <Link href="/register" onClick={() => setMenuOpen(false)} style={{ color: "var(--fg-muted)", textDecoration: "none", fontSize: "0.6rem" }}>Register</Link>
          <Link href="/demo" onClick={() => setMenuOpen(false)} style={{ color: "var(--orange)", textDecoration: "none", fontSize: "0.6rem", fontWeight: "bold" }}>Demo</Link>
          {ready && (
            <>
              {authenticated ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.55rem", color: "var(--fg-dim)" }}>{user?.email?.address?.split("@")[0] || "User"}</span>
                  <button className="nes-btn is-error" onClick={logout} style={{ fontSize: "0.5rem", padding: "0.15rem 0.4rem" }}>Logout</button>
                </div>
              ) : (
                <button className="nes-btn is-primary" onClick={login} style={{ fontSize: "0.5rem", padding: "0.15rem 0.4rem" }}>Login</button>
              )}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-hamburger {
            display: block !important;
          }
          .nav-links {
            display: none !important;
          }
          .nav-mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
