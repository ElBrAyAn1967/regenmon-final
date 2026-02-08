// ==============================================
// DEMO PAGE - REGENMON BOOTCAMP COMPLETO
// ==============================================
// Página principal del DEMO con todas las sesiones

"use client";

import { useState, useCallback } from "react";
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

// Session 4 Components
import { TrainingSystem } from "./components/TrainingSystem";

// Session 5 Components
import { RegisterHub } from "./components/RegisterHub";

export default function DemoPage() {
  const {
    regenmon,
    isLoading,
    createRegenmon,
    saveRegenmon,
    resetRegenmon,
    reviveRegenmon,
    applyStatsEffects,
    feedRegenmon,
    addTraining,
  } = useDemoState();

  const [activeTab, setActiveTab] = useState<"play" | "train" | "social">("play");
  const [showChat, setShowChat] = useState(false);

  // Side panel visible for train/social always, for play only when chat is open (never when dead)
  const showSidePanel = !regenmon?.isDead && (activeTab === "train" || activeTab === "social" || (activeTab === "play" && showChat));

  const toggleChat = useCallback(() => {
    const scrollY = window.scrollY;
    setShowChat(prev => !prev);
    // Prevent browser from auto-scrolling on layout change
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <p style={{ fontSize: "0.7rem", color: "var(--orange)" }}>Cargando DEMO...</p>
      </div>
    );
  }

  // Show creation form directly if no Regenmon exists
  if (!regenmon) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", paddingTop: "2rem" }}>
          <CreateRegenmon onCreateRegenmon={createRegenmon} />
        </div>
        <Footer />
      </>
    );
  }

  // Main demo interface with tabs
  return (
    <>
      <Navbar />

      <div className="demo-layout" style={{ maxWidth: showSidePanel ? "1100px" : "900px", margin: "0 auto", padding: "0.5rem 0.75rem", minHeight: "calc(100vh - 12rem)", transition: "max-width 0.4s ease" }}>
        {/* Regenmon Display + Side Panel */}
        <div
          className="demo-flex"
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "flex-start",
            transition: "all 0.4s ease",
            maxWidth: showSidePanel ? "1000px" : "450px",
            margin: "0 auto",
          }}
        >
          <div style={{ flex: "1", minWidth: 0, transition: "all 0.4s ease" }}>
            <RegenmonDisplay
              regenmon={regenmon}
              onFeed={feedRegenmon}
              showChat={showChat}
              onToggleChat={toggleChat}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={resetRegenmon}
              onRevive={reviveRegenmon}
            />
          </div>

          {/* Side panel - Chat, Training, or Social */}
          {showSidePanel && (
            <div className="demo-side-panel" style={{ flex: "1", minWidth: 0, animation: "fadeIn 0.4s ease-out" }}>
              {activeTab === "play" && showChat && (
                <ChatBox regenmon={regenmon} onStatsUpdate={applyStatsEffects} />
              )}
              {activeTab === "train" && (
                <TrainingSystem
                  regenmon={regenmon}
                  onTrainingComplete={addTraining}
                />
              )}
              {activeTab === "social" && (
                <RegisterHub
                  regenmon={regenmon}
                  onRegister={(appUrl) => {
                    saveRegenmon({ ...regenmon, isRegistered: true, appUrl });
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Token alert (auto-dismiss) */}
        {activeTab === "play" && <TokenDisplay balance={regenmon.balance} />}
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .demo-layout {
            max-width: 100% !important;
            padding: 0.5rem !important;
          }
          .demo-flex {
            flex-direction: column !important;
            max-width: 100% !important;
            gap: 0.75rem !important;
          }
          .demo-side-panel {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
