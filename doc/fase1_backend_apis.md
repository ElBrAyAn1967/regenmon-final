# FASE 1: Backend APIs - Tickets de Desarrollo

**Objetivo:** Crear las 6 APIs del backend que conectan las apps de estudiantes con el hub central en Supabase.

**Progreso:** 0/6 endpoints completados (0%)

---

## 📋 CHECKLIST GENERAL

### Setup Inicial (Pre-requisitos)
- [ ] **Ticket 1.0:** Crear configuración de Rate Limiting (Upstash Redis)
- [ ] **Ticket 1.1:** Crear schemas de validación con Zod
- [ ] **Ticket 1.2:** Crear sistema de gestión de tokens $FRUTA
- [ ] **Ticket 1.3:** Crear utilidades de manejo de errores

### Endpoints Core
- [ ] **Ticket 1.4:** POST /api/register (Registrar nuevo Regenmon)
- [ ] **Ticket 1.5:** POST /api/sync (Sincronizar datos y otorgar tokens)
- [ ] **Ticket 1.6:** GET /api/regenmon/[id] (Ver Regenmon público + analytics)

### Endpoints Públicos
- [ ] **Ticket 1.7:** GET /api/leaderboard (Ranking de mejores Regenmons)
- [ ] **Ticket 1.8:** GET /api/stats (Estadísticas globales del hub)

### Endpoint Opcional (Sistema de Tokens)
- [ ] **Ticket 1.9:** POST /api/feed (Alimentar Regenmon gastando tokens)

---

## 🎫 TICKET 1.0: Rate Limiting Configuration

**Archivo:** `app/lib/ratelimit.ts`

**Descripción:** Configurar Upstash Redis para limitar requests y prevenir abuso de APIs.

**Criterios de Aceptación:**
- ✅ Configurar cliente Upstash Redis
- ✅ Implementar rate limiter con sliding window (10 requests/min por IP)
- ✅ Crear función `checkRateLimit(identifier: string)` que retorna `{ success: boolean, remaining: number }`
- ✅ Manejar errores de conexión Redis gracefully

**Dependencias:** Variables de entorno UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN

**Código esperado:**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, remaining } = await ratelimit.limit(identifier);
  return { success, remaining };
}
```

**Prueba:** Llamar `checkRateLimit("test_ip")` 11 veces seguidas → La 11ª debe retornar `success: false`

---

## 🎫 TICKET 1.1: Zod Validation Schemas

**Archivo:** `app/lib/validations.ts`

**Descripción:** Definir schemas de validación con Zod para todos los endpoints.

**Criterios de Aceptación:**
- ✅ Schema para registro: `RegisterRegenmonSchema`
- ✅ Schema para sincronización: `SyncRegenmonSchema`
- ✅ Schema para stats: validar `{ happiness, energy, hunger }` (0-100)
- ✅ Schema para training history: validar array de evaluaciones
- ✅ Exportar tipos TypeScript inferidos de cada schema

**Código esperado:**
```typescript
import { z } from "zod";

// Stats del Regenmon
export const StatsSchema = z.object({
  happiness: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
  hunger: z.number().min(0).max(100),
});

// Registro de nuevo Regenmon
export const RegisterRegenmonSchema = z.object({
  name: z.string().min(1).max(50),
  ownerName: z.string().min(1).max(100),
  ownerEmail: z.string().email().optional(),
  privyUserId: z.string().optional(),
  appUrl: z.string().url(),
  sprite: z.string().url(),
});

// Sincronización de datos
export const SyncRegenmonSchema = z.object({
  regenmonId: z.string().cuid(),
  stats: StatsSchema,
  totalPoints: z.number().min(0),
  trainingHistory: z.array(z.object({
    score: z.number().min(0).max(100),
    category: z.string().optional(),
    date: z.string().datetime(),
  })),
});

// Feed action
export const FeedRegenmonSchema = z.object({
  regenmonId: z.string().cuid(),
  action: z.literal("feed"),
});

// Tipos TypeScript
export type RegisterRegenmonInput = z.infer<typeof RegisterRegenmonSchema>;
export type SyncRegenmonInput = z.infer<typeof SyncRegenmonSchema>;
export type StatsInput = z.infer<typeof StatsSchema>;
export type FeedRegenmonInput = z.infer<typeof FeedRegenmonSchema>;
```

**Prueba:** Validar objeto inválido → Debe lanzar ZodError con mensajes claros

---

## 🎫 TICKET 1.2: Token Management System

**Archivo:** `app/lib/tokens.ts`

**Descripción:** Lógica del sistema de tokens $FRUTA (cálculo, otorgamiento, gastos).

**Criterios de Aceptación:**
- ✅ Función `calculateTokenReward(points: number)` → retorna tokens a otorgar (0.5 tokens por punto)
- ✅ Función `awardTokens(regenmonId, amount, reason)` → crea transacción y actualiza balance
- ✅ Función `spendTokens(regenmonId, amount, reason)` → verifica balance y resta tokens
- ✅ Función `getTokenConfig()` → obtiene configuración del sistema de tokens
- ✅ Todas las operaciones usan transacciones atómicas de Prisma

**Código esperado:**
```typescript
import { prisma } from "./prisma";

export async function getTokenConfig() {
  return await prisma.tokenSystemConfig.findFirst();
}

export async function calculateTokenReward(points: number): Promise<number> {
  const config = await getTokenConfig();
  if (!config) return Math.floor(points * 0.5); // Default rate
  return Math.floor(points * config.rewardRate);
}

export async function awardTokens(
  regenmonId: string,
  amount: number,
  reason: string,
  metadata?: any
) {
  return await prisma.$transaction(async (tx) => {
    const regenmon = await tx.registeredRegenmon.findUnique({
      where: { id: regenmonId },
    });

    if (!regenmon) throw new Error("Regenmon not found");

    const newBalance = regenmon.balance + amount;

    await tx.registeredRegenmon.update({
      where: { id: regenmonId },
      data: { balance: newBalance },
    });

    await tx.tokenTransaction.create({
      data: {
        regenmonId,
        type: "reward",
        amount,
        balanceBefore: regenmon.balance,
        balanceAfter: newBalance,
        reason,
        metadata,
      },
    });

    return newBalance;
  });
}

export async function spendTokens(
  regenmonId: string,
  amount: number,
  reason: string,
  metadata?: any
) {
  return await prisma.$transaction(async (tx) => {
    const regenmon = await tx.registeredRegenmon.findUnique({
      where: { id: regenmonId },
    });

    if (!regenmon) throw new Error("Regenmon not found");
    if (regenmon.balance < amount) throw new Error("Insufficient balance");

    const newBalance = regenmon.balance - amount;

    await tx.registeredRegenmon.update({
      where: { id: regenmonId },
      data: { balance: newBalance },
    });

    await tx.tokenTransaction.create({
      data: {
        regenmonId,
        type: reason.includes("feed") ? "feed" : "admin_adjust",
        amount: -amount,
        balanceBefore: regenmon.balance,
        balanceAfter: newBalance,
        reason,
        metadata,
      },
    });

    return newBalance;
  });
}
```

**Prueba:**
- `calculateTokenReward(100)` → Debe retornar `50`
- `awardTokens()` → Balance debe incrementar y crear transacción
- `spendTokens()` con balance insuficiente → Debe lanzar error

---

## 🎫 TICKET 1.3: Error Handling Utilities

**Archivo:** `app/lib/errors.ts`

**Descripción:** Utilidades para manejo consistente de errores en todas las APIs.

**Criterios de Aceptación:**
- ✅ Función `handleApiError(error: unknown)` → retorna Response con formato consistente
- ✅ Clase personalizada `ApiError` con statusCode y message
- ✅ Manejo de errores de Prisma (P2002 unique constraint, etc.)
- ✅ Manejo de errores de Zod con mensajes claros

**Código esperado:**
```typescript
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Resource already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Generic errors
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

**Prueba:** Lanzar diferentes tipos de errores → Cada uno debe retornar response apropiado

---

## 🎫 TICKET 1.4: POST /api/register

**Archivo:** `app/api/register/route.ts`

**Descripción:** Endpoint para registrar un nuevo Regenmon en el hub.

**Criterios de Aceptación:**
- ✅ Validar body con `RegisterRegenmonSchema`
- ✅ Verificar que `appUrl` sea única (no duplicados)
- ✅ Crear registro en DB con stats iniciales `{ happiness: 50, energy: 50, hunger: 50 }`
- ✅ Rate limiting: 10 requests/min por IP
- ✅ Retornar `{ id, appUrl, balance, message }`

**Request:**
```json
POST /api/register
{
  "name": "Pikachito",
  "ownerName": "Juan Pérez",
  "ownerEmail": "juan@email.com",
  "appUrl": "https://pikachito.vercel.app",
  "sprite": "https://example.com/sprite.png",
  "privyUserId": "privy_xyz123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "appUrl": "https://pikachito.vercel.app",
    "balance": 0,
    "totalPoints": 0
  },
  "message": "Regenmon registered successfully"
}
```

**Response (409 - Duplicate):**
```json
{
  "error": "A Regenmon with this URL already exists"
}
```

**Response (429 - Rate Limited):**
```json
{
  "error": "Too many requests, please try again later"
}
```

**Código esperado:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { RegisterRegenmonSchema } from "@/app/lib/validations";
import { checkRateLimit } from "@/app/lib/ratelimit";
import { handleApiError, ApiError } from "@/app/lib/errors";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success } = await checkRateLimit(`register:${ip}`);
    if (!success) {
      throw new ApiError(429, "Too many requests, please try again later");
    }

    // Validar body
    const body = await req.json();
    const data = RegisterRegenmonSchema.parse(body);

    // Verificar URL única
    const existing = await prisma.registeredRegenmon.findUnique({
      where: { appUrl: data.appUrl },
    });
    if (existing) {
      throw new ApiError(409, "A Regenmon with this URL already exists");
    }

    // Crear registro
    const regenmon = await prisma.registeredRegenmon.create({
      data: {
        name: data.name,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        privyUserId: data.privyUserId,
        appUrl: data.appUrl,
        sprite: data.sprite,
        stats: { happiness: 50, energy: 50, hunger: 50 },
        stage: 1,
        totalPoints: 0,
        balance: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: regenmon.id,
        appUrl: regenmon.appUrl,
        balance: regenmon.balance,
        totalPoints: regenmon.totalPoints,
      },
      message: "Regenmon registered successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- Registrar Regenmon válido → 200 OK
- Duplicar URL → 409 Conflict
- Body inválido → 400 Bad Request
- 11 requests en 1 minuto → 429 Too Many Requests

---

## 🎫 TICKET 1.5: POST /api/sync

**Archivo:** `app/api/sync/route.ts`

**Descripción:** Endpoint para sincronizar datos del Regenmon local → Hub y otorgar tokens.

**Criterios de Aceptación:**
- ✅ Validar body con `SyncRegenmonSchema`
- ✅ Actualizar stats, totalPoints en DB
- ✅ Calcular tokens a otorgar según puntos nuevos
- ✅ Crear snapshot histórico
- ✅ Actualizar `lastSynced`
- ✅ Rate limiting: 10 requests/min por regenmonId
- ✅ Retornar balance actualizado y tokens ganados

**Request:**
```json
POST /api/sync
{
  "regenmonId": "clxxx",
  "stats": { "happiness": 80, "energy": 60, "hunger": 40 },
  "totalPoints": 150,
  "trainingHistory": [
    { "score": 85, "category": "Math", "date": "2025-01-10T10:00:00Z" }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": 75,
    "tokensEarned": 75,
    "totalPoints": 150,
    "lastSynced": "2025-01-10T10:05:00Z"
  },
  "message": "Sync successful"
}
```

**Código esperado:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { SyncRegenmonSchema } from "@/app/lib/validations";
import { checkRateLimit } from "@/app/lib/ratelimit";
import { handleApiError, ApiError } from "@/app/lib/errors";
import { calculateTokenReward, awardTokens } from "@/app/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SyncRegenmonSchema.parse(body);

    // Rate limiting por regenmonId
    const { success } = await checkRateLimit(`sync:${data.regenmonId}`);
    if (!success) {
      throw new ApiError(429, "Too many sync requests, please wait");
    }

    // Buscar Regenmon
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id: data.regenmonId },
    });
    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found");
    }

    // Calcular puntos nuevos
    const pointsGained = data.totalPoints - regenmon.totalPoints;
    let tokensEarned = 0;

    if (pointsGained > 0) {
      tokensEarned = await calculateTokenReward(pointsGained);
    }

    // Actualizar en transacción
    const updated = await prisma.$transaction(async (tx) => {
      // Actualizar Regenmon
      const updated = await tx.registeredRegenmon.update({
        where: { id: data.regenmonId },
        data: {
          stats: data.stats,
          totalPoints: data.totalPoints,
          lastSynced: new Date(),
        },
      });

      // Crear snapshot
      await tx.snapshot.create({
        data: {
          regenmonId: data.regenmonId,
          balance: updated.balance,
          totalPoints: data.totalPoints,
          trainingHistory: data.trainingHistory,
        },
      });

      return updated;
    });

    // Otorgar tokens (fuera de transacción principal)
    let newBalance = updated.balance;
    if (tokensEarned > 0) {
      newBalance = await awardTokens(
        data.regenmonId,
        tokensEarned,
        `Training reward: ${pointsGained} points`,
        { pointsGained, trainingHistory: data.trainingHistory }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: newBalance,
        tokensEarned,
        totalPoints: data.totalPoints,
        lastSynced: updated.lastSynced,
      },
      message: "Sync successful",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- Sincronizar con puntos nuevos → Balance debe incrementar
- Sincronizar sin puntos nuevos → Balance no cambia
- Regenmon inexistente → 404 Not Found
- Stats inválidos → 400 Bad Request

---

## 🎫 TICKET 1.6: GET /api/regenmon/[id]

**Archivo:** `app/api/regenmon/[id]/route.ts`

**Descripción:** Endpoint para ver un Regenmon público + registrar visita (analytics).

**Criterios de Aceptación:**
- ✅ Buscar Regenmon por ID
- ✅ Registrar visita con IP, país (geo-location), referrer
- ✅ Contar total de visitas
- ✅ Retornar datos públicos del Regenmon
- ✅ Cache-Control: 60 segundos

**Request:**
```
GET /api/regenmon/clxxx
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "Pikachito",
    "ownerName": "Juan Pérez",
    "sprite": "https://...",
    "stage": 2,
    "stats": { "happiness": 80, "energy": 60, "hunger": 40 },
    "totalPoints": 150,
    "balance": 75,
    "totalVisits": 42,
    "registeredAt": "2025-01-01T00:00:00Z",
    "lastSynced": "2025-01-10T10:05:00Z"
  }
}
```

**Response (404):**
```json
{
  "error": "Regenmon not found"
}
```

**Código esperado:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError, ApiError } from "@/app/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Buscar Regenmon
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    });

    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found");
    }

    // Registrar visita (async - no bloquear response)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const referrer = req.headers.get("referer") || null;

    prisma.visit.create({
      data: {
        regenmonId: id,
        visitorIp: ip,
        referrer,
      },
    }).catch(console.error); // Fire and forget

    return NextResponse.json(
      {
        success: true,
        data: {
          id: regenmon.id,
          name: regenmon.name,
          ownerName: regenmon.ownerName,
          sprite: regenmon.sprite,
          stage: regenmon.stage,
          stats: regenmon.stats,
          totalPoints: regenmon.totalPoints,
          balance: regenmon.balance,
          totalVisits: regenmon._count.visits,
          registeredAt: regenmon.registeredAt,
          lastSynced: regenmon.lastSynced,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- GET con ID válido → 200 OK
- GET con ID inválido → 404 Not Found
- Verificar que se crea registro en tabla Visit

---

## 🎫 TICKET 1.7: GET /api/leaderboard

**Archivo:** `app/api/leaderboard/route.ts`

**Descripción:** Endpoint para obtener ranking de mejores Regenmons.

**Criterios de Aceptación:**
- ✅ Ordenar por `totalPoints` descendente
- ✅ Soportar paginación: `?page=1&limit=10`
- ✅ Solo incluir Regenmons activos (`isActive: true`)
- ✅ Retornar posición (rank) de cada Regenmon
- ✅ Cache-Control: 120 segundos

**Request:**
```
GET /api/leaderboard?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "id": "clxxx",
        "name": "Pikachito",
        "ownerName": "Juan",
        "totalPoints": 500,
        "balance": 250,
        "stage": 3,
        "sprite": "https://..."
      },
      {
        "rank": 2,
        "id": "clyyy",
        "name": "Charmander",
        "ownerName": "Ana",
        "totalPoints": 480,
        "balance": 240,
        "stage": 2,
        "sprite": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

**Código esperado:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError } from "@/app/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const skip = (page - 1) * limit;

    const [regenmons, total] = await Promise.all([
      prisma.registeredRegenmon.findMany({
        where: { isActive: true },
        orderBy: { totalPoints: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          ownerName: true,
          totalPoints: true,
          balance: true,
          stage: true,
          sprite: true,
        },
      }),
      prisma.registeredRegenmon.count({ where: { isActive: true } }),
    ]);

    const leaderboard = regenmons.map((r, index) => ({
      rank: skip + index + 1,
      ...r,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          leaderboard,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- GET sin parámetros → Retorna top 10
- GET con `?page=2&limit=5` → Retorna 5 resultados, del 6 al 10
- Verificar ordenamiento correcto por totalPoints

---

## 🎫 TICKET 1.8: GET /api/stats

**Archivo:** `app/api/stats/route.ts`

**Descripción:** Endpoint para obtener estadísticas globales del hub.

**Criterios de Aceptación:**
- ✅ Contar total de Regenmons registrados
- ✅ Sumar total de puntos acumulados
- ✅ Sumar total de tokens $FRUTA distribuidos
- ✅ Calcular promedio de stage
- ✅ Contar Regenmons activos
- ✅ Cache-Control: 300 segundos (5 minutos)

**Request:**
```
GET /api/stats
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRegenmons": 50,
    "activeRegenmons": 45,
    "totalPoints": 12500,
    "totalTokensDistributed": 6250,
    "averageStage": 1.8,
    "topRegenmon": {
      "name": "Pikachito",
      "points": 500
    }
  }
}
```

**Código esperado:**
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleApiError } from "@/app/lib/errors";

export async function GET() {
  try {
    const [
      totalRegenmons,
      activeRegenmons,
      aggregations,
      topRegenmon,
      tokenStats,
    ] = await Promise.all([
      prisma.registeredRegenmon.count(),
      prisma.registeredRegenmon.count({ where: { isActive: true } }),
      prisma.registeredRegenmon.aggregate({
        _sum: { totalPoints: true },
        _avg: { stage: true },
      }),
      prisma.registeredRegenmon.findFirst({
        orderBy: { totalPoints: "desc" },
        select: { name: true, totalPoints: true },
      }),
      prisma.tokenTransaction.aggregate({
        where: { type: "reward" },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalRegenmons,
          activeRegenmons,
          totalPoints: aggregations._sum.totalPoints || 0,
          totalTokensDistributed: tokenStats._sum.amount || 0,
          averageStage: Number(aggregations._avg.stage?.toFixed(1)) || 1,
          topRegenmon: topRegenmon
            ? { name: topRegenmon.name, points: topRegenmon.totalPoints }
            : null,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- GET → Retorna estadísticas correctas
- Verificar que los números coinciden con la DB

---

## 🎫 TICKET 1.9: POST /api/feed (Opcional)

**Archivo:** `app/api/feed/route.ts`

**Descripción:** Endpoint para alimentar Regenmon gastando 10 tokens $FRUTA.

**Criterios de Aceptación:**
- ✅ Validar body con `FeedRegenmonSchema`
- ✅ Verificar balance suficiente (≥10 tokens)
- ✅ Restar 10 tokens del balance
- ✅ Incrementar `hunger` stat en +20 (máx 100)
- ✅ Crear transacción de tipo "feed"
- ✅ Rate limiting: 10 requests/min por regenmonId
- ✅ Retornar stats y balance actualizados

**Request:**
```json
POST /api/feed
{
  "regenmonId": "clxxx",
  "action": "feed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": 65,
    "tokensSpent": 10,
    "stats": { "happiness": 80, "energy": 60, "hunger": 60 },
    "message": "Regenmon fed successfully"
  }
}
```

**Response (400 - Insufficient Balance):**
```json
{
  "error": "Insufficient balance. Need 10 $FRUTA tokens."
}
```

**Código esperado:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { FeedRegenmonSchema } from "@/app/lib/validations";
import { checkRateLimit } from "@/app/lib/ratelimit";
import { handleApiError, ApiError } from "@/app/lib/errors";
import { spendTokens, getTokenConfig } from "@/app/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FeedRegenmonSchema.parse(body);

    // Rate limiting
    const { success } = await checkRateLimit(`feed:${data.regenmonId}`);
    if (!success) {
      throw new ApiError(429, "Too many feed requests, please wait");
    }

    // Obtener configuración de costos
    const config = await getTokenConfig();
    const feedCost = config?.feedCost || 10;

    // Buscar Regenmon
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id: data.regenmonId },
    });

    if (!regenmon) {
      throw new ApiError(404, "Regenmon not found");
    }

    if (regenmon.balance < feedCost) {
      throw new ApiError(
        400,
        `Insufficient balance. Need ${feedCost} $FRUTA tokens.`
      );
    }

    // Actualizar stats (hunger +20, máx 100)
    const currentStats = regenmon.stats as any;
    const newHunger = Math.min((currentStats.hunger || 0) + 20, 100);
    const newStats = { ...currentStats, hunger: newHunger };

    // Gastar tokens y actualizar stats
    const newBalance = await spendTokens(
      data.regenmonId,
      feedCost,
      "Fed Regenmon",
      { hungerBefore: currentStats.hunger, hungerAfter: newHunger }
    );

    await prisma.registeredRegenmon.update({
      where: { id: data.regenmonId },
      data: { stats: newStats },
    });

    return NextResponse.json({
      success: true,
      data: {
        balance: newBalance,
        tokensSpent: feedCost,
        stats: newStats,
        message: "Regenmon fed successfully",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Prueba:**
- Feed con balance suficiente → 200 OK, hunger incrementa
- Feed con balance insuficiente → 400 Bad Request
- Verificar que se crea transacción en DB

---

## ✅ CRITERIOS DE FINALIZACIÓN DE FASE 1

- [ ] Todos los 9 tickets completados (1.0 - 1.9)
- [ ] Rate limiting funciona en todos los endpoints
- [ ] Todas las validaciones Zod funcionan correctamente
- [ ] Sistema de tokens $FRUTA opera sin errores
- [ ] Manejo de errores consistente en todas las APIs
- [ ] Pruebas manuales completadas para cada endpoint
- [ ] Documentación de APIs actualizada
- [ ] Variables de entorno verificadas en Vercel

---

## 📊 MÉTRICAS DE ÉXITO

- **Cobertura de Validación:** 100% de requests validados con Zod
- **Rate Limiting:** 100% de endpoints protegidos
- **Manejo de Errores:** 0 errores sin manejar (500 genéricos)
- **Performance:** Respuestas < 500ms (promedio)
- **Integridad de Datos:** 100% de operaciones atómicas con transacciones

---

## 🔄 SIGUIENTE FASE

**Fase 2: Frontend Público** (4 páginas)
1. Homepage con estadísticas globales
2. Página de registro de Regenmon
3. Leaderboard público
4. Página pública de cada Regenmon

---

**Última actualización:** 2025-01-10
**Estado:** Pendiente de inicio (0%)
