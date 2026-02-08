// ==============================================
// FOOTER COMPONENT
// ==============================================
// Footer pixel art con información del proyecto

export function Footer() {
  return (
    <footer style={{
      padding: "1rem",
      textAlign: "center",
      backgroundColor: "var(--bg-card)",
      borderTop: "1px solid var(--border-color)",
      marginTop: "3rem"
    }}>
      <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)" }}>Powered by Next.js + Supabase + Privy + Gemini</p>
      <p style={{ fontSize: "0.45rem", marginTop: "0.5rem", color: "var(--fg-muted)" }}>
        Regenmon Hub &copy; 2025
      </p>
    </footer>
  );
}
