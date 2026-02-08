// ==============================================
// REGISTER HUB COMPONENT - Session 5 (S5-1 + S5-2)
// ==============================================
// Registro en el HUB público + Vista de éxito

"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

interface RegisterHubProps {
  regenmon: {
    name: string;
    ownerName: string;
    sprite: string;
    stage: number;
    totalPoints: number;
    balance: number;
    stats: { happiness: number; energy: number; hunger: number };
    isRegistered: boolean;
    appUrl?: string;
  };
  onRegister: (appUrl: string) => void;
}

// Map emoji sprites to placeholder URLs for the API validation
const SPRITE_URL_MAP: Record<string, string> = {
  "🦖": "https://em-content.zobj.net/source/apple/391/t-rex_1f996.png",
  "🐉": "https://em-content.zobj.net/source/apple/391/dragon_1f409.png",
  "🦕": "https://em-content.zobj.net/source/apple/391/sauropod_1f995.png",
};

function getSpriteUrl(sprite: string): string {
  return SPRITE_URL_MAP[sprite] || `https://ui-avatars.com/api/?name=${encodeURIComponent(sprite)}&size=128`;
}

export function RegisterHub({ regenmon, onRegister }: RegisterHubProps) {
  const [email, setEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  // If already registered, show success view
  if (regenmon.isRegistered && regenmon.appUrl) {
    return <SuccessView regenmon={regenmon} registeredId={registeredId} />;
  }

  const handleRegister = async () => {
    if (isRegistering) return;

    setIsRegistering(true);
    setError("");

    try {
      // Generate a unique demo appUrl (must contain "localhost" for validation)
      const demoId = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const appUrl = `http://localhost:3000/regenmon/${demoId}`;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regenmon.name,
          ownerName: regenmon.ownerName,
          ownerEmail: email || undefined,
          appUrl,
          sprite: getSpriteUrl(regenmon.sprite),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      setRegisteredId(data.data?.id || null);
      onRegister(appUrl);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.message?.includes("already exists")) {
        setError("Este Regenmon ya está registrado en el HUB.");
      } else if (err.message?.includes("Too many")) {
        setError("Demasiados intentos. Espera un momento.");
      } else {
        setError(err.message || "Error al registrar. Intenta de nuevo.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center", color: "var(--orange)" }}>
        Registrar en el HUB
      </h3>

      {/* Regenmon Preview */}
      <div
        className="nes-container is-dark is-centered"
        style={{ marginBottom: "1.5rem", padding: "1.5rem" }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>{regenmon.sprite}</div>
        <h4 style={{ fontSize: "0.75rem", color: "var(--yellow)", marginBottom: "0.25rem" }}>
          {regenmon.name}
        </h4>
        <p style={{ fontSize: "0.5rem", color: "var(--fg-muted)" }}>
          Owner: {regenmon.ownerName} | Stage {regenmon.stage}/3 | {regenmon.totalPoints} pts
        </p>
      </div>

      {/* Registration Form */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontSize: "0.6rem", marginBottom: "0.5rem", display: "block", color: "var(--fg-muted)" }}>
          Email (opcional):
        </label>
        <input
          type="email"
          className="nes-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          style={{ fontSize: "0.6rem", marginBottom: "0.5rem" }}
        />
        <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)" }}>
          Para recibir notificaciones del HUB (opcional)
        </p>
      </div>

      {/* Info */}
      <div
        className="nes-container is-rounded"
        style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(59, 130, 246, 0.1)" }}
      >
        <h4 style={{ fontSize: "0.65rem", marginBottom: "0.5rem", color: "var(--orange)" }}>Al registrarte:</h4>
        <ul style={{ fontSize: "0.55rem", color: "var(--fg-muted)", listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "0.25rem" }}>✅ Tu Regenmon aparece en el Leaderboard</li>
          <li style={{ marginBottom: "0.25rem" }}>✅ Obtienes un perfil público</li>
          <li style={{ marginBottom: "0.25rem" }}>✅ Conectas con otros estudiantes</li>
        </ul>
      </div>

      {/* Error */}
      {error && (
        <div
          className="nes-container is-rounded"
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            fontSize: "0.6rem",
            color: "var(--red)",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Register Button */}
      <Button
        variant="success"
        onClick={handleRegister}
        disabled={isRegistering}
        isLoading={isRegistering}
        style={{ width: "100%", fontSize: "0.7rem" }}
      >
        Registrar en el HUB
      </Button>
    </Card>
  );
}

// ==============================================
// SUCCESS VIEW (S5-2)
// ==============================================
function SuccessView({
  regenmon,
  registeredId,
}: {
  regenmon: RegisterHubProps["regenmon"];
  registeredId: string | null;
}) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Success Badge */}
      <Card style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
        <h3 style={{ fontSize: "0.9rem", color: "var(--orange)", marginBottom: "0.5rem" }}>
          Registrado en el HUB!
        </h3>
        <p style={{ fontSize: "0.6rem", color: "var(--fg-muted)", marginBottom: "1rem" }}>
          {regenmon.name} ahora es parte de la comunidad global
        </p>

        {/* Registered Badge */}
        <div
          className="nes-badge"
          style={{ display: "inline-block", marginBottom: "1rem" }}
        >
          <span className="is-success" style={{ fontSize: "0.7rem" }}>HUB MEMBER</span>
        </div>

        {/* Regenmon Card */}
        <div
          className="nes-container is-dark is-centered"
          style={{ padding: "1.5rem", marginBottom: "1rem" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{regenmon.sprite}</div>
          <h4 style={{ fontSize: "0.75rem", color: "var(--yellow)" }}>{regenmon.name}</h4>
          <p style={{ fontSize: "0.5rem", color: "var(--fg-muted)" }}>
            Stage {regenmon.stage}/3 | {regenmon.totalPoints} pts | {regenmon.balance} tokens
          </p>
        </div>
      </Card>

      {/* Action Buttons (S5-2) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Profile Link */}
        {registeredId && (
          <a
            href={`/regenmon/${registeredId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div
              className="nes-container is-rounded"
              style={{
                textAlign: "center",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👤</div>
              <h4 style={{ fontSize: "0.65rem", marginBottom: "0.25rem" }}>Mi Perfil</h4>
              <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)" }}>Ver perfil público</p>
            </div>
          </a>
        )}

        {/* Leaderboard Link */}
        <a
          href="/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div
            className="nes-container is-rounded"
            style={{
              textAlign: "center",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏆</div>
            <h4 style={{ fontSize: "0.65rem", marginBottom: "0.25rem" }}>Leaderboard</h4>
            <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)" }}>Ranking global</p>
          </div>
        </a>

        {/* Explore Link */}
        <a
          href="/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div
            className="nes-container is-rounded"
            style={{
              textAlign: "center",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
            <h4 style={{ fontSize: "0.65rem", marginBottom: "0.25rem" }}>Explorar</h4>
            <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)" }}>Ver otros Regenmon</p>
          </div>
        </a>
      </div>
    </div>
  );
}
