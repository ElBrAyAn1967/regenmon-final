// ==============================================
// REGISTER PAGE (NES.css)
// ==============================================
// Formulario pixel art para registrar Regenmon

"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/useRegister";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function RegisterPage() {
  const { user, authenticated } = usePrivy();
  const { register, isLoading, error } = useRegister();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    ownerEmail: user?.email?.address || "",
    appUrl: "",
    sprite: "",
  });

  const [success, setSuccess] = useState(false);
  const [registeredId, setRegisteredId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await register({
        ...formData,
        privyUserId: user?.id,
      });

      setSuccess(true);
      setRegisteredId(result.id);

      setTimeout(() => {
        router.push(`/regenmon/${result.id}`);
      }, 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card centered style={{ maxWidth: "500px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem" }}>🎉</div>
              <h2 style={{ fontSize: "1.5rem", margin: "1rem 0" }}>Regenmon Registered!</h2>
              <p style={{ fontSize: "0.8rem", marginBottom: "1rem" }}>
                Your Regenmon has been successfully registered.
              </p>
              <p style={{ fontSize: "0.7rem", color: "#92cc41" }}>ID: {registeredId}</p>
              <p style={{ fontSize: "0.7rem", marginTop: "1rem" }}>Redirecting...</p>
            </div>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        <h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "2rem", color: "#92cc41" }}>
          📝 Register Regenmon
        </h1>

        {!authenticated && (
          <div className="nes-container is-dark" style={{ maxWidth: "600px", margin: "0 auto 2rem", backgroundColor: "#209cee" }}>
            <p style={{ fontSize: "0.8rem" }}>💡 Login to auto-fill your info</p>
          </div>
        )}

        <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            {/* Regenmon Name */}
            <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="name" style={{ fontSize: "0.8rem" }}>Regenmon Name *</label>
              <input
                type="text"
                id="name"
                className="nes-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Pikachito"
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            {/* Owner Name */}
            <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="ownerName" style={{ fontSize: "0.8rem" }}>Your Name *</label>
              <input
                type="text"
                id="ownerName"
                className="nes-input"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Ex: Juan Perez"
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            {/* Email */}
            <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="email" style={{ fontSize: "0.8rem" }}>Email (optional)</label>
              <input
                type="email"
                id="email"
                className="nes-input"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="your@email.com"
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            {/* App URL */}
            <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="appUrl" style={{ fontSize: "0.8rem" }}>App URL (Vercel) *</label>
              <input
                type="url"
                id="appUrl"
                className="nes-input"
                required
                value={formData.appUrl}
                onChange={(e) => setFormData({ ...formData, appUrl: e.target.value })}
                placeholder="https://my-regenmon.vercel.app"
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            {/* Sprite URL */}
            <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="sprite" style={{ fontSize: "0.8rem" }}>Sprite URL (image) *</label>
              <input
                type="url"
                id="sprite"
                className="nes-input"
                required
                value={formData.sprite}
                onChange={(e) => setFormData({ ...formData, sprite: e.target.value })}
                placeholder="https://example.com/sprite.png"
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            {/* Error */}
            {error && <div style={{ marginBottom: "1.5rem" }}><ErrorMessage message={error} /></div>}

            {/* Submit */}
            <Button
              type="submit"
              variant="success"
              isLoading={isLoading}
              style={{ width: "100%" }}
            >
              {isLoading ? "Registering..." : "Register Regenmon"}
            </Button>
          </form>
        </Card>
      </div>
      <Footer />
    </>
  );
}
