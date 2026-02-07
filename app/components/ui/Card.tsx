// ==============================================
// CARD COMPONENT (NES.css)
// ==============================================
// Container pixel art con bordes retro

import { CSSProperties } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
  centered?: boolean;
  style?: CSSProperties;
}

export function Card({ children, className = "", isDark = false, centered = false, style }: CardProps) {
  return (
    <div
      className={`nes-container ${isDark ? "is-dark" : "with-title"} ${centered ? "is-centered" : ""} ${className}`}
      style={{ marginBottom: "2rem", ...style }}
    >
      {children}
    </div>
  );
}
