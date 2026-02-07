// ==============================================
// CREATE REGENMON COMPONENT - Session 1
// ==============================================
// Modal de creación inicial del Regenmon

"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

interface CreateRegenmonProps {
  onCreateRegenmon: (data: { name: string; ownerName: string; sprite: string }) => void;
}

export function CreateRegenmon({ onCreateRegenmon }: CreateRegenmonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [sprite, setSprite] = useState("🦖");
  const [errors, setErrors] = useState({ name: "", ownerName: "" });

  const sprites = ["🦖", "🐉", "🦕"];

  const MIN_NAME_LENGTH = 3;
  const MAX_NAME_LENGTH = 20;

  const validateName = (value: string): string => {
    if (!value.trim()) return "El nombre es requerido";
    if (value.trim().length < MIN_NAME_LENGTH) return `Mínimo ${MIN_NAME_LENGTH} caracteres`;
    if (value.length > MAX_NAME_LENGTH) return `Máximo ${MAX_NAME_LENGTH} caracteres`;
    return "";
  };

  const validateOwnerName = (value: string): string => {
    if (!value.trim()) return "Tu nombre es requerido";
    if (value.trim().length < 2) return "Mínimo 2 caracteres";
    return "";
  };

  const handleNameChange = (value: string) => {
    setName(value);
    const error = validateName(value);
    setErrors(prev => ({ ...prev, name: error }));
  };

  const handleOwnerNameChange = (value: string) => {
    setOwnerName(value);
    const error = validateOwnerName(value);
    setErrors(prev => ({ ...prev, ownerName: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const ownerError = validateOwnerName(ownerName);

    if (nameError || ownerError) {
      setErrors({ name: nameError, ownerName: ownerError });
      return;
    }

    onCreateRegenmon({
      name: name.trim(),
      ownerName: ownerName.trim(),
      sprite
    });

    // Reset form
    setName("");
    setOwnerName("");
    setSprite("🦖");
    setErrors({ name: "", ownerName: "" });
    setIsOpen(false);
  };

  const isFormValid = name.trim().length >= MIN_NAME_LENGTH &&
                      name.length <= MAX_NAME_LENGTH &&
                      ownerName.trim().length >= 2 &&
                      !errors.name &&
                      !errors.ownerName;

  if (!isOpen) {
    return (
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setIsOpen(true)}
          className="nes-btn is-success"
          style={{
            fontSize: "1.2rem",
            padding: "1rem 2rem",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 0 #0f380f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          🎮 Crear Mi Regenmon
        </button>
      </div>
    );
  }

  return (
    <div
      className="nes-container is-rounded"
      style={{
        marginBottom: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        animation: "slideIn 0.3s ease-out"
      }}
    >
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>🎮 Crea Tu Regenmon</h3>
      <form onSubmit={handleSubmit}>
        {/* Nombre del Regenmon */}
        <div className="nes-field" style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ fontSize: "0.8rem" }}>
            Nombre del Regenmon:
          </label>
          <input
            type="text"
            id="name"
            className={`nes-input ${errors.name ? "is-error" : ""}`}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="ej. Frutosaurio"
            maxLength={MAX_NAME_LENGTH}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
            {errors.name ? (
              <span style={{ fontSize: "0.7rem", color: "#e76e55" }}>⚠️ {errors.name}</span>
            ) : (
              <span style={{ fontSize: "0.7rem", color: "#aaa" }}>
                {MIN_NAME_LENGTH}-{MAX_NAME_LENGTH} caracteres
              </span>
            )}
            <span style={{ fontSize: "0.7rem", color: name.length > MAX_NAME_LENGTH - 5 ? "#f7d51d" : "#aaa" }}>
              {name.length}/{MAX_NAME_LENGTH}
            </span>
          </div>
        </div>

        {/* Tu Nombre */}
        <div className="nes-field" style={{ marginBottom: "1rem" }}>
          <label htmlFor="owner" style={{ fontSize: "0.8rem" }}>
            Tu Nombre:
          </label>
          <input
            type="text"
            id="owner"
            className={`nes-input ${errors.ownerName ? "is-error" : ""}`}
            value={ownerName}
            onChange={(e) => handleOwnerNameChange(e.target.value)}
            placeholder="ej. Brayan"
          />
          {errors.ownerName && (
            <span style={{ fontSize: "0.7rem", color: "#e76e55", marginTop: "0.3rem", display: "block" }}>
              ⚠️ {errors.ownerName}
            </span>
          )}
        </div>

        {/* Selección de Tipo */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.8rem", marginBottom: "0.5rem", display: "block" }}>
            Elige un Tipo:
          </label>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "0.5rem" }}>
            {sprites.map((s) => (
              <button
                key={s}
                type="button"
                className={`nes-btn ${sprite === s ? "is-primary" : ""}`}
                onClick={() => setSprite(s)}
                onMouseEnter={(e) => {
                  if (sprite !== s) {
                    e.currentTarget.style.transform = "scale(1.15) rotate(5deg)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = sprite === s ? "scale(1.1)" : "scale(1)";
                }}
                style={{
                  fontSize: "2.5rem",
                  padding: "1rem",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  transform: sprite === s ? "scale(1.1)" : "scale(1)",
                  cursor: "pointer",
                  boxShadow: sprite === s ? "0 4px 8px rgba(33, 156, 238, 0.3)" : "none",
                  animation: sprite === s ? "pulse 1.5s ease-in-out infinite" : "none"
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <p style={{ fontSize: "0.7rem", color: "#aaa", textAlign: "center", marginTop: "0.5rem" }}>
            Tipo seleccionado: {sprite}
          </p>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="success"
            type="submit"
            disabled={!isFormValid}
            style={{ flex: 1 }}
          >
            ✅ Crear
          </Button>
          <Button
            variant="error"
            onClick={() => {
              setIsOpen(false);
              setErrors({ name: "", ownerName: "" });
            }}
            style={{ flex: 1 }}
          >
            ❌ Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
