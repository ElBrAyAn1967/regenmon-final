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
    <nav style={{ padding: "1rem", backgroundColor: "#209cee", marginBottom: "2rem" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/" style={{ fontSize: "1.2rem", color: "#fff", textDecoration: "none" }}>
          🎮 Regenmon Hub
        </Link>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
          <Link href="/leaderboard" style={{ color: "#fff", textDecoration: "none" }}>Leaderboard</Link>
          <Link href="/register" style={{ color: "#fff", textDecoration: "none" }}>Register</Link>

          {ready && (
            <>
              {authenticated ? (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#fff" }}>👋 {user?.email?.address?.split("@")[0] || "User"}</span>
                  <Button variant="error" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="success" onClick={login}>
                  Login
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
