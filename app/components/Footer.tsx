// ==============================================
// FOOTER COMPONENT
// ==============================================
// Footer pixel art con información del proyecto

export function Footer() {
  return (
    <footer style={{ padding: "2rem", textAlign: "center", backgroundColor: "#212529", color: "#fff", marginTop: "4rem" }}>
      <p style={{ fontSize: "0.8rem" }}>🚀 Powered by Next.js + Supabase + Privy + Gemini</p>
      <p style={{ fontSize: "0.7rem", marginTop: "1rem", color: "#92cc41" }}>
        Fase 1: Backend APIs ✅ | Fase 2: Frontend Público 🔄
      </p>
    </footer>
  );
}
