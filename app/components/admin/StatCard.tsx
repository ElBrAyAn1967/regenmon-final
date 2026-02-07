// ==============================================
// STAT CARD (NES.css)
// ==============================================
// Tarjeta de estadística con icono y valor

import { CSSProperties } from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  style?: CSSProperties;
}

export function StatCard({ icon, label, value, color = "#92cc41", style }: StatCardProps) {
  return (
    <div className="nes-container is-dark" style={{ textAlign: "center", padding: "1.5rem", ...style }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "1.8rem", color, fontWeight: "bold", marginBottom: "0.3rem" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.6rem", color: "#aaa" }}>{label}</div>
    </div>
  );
}
