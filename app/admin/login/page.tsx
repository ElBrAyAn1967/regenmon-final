// ==============================================
// ADMIN LOGIN PAGE (NES.css)
// ==============================================
// Página de inicio de sesión para el panel de admin

"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid password");
      } else if (result?.ok) {
        router.push("/admin");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#212529",
      }}
    >
      <Card centered style={{ maxWidth: "500px", width: "100%", margin: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔐</div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Admin Login</h1>
          <p style={{ fontSize: "0.7rem", color: "#aaa" }}>
            Enter admin password to access dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="nes-input is-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{ fontSize: "0.8rem" }}
            />
          </div>

          {error && (
            <div className="nes-text is-error" style={{ fontSize: "0.7rem", marginBottom: "1rem" }}>
              ⚠️ {error}
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            style={{ width: "100%", fontSize: "0.8rem" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a
            href="/"
            style={{ fontSize: "0.7rem", color: "#92cc41", textDecoration: "none" }}
          >
            ← Back to Home
          </a>
        </div>
      </Card>
    </div>
  );
}
