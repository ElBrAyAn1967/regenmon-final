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
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

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

        setResult({
          score: finalScore,
          feedback: finalFeedback,
          points: finalPoints,
          tokens: finalTokens,
          isFallback: !!data.fallbackScore,
        });

        // Update regenmon stats
        onTrainingComplete({
          score: finalScore,
          points: finalPoints,
          tokens: finalTokens,
          category: selectedCategory,
        });
      };

      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.error("Evaluation error:", error);
      alert(`Error: ${error.message}`);
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
    <Card style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>🎓 Entrenamiento</h3>

      {/* Category Selection */}
      {!result && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.8rem", marginBottom: "0.5rem", display: "block" }}>
            Categoría:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`nes-btn ${selectedCategory === cat.value ? "is-primary" : ""}`}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.5rem",
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
                <div style={{ fontSize: "0.6rem", color: "#aaa", marginTop: "0.25rem" }}>
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
          <p style={{ fontSize: "0.7rem", color: "#aaa", textAlign: "center", marginTop: "0.5rem" }}>
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
                border: "2px solid #92cc41",
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
              backgroundColor: result.score >= 70 ? "#92cc4133" : result.score >= 40 ? "#f7d51d33" : "#e76e5533",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              {result.score >= 80 ? "🏆" : result.score >= 60 ? "⭐" : result.score >= 40 ? "👍" : "💪"}
            </div>
            <h2 style={{ fontSize: "2.5rem", color: "#f7d51d", marginBottom: "0.5rem" }}>
              {result.score}/100
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
              {result.score >= 80 ? "¡Excelente trabajo!" : result.score >= 60 ? "¡Buen trabajo!" : result.score >= 40 ? "Buen intento" : "Sigue practicando"}
            </p>
            {result.isFallback && (
              <p style={{ fontSize: "0.7rem", color: "#e76e55", marginTop: "0.5rem" }}>
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
            <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>📝 Feedback:</h4>
            <p style={{ lineHeight: "1.5" }}>{result.feedback}</p>
          </div>

          {/* Rewards */}
          <div
            className="nes-container is-rounded"
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#209cee33",
            }}
          >
            <h4 style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>🎁 Recompensas:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem" }}>⭐</div>
                <div style={{ fontSize: "1.2rem", color: "#f7d51d", fontWeight: "bold" }}>
                  +{result.points}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#aaa" }}>Puntos</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem" }}>🍎</div>
                <div style={{ fontSize: "1.2rem", color: "#92cc41", fontWeight: "bold" }}>
                  +{result.tokens}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#aaa" }}>Tokens</div>
              </div>
            </div>
          </div>

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
              <p style={{ color: "#aaa", marginTop: "0.25rem" }}>
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
          <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>🤖 Gemini AI evaluando...</p>
          <p style={{ fontSize: "0.7rem", color: "#aaa" }}>Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* Info */}
      {!result && (
        <p style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "1rem", textAlign: "center" }}>
          💡 Sube capturas de tu trabajo para ganar puntos y tokens
        </p>
      )}
    </Card>
  );
}
