# FASE 2: Frontend Público - Tickets de Desarrollo

**Objetivo:** Crear las páginas web públicas del hub que consumen las APIs del backend.

**Estética:** 🎮 Pixel Art 8-bit auténtica usando NES.css

**Progreso:** 0/4 páginas completadas (0%)

---

## 📋 CHECKLIST GENERAL

### Setup Inicial (Pre-requisitos)
- [ ] **Ticket 2.0:** Configurar NES.css y fuentes retro
- [ ] **Ticket 2.1:** Configurar Privy Auth Provider
- [ ] **Ticket 2.2:** Crear componentes reutilizables base (NES.css)
- [ ] **Ticket 2.3:** Crear hooks personalizados para APIs

### Páginas Públicas
- [ ] **Ticket 2.4:** Homepage con estadísticas en tiempo real (/)
- [ ] **Ticket 2.5:** Página de registro de Regenmon (/register)
- [ ] **Ticket 2.6:** Leaderboard público (/leaderboard)
- [ ] **Ticket 2.7:** Página pública de Regenmon (/regenmon/[id])

---

## 🎫 TICKET 2.0: Configurar NES.css y Fuentes Retro

**Archivos:**
- `app/layout.tsx` (modificar)

**Descripción:** Importar NES.css y la fuente "Press Start 2P" para lograr estética pixel art 8-bit auténtica.

**Criterios de Aceptación:**
- ✅ Importar NES.css desde CDN: `https://unpkg.com/nes.css@latest/css/nes.min.css`
- ✅ Importar fuente "Press Start 2P" desde Google Fonts
- ✅ Configurar fuente "Press Start 2P" como fuente principal
- ✅ Todos los elementos deben usar clases de NES.css
- ✅ Estética pixel art 8-bit auténtica

**Código esperado:**

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { PrivyProvider } from "./providers/PrivyProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regenmon Hub - Bootcamp de Programación",
  description: "Aprende programación con tu Tamagotchi virtual y gana tokens $FRUTA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* NES.css Framework */}
        <link
          href="https://unpkg.com/nes.css@latest/css/nes.min.css"
          rel="stylesheet"
        />
        {/* Press Start 2P Font from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: '"Press Start 2P", cursive' }}>
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  );
}
```

```css
/* app/globals.css - Estilos globales para NES.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Press Start 2P", cursive;
  background-color: #212529;
  color: #fff;
}

/* Clases helper para spacing (NES.css no incluye utilities) */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

.text-center { text-align: center; }
```

**Prueba:**
- Abrir cualquier página → Debe verse con fuente pixel art
- Elementos con clases `nes-btn`, `nes-container` deben tener estilo 8-bit
- No debe haber fuentes genéricas (Arial, sans-serif)

---

## 🎫 TICKET 2.1: Privy Auth Provider

**Archivos:**
- `app/providers/PrivyProvider.tsx`
- `app/layout.tsx` (modificar)

**Descripción:** Configurar Privy para autenticación de estudiantes con Google, Email, etc.

**Criterios de Aceptación:**
- ✅ Crear componente `PrivyProvider` con configuración
- ✅ Habilitar métodos de login: Email, Google, Apple, Twitter, Discord, GitHub, SMS
- ✅ **DESHABILITAR** wallets (embedded, external)
- ✅ Configurar apariencia (logo, colores)
- ✅ Wrappear app en `layout.tsx` con el provider

**Código esperado:**

```typescript
// app/providers/PrivyProvider.tsx
"use client";

import { PrivyProvider as Privy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google", "apple", "twitter", "discord", "github", "sms"],
        appearance: {
          theme: "light",
          accentColor: "#3b82f6",
          logo: "https://your-logo-url.com/logo.png",
        },
        embeddedWallets: {
          createOnLogin: "off", // NO crear wallets
        },
        defaultChain: undefined, // NO usar blockchain
      }}
      onSuccess={() => {
        router.push("/dashboard"); // Redirigir después de login
      }}
    >
      {children}
    </Privy>
  );
}
```

**Nota:** El layout ya está configurado con NES.css en el Ticket 2.0, solo se agrega el PrivyProvider wrapper.

**Prueba:**
- Abrir app → Botón "Login" debe mostrar modal de Privy
- Verificar que NO aparecen opciones de wallet
- Login con Google → Debe funcionar y redirigir

---

## 🎫 TICKET 2.2: Componentes Reutilizables Base (NES.css)

**Archivos:**
- `app/components/ui/Button.tsx`
- `app/components/ui/Card.tsx`
- `app/components/ui/LoadingSpinner.tsx`
- `app/components/ui/ErrorMessage.tsx`
- `app/components/Navbar.tsx`
- `app/components/Footer.tsx`

**Descripción:** Crear componentes UI reutilizables usando clases de NES.css para estética pixel art 8-bit.

**Criterios de Aceptación:**
- ✅ Button usando clases `nes-btn`
- ✅ Card usando `nes-container`
- ✅ LoadingSpinner pixel art
- ✅ ErrorMessage con `nes-balloon`
- ✅ Navbar con estilo retro
- ✅ Footer pixel art

**Código esperado:**

```typescript
// app/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "warning" | "error";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "is-primary",
    success: "is-success",
    warning: "is-warning",
    error: "is-error",
  };

  return (
    <button
      type="button"
      className={`nes-btn ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
```

```typescript
// app/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
  centered?: boolean;
}

export function Card({ children, className = "", isDark = false, centered = false }: CardProps) {
  return (
    <div
      className={`nes-container ${isDark ? "is-dark" : "with-title"} ${centered ? "is-centered" : ""} ${className}`}
      style={{ marginBottom: "2rem" }}
    >
      {children}
    </div>
  );
```

```typescript
// app/components/ui/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <i className="nes-icon is-large heart"></i>
      <p className="mt-2">Loading...</p>
    </div>
  );
}
```

```typescript
// app/components/ui/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="nes-container is-dark is-rounded" style={{ backgroundColor: "#ce372b" }}>
      <p>⚠️ {message}</p>
    </div>
  );
}
```

```typescript
// app/components/Navbar.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { Button } from "./ui/Button";

export function Navbar() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  return (
    <nav style={{ padding: "1rem", backgroundColor: "#209cee", marginBottom: "2rem" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/" style={{ fontSize: "1.2rem", color: "#fff", textDecoration: "none" }}>
          🎮 Regenmon Hub
        </Link>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
          <Link href="/leaderboard" style={{ color: "#fff", textDecoration: "none" }}>Leaderboard</Link>
          <Link href="/register" style={{ color: "#fff", textDecoration: "none" }}>Register</Link>

          {ready && (
            <>
              {authenticated ? (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#fff" }}>👋 {user?.email?.address?.split("@")[0] || "User"}</span>
                  <Button variant="error" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="success" onClick={login}>
                  Login
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
```

```typescript
// app/components/Footer.tsx
export function Footer() {
  return (
    <footer style={{ padding: "2rem", textAlign: "center", backgroundColor: "#212529", color: "#fff", marginTop: "4rem" }}>
      <p style={{ fontSize: "0.8rem" }}>🚀 Powered by Next.js + Supabase + Privy + Gemini</p>
      <p style={{ fontSize: "0.7rem", marginTop: "1rem", color: "#92cc41" }}>
        Fase 1: Backend APIs ✅ | Fase 2: Frontend Público 🔄
      </p>
    </footer>
  );
}
```

**Prueba:**
- Navbar debe mostrar botón "Login" si no está autenticado
- Card debe renderizar con bordes pixel art
- Button debe tener variantes (primary, success, warning, error)
- Footer debe aparecer en la parte inferior

---

## 🎫 TICKET 2.3: Hooks Personalizados para APIs

**Archivos:**
- `app/hooks/useStats.ts`
- `app/hooks/useLeaderboard.ts`
- `app/hooks/useRegenmon.ts`
- `app/hooks/useRegister.ts`

**Descripción:** Crear hooks React para consumir las APIs del backend.

**Criterios de Aceptación:**
- ✅ Hook `useStats()` para GET /api/stats
- ✅ Hook `useLeaderboard(page, limit)` para GET /api/leaderboard
- ✅ Hook `useRegenmon(id)` para GET /api/regenmon/[id]
- ✅ Hook `useRegister()` para POST /api/register
- ✅ Todos con estados: loading, error, data
- ✅ Usar SWR o React Query (recomendado SWR)

**Instalación:**
```bash
npm install swr
```

**Código esperado:**

```typescript
// app/hooks/useStats.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStats() {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher, {
    refreshInterval: 30000, // Refrescar cada 30 segundos
  });

  return {
    stats: data?.data,
    isLoading,
    error,
  };
}
```

```typescript
// app/hooks/useLeaderboard.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLeaderboard(page: number = 1, limit: number = 10) {
  const { data, error, isLoading } = useSWR(
    `/api/leaderboard?page=${page}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 60000, // Refrescar cada 60 segundos
    }
  );

  return {
    leaderboard: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}
```

```typescript
// app/hooks/useRegenmon.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRegenmon(id: string | null) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/regenmon/${id}` : null,
    fetcher
  );

  return {
    regenmon: data?.data,
    isLoading,
    error,
  };
}
```

```typescript
// app/hooks/useRegister.ts
import { useState } from "react";

interface RegisterData {
  name: string;
  ownerName: string;
  ownerEmail?: string;
  privyUserId?: string;
  appUrl: string;
  sprite: string;
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const register = async (formData: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      setData(result.data);
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, data };
}
```

**Prueba:**
- `useStats()` debe retornar estadísticas del hub
- `useLeaderboard()` debe retornar array de Regenmons
- `useRegenmon()` debe retornar datos de un Regenmon
- `useRegister()` debe enviar POST y manejar errores

---

## 🎫 TICKET 2.4: Homepage con Estadísticas en Tiempo Real (NES.css)

**Archivo:** `app/page.tsx` (ya existe, modificar)

**Descripción:** Homepage que muestra estadísticas globales del hub consumidas desde GET /api/stats.

**Criterios de Aceptación:**
- ✅ Mostrar estadísticas en tiempo real (usando `useStats()`)
- ✅ Cards con: Total Regenmons, Total Puntos, Total Tokens
- ✅ Mostrar Top Regenmon
- ✅ CTAs a /register y /leaderboard
- ✅ Loading state mientras carga datos
- ✅ Error state si falla la petición

**Código esperado:**

```typescript
// app/page.tsx
"use client";

import { useStats } from "./hooks/useStats";
import { Card } from "./components/ui/Card";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { Button } from "./components/ui/Button";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Link from "next/link";

export default function HomePage() {
  const { stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ErrorMessage message="Failed to load stats" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "2rem", color: "#92cc41", marginBottom: "1rem" }}>
            🎮 Regenmon Hub
          </h1>
          <p style={{ fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Bootcamp de programacion con Tamagotchis virtuales.
            <br />
            Aprende, entrena tu Regenmon, y gana tokens $FRUTA.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>👾</div>
              <div style={{ fontSize: "2rem", color: "#209cee", margin: "1rem 0" }}>
                {stats?.totalRegenmons || 0}
              </div>
              <div style={{ fontSize: "0.8rem" }}>Regenmons</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>⭐</div>
              <div style={{ fontSize: "2rem", color: "#f7d51d", margin: "1rem 0" }}>
                {stats?.totalPoints?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: "0.8rem" }}>Total Points</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>🍎</div>
              <div style={{ fontSize: "2rem", color: "#92cc41", margin: "1rem 0" }}>
                {stats?.totalTokensDistributed?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: "0.8rem" }}>$FRUTA Tokens</div>
            </div>
          </Card>
        </div>

        {/* Top Regenmon */}
        {stats?.topRegenmon && (
          <Card centered style={{ maxWidth: "600px", margin: "3rem auto" }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>🏆 Top Regenmon</h3>
              <p>
                <strong>{stats.topRegenmon.name}</strong> by {stats.topRegenmon.owner}
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#92cc41" }}>
                {stats.topRegenmon.points} points • {stats.topRegenmon.balance} $FRUTA
              </p>
            </div>
          </Card>
        )}

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "3rem", flexWrap: "wrap" }}>
          <Link href="/register">
            <Button variant="primary">📝 Register Regenmon</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="warning">🏆 Leaderboard</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
```

**Prueba:**
- Homepage debe cargar y mostrar estadísticas reales con estilo pixel art
- Cards deben tener bordes NES.css
- Botones deben tener estilo 8-bit
- Si hay errores, debe mostrar mensaje de error

---

## 🎫 TICKET 2.5: Página de Registro de Regenmon (NES.css)

**Archivo:** `app/register/page.tsx`

**Descripción:** Formulario pixel art para que estudiantes registren su Regenmon en el hub usando NES.css.

**Criterios de Aceptación:**
- ✅ Formulario con campos usando `nes-input`
- ✅ Validación de campos (requeridos, formato)
- ✅ Integración con Privy (auto-llenar email)
- ✅ Usar `useRegister()` hook
- ✅ Loading state durante registro
- ✅ Success state con estilo retro
- ✅ Error state con `nes-balloon`

**Código esperado:**

```typescript
// app/register/page.tsx
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
```

**Prueba:**
- Formulario debe validar campos requeridos con estilo NES.css
- Inputs deben tener borde pixel art
- Si está autenticado, email debe auto-llenarse
- Submit exitoso → Mostrar success con estilo retro
- Submit con error → Mostrar `nes-balloon` de error

---

## 🎫 TICKET 2.6: Leaderboard Público (NES.css)

**Archivo:** `app/leaderboard/page.tsx`

**Descripción:** Página con ranking de los mejores Regenmons por puntos.

**Criterios de Aceptación:**
- ✅ Tabla con ranking de Regenmons (usando `useLeaderboard()`)
- ✅ Mostrar: Rank, Nombre, Owner, Puntos, Balance, Stage
- ✅ Paginación (10 items por página)
- ✅ Links a página individual de cada Regenmon
- ✅ Loading state
- ✅ Empty state si no hay Regenmons

**Código esperado:**

```typescript
// app/leaderboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { Card } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const { leaderboard, pagination, isLoading, error } = useLeaderboard(page, 10);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#ce372b" }}>⚠️ Error loading leaderboard</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2rem", color: "#f7d51d" }}>
          🏆 Leaderboard
        </h1>

        {leaderboard.length === 0 ? (
          <Card centered style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              No Regenmons registered yet. Be the first!
            </p>
            <Link href="/register">
              <Button variant="success">Register Regenmon →</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Leaderboard List */}
            <div style={{ marginBottom: "2rem" }}>
              {leaderboard.map((regenmon: any) => (
                <Card key={regenmon.id} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1.5rem", alignItems: "center" }}>
                    {/* Rank */}
                    <div style={{ textAlign: "center", fontSize: "2rem" }}>
                      {regenmon.rank <= 3 ? (
                        regenmon.rank === 1 ? "🥇" :
                        regenmon.rank === 2 ? "🥈" : "🥉"
                      ) : (
                        <span style={{ fontSize: "1.5rem" }}>#{regenmon.rank}</span>
                      )}
                    </div>

                    {/* Regenmon Info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                        <img
                          src={regenmon.sprite}
                          alt={regenmon.name}
                          style={{ width: "48px", height: "48px", imageRendering: "pixelated" }}
                        />
                        <div>
                          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>{regenmon.name}</h3>
                          <p style={{ fontSize: "0.7rem", color: "#92cc41" }}>by {regenmon.ownerName} • Stage {regenmon.stage}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "2rem", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                        <span>⭐ {regenmon.totalPoints.toLocaleString()} pts</span>
                        <span style={{ color: "#92cc41" }}>🍎 {regenmon.balance} $FRUTA</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div>
                      <Link href={`/regenmon/${regenmon.id}`}>
                        <Button variant="primary" style={{ padding: "0.5rem 1rem", fontSize: "0.7rem" }}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <Button
                  variant="primary"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  ← Prev
                </Button>
                <span style={{ fontSize: "0.8rem" }}>
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="primary"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
```

**Prueba:**
- Leaderboard debe mostrar ranking con estilo pixel art
- Cards deben tener bordes NES.css
- Paginación debe funcionar con botones retro
- Medallas 🥇🥈🥉 para top 3
- Click en "View" → Navegar a página del Regenmon

---

## 🎫 TICKET 2.7: Página Pública de Regenmon (NES.css)

**Archivo:** `app/regenmon/[id]/page.tsx`

**Descripción:** Página individual pixel art de cada Regenmon con estadísticas y barras de progreso retro.

**Criterios de Aceptación:**
- ✅ Mostrar información del Regenmon (usando `useRegenmon(id)`)
- ✅ Sprite con estilo pixel art
- ✅ Stats con barras de progreso NES.css (`nes-progress`)
- ✅ Puntos, balance, stage, total de visitas
- ✅ Botón NES.css para visitar app
- ✅ Loading state retro
- ✅ 404 state pixel art

**Código esperado:**

```typescript
// app/regenmon/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useRegenmon } from "../../hooks/useRegenmon";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function RegenmonPage() {
  const params = useParams();
  const id = params.id as string;
  const { regenmon, isLoading, error } = useRegenmon(id);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !regenmon) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 12rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card centered style={{ maxWidth: "400px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem" }}>😢</div>
              <h2 style={{ fontSize: "1.5rem", margin: "1rem 0" }}>Not Found</h2>
              <p style={{ fontSize: "0.8rem" }}>This Regenmon does not exist</p>
            </div>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const stats = regenmon.stats as any;

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {/* Header with Sprite */}
        <Card centered style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src={regenmon.sprite}
            alt={regenmon.name}
            style={{ width: "128px", height: "128px", margin: "0 auto 1rem", imageRendering: "pixelated" }}
          />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{regenmon.name}</h1>
          <p style={{ fontSize: "0.8rem", color: "#92cc41" }}>
            by {regenmon.ownerName} • Stage {regenmon.stage}
          </p>
          {!regenmon.isActive && (
            <div className="nes-badge" style={{ marginTop: "1rem" }}>
              <span className="is-error">⚠️ Inactive</span>
            </div>
          )}
        </Card>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>⭐</div>
              <div style={{ fontSize: "1.8rem", color: "#f7d51d", margin: "0.5rem 0" }}>
                {regenmon.totalPoints}
              </div>
              <div style={{ fontSize: "0.7rem" }}>Total Points</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>🍎</div>
              <div style={{ fontSize: "1.8rem", color: "#92cc41", margin: "0.5rem 0" }}>
                {regenmon.balance}
              </div>
              <div style={{ fontSize: "0.7rem" }}>$FRUTA</div>
            </div>
          </Card>

          <Card centered>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>👁️</div>
              <div style={{ fontSize: "1.8rem", color: "#209cee", margin: "0.5rem 0" }}>
                {regenmon.totalVisits}
              </div>
              <div style={{ fontSize: "0.7rem" }}>Visits</div>
            </div>
          </Card>
        </div>

        {/* Status Bars (NES.css progress) */}
        <Card style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Regenmon Status</h3>

          {/* Happiness */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              <span>😊 Happiness</span>
              <span>{stats.happiness}/100</span>
            </div>
            <progress className="nes-progress is-warning" value={stats.happiness} max="100"></progress>
          </div>

          {/* Energy */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              <span>⚡ Energy</span>
              <span>{stats.energy}/100</span>
            </div>
            <progress className="nes-progress is-primary" value={stats.energy} max="100"></progress>
          </div>

          {/* Hunger */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              <span>🍖 Hunger</span>
              <span>{stats.hunger}/100</span>
            </div>
            <progress className="nes-progress is-success" value={stats.hunger} max="100"></progress>
          </div>
        </Card>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href={regenmon.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="success" style={{ fontSize: "0.9rem" }}>
              🎮 Visit Student App →
            </Button>
          </a>
          <p style={{ fontSize: "0.7rem", marginTop: "1.5rem", color: "#92cc41" }}>
            Last sync: {new Date(regenmon.lastSynced).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
```

**Prueba:**
- Página debe mostrar todos los datos del Regenmon con estilo pixel art
- Barras de progreso NES.css (`nes-progress`) deben reflejar stats correctos
- Colores: warning (amarillo) para Happiness, primary (azul) para Energy, success (verde) para Hunger
- Botón "Visit App" debe abrir URL en nueva pestaña
- Si ID no existe → Mostrar 404 con estilo retro

---

## ✅ CRITERIOS DE FINALIZACIÓN DE FASE 2

- [ ] Todos los 8 tickets completados (2.0 - 2.7)
- [ ] **NES.css y fuente Press Start 2P** importadas correctamente
- [ ] Todos los elementos usan clases NES.css (nes-btn, nes-container, nes-input, nes-progress)
- [ ] Estética pixel art 8-bit auténtica en todas las páginas
- [ ] Privy Auth funciona (login/logout)
- [ ] Todos los hooks consumen APIs correctamente
- [ ] Homepage muestra estadísticas en tiempo real con estilo retro
- [ ] Formulario de registro funciona y valida con inputs pixel art
- [ ] Leaderboard muestra ranking y paginación con cards retro
- [ ] Página individual muestra Regenmon completo con barras de progreso NES.css
- [ ] Navbar y Footer pixel art en todas las páginas
- [ ] Responsive design (mobile y desktop)
- [ ] Estados de loading/error en todas las páginas con estilo retro

---

## 📊 MÉTRICAS DE ÉXITO

- **Funcionalidad:** 100% de las páginas funcionan sin errores
- **Performance:** Carga inicial < 3 segundos
- **Estética:** 100% de elementos usan NES.css, 0% Tailwind genérico
- **UX:** Estados de loading/error claros con estilo pixel art
- **Accesibilidad:** Navegación con teclado funcional
- **Responsive:** Todas las páginas funcionan en mobile (375px+)

---

## 🔄 SIGUIENTE FASE

**Fase 3: Dashboard del Admin** (Panel de control)
1. Login de admin con NextAuth
2. Vista de todos los Regenmons
3. Estadísticas avanzadas con gráficos
4. Gestión de tokens (ajustes manuales)
5. Logs de actividad

---

**Última actualización:** 2025-01-10
**Estado:** Pendiente de inicio (0%)
