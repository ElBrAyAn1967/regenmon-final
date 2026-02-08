// ==============================================
// CHATBOX COMPONENT - Session 2
// ==============================================
// Chat con Gemini AI con personalidad dinámica

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  regenmon: any;
  onStatsUpdate: (effects: { happiness: number; energy: number; hunger: number }) => void;
}

const CHAT_STORAGE_KEY = "demo-regenmon-chat";

export function ChatBox({ regenmon, onStatsUpdate }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom within chat container only (no page scroll)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          regenmonData: regenmon,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      // Chat costs energy and makes hungry, but increases happiness
      // Like a real creature: socializing is fun but tiring
      onStatsUpdate({ happiness: 3, energy: -3, hunger: -2 });
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error al procesar mensaje" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card style={{ margin: "0 auto" }}>
      <h3 style={{ marginBottom: "0.75rem", fontSize: "0.85rem", color: "var(--orange)" }}>Chat con {regenmon.name}</h3>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="nes-container is-dark"
        style={{
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "120px" }}>
            <p style={{ fontSize: "0.6rem", color: "var(--fg-muted)" }}>
              Habla con tu Regenmon!
            </p>
            <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)", marginTop: "0.5rem" }}>
              Cada mensaje: +3 😊, -3 ⚡, -2 🍔
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              textAlign: msg.role === "user" ? "right" : "left",
              animation: "fadeIn 0.3s ease-in"
            }}
          >
            <div
              className={`nes-balloon ${msg.role === "user" ? "from-right" : "from-left"}`}
              style={{
                display: "inline-block",
                maxWidth: "80%",
                fontSize: "0.6rem",
                backgroundColor: msg.role === "user" ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
              }}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <div className="nes-balloon from-left" style={{ display: "inline-block", backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
              <p style={{ fontSize: "0.6rem" }}>
                {regenmon.sprite} escribiendo
                <span style={{ animation: "blink 1.4s infinite" }}>...</span>
              </p>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Input Area */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          className="nes-input"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          style={{ flex: 1, fontSize: "0.6rem" }}
        />
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? "..." : "Enviar"}
        </Button>
      </div>

      {/* Energy Warning */}
      {regenmon.stats.energy < 20 && (
        <div
          className="nes-container is-rounded"
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            fontSize: "0.55rem",
            textAlign: "center",
          }}
        >
          <p>⚠️ Tu Regenmon está muy cansado. ¡Dale tiempo para descansar!</p>
        </div>
      )}

      {/* Info */}
      <p style={{ fontSize: "0.5rem", color: "var(--fg-dim)", marginTop: "0.5rem", textAlign: "center" }}>
        💡 La personalidad de {regenmon.name} cambia según sus stats
      </p>
    </Card>
  );
}
