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

export function ChatBox({ regenmon, onStatsUpdate }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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

      // Update stats
      onStatsUpdate(data.statsEffects);
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
    <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>💬 Chat con {regenmon.name}</h3>

      {/* Messages Container */}
      <div
        className="nes-container is-dark"
        style={{
          height: "350px",
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "140px" }}>
            <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
              ¡Habla con tu Regenmon!
            </p>
            <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "0.5rem" }}>
              Cada mensaje: +5 😊 Felicidad, -10 ⚡ Energía
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
                fontSize: "0.8rem",
                backgroundColor: msg.role === "user" ? "#209cee33" : "#92cc4133",
              }}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <div className="nes-balloon from-left" style={{ display: "inline-block", backgroundColor: "#92cc4133" }}>
              <p style={{ fontSize: "0.8rem" }}>
                {regenmon.sprite} escribiendo
                <span style={{ animation: "blink 1.4s infinite" }}>...</span>
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
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
          style={{ flex: 1, fontSize: "0.8rem" }}
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
            backgroundColor: "#e76e5533",
            fontSize: "0.7rem",
            textAlign: "center",
          }}
        >
          <p>⚠️ Tu Regenmon está muy cansado. ¡Dale tiempo para descansar!</p>
        </div>
      )}

      {/* Info */}
      <p style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "0.5rem", textAlign: "center" }}>
        💡 La personalidad de {regenmon.name} cambia según sus stats
      </p>
    </Card>
  );
}
