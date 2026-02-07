// ==============================================
// ADMIN NAVBAR (NES.css)
// ==============================================
// Barra de navegación para el dashboard de admin

"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function AdminNavbar() {
  return (
    <nav style={{ backgroundColor: "#209cee", padding: "1.5rem 2rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Logo */}
        <Link href="/admin" style={{ textDecoration: "none", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🎮</span>
            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>ADMIN PANEL</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/admin" style={{ textDecoration: "none", color: "white", fontSize: "0.7rem" }}>
            Dashboard
          </Link>
          <Link href="/admin/regenmons" style={{ textDecoration: "none", color: "white", fontSize: "0.7rem" }}>
            Regenmons
          </Link>
          <Link href="/admin/tokens" style={{ textDecoration: "none", color: "white", fontSize: "0.7rem" }}>
            Tokens
          </Link>
          <Link href="/admin/logs" style={{ textDecoration: "none", color: "white", fontSize: "0.7rem" }}>
            Logs
          </Link>
          <button
            className="nes-btn is-error"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
