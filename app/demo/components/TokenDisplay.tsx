// ==============================================
// TOKEN DISPLAY COMPONENT - Session 3
// ==============================================
// Muestra balance de tokens $FRUTA

"use client";

import { Card } from "@/app/components/ui/Card";

interface TokenDisplayProps {
  balance: number;
}

export function TokenDisplay({ balance }: TokenDisplayProps) {
  return (
    <Card centered>
      <div style={{ textAlign: "center" }}>
        {/* Apple Icon */}
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            animation: "float 3s ease-in-out infinite"
          }}
        >
          🍎
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>

        {/* Title */}
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#92cc41" }}>
          Tokens $FRUTA
        </h3>

        {/* Balance */}
        <p
          style={{
            fontSize: "2.5rem",
            color: "#f7d51d",
            fontWeight: "bold",
            textShadow: "2px 2px 0px rgba(0,0,0,0.2)"
          }}
        >
          {balance}
        </p>

        {/* Info */}
        <p style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "0.5rem" }}>
          💡 Gana tokens entrenando • Úsalos para alimentar
        </p>
      </div>
    </Card>
  );
}
