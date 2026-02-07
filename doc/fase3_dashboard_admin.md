# FASE 3: Dashboard del Admin - Tickets de Desarrollo

**Objetivo:** Crear el panel de control privado para el administrador del bootcamp con gestión completa de Regenmons, tokens y estadísticas.

**Estética:** 🎮 Pixel Art 8-bit auténtica usando NES.css (igual que frontend público)

**Progreso:** 0/6 páginas completadas (0%)

---

## 📋 CHECKLIST GENERAL

### Setup Inicial (Pre-requisitos)
- [ ] **Ticket 3.0:** Configurar NextAuth para autenticación de admin
- [ ] **Ticket 3.1:** Crear middleware de protección de rutas admin
- [ ] **Ticket 3.2:** Crear componentes reutilizables de admin (tablas, gráficos)

### APIs de Administración
- [ ] **Ticket 3.3:** API para gestión de tokens (ajustes manuales)
- [ ] **Ticket 3.4:** API para estadísticas avanzadas y reportes
- [ ] **Ticket 3.5:** API para logs de actividad del sistema

### Páginas del Dashboard
- [ ] **Ticket 3.6:** Página de login admin (/admin/login)
- [ ] **Ticket 3.7:** Dashboard principal con gráficos (/admin)
- [ ] **Ticket 3.8:** Vista de todos los Regenmons (/admin/regenmons)
- [ ] **Ticket 3.9:** Gestión de tokens y transacciones (/admin/tokens)
- [ ] **Ticket 3.10:** Logs de actividad (/admin/logs)

---

## 🎫 TICKET 3.0: Configurar NextAuth para Autenticación de Admin

**Archivos:**
- `app/api/auth/[...nextauth]/route.ts`
- `app/lib/auth.ts`
- `middleware.ts`

**Descripción:** Configurar NextAuth con autenticación por contraseña para el administrador del bootcamp.

**Criterios de Aceptación:**
- ✅ Configurar NextAuth con provider de Credentials
- ✅ Validar contraseña contra variable de entorno `ADMIN_PASSWORD`
- ✅ Crear sesión persistente para admin
- ✅ Exportar función `getServerSession` para validación
- ✅ No permitir registro, solo login con credenciales predefinidas

**Código esperado:**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validar contraseña contra variable de entorno
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return {
            id: "admin",
            name: "Admin",
            email: "admin@regenmon.hub",
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

```typescript
// app/lib/auth.ts
import { getServerSession as getSession } from "next-auth";

export async function getServerSession() {
  return await getSession();
}

export async function requireAdmin() {
  const session = await getServerSession();

  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session;
}
```

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Proteger rutas /admin/*
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Prueba:**
- Intentar acceder a /admin sin login → Redirige a /admin/login
- Login con contraseña incorrecta → Muestra error
- Login con contraseña correcta → Crea sesión y redirige a /admin
- Sesión expira después de 24 horas

---

## 🎫 TICKET 3.1: Crear Middleware de Protección de Rutas Admin

**Archivos:**
- `app/lib/adminAuth.ts`
- `app/admin/layout.tsx`

**Descripción:** Crear sistema de validación de admin para todas las páginas del dashboard.

**Criterios de Aceptación:**
- ✅ Función `validateAdminSession()` para uso en Server Components
- ✅ Hook `useAdminSession()` para uso en Client Components
- ✅ Layout de admin que valida sesión en cada página
- ✅ Redirección automática a login si no hay sesión

**Código esperado:**

```typescript
// app/lib/adminAuth.ts
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";

export async function validateAdminSession() {
  try {
    const session = await requireAdmin();
    return session;
  } catch (error) {
    redirect("/admin/login");
  }
}
```

```typescript
// app/admin/layout.tsx
import { validateAdminSession } from "../lib/adminAuth";
import { AdminNavbar } from "../components/admin/AdminNavbar";
import { Footer } from "../components/Footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validar sesión en cada página admin
  await validateAdminSession();

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
```

**Prueba:**
- Acceder a /admin sin sesión → Redirige a /admin/login
- Acceder con sesión válida → Muestra contenido
- Cerrar sesión → Invalida acceso

---

## 🎫 TICKET 3.2: Crear Componentes Reutilizables de Admin (NES.css)

**Archivos:**
- `app/components/admin/AdminNavbar.tsx`
- `app/components/admin/AdminCard.tsx`
- `app/components/admin/DataTable.tsx`
- `app/components/admin/StatCard.tsx`
- `app/components/admin/LineChart.tsx`

**Descripción:** Crear componentes UI específicos para el dashboard admin con estilo pixel art.

**Criterios de Aceptación:**
- ✅ AdminNavbar con navegación entre secciones y botón de logout
- ✅ AdminCard para contenedores de información
- ✅ DataTable para mostrar listas de datos con paginación
- ✅ StatCard para mostrar métricas clave
- ✅ LineChart para gráficos (usando Recharts con tema pixel art)

**Código esperado:**

```typescript
// app/components/admin/AdminNavbar.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "../ui/Button";

export function AdminNavbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#ce372b", marginBottom: "2rem" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/admin" style={{ fontSize: "1.2rem", color: "#fff", textDecoration: "none" }}>
          🔧 Admin Dashboard
        </Link>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/admin" style={{ color: "#fff", textDecoration: "none", fontSize: "0.8rem" }}>Dashboard</Link>
          <Link href="/admin/regenmons" style={{ color: "#fff", textDecoration: "none", fontSize: "0.8rem" }}>Regenmons</Link>
          <Link href="/admin/tokens" style={{ color: "#fff", textDecoration: "none", fontSize: "0.8rem" }}>Tokens</Link>
          <Link href="/admin/logs" style={{ color: "#fff", textDecoration: "none", fontSize: "0.8rem" }}>Logs</Link>

          <Button variant="error" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

```typescript
// app/components/admin/AdminCard.tsx
import { Card } from "../ui/Card";

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export function AdminCard({ title, children, icon }: AdminCardProps) {
  return (
    <Card>
      <div style={{ marginBottom: "1rem", borderBottom: "4px solid #fff", paddingBottom: "0.5rem" }}>
        <h3 style={{ fontSize: "1rem", color: "#92cc41" }}>
          {icon && <span style={{ marginRight: "0.5rem" }}>{icon}</span>}
          {title}
        </h3>
      </div>
      {children}
    </Card>
  );
}
```

```typescript
// app/components/admin/StatCard.tsx
import { Card } from "../ui/Card";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
}

export function StatCard({ icon, value, label, color = "#209cee" }: StatCardProps) {
  return (
    <Card centered>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem" }}>{icon}</div>
        <div style={{ fontSize: "1.8rem", color, margin: "0.5rem 0", fontWeight: "bold" }}>
          {value}
        </div>
        <div style={{ fontSize: "0.7rem" }}>{label}</div>
      </div>
    </Card>
  );
}
```

```typescript
// app/components/admin/DataTable.tsx
interface DataTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  emptyMessage?: string;
}

export function DataTable({ headers, rows, emptyMessage = "No data" }: DataTableProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="nes-table is-bordered is-centered" style={{ width: "100%", fontSize: "0.7rem" }}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: "center", padding: "2rem" }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

**Prueba:**
- AdminNavbar muestra navegación completa con logout
- StatCard muestra métricas con estilo pixel art
- DataTable renderiza datos correctamente
- Todos los componentes usan NES.css

---

## 🎫 TICKET 3.3: API para Gestión de Tokens (Ajustes Manuales)

**Archivos:**
- `app/api/admin/tokens/adjust/route.ts`
- `app/api/admin/tokens/history/route.ts`

**Descripción:** API para que el admin pueda ajustar tokens manualmente (dar/quitar) con auditoría completa.

**Criterios de Aceptación:**
- ✅ POST /api/admin/tokens/adjust - Ajustar balance de un Regenmon
- ✅ GET /api/admin/tokens/history - Obtener historial de ajustes manuales
- ✅ Validar sesión de admin antes de permitir operación
- ✅ Registrar todos los ajustes en tabla TokenTransaction
- ✅ Incluir razón del ajuste en metadata

**Código esperado:**

```typescript
// app/api/admin/tokens/adjust/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { handleApiError, successResponse } from "@/app/lib/errors";
import { z } from "zod";

const AdjustTokensSchema = z.object({
  regenmonId: z.string().cuid(),
  amount: z.number().int(), // Puede ser positivo (dar) o negativo (quitar)
  reason: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    // Validar sesión de admin
    await requireAdmin();

    const body = await req.json();
    const { regenmonId, amount, reason } = AdjustTokensSchema.parse(body);

    // Ejecutar ajuste en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Obtener balance actual
      const regenmon = await tx.registeredRegenmon.findUnique({
        where: { id: regenmonId },
        select: { balance: true, name: true },
      });

      if (!regenmon) {
        throw new Error("Regenmon not found");
      }

      const balanceBefore = regenmon.balance;
      const balanceAfter = balanceBefore + amount;

      // Validar que no quede negativo
      if (balanceAfter < 0) {
        throw new Error("Insufficient balance");
      }

      // Actualizar balance
      await tx.registeredRegenmon.update({
        where: { id: regenmonId },
        data: { balance: balanceAfter },
      });

      // Registrar transacción
      const transaction = await tx.tokenTransaction.create({
        data: {
          regenmonId,
          type: "admin_adjust",
          amount,
          balanceBefore,
          balanceAfter,
          metadata: {
            reason,
            adjustedBy: "admin",
            timestamp: new Date().toISOString(),
          },
        },
      });

      return {
        regenmonName: regenmon.name,
        balanceBefore,
        balanceAfter,
        amount,
        transaction,
      };
    });

    return successResponse(result, "Tokens adjusted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
```

```typescript
// app/api/admin/tokens/history/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { handleApiError, paginatedResponse } from "@/app/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type"); // Filtrar por tipo

    const skip = (page - 1) * limit;

    const where = type ? { type } : {};

    const [transactions, total] = await Promise.all([
      prisma.tokenTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          regenmon: {
            select: {
              name: true,
              ownerName: true,
            },
          },
        },
      }),
      prisma.tokenTransaction.count({ where }),
    ]);

    return paginatedResponse(transactions, { page, limit, total });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- Admin puede dar tokens a un Regenmon
- Admin puede quitar tokens (valida balance positivo)
- Todas las transacciones quedan registradas con razón
- Historial muestra todos los ajustes con detalles

---

## 🎫 TICKET 3.4: API para Estadísticas Avanzadas y Reportes

**Archivos:**
- `app/api/admin/stats/advanced/route.ts`
- `app/api/admin/stats/charts/route.ts`

**Descripción:** APIs para obtener estadísticas avanzadas y datos para gráficos del dashboard.

**Criterios de Aceptación:**
- ✅ GET /api/admin/stats/advanced - Estadísticas detalladas del sistema
- ✅ GET /api/admin/stats/charts - Datos para gráficos (puntos por día, distribución, etc.)
- ✅ Métricas de engagement (registros por día, sincronizaciones, etc.)
- ✅ Análisis de distribución de tokens

**Código esperado:**

```typescript
// app/api/admin/stats/advanced/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { handleApiError, successResponse } from "@/app/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const [
      totalRegenmons,
      activeRegenmons,
      recentRegistrations,
      recentSyncs,
      tokenStats,
      topRegenmons,
    ] = await Promise.all([
      // Total de Regenmons
      prisma.registeredRegenmon.count(),

      // Regenmons activos
      prisma.registeredRegenmon.count({ where: { isActive: true } }),

      // Registros recientes (últimas 24h)
      prisma.registeredRegenmon.count({
        where: {
          registeredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),

      // Sincronizaciones recientes (últimas 24h)
      prisma.syncSnapshot.count({
        where: {
          timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),

      // Estadísticas de tokens
      prisma.tokenTransaction.aggregate({
        _sum: { amount: true },
        _count: true,
      }),

      // Top 10 Regenmons
      prisma.registeredRegenmon.findMany({
        where: { isActive: true },
        orderBy: { totalPoints: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          ownerName: true,
          totalPoints: true,
          balance: true,
          stage: true,
        },
      }),
    ]);

    return successResponse({
      overview: {
        totalRegenmons,
        activeRegenmons,
        inactiveRegenmons: totalRegenmons - activeRegenmons,
      },
      activity: {
        recentRegistrations24h: recentRegistrations,
        recentSyncs24h: recentSyncs,
      },
      tokens: {
        totalTransactions: tokenStats._count,
        totalTokensIssued: tokenStats._sum.amount || 0,
      },
      topRegenmons,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

```typescript
// app/api/admin/stats/charts/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { handleApiError, successResponse } from "@/app/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");

    // Obtener datos de los últimos N días
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Puntos acumulados por día
    const pointsPerDay = await prisma.syncSnapshot.groupBy({
      by: ["timestamp"],
      where: {
        timestamp: { gte: startDate },
      },
      _sum: {
        pointsGained: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Tokens distribuidos por día
    const tokensPerDay = await prisma.tokenTransaction.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: startDate },
        type: "reward",
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Distribución por stage
    const stageDistribution = await prisma.registeredRegenmon.groupBy({
      by: ["stage"],
      where: { isActive: true },
      _count: true,
      orderBy: { stage: "asc" },
    });

    return successResponse({
      pointsPerDay: pointsPerDay.map((d) => ({
        date: d.timestamp.toISOString().split("T")[0],
        points: d._sum.pointsGained || 0,
      })),
      tokensPerDay: tokensPerDay.map((d) => ({
        date: d.createdAt.toISOString().split("T")[0],
        tokens: d._sum.amount || 0,
      })),
      stageDistribution: stageDistribution.map((d) => ({
        stage: d.stage,
        count: d._count,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- /api/admin/stats/advanced retorna todas las métricas clave
- /api/admin/stats/charts retorna datos formateados para gráficos
- Datos se pueden filtrar por rango de días
- Todas las consultas usan índices para performance

---

## 🎫 TICKET 3.5: API para Logs de Actividad del Sistema

**Archivos:**
- `app/api/admin/logs/route.ts`
- `app/lib/logger.ts`

**Descripción:** Sistema de logging para auditoría de eventos importantes del sistema.

**Criterios de Aceptación:**
- ✅ GET /api/admin/logs - Obtener logs con paginación y filtros
- ✅ Función `logEvent()` para registrar eventos
- ✅ Tipos de eventos: registration, sync, token_adjust, admin_action
- ✅ Incluir metadata relevante (IP, user agent, etc.)

**Código esperado:**

```typescript
// app/lib/logger.ts
import { prisma } from "./prisma";

export type LogEventType =
  | "registration"
  | "sync_success"
  | "sync_failed"
  | "token_reward"
  | "token_adjust"
  | "admin_login"
  | "admin_action";

interface LogEventData {
  type: LogEventType;
  regenmonId?: string;
  userId?: string;
  message: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export async function logEvent(data: LogEventData) {
  try {
    // Nota: Esto requeriría una tabla ActivityLog en el schema
    // Por ahora, usar console.log como fallback
    console.log("[ACTIVITY LOG]", {
      timestamp: new Date().toISOString(),
      ...data,
    });

    // TODO: Implementar almacenamiento en BD cuando se agregue tabla ActivityLog
    // await prisma.activityLog.create({ data: { ...data } });
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}
```

```typescript
// app/api/admin/logs/route.ts
import { NextRequest } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { handleApiError, successResponse } from "@/app/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "100");

    // Por ahora retornar logs de TokenTransaction como proxy
    // TODO: Implementar tabla ActivityLog dedicada
    const logs = await prisma.tokenTransaction.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        regenmon: {
          select: {
            name: true,
            ownerName: true,
          },
        },
      },
    });

    const formattedLogs = logs.map((log) => ({
      id: log.id,
      type: log.type,
      message: `${log.type} - ${log.amount} tokens for ${log.regenmon.name}`,
      regenmonName: log.regenmon.name,
      ownerName: log.regenmon.ownerName,
      amount: log.amount,
      metadata: log.metadata,
      timestamp: log.createdAt,
    }));

    return successResponse(formattedLogs);
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- Eventos se registran correctamente
- Logs se pueden filtrar por tipo
- Metadata incluye información relevante
- Logs se pueden exportar

---

## 🎫 TICKET 3.6: Página de Login Admin (NES.css)

**Archivo:** `app/admin/login/page.tsx`

**Descripción:** Página de autenticación pixel art para el administrador.

**Criterios de Aceptación:**
- ✅ Formulario de login con campo de contraseña
- ✅ Validación del lado del cliente
- ✅ Integración con NextAuth
- ✅ Mensajes de error claros
- ✅ Estilo NES.css retro

**Código esperado:**

```typescript
// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid password");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#212529" }}>
      <Card style={{ maxWidth: "400px", width: "100%", margin: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", color: "#ce372b", marginBottom: "0.5rem" }}>
            🔧 Admin Login
          </h1>
          <p style={{ fontSize: "0.7rem", color: "#92cc41" }}>
            Regenmon Hub Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ fontSize: "0.8rem" }}>
              Admin Password *
            </label>
            <input
              type="password"
              id="password"
              className="nes-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{ marginTop: "0.5rem" }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: "1.5rem" }}>
              <ErrorMessage message={error} />
            </div>
          )}

          <Button
            type="submit"
            variant="error"
            isLoading={isLoading}
            style={{ width: "100%" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <a
            href="/"
            style={{ fontSize: "0.7rem", color: "#209cee", textDecoration: "none" }}
          >
            ← Back to Public Hub
          </a>
        </div>
      </Card>
    </div>
  );
}
```

**Prueba:**
- Formulario valida campo requerido
- Contraseña incorrecta muestra error
- Contraseña correcta crea sesión y redirige
- Estilo pixel art coherente con frontend público

---

## 🎫 TICKET 3.7: Dashboard Principal con Gráficos (NES.css)

**Archivo:** `app/admin/page.tsx`

**Descripción:** Dashboard principal con estadísticas, gráficos y actividad reciente.

**Criterios de Aceptación:**
- ✅ Mostrar métricas clave (StatCards)
- ✅ Gráfico de puntos por día (LineChart con Recharts)
- ✅ Top 10 Regenmons
- ✅ Actividad reciente
- ✅ Auto-refresh cada 30 segundos

**Código esperado:**

```typescript
// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AdminCard } from "../components/admin/AdminCard";
import { StatCard } from "../components/admin/StatCard";
import { DataTable } from "../components/admin/DataTable";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          fetch("/api/admin/stats/advanced"),
          fetch("/api/admin/stats/charts?days=7"),
        ]);

        const statsData = await statsRes.json();
        const chartsData = await chartsRes.json();

        setStats(statsData.data);
        setChartData(chartsData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh cada 30s

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#ce372b" }}>
        🔧 Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <StatCard
          icon="👾"
          value={stats?.overview.totalRegenmons || 0}
          label="Total Regenmons"
          color="#209cee"
        />
        <StatCard
          icon="✅"
          value={stats?.overview.activeRegenmons || 0}
          label="Active"
          color="#92cc41"
        />
        <StatCard
          icon="🍎"
          value={stats?.tokens.totalTokensIssued?.toLocaleString() || 0}
          label="Tokens Issued"
          color="#f7d51d"
        />
        <StatCard
          icon="📈"
          value={stats?.activity.recentSyncs24h || 0}
          label="Syncs (24h)"
          color="#209cee"
        />
      </div>

      {/* Charts */}
      <AdminCard title="Points Per Day (Last 7 Days)" icon="📊">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData?.pointsPerDay || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#fff" style={{ fontSize: "0.7rem" }} />
            <YAxis stroke="#fff" style={{ fontSize: "0.7rem" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#212529",
                border: "4px solid #fff",
                fontFamily: "Press Start 2P",
                fontSize: "0.6rem",
              }}
            />
            <Line type="monotone" dataKey="points" stroke="#92cc41" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </AdminCard>

      {/* Top 10 Regenmons */}
      <AdminCard title="Top 10 Regenmons" icon="🏆">
        <DataTable
          headers={["Rank", "Name", "Owner", "Stage", "Points", "Tokens"]}
          rows={
            stats?.topRegenmons?.map((r: any, i: number) => [
              i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`,
              r.name,
              r.ownerName,
              r.stage,
              r.totalPoints.toLocaleString(),
              `${r.balance} $FRUTA`,
            ]) || []
          }
        />
      </AdminCard>
    </div>
  );
}
```

**Prueba:**
- Dashboard carga estadísticas correctamente
- Gráficos muestran datos de últimos 7 días
- Top 10 se ordena por puntos
- Auto-refresh funciona cada 30s

---

## 🎫 TICKET 3.8: Vista de Todos los Regenmons

**Archivo:** `app/admin/regenmons/page.tsx`

**Descripción:** Página para ver y gestionar todos los Regenmons registrados.

**Criterios de Aceptación:**
- ✅ Tabla con todos los Regenmons
- ✅ Filtros por estado (activo/inactivo)
- ✅ Búsqueda por nombre
- ✅ Paginación
- ✅ Acciones rápidas (ver detalles, activar/desactivar)

**Código esperado:**

```typescript
// app/admin/regenmons/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminCard } from "../../components/admin/AdminCard";
import { DataTable } from "../../components/admin/DataTable";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function AdminRegenmonsPage() {
  const [regenmons, setRegenmons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchRegenmons() {
      try {
        const res = await fetch(`/api/leaderboard?page=${page}&limit=20`);
        const data = await res.json();
        setRegenmons(data.data || []);
      } catch (error) {
        console.error("Failed to fetch regenmons:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegenmons();
  }, [page, filter]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#ce372b" }}>
        👾 All Regenmons
      </h1>

      <AdminCard title="Regenmons List" icon="📋">
        <DataTable
          headers={["Rank", "Name", "Owner", "Stage", "Points", "Balance", "Status", "Actions"]}
          rows={regenmons.map((r: any) => [
            r.rank,
            r.name,
            r.ownerName,
            r.stage,
            r.totalPoints.toLocaleString(),
            `${r.balance} $FRUTA`,
            r.isActive ? "✅ Active" : "❌ Inactive",
            <Link key={r.id} href={`/regenmon/${r.id}`}>
              <Button variant="primary" style={{ padding: "0.3rem 0.8rem", fontSize: "0.6rem" }}>
                View
              </Button>
            </Link>,
          ])}
        />

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button variant="primary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← Prev
          </Button>
          <span style={{ display: "flex", alignItems: "center", fontSize: "0.8rem" }}>Page {page}</span>
          <Button variant="primary" onClick={() => setPage(p => p + 1)}>
            Next →
          </Button>
        </div>
      </AdminCard>
    </div>
  );
}
```

**Prueba:**
- Tabla muestra todos los Regenmons
- Paginación funciona correctamente
- Filtros aplican correctamente
- Botón "View" navega a página del Regenmon

---

## 🎫 TICKET 3.9: Gestión de Tokens y Transacciones

**Archivo:** `app/admin/tokens/page.tsx`

**Descripción:** Página para ajustar tokens manualmente y ver historial de transacciones.

**Criterios de Aceptación:**
- ✅ Formulario para ajustar tokens (dar/quitar)
- ✅ Selector de Regenmon
- ✅ Campo de razón obligatorio
- ✅ Tabla con historial de transacciones
- ✅ Filtros por tipo de transacción

**Código esperado:**

```typescript
// app/admin/tokens/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AdminCard } from "../../components/admin/AdminCard";
import { DataTable } from "../../components/admin/DataTable";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export default function AdminTokensPage() {
  const [regenmons, setRegenmons] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedRegenmon, setSelectedRegenmon] = useState("");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch regenmons list
    fetch("/api/leaderboard?limit=100")
      .then(res => res.json())
      .then(data => setRegenmons(data.data || []));

    // Fetch transactions history
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const res = await fetch("/api/admin/tokens/history?limit=50");
    const data = await res.json();
    setTransactions(data.data || []);
  }

  async function handleAdjust(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/tokens/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regenmonId: selectedRegenmon,
          amount: parseInt(amount.toString()),
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to adjust tokens");
      }

      setSuccess(`Tokens adjusted successfully for ${data.data.regenmonName}`);
      setAmount(0);
      setReason("");
      fetchTransactions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#ce372b" }}>
        🍎 Token Management
      </h1>

      {/* Adjust Tokens Form */}
      <AdminCard title="Adjust Tokens" icon="⚙️">
        <form onSubmit={handleAdjust}>
          <div className="nes-field" style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Select Regenmon *</label>
            <div className="nes-select" style={{ marginTop: "0.5rem" }}>
              <select
                required
                value={selectedRegenmon}
                onChange={(e) => setSelectedRegenmon(e.target.value)}
              >
                <option value="">-- Select --</option>
                {regenmons.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.ownerName}) - {r.balance} $FRUTA
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="nes-field" style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Amount (+ to give, - to take) *</label>
            <input
              type="number"
              className="nes-input"
              required
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              style={{ marginTop: "0.5rem" }}
            />
          </div>

          <div className="nes-field" style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Reason *</label>
            <input
              type="text"
              className="nes-input"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Bonus for exceptional work"
              style={{ marginTop: "0.5rem" }}
            />
          </div>

          {error && <div style={{ marginBottom: "1rem" }}><ErrorMessage message={error} /></div>}
          {success && (
            <div className="nes-container is-dark" style={{ backgroundColor: "#92cc41", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.7rem" }}>✅ {success}</p>
            </div>
          )}

          <Button type="submit" variant="warning" isLoading={isLoading}>
            {isLoading ? "Adjusting..." : "Adjust Tokens"}
          </Button>
        </form>
      </AdminCard>

      {/* Transaction History */}
      <AdminCard title="Transaction History" icon="📜">
        <DataTable
          headers={["Date", "Regenmon", "Type", "Amount", "Balance", "Reason"]}
          rows={transactions.map((t: any) => [
            new Date(t.createdAt).toLocaleDateString(),
            `${t.regenmon.name} (${t.regenmon.ownerName})`,
            t.type,
            t.amount > 0 ? `+${t.amount}` : t.amount,
            t.balanceAfter,
            t.metadata?.reason || "-",
          ])}
        />
      </AdminCard>
    </div>
  );
}
```

**Prueba:**
- Admin puede seleccionar Regenmon
- Puede dar tokens (número positivo)
- Puede quitar tokens (número negativo)
- Razón es obligatoria
- Historial se actualiza después de ajuste

---

## 🎫 TICKET 3.10: Logs de Actividad

**Archivo:** `app/admin/logs/page.tsx`

**Descripción:** Página para ver logs de actividad del sistema con filtros.

**Criterios de Aceptación:**
- ✅ Tabla con logs de actividad
- ✅ Filtros por tipo de evento
- ✅ Búsqueda por Regenmon
- ✅ Exportar a CSV (opcional)

**Código esperado:**

```typescript
// app/admin/logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AdminCard } from "../../components/admin/AdminCard";
import { DataTable } from "../../components/admin/DataTable";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch(`/api/admin/logs${filter ? `?type=${filter}` : ""}`);
      const data = await res.json();
      setLogs(data.data || []);
    }

    fetchLogs();
  }, [filter]);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#ce372b" }}>
        📝 Activity Logs
      </h1>

      <AdminCard title="System Logs" icon="📋">
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.8rem", marginRight: "1rem" }}>Filter by type:</label>
          <div className="nes-select">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All</option>
              <option value="reward">Rewards</option>
              <option value="admin_adjust">Admin Adjustments</option>
              <option value="feed">Feeding</option>
              <option value="evolution">Evolution</option>
            </select>
          </div>
        </div>

        <DataTable
          headers={["Timestamp", "Type", "Regenmon", "Owner", "Amount", "Details"]}
          rows={logs.map((log: any) => [
            new Date(log.timestamp).toLocaleString(),
            log.type,
            log.regenmonName,
            log.ownerName,
            log.amount,
            JSON.stringify(log.metadata || {}).substring(0, 50),
          ])}
        />
      </AdminCard>
    </div>
  );
}
```

**Prueba:**
- Logs se cargan correctamente
- Filtros funcionan
- Datos se muestran en orden cronológico inverso

---

## ✅ CRITERIOS DE FINALIZACIÓN DE FASE 3

- [ ] Todos los 11 tickets completados (3.0 - 3.10)
- [ ] **NextAuth configurado** correctamente con protección de rutas
- [ ] **Middleware** protege todas las rutas /admin/*
- [ ] **APIs de admin** funcionan con validación de sesión
- [ ] **Dashboard principal** muestra estadísticas y gráficos
- [ ] **Gestión de tokens** permite ajustes manuales con auditoría
- [ ] **Logs de actividad** registran eventos importantes
- [ ] Todas las páginas usan **NES.css** con estilo pixel art
- [ ] Navegación entre secciones del dashboard funciona
- [ ] Sesiones expiran correctamente después de 24h

---

## 📊 MÉTRICAS DE ÉXITO

- **Seguridad:** Solo el admin puede acceder a /admin/*
- **Funcionalidad:** 100% de las operaciones de gestión funcionan
- **Auditoría:** Todos los ajustes manuales quedan registrados
- **Performance:** Dashboard carga en < 3 segundos
- **Estética:** 100% coherente con frontend público (NES.css)
- **UX:** Navegación intuitiva entre secciones

---

## 🔄 SIGUIENTE FASE

**Fase 4: Integración Completa** (Opcional)
1. Integrar Gemini AI para evaluación de imágenes
2. Crear webhook para sincronización automática
3. Implementar notificaciones en tiempo real
4. Sistema de badges y logros
5. Exportación de reportes completos

---

**Última actualización:** 2025-01-10
**Estado:** Pendiente de inicio (0%)
