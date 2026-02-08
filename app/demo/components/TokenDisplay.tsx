// ==============================================
// TOKEN DISPLAY COMPONENT - Session 3
// ==============================================
// Alerta temporal de balance de tokens $FRUTA

"use client";

import { useState, useEffect } from "react";

interface TokenDisplayProps {
  balance: number;
}

export function TokenDisplay({ balance }: TokenDisplayProps) {
  const [visible, setVisible] = useState(true);

  // Auto-hide after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      style={{
        position: "fixed",
        top: "3.5rem",
        right: "0.5rem",
        zIndex: 200,
        maxWidth: "calc(100vw - 1rem)",
        padding: "0.6rem 1rem",
        backgroundColor: "var(--bg-card-light)",
        border: "2px solid var(--orange)",
        borderRadius: "4px",
        cursor: "pointer",
        animation: "slideInRight 0.3s ease-out",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <span style={{ fontSize: "1.2rem" }}>🍎</span>
      <div>
        <span style={{ fontSize: "0.55rem", color: "var(--fg-muted)" }}>$FRUTA </span>
        <span style={{ fontSize: "0.8rem", color: "var(--yellow)", fontWeight: "bold" }}>{balance}</span>
      </div>
      <span style={{ fontSize: "0.45rem", color: "var(--fg-dim)", marginLeft: "0.3rem" }}>✕</span>
    </div>
  );
}
