// ==============================================
// TRAINING SYSTEM COMPONENT - Session 4
// ==============================================
// Sistema de entrenamiento con upload y evaluación

"use client";

import { useState, useRef } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

interface TrainingSystemProps {
  regenmon: any;
  onTrainingComplete: (result: { score: number; points: number; tokens: number; category: string }) => void;
}

const CATEGORIES = [
  { value: "codigo", label: "💻 Código", description: "Tu mejor código" },
  { value: "diseño", label: "🎨 Diseño", description: "UI/UX o gráfico" },
  { value: "proyecto", label: "🚀 Proyecto", description: "Proyecto completo" },
  { value: "aprendizaje", label: "📚 Aprendizaje", description: "Notas o ejercicios" },
];

export function TrainingSystem({ regenmon, onTrainingComplete }: TrainingSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState("codigo");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen (PNG, JPG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande. Máximo 5MB.");
      return;
    }

    setSelectedFile(file);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEvaluate = async () => {
    if (!selectedFile || isEvaluating) return;

    setIsEvaluating(true);

    try {
      // Convert image to base64 using Promise
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const res = await fetch("/api/demo/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          category: selectedCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.fallbackScore) {
        throw new Error(data.error || "Error al evaluar");
      }

      // Handle fallback score
      const finalScore = data.fallbackScore || data.score;
      const finalFeedback = data.fallbackFeedback || data.feedback;
      const finalPoints = data.points;
      const finalTokens = data.tokens;

      // Calculate stat effects based on score (mirrors useDemoState logic)
      // hunger = saciedad (negative = gets hungry from training)
      let statEffects: { happiness: number; energy: number; hunger: number };
      if (finalScore >= 80) {
        statEffects = { happiness: 15, energy: -20, hunger: -15 };
      } else if (finalScore >= 60) {
        statEffects = { happiness: 8, energy: -15, hunger: -12 };
      } else if (finalScore >= 40) {
        statEffects = { happiness: 3, energy: -12, hunger: -10 };
      } else {
        statEffects = { happiness: -10, energy: -15, hunger: -10 };
      }

      setResult({
        score: finalScore,
        feedback: finalFeedback,
        points: finalPoints,
        tokens: finalTokens,
        isFallback: !!data.fallbackScore,
        statEffects,
      });

      // Update regenmon stats
      onTrainingComplete({
        score: finalScore,
        points: finalPoints,
        tokens: finalTokens,
        category: selectedCategory,
      });
    } catch (error: any) {
      console.error("Evaluation error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setIsEvaluating(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card style={{ maxWidth: "100%", margin: "0 auto" }}>
      <h3 style={{ marginBottom: "0.75rem", fontSize: "0.85rem", color: "var(--orange)" }}>Entrenamiento</h3>

      {/* Category Selection */}
      {!result && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.6rem", marginBottom: "0.5rem", display: "block", color: "var(--fg-muted)" }}>
            Categoria:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`nes-btn ${selectedCategory === cat.value ? "is-primary" : ""}`}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  fontSize: "0.6rem",
                  padding: "0.4rem",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.value) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div>{cat.label}</div>
                <div style={{ fontSize: "0.5rem", color: "var(--fg-dim)", marginTop: "0.25rem" }}>
                  {cat.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Upload */}
      {!selectedFile && !result && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            style={{ width: "100%" }}
          >
            📸 Subir Captura
          </Button>
          <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)", textAlign: "center", marginTop: "0.5rem" }}>
            Sube una captura de tu {CATEGORIES.find(c => c.value === selectedCategory)?.description}
          </p>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && !result && (
        <div style={{ marginBottom: "1rem" }}>
          <div
            className="nes-container is-dark"
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                border: "2px solid var(--orange)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              variant="success"
              onClick={handleEvaluate}
              disabled={isEvaluating}
              style={{ flex: 1 }}
            >
              {isEvaluating ? "🔄 Evaluando..." : "✅ Evaluar"}
            </Button>
            <Button
              variant="error"
              onClick={handleReset}
              disabled={isEvaluating}
              style={{ flex: 1 }}
            >
              ❌ Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Score Display */}
          <div
            className="nes-container is-rounded"
            style={{
              marginBottom: "1.5rem",
              padding: "1.5rem",
              textAlign: "center",
              backgroundColor: result.score >= 70 ? "rgba(245, 158, 11, 0.15)" : result.score >= 40 ? "rgba(251, 191, 36, 0.15)" : "rgba(239, 68, 68, 0.15)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {result.score >= 80 ? "🏆" : result.score >= 60 ? "⭐" : result.score >= 40 ? "👍" : "💪"}
            </div>
            <h2 style={{ fontSize: "1.4rem", color: "var(--yellow)", marginBottom: "0.5rem" }}>
              {result.score}/100
            </h2>
            <p style={{ fontSize: "0.6rem", color: "var(--fg-muted)" }}>
              {result.score >= 80 ? "Excelente trabajo!" : result.score >= 60 ? "Buen trabajo!" : result.score >= 40 ? "Buen intento" : "Sigue practicando"}
            </p>
            {result.isFallback && (
              <p style={{ fontSize: "0.5rem", color: "var(--red)", marginTop: "0.5rem" }}>
                ⚠️ Evaluación con score por defecto (API temporalmente no disponible)
              </p>
            )}
          </div>

          {/* Feedback */}
          <div
            className="nes-container is-dark"
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              fontSize: "0.8rem",
            }}
          >
            <h4 style={{ fontSize: "0.7rem", marginBottom: "0.5rem", color: "var(--orange)" }}>Feedback:</h4>
            <p style={{ lineHeight: "1.6", fontSize: "0.6rem" }}>{result.feedback}</p>
          </div>

          {/* Rewards */}
          <div
            className="nes-container is-rounded"
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
            }}
          >
            <h4 style={{ fontSize: "0.7rem", marginBottom: "0.75rem", color: "var(--orange)" }}>Recompensas:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem" }}>⭐</div>
                <div style={{ fontSize: "0.9rem", color: "var(--yellow)", fontWeight: "bold" }}>
                  +{result.points}
                </div>
                <div style={{ fontSize: "0.55rem", color: "var(--fg-muted)" }}>Puntos</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem" }}>🍎</div>
                <div style={{ fontSize: "0.9rem", color: "var(--orange)", fontWeight: "bold" }}>
                  +{result.tokens}
                </div>
                <div style={{ fontSize: "0.55rem", color: "var(--fg-muted)" }}>Tokens</div>
              </div>
            </div>
          </div>

          {/* Stat Effects from Training */}
          {result.statEffects && (
            <div
              className="nes-container is-rounded"
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: result.score >= 60 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              }}
            >
              <h4 style={{ fontSize: "0.7rem", marginBottom: "0.75rem", color: "var(--orange)" }}>Efecto en {regenmon.name}:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: "0.9rem" }}>😊</div>
                  <div style={{
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    color: result.statEffects.happiness >= 0 ? "var(--green)" : "var(--red)"
                  }}>
                    {result.statEffects.happiness >= 0 ? "+" : ""}{result.statEffects.happiness}
                  </div>
                  <div style={{ fontSize: "0.45rem", color: "var(--fg-muted)" }}>Felicidad</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem" }}>⚡</div>
                  <div style={{
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    color: result.statEffects.energy >= 0 ? "var(--blue)" : "var(--red)"
                  }}>
                    {result.statEffects.energy >= 0 ? "+" : ""}{result.statEffects.energy}
                  </div>
                  <div style={{ fontSize: "0.45rem", color: "var(--fg-muted)" }}>Energia</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem" }}>🍔</div>
                  <div style={{
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    color: result.statEffects.hunger >= 0 ? "var(--green)" : "var(--red)"
                  }}>
                    {result.statEffects.hunger >= 0 ? "+" : ""}{result.statEffects.hunger}
                  </div>
                  <div style={{ fontSize: "0.45rem", color: "var(--fg-muted)" }}>Hambre</div>
                </div>
              </div>
            </div>
          )}

          {/* Evolution Progress */}
          <div
            className="nes-container is-dark"
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              fontSize: "0.7rem",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Progreso de Evolución:</strong>
            </p>
            <p>
              Total: {regenmon.totalPoints} pts | Stage {regenmon.stage}/3
            </p>
            {regenmon.stage < 3 && (
              <p style={{ color: "var(--fg-muted)", marginTop: "0.25rem" }}>
                Próxima evolución: {regenmon.stage === 1 ? 500 : 1500} pts
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <Button
            variant="primary"
            onClick={handleReset}
            style={{ width: "100%" }}
          >
            🎓 Entrenar Nuevamente
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isEvaluating && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "0.7rem", marginBottom: "0.75rem", color: "var(--orange)" }}>IA evaluando...</p>
          <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)" }}>Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* Info */}
      {!result && (
        <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)", marginTop: "1rem", textAlign: "center" }}>
          💡 Sube capturas de tu trabajo para ganar puntos y tokens
        </p>
      )}
    </Card>
  );
}
