// ==============================================
// ADMIN CARD (NES.css)
// ==============================================
// Tarjeta contenedora para secciones del admin

import { ReactNode, CSSProperties } from "react";

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  centered?: boolean;
  style?: CSSProperties;
}

export function AdminCard({ children, title, centered, style }: AdminCardProps) {
  return (
    <div
      className={`nes-container is-dark with-title ${centered ? "is-centered" : ""}`}
      style={{ marginBottom: "2rem", ...style }}
    >
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
}
