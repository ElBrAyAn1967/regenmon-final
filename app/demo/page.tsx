// ==============================================
// DEMO PAGE - REGENMON BOOTCAMP COMPLETO
// ==============================================
// Página principal del DEMO con todas las sesiones

"use client";

import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useDemoState } from "./hooks/useDemoState";

// Session 1 Components
import { CreateRegenmon } from "./components/CreateRegenmon";
import { RegenmonDisplay } from "./components/RegenmonDisplay";

// Session 2 Components
import { ChatBox } from "./components/ChatBox";

// Session 3 Components
import { TokenDisplay } from "./components/TokenDisplay";
import { FeedingSystem } from "./components/FeedingSystem";

// Session 4 Components
import { TrainingSystem } from "./components/TrainingSystem";

export default function DemoPage() {
  const {
    regenmon,
    isLoading,
    createRegenmon,
    resetRegenmon,
    applyStatsEffects,
    feedRegenmon,
    addTraining,
  } = useDemoState();

  const [activeTab, setActiveTab] = useState<"play" | "train" | "social">("play");

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "1rem" }}>⏳ Cargando DEMO...</p>
      </div>
    );
  }

  // Show creation if no Regenmon exists
  if (!regenmon) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", paddingTop: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "2rem", color: "#92cc41", marginBottom: "1rem" }}>
              👾 Regenmon DEMO
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#aaa", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
              Experimenta todas las sesiones del bootcamp en un solo lugar.
              <br />
              Crea tu Regenmon, entrena, evoluciona y conecta con el HUB social.
            </p>
          </div>

          <CreateRegenmon onCreateRegenmon={createRegenmon} />

          {/* Info Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", maxWidth: "1000px", margin: "3rem auto" }}>
            <div className="nes-container is-rounded">
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>📚 Sesión 1</h3>
              <p style={{ fontSize: "0.7rem", color: "#aaa" }}>Crea y cuida tu Regenmon</p>
            </div>
            <div className="nes-container is-rounded">
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>💬 Sesión 2</h3>
              <p style={{ fontSize: "0.7rem", color: "#aaa" }}>Habla con IA (Gemini)</p>
            </div>
            <div className="nes-container is-rounded">
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>🍎 Sesión 3</h3>
              <p style={{ fontSize: "0.7rem", color: "#aaa" }}>Tokens $FRUTA</p>
            </div>
            <div className="nes-container is-rounded">
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>🎓 Sesión 4</h3>
              <p style={{ fontSize: "0.7rem", color: "#aaa" }}>Entrena y evoluciona</p>
            </div>
            <div className="nes-container is-rounded">
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>🌍 Sesión 5</h3>
              <p style={{ fontSize: "0.7rem", color: "#aaa" }}>Conecta con el HUB</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Main demo interface with tabs
  return (
    <>
      <Navbar />

      <div className="container" style={{ minHeight: "calc(100vh - 12rem)", paddingTop: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#92cc41", marginBottom: "0.5rem" }}>
            👾 Regenmon DEMO
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "1rem" }}>
            Experimenta las 5 sesiones del bootcamp
          </p>
          <button
            className="nes-btn is-error"
            onClick={() => {
              if (confirm("¿Resetear tu Regenmon? Esto borrará todo el progreso.")) {
                resetRegenmon();
              }
            }}
            style={{ fontSize: "0.7rem" }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className={`nes-btn ${activeTab === "play" ? "is-primary" : ""}`}
            onClick={() => setActiveTab("play")}
          >
            🎮 Jugar
          </button>
          <button
            className={`nes-btn ${activeTab === "train" ? "is-primary" : ""}`}
            onClick={() => setActiveTab("train")}
          >
            🎓 Entrenar
          </button>
          <button
            className={`nes-btn ${activeTab === "social" ? "is-primary" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            🌍 Social
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "play" && (
          <div style={{ display: "grid", gap: "2rem" }}>
            {/* Session 1: Display */}
            <RegenmonDisplay regenmon={regenmon} />

            {/* Session 3: Tokens & Feeding */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
              <TokenDisplay balance={regenmon.balance} />
              <FeedingSystem regenmon={regenmon} onFeed={feedRegenmon} />
            </div>

            {/* Session 2: Chat */}
            <ChatBox regenmon={regenmon} onStatsUpdate={applyStatsEffects} />
          </div>
        )}

        {activeTab === "train" && (
          <div style={{ display: "grid", gap: "2rem" }}>
            {/* Session 4: Training */}
            <TrainingSystem
              regenmon={regenmon}
              onTrainingComplete={addTraining}
            />
          </div>
        )}

        {activeTab === "social" && (
          <div style={{ display: "grid", gap: "2rem" }}>
            {/* Session 5: Register Hub - Placeholder */}
            <div className="nes-container is-rounded" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", padding: "3rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🌍 Regenmon HUB</h3>
              <p style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "2rem" }}>
                Próximamente: Registra tu Regenmon en el HUB social global
              </p>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌐</div>
              <p style={{ fontSize: "0.7rem", color: "#aaa" }}>
                • Aparece en el leaderboard global<br />
                • Comparte tu perfil público<br />
                • Conecta con otros estudiantes
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
