# 🎮 REGENMON DEMO - Bootcamp Completo (5 Sesiones)

## 🎯 Objetivo

Construir un **Regenmon DEMO 100% funcional** que demuestre **todas las sesiones del bootcamp** (1-5) en una sola aplicación.

Este DEMO sirve como:
1. **Hook de ventas** para mostrar a potenciales estudiantes lo que van a construir
2. **Validación de infraestructura** del HUB central funcionando en producción
3. **Herramienta educativa** especialmente para enseñar Session 5 (social/HUB integration - la más compleja)

**Ruta:** `/demo`

---

## 📋 Estructura de Tickets

Cada sesión tiene sus propios tickets independientes basados en los **entregables reales del curriculum**:

### **Sesión 1: Nace tu Regenmon** (S1)
- **S1-1**: CreateRegenmon Component (Modal de creación)
- **S1-2**: RegenmonDisplay Component (Display tipo Game Boy)
- **S1-3**: localStorage Integration (Persistencia local)

### **Sesión 2: Habla con tu Regenmon** (S2)
- **S2-1**: Chat API con Gemini (System prompt basado en stats)
- **S2-2**: ChatBox Component (Interfaz de chat)
- **S2-3**: Stats Effects System (Chat aumenta happiness, reduce energy)

### **Sesión 3: Come tokens $FRUTA** (S3)
**⚠️ NOTA CRÍTICA**: El curriculum original dice "Web3 + Wallet" pero nuestro sistema es **centralizado (NO blockchain, tokens en PostgreSQL)**

- **S3-1**: TokenDisplay Component (Mostrar balance)
- **S3-2**: FeedingSystem Component (Gastar tokens para alimentar)
- **S3-3**: Token Rewards (Ganar tokens por entrenar)

### **Sesión 4: Evoluciona entrenando** (S4)
- **S4-1**: Evaluate API con Gemini Vision (Evaluar imágenes)
- **S4-2**: TrainingSystem Component (Upload + feedback)
- **S4-3**: Evolution System (500pts → Joven, 1500pts → Adulto)

### **Sesión 5: Socializa en el HUB** (S5) - **LA MÁS IMPORTANTE**
- **S5-1**: RegisterHub Component (Registrarse en HUB público)
- **S5-2**: Success View (Links a perfil, leaderboard, explorar)

### **Integración Final** (DEMO)
- **DEMO-1**: Main Demo Page (Orquestador con tabs)

---

## 🔴 Sesión 1: "Nace tu Regenmon"

### 📚 Entregables del Curriculum
- ✅ Regenmon display con stats (Happiness, Energy, Hunger)
- ✅ Modal de creación (nombre, dueño, tipo de sprite)
- ✅ localStorage para persistencia
- ✅ Deploy en Vercel (simulado con localStorage en demo)

### S1-1: CreateRegenmon Component

**Ubicación**: `app/demo/components/CreateRegenmon.tsx`

**Descripción**: Modal inicial para crear el Regenmon (nombre + sprite)

**Características**:
- Modal overlay centrado
- Input de nombre (máx 20 caracteres)
- Selección de 3 sprites: 👾, 🐉, 🦖
- Botón deshabilitado si nombre vacío
- Callback al crear con nombre y sprite

**Código**:
```tsx
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

  const sprites = ["🦖", "🐉", "🦕"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName) return;

    onCreateRegenmon({ name, ownerName, sprite });

    // Reset form
    setName("");
    setOwnerName("");
    setSprite("🦖");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Button variant="success" onClick={() => setIsOpen(true)}>
          🎮 Crear Mi Regenmon
        </Button>
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded" style={{ marginBottom: "2rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>🎮 Crea Tu Regenmon</h3>
      <form onSubmit={handleSubmit}>
        <div className="nes-field" style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Nombre del Regenmon:</label>
          <input
            type="text"
            id="name"
            className="nes-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Frutosaurio"
            maxLength={20}
            required
          />
        </div>

        <div className="nes-field" style={{ marginBottom: "1rem" }}>
          <label htmlFor="owner">Tu Nombre:</label>
          <input
            type="text"
            id="owner"
            className="nes-input"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="ej. Brayan"
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Elige un Tipo:</label>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            {sprites.map((s) => (
              <button
                key={s}
                type="button"
                className={`nes-btn ${sprite === s ? "is-primary" : ""}`}
                onClick={() => setSprite(s)}
                style={{ fontSize: "2rem" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button variant="success" type="submit">
            ✅ Crear
          </Button>
          <Button variant="error" onClick={() => setIsOpen(false)}>
            ❌ Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
```

**Criterios de aceptación:**
- [ ] Modal se muestra al entrar al demo sin Regenmon guardado
- [ ] Input de nombre limita a 20 caracteres
- [ ] Se pueden seleccionar 3 sprites diferentes
- [ ] Botón deshabilitado si nombre está vacío
- [ ] Al crear, se pasa nombre y sprite al componente padre

---

### S1-2: RegenmonDisplay Component

**Ubicación**: `app/demo/components/RegenmonDisplay.tsx`

**Descripción**: Pantalla principal tipo Game Boy con sprite y barras de stats

**Características**:
- Display estilo Game Boy con fondo verde (#92cc41)
- Sprite grande centrado (6rem)
- 3 barras de progreso: Happiness 💚, Energy ⚡, Hunger 🍎
- Header con stage, totalPoints, balance
- Barras cambian de color según valor

**Código**:
```tsx
"use client";

import { Card } from "@/app/components/ui/Card";

interface RegenmonData {
  name: string;
  ownerName: string;
  sprite: string;
  stage: number;
  stats: {
    happiness: number;
    energy: number;
    hunger: number;
  };
  totalPoints: number;
}

interface RegenmonDisplayProps {
  regenmon: RegenmonData;
}

export function RegenmonDisplay({ regenmon }: RegenmonDisplayProps) {
  const { name, ownerName, sprite, stage, stats, totalPoints } = regenmon;

  // Stage labels
  const stageLabels = ["Bebé", "Joven", "Adulto"];
  const stageLabel = stageLabels[stage - 1] || "Bebé";

  return (
    <Card centered>
      <div style={{ textAlign: "center" }}>
        {/* Sprite */}
        <div style={{ fontSize: "6rem", marginBottom: "1rem" }}>{sprite}</div>

        {/* Name + Stage */}
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{name}</h2>
        <p style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "1rem" }}>
          Etapa: {stageLabel} | Dueño: {ownerName}
        </p>

        {/* Stats */}
        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
          <div className="nes-progress is-primary" style={{ marginBottom: "0.5rem" }}>
            <progress value={stats.happiness} max="100"></progress>
          </div>
          <p style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>
            😊 Felicidad: {stats.happiness}%
          </p>

          <div className="nes-progress is-success" style={{ marginBottom: "0.5rem" }}>
            <progress value={stats.energy} max="100"></progress>
          </div>
          <p style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>
            ⚡ Energía: {stats.energy}%
          </p>

          <div className="nes-progress is-warning" style={{ marginBottom: "0.5rem" }}>
            <progress value={100 - stats.hunger} max="100"></progress>
          </div>
          <p style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>
            🍎 Hambre: {stats.hunger}%
          </p>
        </div>

        {/* Points */}
        <p style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#f7d51d" }}>
          ⭐ Puntos Totales: {totalPoints}
        </p>

        {/* Next Evolution */}
        {stage < 3 && (
          <p style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "0.5rem" }}>
            Próxima evolución: {stage === 1 ? 500 : 1500} puntos
          </p>
        )}
      </div>
    </Card>
  );
}
```

**Criterios de aceptación:**
- [ ] Muestra nombre del Regenmon y dueño
- [ ] Sprite se ve grande y centrado con estilo Game Boy
- [ ] 3 barras de progreso funcionan correctamente
- [ ] Barras cambian de color según valor (verde/amarillo/rojo)
- [ ] Se muestran stats globales (stage, points, balance)
- [ ] Mensaje de próxima evolución para stages 1 y 2

---

### S1-3: localStorage Integration

**Ubicación**: `app/demo/hooks/useDemoState.ts`

**Descripción**: Hook personalizado para gestionar estado del Regenmon con localStorage

**Características**:
- Estado completo del Regenmon
- Load/Save automático en localStorage
- Funciones para crear, actualizar, resetear
- Balance inicial: 50 $FRUTA
- Stats iniciales: happiness 80, energy 70, hunger 30

**Código**:
```ts
"use client";

import { useState, useEffect } from "react";

export interface RegenmonData {
  name: string;
  ownerName: string;
  sprite: string;
  stage: number;
  stats: {
    happiness: number;
    energy: number;
    hunger: number;
  };
  totalPoints: number;
  balance: number;
  trainingHistory: Array<{
    score: number;
    category: string;
    timestamp: number;
  }>;
  isRegistered: boolean;
  appUrl?: string;
}

const DEFAULT_REGENMON: RegenmonData = {
  name: "",
  ownerName: "",
  sprite: "🦖",
  stage: 1,
  stats: {
    happiness: 80,
    energy: 70,
    hunger: 30,
  },
  totalPoints: 0,
  balance: 50,
  trainingHistory: [],
  isRegistered: false,
};

export function useDemoState() {
  const [regenmon, setRegenmon] = useState<RegenmonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("demo-regenmon");
    if (saved) {
      setRegenmon(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  const saveRegenmon = (data: RegenmonData) => {
    setRegenmon(data);
    localStorage.setItem("demo-regenmon", JSON.stringify(data));
  };

  // Create new Regenmon
  const createRegenmon = (data: { name: string; ownerName: string; sprite: string }) => {
    const newRegenmon: RegenmonData = {
      ...DEFAULT_REGENMON,
      ...data,
    };
    saveRegenmon(newRegenmon);
  };

  // Reset Regenmon
  const resetRegenmon = () => {
    localStorage.removeItem("demo-regenmon");
    setRegenmon(null);
  };

  return {
    regenmon,
    isLoading,
    createRegenmon,
    saveRegenmon,
    resetRegenmon,
  };
}
```

**Criterios de aceptación:**
- [ ] Estado se carga automáticamente al inicio
- [ ] Estado se guarda automáticamente en localStorage
- [ ] createRegenmon crea con valores iniciales correctos
- [ ] resetRegenmon limpia localStorage y estado
- [ ] isLoading maneja el estado inicial correctamente

---

## 🔴 Sesión 2: "Habla con tu Regenmon"

### 📚 Entregables del Curriculum
- ✅ Interfaz de chat con Gemini AI
- ✅ System prompt basado en personalidad (stats determinan mood)
- ✅ Efectos en stats: happiness +5, energy -10 por mensaje
- ✅ Memory seeds (historial de conversación)

### S2-1: Chat API con Gemini

**Ubicación**: `app/api/demo/chat/route.ts`

**Descripción**: Endpoint para chat con Gemini AI personalizado según stats

**Características**:
- System prompt dinámico basado en stats
- Mood cambia según happiness: feliz (>70), normal (40-70), triste (<40)
- Considera energy y hunger para respuestas contextuales
- Historial de mensajes para continuidad
- Respuestas breves (1-2 oraciones)

**Código**:
```ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message, regenmonData } = await req.json();

    if (!message || !regenmonData) {
      return NextResponse.json(
        { error: "Missing message or regenmonData" },
        { status: 400 }
      );
    }

    // Generate personality prompt based on stats
    const { name, sprite, stats } = regenmonData;
    const personalityPrompt = generatePersonalityPrompt(name, sprite, stats);

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: personalityPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "¡Entendido! Responderé con esa personalidad." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({
      response,
      statsEffects: {
        happiness: 5,   // Chat aumenta felicidad
        energy: -10,    // Chat consume energía
        hunger: 0,
      },
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}

function generatePersonalityPrompt(
  name: string,
  sprite: string,
  stats: { happiness: number; energy: number; hunger: number }
): string {
  // Personality based on stats
  let personality = "";

  if (stats.happiness > 70) {
    personality += "Estás muy feliz y juguetón. ";
  } else if (stats.happiness > 40) {
    personality += "Estás de buen humor pero tranquilo. ";
  } else {
    personality += "Estás un poco triste y necesitas ánimo. ";
  }

  if (stats.energy > 70) {
    personality += "Tienes mucha energía y quieres jugar. ";
  } else if (stats.energy > 40) {
    personality += "Tienes energía moderada. ";
  } else {
    personality += "Estás cansado y necesitas descansar. ";
  }

  if (stats.hunger > 70) {
    personality += "Tienes mucha hambre y piensas en comida. ";
  } else if (stats.hunger > 40) {
    personality += "Tienes un poco de hambre. ";
  } else {
    personality += "Estás satisfecho. ";
  }

  return `Eres ${name}, un Regenmon ${sprite}. Tu personalidad actual: ${personality}

Responde en primera persona como ${name}. Sé breve (1-2 oraciones). Refleja tu estado emocional en tus respuestas. Usa emojis relacionados con ${sprite}.`;
}
```

**Variables de entorno requeridas**:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Criterios de aceptación:**
- [ ] API responde correctamente con Gemini
- [ ] Personalidad cambia dinámicamente según stats
- [ ] Respuestas son breves (1-2 oraciones)
- [ ] Retorna statsEffects correctos (+5 happiness, -10 energy)
- [ ] Maneja errores correctamente

---

### S2-2: ChatBox Component

**Ubicación**: `app/demo/components/ChatBox.tsx`

**Descripción**: Interfaz de chat con burbujas y boost de happiness

**Características**:
- Burbujas de chat diferenciadas (usuario vs Regenmon)
- Scroll automático al último mensaje
- Input limpiado después de enviar
- Loading state durante API call
- Callback para actualizar stats
- Advertencia si energy < 20

**Código**:
```tsx
"use client";

import { useState } from "react";
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

  return (
    <Card>
      <h3 style={{ marginBottom: "1rem" }}>💬 Chat con {regenmon.name}</h3>

      {/* Messages */}
      <div
        className="nes-container is-dark"
        style={{
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      >
        {messages.length === 0 && (
          <p style={{ fontSize: "0.8rem", color: "#aaa", textAlign: "center" }}>
            ¡Habla con tu Regenmon!
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <div
              className={`nes-balloon ${msg.role === "user" ? "from-right" : "from-left"}`}
            >
              <p style={{ fontSize: "0.8rem" }}>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <input
          type="text"
          className="nes-input"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <Button variant="primary" onClick={handleSend} disabled={isLoading}>
          {isLoading ? "..." : "Enviar"}
        </Button>
      </div>

      {/* Stats warning */}
      {regenmon.stats.energy < 20 && (
        <p style={{ fontSize: "0.7rem", color: "#ff6b6b", marginTop: "0.5rem" }}>
          ⚠️ Tu Regenmon está muy cansado. ¡Dale tiempo para descansar!
        </p>
      )}
    </Card>
  );
}
```

**Criterios de aceptación:**
- [ ] Mensajes se muestran en burbujas correctas (user/assistant)
- [ ] Chat tiene scroll automático al último mensaje
- [ ] Input se limpia después de enviar
- [ ] Loading state funciona (botón deshabilitado)
- [ ] Happiness aumenta +5 y energy reduce -10 por mensaje
- [ ] Advertencia aparece si energy < 20

---

### S2-3: Stats Effects System

**Ubicación**: Actualización a `app/demo/hooks/useDemoState.ts`

**Descripción**: Agregar función para aplicar efectos de stats

**Características**:
- Aplica efectos positivos/negativos a stats
- Clamp values entre 0-100
- Guarda automáticamente en localStorage

**Código a agregar**:
```ts
// Agregar al hook useDemoState

const applyStatsEffects = (effects: { happiness: number; energy: number; hunger: number }) => {
  if (!regenmon) return;

  const newStats = {
    happiness: Math.max(0, Math.min(100, regenmon.stats.happiness + effects.happiness)),
    energy: Math.max(0, Math.min(100, regenmon.stats.energy + effects.energy)),
    hunger: Math.max(0, Math.min(100, regenmon.stats.hunger + effects.hunger)),
  };

  saveRegenmon({
    ...regenmon,
    stats: newStats,
  });
};

// Return en el hook:
return {
  // ... existing returns
  applyStatsEffects,
};
```

**Criterios de aceptación:**
- [ ] Efectos se aplican correctamente
- [ ] Stats no exceden 0-100
- [ ] Estado se guarda automáticamente
- [ ] Chat aumenta happiness +5, reduce energy -10

---

## 🔴 Sesión 3: "Come tokens $FRUTA"

### 📚 Entregables del Curriculum
⚠️ **DISCREPANCIA**: El curriculum dice "Web3 + Wallet" pero nuestro sistema es **100% centralizado con tokens en PostgreSQL (NO blockchain)**

- ✅ Display de balance de tokens $FRUTA
- ✅ Sistema de alimentación (cuesta 10 tokens)
- ✅ Ganar tokens por entrenar (Sesión 4)
- ❌ NO Web3, NO wallets, NO blockchain

### S3-1: TokenDisplay Component

**Ubicación**: `app/demo/components/TokenDisplay.tsx`

**Descripción**: Mostrar balance de tokens $FRUTA

**Código**:
```tsx
"use client";

import { Card } from "@/app/components/ui/Card";

interface TokenDisplayProps {
  balance: number;
}

export function TokenDisplay({ balance }: TokenDisplayProps) {
  return (
    <Card centered>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍎</div>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          Tokens $FRUTA
        </h3>
        <p style={{ fontSize: "2rem", color: "#92cc41", fontWeight: "bold" }}>
          {balance}
        </p>
        <p style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "0.5rem" }}>
          Gana tokens entrenando • Úsalos para alimentar
        </p>
      </div>
    </Card>
  );
}
```

---

### S3-2: FeedingSystem Component

**Ubicación**: `app/demo/components/FeedingSystem.tsx`

**Descripción**: Sistema para gastar tokens y reducir hambre

**Código**:
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

interface FeedingSystemProps {
  regenmon: any;
  onFeed: () => void;
}

const FEED_COST = 10;

export function FeedingSystem({ regenmon, onFeed }: FeedingSystemProps) {
  const [isFeeding, setIsFeeding] = useState(false);

  const canFeed = regenmon.balance >= FEED_COST;

  const handleFeed = () => {
    if (!canFeed || isFeeding) return;

    setIsFeeding(true);

    // Animation delay
    setTimeout(() => {
      onFeed();
      setIsFeeding(false);
    }, 500);
  };

  return (
    <Card>
      <h3 style={{ marginBottom: "1rem" }}>🍎 Alimentar</h3>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
          Costo: {FEED_COST} $FRUTA
        </p>
        <p style={{ fontSize: "0.7rem", color: "#aaa" }}>
          Alimentar reduce el hambre en 30 puntos
        </p>
      </div>

      <Button
        variant={canFeed ? "success" : "disabled"}
        onClick={handleFeed}
        disabled={!canFeed || isFeeding}
      >
        {isFeeding ? "🍎 Alimentando..." : "🍎 Alimentar"}
      </Button>

      {!canFeed && (
        <p style={{ fontSize: "0.7rem", color: "#ff6b6b", marginTop: "0.5rem" }}>
          ⚠️ No tienes suficientes tokens. ¡Entrena para ganar más!
        </p>
      )}

      {regenmon.stats.hunger < 30 && (
        <p style={{ fontSize: "0.7rem", color: "#92cc41", marginTop: "0.5rem" }}>
          ✅ Tu Regenmon está satisfecho
        </p>
      )}
    </Card>
  );
}
```

---

### S3-3: Token Rewards System

**Ubicación**: Actualización a `app/demo/hooks/useDemoState.ts`

**Código a agregar**:
```ts
const feedRegenmon = () => {
  if (!regenmon || regenmon.balance < 10) return;

  const newStats = {
    ...regenmon.stats,
    hunger: Math.max(0, regenmon.stats.hunger - 30),
    happiness: Math.min(100, regenmon.stats.happiness + 5),
  };

  saveRegenmon({
    ...regenmon,
    balance: regenmon.balance - 10,
    stats: newStats,
  });
};

const rewardTokens = (amount: number) => {
  if (!regenmon) return;

  saveRegenmon({
    ...regenmon,
    balance: regenmon.balance + amount,
  });
};

// Return:
return {
  // ... existing
  feedRegenmon,
  rewardTokens,
};
```

---

## 🔴 Sesión 4: "Evoluciona entrenando"

### 📚 Entregables del Curriculum
- ✅ Upload de imagen para entrenamiento
- ✅ Gemini Vision evalúa calidad (0-100)
- ✅ Sistema de puntos: 500 → Joven, 1500 → Adulto
- ✅ Historial de entrenamientos
- ✅ Recompensas de tokens por score

### S4-1: Evaluate API con Gemini Vision

**Ubicación**: `app/api/demo/evaluate/route.ts`

**Código**: (Ver en archivo anterior, líneas 690-777)

---

### S4-2: TrainingSystem Component

**Ubicación**: `app/demo/components/TrainingSystem.tsx`

**Código**: (Ver en archivo anterior, líneas 795-985)

---

### S4-3: Evolution System

**Ubicación**: Actualización a `app/demo/hooks/useDemoState.ts`

**Código a agregar**:
```ts
const addTraining = (result: { score: number; points: number; tokens: number; category: string }) => {
  if (!regenmon) return;

  const newTrainingHistory = [
    ...regenmon.trainingHistory,
    {
      score: result.score,
      category: result.category,
      timestamp: Date.now(),
    },
  ];

  const newTotalPoints = regenmon.totalPoints + result.points;
  const newBalance = regenmon.balance + result.tokens;

  // Check evolution
  let newStage = regenmon.stage;
  if (newTotalPoints >= 1500 && regenmon.stage < 3) {
    newStage = 3; // Adult
  } else if (newTotalPoints >= 500 && regenmon.stage < 2) {
    newStage = 2; // Young
  }

  const evolved = newStage > regenmon.stage;

  saveRegenmon({
    ...regenmon,
    stage: newStage,
    totalPoints: newTotalPoints,
    balance: newBalance + (evolved ? 100 : 0), // Evolution bonus
    trainingHistory: newTrainingHistory,
  });

  // Show evolution notification
  if (evolved) {
    alert(`🎉 ¡${regenmon.name} evolucionó a etapa ${newStage}! +100 tokens bonus`);
  }
};

// Return:
return {
  // ... existing
  addTraining,
};
```

---

## 🔴 Sesión 5: "Socializa en el HUB" - **LA MÁS IMPORTANTE**

### 📚 Entregables del Curriculum
- ✅ Registrar Regenmon en HUB público
- ✅ Botón para "Hacerse Público"
- ✅ URL de compartir funcional
- ✅ Muestra estado "Público" badge
- ✅ Links para ver perfil, leaderboard, comunidad

**NOTA**: Esta es la feature más importante del DEMO porque demuestra la integración real con el HUB central (Sesión 5 del bootcamp).

### S5-1: RegisterHub Component

**Ubicación**: `app/demo/components/RegisterHub.tsx`

**Código**: (Ver en archivo anterior, líneas 1019-1244)

**Criterios de aceptación:**
- [ ] Formulario valida nombre y email
- [ ] Genera appUrl demo única con timestamp
- [ ] Llama a `/api/register` (API ya existente)
- [ ] Muestra vista de éxito con 3 botones
- [ ] Links abren páginas reales del HUB
- [ ] Error handling funciona correctamente

---

### S5-2: Success View

**Incluido en S5-1** - Vista de éxito después de registro:

**Características**:
- Badge "Registrado en el HUB"
- 3 botones CTA:
  - Ver mi Perfil Público → `/regenmon/{id}`
  - Ver Leaderboard Global → `/leaderboard`
  - Explorar todos los Regenmons → `/`
- Info box explicando qué pasó al registrarse
- URL de compartir copiable

---

## 🎯 DEMO-1: Main Demo Page (Orquestador)

**Ubicación**: `app/demo/page.tsx`

**Descripción**: Página principal con tabs y gestión de estado completa

**Código**:
```tsx
"use client";

import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useDemoState } from "./hooks/useDemoState";

// Session 1
import { CreateRegenmon } from "./components/CreateRegenmon";
import { RegenmonDisplay } from "./components/RegenmonDisplay";

// Session 2
import { ChatBox } from "./components/ChatBox";

// Session 3
import { TokenDisplay } from "./components/TokenDisplay";
import { FeedingSystem } from "./components/FeedingSystem";

// Session 4
import { TrainingSystem } from "./components/TrainingSystem";

// Session 5
import { RegisterHub } from "./components/RegisterHub";

export default function DemoPage() {
  const {
    regenmon,
    isLoading,
    createRegenmon,
    saveRegenmon,
    resetRegenmon,
    feedRegenmon,
    addTraining,
    applyStatsEffects,
  } = useDemoState();

  const [activeTab, setActiveTab] = useState<"play" | "train" | "social">("play");

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>⏳ Cargando DEMO...</p>
      </div>
    );
  }

  // Show creation if no Regenmon exists
  if (!regenmon) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", color: "#92cc41", marginBottom: "1rem" }}>
              👾 Regenmon DEMO
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
              Experimenta todas las sesiones del bootcamp
            </p>
          </div>

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

      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#92cc41", marginBottom: "0.5rem" }}>
            👾 Regenmon DEMO
          </h1>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
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
            {/* Session 5: Register Hub */}
            <RegisterHub
              regenmon={regenmon}
              onRegister={(appUrl) => {
                saveRegenmon({
                  ...regenmon,
                  isRegistered: true,
                  appUrl,
                });
              }}
            />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
```

**Criterios de aceptación:**
- [ ] Tabs funcionan correctamente
- [ ] Estado se guarda en localStorage automáticamente
- [ ] Botón de reset funciona y pide confirmación
- [ ] Todas las sesiones se integran correctamente
- [ ] Evolución automática funciona (500 pts → stage 2, 1500 pts → stage 3)
- [ ] Stats se actualizan en tiempo real
- [ ] Navegación entre tabs mantiene estado

---

## ✅ Resumen de Implementación

### Archivos a Crear

**Hooks:**
1. `app/demo/hooks/useDemoState.ts` (S1-3 + S2-3 + S3-3 + S4-3)

**Componentes Sesión 1:**
2. `app/demo/components/CreateRegenmon.tsx` (S1-1)
3. `app/demo/components/RegenmonDisplay.tsx` (S1-2)

**APIs Sesión 2:**
4. `app/api/demo/chat/route.ts` (S2-1)

**Componentes Sesión 2:**
5. `app/demo/components/ChatBox.tsx` (S2-2)

**Componentes Sesión 3:**
6. `app/demo/components/TokenDisplay.tsx` (S3-1)
7. `app/demo/components/FeedingSystem.tsx` (S3-2)

**APIs Sesión 4:**
8. `app/api/demo/evaluate/route.ts` (S4-1)

**Componentes Sesión 4:**
9. `app/demo/components/TrainingSystem.tsx` (S4-2)

**Componentes Sesión 5:**
10. `app/demo/components/RegisterHub.tsx` (S5-1 + S5-2)

**Main Page:**
11. `app/demo/page.tsx` (DEMO-1) - Reemplazar placeholder

---

## 📊 Checklist de Funcionalidad por Sesión

### Sesión 1: Nace tu Regenmon
- [ ] Modal de creación funciona
- [ ] Display muestra stats correctamente
- [ ] localStorage persiste datos
- [ ] Evolución visual por stages

### Sesión 2: Habla con tu Regenmon
- [ ] Chat responde con Gemini
- [ ] Personalidad cambia según stats
- [ ] Happiness +5 por mensaje
- [ ] Energy -10 por mensaje
- [ ] Advertencia si energy < 20

### Sesión 3: Come tokens $FRUTA
- [ ] Balance se muestra correctamente
- [ ] Alimentar cuesta 10 tokens
- [ ] Hunger reduce -30 al alimentar
- [ ] Tokens se ganan entrenando

### Sesión 4: Evoluciona entrenando
- [ ] Upload de imagen funciona
- [ ] Gemini Vision evalúa (0-100)
- [ ] Tokens = score * 0.5
- [ ] Puntos = score
- [ ] Evolución a 500 pts (stage 2)
- [ ] Evolución a 1500 pts (stage 3)
- [ ] Bonus +100 tokens al evolucionar

### Sesión 5: Socializa en el HUB ⭐
- [ ] Formulario de registro valida
- [ ] appUrl demo se genera
- [ ] API `/api/register` se llama correctamente
- [ ] Vista de éxito muestra 3 botones
- [ ] Links funcionan correctamente
- [ ] Badge "Registrado" aparece

---

## 🚀 Orden de Implementación Sugerido

1. **S1-3**: `useDemoState.ts` (Foundation - localStorage hook)
2. **S1-1, S1-2**: CreateRegenmon + RegenmonDisplay (Sesión 1 completa)
3. **DEMO-1**: Main demo page con tabs (Estructura principal)
4. **S3-1, S3-2, S3-3**: TokenDisplay + FeedingSystem + Rewards (Sesión 3)
5. **S2-1, S2-2, S2-3**: Chat API + ChatBox + Effects (Sesión 2)
6. **S4-1, S4-2, S4-3**: Evaluate API + TrainingSystem + Evolution (Sesión 4)
7. **S5-1, S5-2**: RegisterHub (Sesión 5 - LA MÁS IMPORTANTE)

---

## 📝 Notas Importantes

### Discrepancias con Curriculum
- **Sesión 3**: Curriculum dice "Web3 + Wallet" pero nuestro sistema es **centralizado con tokens en PostgreSQL**. No hay blockchain, wallets cripto, ni transacciones on-chain.

### APIs Existentes
- `/api/register` - Ya existe, usada en S5-1
- `/api/regenmons` - Ya existe, para explorar comunidad
- `/api/stats` - Ya existe, para estadísticas globales

### Variables de Entorno Requeridas
```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_supabase_postgres_url
```

### Dependencies Requeridas
```json
{
  "@google/generative-ai": "^0.1.0"
}
```

---

**🎯 SIGUIENTE PASO**: ¿Procedo con la implementación de estos tickets? Sugiero empezar con S1-3 (useDemoState hook) como fundación.
