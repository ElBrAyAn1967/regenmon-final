# 🏗️ Infraestructura Regenmon - Plan de Implementación Completo

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Plan de Implementación por Fases](#plan-de-implementación-por-fases)
5. [Base de Datos - Schemas](#base-de-datos---schemas)
6. [APIs - Especificación Completa](#apis---especificación-completa)
7. [Dashboard de Admin](#dashboard-de-admin)
8. [Endpoints que el Estudiante debe Exponer](#endpoints-que-el-estudiante-debe-exponer)
9. [Checklist de Implementación](#checklist-de-implementación)

---

## 🎯 Visión General

### ¿Qué construimos?

**PORTAL CENTRAL DE REGENMON** - La infraestructura que permite que los Regenmons de todos los estudiantes se conecten en una red social.

### Flujo del Bootcamp

```
SESIONES 1-4: Estudiante construye LOCAL
┌──────────────────────────────────────┐
│ Cada estudiante crea su propia app   │
│ - Next.js + React + Tailwind         │
│ - localStorage para datos            │
│ - Su propia API key de Gemini        │
│ - Privy auth (TU App ID)             │
│ - Deploy en SU Vercel personal       │
│                                      │
│ NO interactúa con TU backend         │
└──────────────────────────────────────┘
              ↓
         SESIÓN 5
┌──────────────────────────────────────┐
│ Estudiante REGISTRA su Regenmon      │
│ en TU portal central                 │
│                                      │
│ https://regenmon-hub.vercel.app      │
│                                      │
│ ✅ Pega su URL                       │
│ ✅ Sistema valida                    │
│ ✅ Aparece en galería pública        │
│ ✅ Otros pueden ver su Regenmon      │
└──────────────────────────────────────┘
```

### Lo que NO construyes
- ❌ El frontend de los estudiantes (lo generan con v0.dev)
- ❌ Templates de código (solo prompts maestros)
- ❌ Sistema de autenticación de estudiantes (usan Privy con tu App ID)

---

## 🏛️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                  ESTUDIANTES (50)                        │
│                                                          │
│  App 1              App 2              App 3            │
│  juan.vercel.app    ana.vercel.app     pedro.vercel.app │
│  ├─ /api/           ├─ /api/           ├─ /api/         │
│  │  regenmon-data   │  regenmon-data   │  regenmon-data │
│  └─ /api/           └─ /api/           └─ /api/         │
│     regenmon-balance    regenmon-balance   regenmon-balance│
└─────────────────────────────────────────────────────────┘
                          ↓
                   (Se registran en)
                          ↓
┌─────────────────────────────────────────────────────────┐
│           TU PORTAL CENTRAL (Hub)                        │
│         https://regenmon-hub.vercel.app                  │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │  FRONTEND PÚBLICO                           │        │
│  ├─────────────────────────────────────────────┤        │
│  │  /register     - Formulario de registro     │        │
│  │  /gallery      - Galería de todos           │        │
│  │  /visit/:id    - Ver Regenmon (iFrame)      │        │
│  │  /admin        - Dashboard admin (protegido)│        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │  BACKEND (Next.js API Routes)               │        │
│  ├─────────────────────────────────────────────┤        │
│  │  POST /api/registry/validate                │        │
│  │  POST /api/registry/register                │        │
│  │  GET  /api/registry/all                     │        │
│  │  GET  /api/registry/:id                     │        │
│  │  POST /api/admin/manual-register            │        │
│  │  GET  /api/admin/stats                      │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │  BASE DE DATOS (Supabase PostgreSQL)        │        │
│  ├─────────────────────────────────────────────┤        │
│  │  - registered_regenmons                     │        │
│  │  - snapshots (balance, points)              │        │
│  │  - visits (analytics)                       │        │
│  │  - admin_logs                               │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI:** React 18+ + TypeScript
- **Styling:** Tailwind CSS
- **Componentes:** shadcn/ui (opcional)
- **Gráficas:** Chart.js o Recharts (para dashboard admin)

### Backend
- **API:** Next.js API Routes (`/app/api`)
- **Runtime:** Node.js 20+ (Vercel serverless)
- **Validación:** Zod (schemas de validación)

### Base de Datos
- **DB:** Supabase (PostgreSQL)
- **ORM:** Prisma o Drizzle ORM
- **Free Tier:** 500MB storage, 2GB bandwidth

### Autenticación & Seguridad
- **Admin Auth:** NextAuth.js con credenciales (contraseña maestra)
- **Rate Limiting:** Upstash Redis (free tier)
- **CORS:** Configurado para aceptar peticiones de `*.vercel.app`

### Hosting & Deploy
- **Frontend + Backend:** Vercel (free tier)
- **Dominio:** `regenmon-hub.vercel.app` (gratis)
- **CI/CD:** GitHub Actions + Vercel auto-deploy

### Monitoreo
- **Logs:** Vercel Logs (incluido gratis)
- **Errores:** Console.log básico
- **Analytics:** Opcional - Vercel Analytics

---

## 📅 Plan de Implementación por Fases

### **FASE 0: Setup Inicial** (Antes del bootcamp - 2-3 días)

#### Día 1: Configuración de proyecto
```bash
# 1. Crear repositorio
mkdir regenmon-hub
cd regenmon-hub
git init

# 2. Inicializar Next.js
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 3. Instalar dependencias
npm install @supabase/supabase-js
npm install prisma @prisma/client
npm install zod
npm install next-auth
npm install @upstash/redis @upstash/ratelimit
npm install recharts # para gráficas admin

# 4. Setup Prisma
npx prisma init
```

#### Día 2: Configuración de servicios externos

**A. Crear cuenta en Supabase**
1. Ir a https://supabase.com
2. Crear proyecto: `regenmon-hub`
3. Copiar:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `DATABASE_URL` (para Prisma)

**B. Configurar Privy (para dar App ID a estudiantes)**
1. Ir a https://privy.io
2. Crear app: `Regenmon Bootcamp`
3. Habilitar: Email login + Google OAuth
4. Copiar: `NEXT_PUBLIC_PRIVY_APP_ID`
5. Whitelist domains: `*.vercel.app`

**C. Crear cuenta en Upstash (rate limiting)**
1. Ir a https://upstash.com
2. Crear Redis database: `regenmon-ratelimit`
3. Copiar:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**D. Variables de entorno**
```env
# .env.local
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_PRIVY_APP_ID="clxxx..."
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="Axxx..."
ADMIN_PASSWORD="bootcamp2025_secure"
NEXTAUTH_SECRET="generate-random-string-here"
NEXTAUTH_URL="https://regenmon-hub.vercel.app"
```

#### Día 3: Setup de base de datos

**Crear schema Prisma:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model RegisteredRegenmon {
  id              String   @id @default(cuid())
  appUrl          String   @unique
  name            String
  ownerName       String
  ownerEmail      String?
  sprite          String
  stage           Int      @default(1)
  stats           Json     // { happiness, energy, hunger }
  totalPoints     Int      @default(0)
  balance         Int      @default(0)
  privyUserId     String?

  // Metadata
  registeredAt    DateTime @default(now())
  lastSynced      DateTime @default(now())
  isActive        Boolean  @default(true)

  // Relaciones
  snapshots       Snapshot[]
  visits          Visit[]

  @@index([registeredAt])
  @@index([totalPoints])
}

model Snapshot {
  id              String   @id @default(cuid())
  regenmonId      String
  regenmon        RegisteredRegenmon @relation(fields: [regenmonId], references: [id], onDelete: Cascade)

  balance         Int
  totalPoints     Int
  trainingHistory Json     // Array de evaluaciones

  createdAt       DateTime @default(now())

  @@index([regenmonId, createdAt])
}

model Visit {
  id              String   @id @default(cuid())
  regenmonId      String
  regenmon        RegisteredRegenmon @relation(fields: [regenmonId], references: [id], onDelete: Cascade)

  visitorIp       String?
  visitorCountry  String?
  referrer        String?

  createdAt       DateTime @default(now())

  @@index([regenmonId, createdAt])
}

model AdminLog {
  id              String   @id @default(cuid())
  action          String   // "manual_register", "delete", "update"
  details         Json
  adminIp         String?

  createdAt       DateTime @default(now())

  @@index([createdAt])
}
```

**Ejecutar migración:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### **FASE 1: Backend - APIs de Registro** (1-2 días)

#### API 1: Validar URL de estudiante
**Endpoint:** `POST /api/registry/validate`

**Propósito:** Verificar que la URL del estudiante sea válida y tenga los endpoints necesarios.

**Código:**
```typescript
// app/api/registry/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  appUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appUrl } = schema.parse(body);

    // 1. Verificar que la URL responda
    const testResponse = await fetch(appUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 segundos timeout
    });

    if (!testResponse.ok) {
      return NextResponse.json(
        { error: 'La URL no responde. Verifica que tu app esté desplegada.' },
        { status: 400 }
      );
    }

    // 2. Verificar endpoint /api/regenmon-data
    const dataResponse = await fetch(`${appUrl}/api/regenmon-data`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!dataResponse.ok) {
      return NextResponse.json(
        {
          error: 'No se encontró el endpoint /api/regenmon-data. Asegúrate de haberlo creado en tu app.',
          hint: 'Revisa el Prompt Maestro de Sesión 4'
        },
        { status: 400 }
      );
    }

    const regenmonData = await dataResponse.json();

    // 3. Validar estructura de datos
    const dataSchema = z.object({
      name: z.string(),
      sprite: z.string(),
      stage: z.number().min(1).max(3),
      stats: z.object({
        happiness: z.number(),
        energy: z.number(),
        hunger: z.number(),
      }),
      totalPoints: z.number(),
      userId: z.string(),
      owner: z.string(),
    });

    const validatedData = dataSchema.parse(regenmonData);

    // 4. Verificar endpoint /api/regenmon-balance
    const balanceResponse = await fetch(`${appUrl}/api/regenmon-balance`, {
      signal: AbortSignal.timeout(5000)
    });

    let balanceData = null;
    if (balanceResponse.ok) {
      balanceData = await balanceResponse.json();
    }

    return NextResponse.json({
      valid: true,
      data: validatedData,
      balance: balanceData,
      message: '✅ Tu Regenmon está listo para ser registrado'
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos en tu endpoint',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al validar la URL: ' + error.message },
      { status: 500 }
    );
  }
}
```

---

#### API 2: Registrar Regenmon
**Endpoint:** `POST /api/registry/register`

**Propósito:** Registrar el Regenmon del estudiante en la base de datos.

**Código:**
```typescript
// app/api/registry/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting: 5 intentos por hora por IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});

const schema = z.object({
  appUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera 1 hora.' },
        { status: 429 }
      );
    }

    // 2. Validar input
    const body = await req.json();
    const { appUrl } = schema.parse(body);

    // 3. Verificar si ya está registrado
    const existing = await prisma.registeredRegenmon.findUnique({
      where: { appUrl }
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'Este Regenmon ya está registrado',
          regenmonId: existing.id,
          registeredAt: existing.registeredAt
        },
        { status: 400 }
      );
    }

    // 4. Fetch datos del estudiante
    const dataResponse = await fetch(`${appUrl}/api/regenmon-data`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!dataResponse.ok) {
      return NextResponse.json(
        { error: 'No se pudo obtener los datos del Regenmon' },
        { status: 400 }
      );
    }

    const regenmonData = await dataResponse.json();

    // 5. Fetch balance (opcional)
    let balance = 0;
    let trainingHistory = [];

    try {
      const balanceResponse = await fetch(`${appUrl}/api/regenmon-balance`, {
        signal: AbortSignal.timeout(5000)
      });

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        balance = balanceData.balance || 0;
        trainingHistory = balanceData.trainingHistory || [];
      }
    } catch (e) {
      console.warn('No se pudo obtener balance, usando 0');
    }

    // 6. Crear registro en DB
    const registered = await prisma.registeredRegenmon.create({
      data: {
        appUrl,
        name: regenmonData.name,
        ownerName: regenmonData.owner,
        sprite: regenmonData.sprite,
        stage: regenmonData.stage,
        stats: regenmonData.stats,
        totalPoints: regenmonData.totalPoints,
        balance,
        privyUserId: regenmonData.userId,
        snapshots: {
          create: {
            balance,
            totalPoints: regenmonData.totalPoints,
            trainingHistory,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      regenmonId: registered.id,
      message: '🎉 ¡Tu Regenmon ha sido registrado!',
      profileUrl: `/visit/${registered.id}`,
      galleryUrl: '/gallery'
    });

  } catch (error: any) {
    console.error('Error al registrar:', error);
    return NextResponse.json(
      { error: 'Error al registrar: ' + error.message },
      { status: 500 }
    );
  }
}
```

---

#### API 3: Obtener todos los Regenmons (Galería)
**Endpoint:** `GET /api/registry/all`

**Código:**
```typescript
// app/api/registry/all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, points, stage
    const search = searchParams.get('search') || '';

    let orderBy: any = { registeredAt: 'desc' };

    if (sortBy === 'points') {
      orderBy = { totalPoints: 'desc' };
    } else if (sortBy === 'stage') {
      orderBy = { stage: 'desc' };
    }

    const regenmons = await prisma.registeredRegenmon.findMany({
      where: {
        isActive: true,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { ownerName: { contains: search, mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy,
      select: {
        id: true,
        name: true,
        ownerName: true,
        sprite: true,
        stage: true,
        totalPoints: true,
        registeredAt: true,
        appUrl: true,
        _count: {
          select: { visits: true }
        }
      }
    });

    return NextResponse.json({
      total: regenmons.length,
      regenmons: regenmons.map(r => ({
        ...r,
        visitCount: r._count.visits
      }))
    });

  } catch (error: any) {
    console.error('Error al obtener regenmons:', error);
    return NextResponse.json(
      { error: 'Error al cargar la galería' },
      { status: 500 }
    );
  }
}
```

---

#### API 4: Obtener Regenmon específico
**Endpoint:** `GET /api/registry/:id`

**Código:**
```typescript
// app/api/registry/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const regenmon = await prisma.registeredRegenmon.findUnique({
      where: { id: params.id },
      include: {
        snapshots: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { visits: true }
        }
      }
    });

    if (!regenmon) {
      return NextResponse.json(
        { error: 'Regenmon no encontrado' },
        { status: 404 }
      );
    }

    // Registrar visita
    const visitorIp = req.headers.get('x-forwarded-for') ?? 'unknown';

    await prisma.visit.create({
      data: {
        regenmonId: params.id,
        visitorIp,
      }
    });

    return NextResponse.json({
      ...regenmon,
      visitCount: regenmon._count.visits,
      latestSnapshot: regenmon.snapshots[0] || null
    });

  } catch (error: any) {
    console.error('Error al obtener regenmon:', error);
    return NextResponse.json(
      { error: 'Error al cargar el Regenmon' },
      { status: 500 }
    );
  }
}
```

---

#### API 5: Registro manual por admin
**Endpoint:** `POST /api/admin/manual-register`

**Código:**
```typescript
// app/api/admin/manual-register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  appUrl: z.string().url(),
  name: z.string(),
  ownerName: z.string(),
  ownerEmail: z.string().email().optional(),
  sprite: z.string(),
  stage: z.number().min(1).max(3),
  totalPoints: z.number(),
  balance: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticación de admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // 2. Validar datos
    const body = await req.json();
    const data = schema.parse(body);

    // 3. Verificar si ya existe
    const existing = await prisma.registeredRegenmon.findUnique({
      where: { appUrl: data.appUrl }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un Regenmon con esta URL' },
        { status: 400 }
      );
    }

    // 4. Crear registro
    const registered = await prisma.registeredRegenmon.create({
      data: {
        appUrl: data.appUrl,
        name: data.name,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        sprite: data.sprite,
        stage: data.stage,
        totalPoints: data.totalPoints,
        balance: data.balance,
        stats: { happiness: 100, energy: 100, hunger: 0 },
        snapshots: {
          create: {
            balance: data.balance,
            totalPoints: data.totalPoints,
            trainingHistory: []
          }
        }
      }
    });

    // 5. Log de admin
    await prisma.adminLog.create({
      data: {
        action: 'manual_register',
        details: {
          regenmonId: registered.id,
          appUrl: data.appUrl,
          name: data.name
        },
        adminIp: req.headers.get('x-forwarded-for') ?? 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      regenmonId: registered.id,
      message: 'Regenmon registrado manualmente'
    });

  } catch (error: any) {
    console.error('Error en registro manual:', error);
    return NextResponse.json(
      { error: 'Error: ' + error.message },
      { status: 500 }
    );
  }
}
```

---

#### API 6: Stats para admin
**Endpoint:** `GET /api/admin/stats`

**Código:**
```typescript
// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Stats generales
    const [
      totalRegenmons,
      totalVisits,
      regenmonsByStage,
      recentRegistrations,
      topRegenmons
    ] = await Promise.all([
      // Total de regenmons
      prisma.registeredRegenmon.count(),

      // Total de visitas
      prisma.visit.count(),

      // Por etapa
      prisma.registeredRegenmon.groupBy({
        by: ['stage'],
        _count: true
      }),

      // Últimos 10 registros
      prisma.registeredRegenmon.findMany({
        orderBy: { registeredAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          ownerName: true,
          registeredAt: true,
          stage: true
        }
      }),

      // Top 10 por puntos
      prisma.registeredRegenmon.findMany({
        orderBy: { totalPoints: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          ownerName: true,
          totalPoints: true,
          stage: true,
          sprite: true
        }
      })
    ]);

    // Visitas en últimas 24h
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const visitsLast24h = await prisma.visit.count({
      where: {
        createdAt: { gte: yesterday }
      }
    });

    return NextResponse.json({
      totalRegenmons,
      totalVisits,
      visitsLast24h,
      byStage: regenmonsByStage.reduce((acc, { stage, _count }) => {
        acc[`stage${stage}`] = _count;
        return acc;
      }, {} as Record<string, number>),
      recentRegistrations,
      topRegenmons
    });

  } catch (error: any) {
    console.error('Error al obtener stats:', error);
    return NextResponse.json(
      { error: 'Error al cargar estadísticas' },
      { status: 500 }
    );
  }
}
```

---

### **FASE 2: Frontend Público** (2-3 días)

#### Página 1: Home/Landing
**Ruta:** `/`

**Contenido:**
```tsx
// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">
            🌱 Regenmon Hub
          </h1>
          <p className="text-xl text-gray-600">
            La comunidad de mascotas regenerativas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/register"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">Registra tu Regenmon</h2>
            <p className="text-gray-600">
              Haz que tu Regenmon sea público y únete a la comunidad
            </p>
          </Link>

          <Link
            href="/gallery"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Explorar Galería</h2>
            <p className="text-gray-600">
              Descubre y visita otros Regenmons de la comunidad
            </p>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white px-8 py-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Parte del <strong>Regenmon Bootcamp</strong> by Frutero
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

#### Página 2: Registro
**Ruta:** `/register`

**Componente:**
```tsx
// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [appUrl, setAppUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationData, setValidationData] = useState<any>(null);

  const handleValidate = async () => {
    setLoading(true);
    setError('');
    setValidationData(null);

    try {
      const res = await fetch('/api/registry/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al validar');
        return;
      }

      setValidationData(data);
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/registry/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }

      // Redirect a la galería con mensaje de éxito
      router.push(`/visit/${data.regenmonId}?registered=true`);
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          📝 Registra tu Regenmon
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              URL de tu Regenmon
            </label>
            <input
              type="url"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://mi-regenmon-juan.vercel.app"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Pega la URL de tu app desplegada en Vercel
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {validationData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-800 mb-2">
                ✅ Validación exitosa
              </h3>
              <div className="space-y-1 text-sm">
                <p>Nombre: <strong>{validationData.data.name}</strong></p>
                <p>Sprite: {validationData.data.sprite}</p>
                <p>Etapa: {validationData.data.stage}</p>
                <p>Puntos: {validationData.data.totalPoints}</p>
                {validationData.balance && (
                  <p>Balance: {validationData.balance.balance} $FRUTA</p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!validationData ? (
              <button
                onClick={handleValidate}
                disabled={loading || !appUrl}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Validando...' : '🔍 Validar URL'}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Registrando...' : '✅ Registrar en la Galería'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold mb-2">📧 ¿Problemas para registrar?</h3>
          <p className="text-sm mb-2">
            Si el auto-registro no funciona, envía un correo a:
          </p>
          <p className="font-mono text-sm bg-white px-3 py-2 rounded border">
            registro@frutero.club
          </p>
          <p className="text-sm mt-2 text-gray-600">
            Incluye: tu nombre, URL de tu Regenmon y una captura de pantalla.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

#### Página 3: Galería
**Ruta:** `/gallery`

**Componente:**
```tsx
// app/gallery/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  const [regenmons, setRegenmons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');

  const fetchRegenmons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/registry/all?sortBy=${sortBy}&search=${search}`);
      const data = await res.json();
      setRegenmons(data.regenmons);
    } catch (err) {
      console.error('Error al cargar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegenmons();
  }, [sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegenmons();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🌍 Comunidad Regenmon
        </h1>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o dueño..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </form>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="newest">Más nuevos</option>
              <option value="points">Más puntos</option>
              <option value="stage">Mayor etapa</option>
            </select>
          </div>

          <div className="mt-4 text-center text-gray-600">
            <strong>{regenmons.length}</strong> Regenmons públicos
          </div>
        </div>

        {/* Grid de Regenmons */}
        {loading ? (
          <div className="text-center">
            <p>Cargando...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regenmons.map((regenmon) => (
              <Link
                key={regenmon.id}
                href={`/visit/${regenmon.id}`}
                className="bg-white rounded-xl shadow hover:shadow-xl transition p-6"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{regenmon.sprite}</div>
                  <h3 className="font-bold text-lg">{regenmon.name}</h3>
                  <p className="text-sm text-gray-600">{regenmon.ownerName}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Etapa:</span>
                    <strong>{regenmon.stage}/3</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Puntos:</span>
                    <strong>{regenmon.totalPoints}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Visitas:</span>
                    <strong>{regenmon.visitCount}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t text-center">
                  <span className="text-blue-600 text-sm font-medium">
                    👁️ Ver Regenmon
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && regenmons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No se encontraron Regenmons. ¡Sé el primero en registrar!
            </p>
            <Link href="/register" className="text-blue-600 hover:underline mt-2 inline-block">
              Registrar mi Regenmon →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

#### Página 4: Vista de Regenmon (con iFrame)
**Ruta:** `/visit/[id]`

**Componente:**
```tsx
// app/visit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VisitPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [regenmon, setRegenmon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const registered = searchParams.get('registered') === 'true';

  useEffect(() => {
    const fetchRegenmon = async () => {
      try {
        const res = await fetch(`/api/registry/${params.id}`);
        const data = await res.json();
        setRegenmon(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegenmon();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!regenmon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Regenmon no encontrado</p>
          <Link href="/gallery" className="text-blue-600 hover:underline">
            ← Volver a la galería
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {registered && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              🎉 ¡Tu Regenmon ha sido registrado exitosamente!
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {regenmon.sprite} {regenmon.name}
                </h1>
                <p className="opacity-90">por {regenmon.ownerName}</p>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Etapa</div>
                <div className="text-4xl font-bold">{regenmon.stage}/3</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {regenmon.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Puntos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {regenmon.balance}
              </div>
              <div className="text-sm text-gray-600">$FRUTA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {regenmon.visitCount}
              </div>
              <div className="text-sm text-gray-600">Visitas</div>
            </div>
          </div>

          {/* iFrame del Regenmon del estudiante */}
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">🌱 Regenmon en Vivo</h2>
            <div className="border-4 border-gray-200 rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={regenmon.appUrl}
                className="w-full h-[600px]"
                title={`Regenmon de ${regenmon.ownerName}`}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Estás viendo el Regenmon de {regenmon.ownerName} en vivo desde su app
            </p>
          </div>

          {/* Acciones sociales (opcional - simplificado) */}
          <div className="p-6 border-t bg-gray-50">
            <h3 className="font-bold mb-4">👋 Interactuar</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setMessage('¡Hola! 👋')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                👋 Saludar
              </button>
              <a
                href={regenmon.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-center"
              >
                🔗 Visitar App
              </a>
            </div>

            {message && (
              <div className="mt-4 p-3 bg-white border rounded-lg">
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/gallery" className="text-blue-600 hover:underline">
            ← Volver a la galería
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

### **FASE 3: Dashboard de Admin** (2 días)

#### Setup de NextAuth
**Archivo:** `lib/auth.ts`

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: 'admin', name: 'Admin', email: 'admin@regenmon.hub' };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};
```

**API Route:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

#### Página de Login Admin
**Ruta:** `/admin/login`

```tsx
// app/admin/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      password,
      redirect: false
    });

    if (result?.error) {
      setError('Contraseña incorrecta');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🔒 Admin Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

#### Dashboard Principal
**Ruta:** `/admin`

```tsx
// app/admin/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
```

**Componente:**
```tsx
// components/AdminDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };

    fetchStats();

    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎓 Regenmon Admin</h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold">{stats.totalRegenmons}</div>
            <div className="text-sm text-gray-600">Regenmons Registrados</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">👁️</div>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <div className="text-sm text-gray-600">Total Visitas</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold">{stats.visitsLast24h}</div>
            <div className="text-sm text-gray-600">Visitas (24h)</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">🌳</div>
            <div className="text-2xl font-bold">{stats.byStage?.stage3 || 0}</div>
            <div className="text-sm text-gray-600">Etapa 3</div>
          </div>
        </div>

        {/* Por Etapa */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📊 Distribución por Etapa</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Etapa 1</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.byStage?.stage1 || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Etapa 2</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.byStage?.stage2 || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Etapa 3</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.byStage?.stage3 || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Top Regenmons */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🏆 Top Regenmons</h2>
          <div className="space-y-3">
            {stats.topRegenmons.map((r: any, idx: number) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                  <div className="text-3xl">{r.sprite}</div>
                  <div>
                    <div className="font-bold">{r.name}</div>
                    <div className="text-sm text-gray-600">{r.ownerName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{r.totalPoints} pts</div>
                  <div className="text-sm text-gray-600">Etapa {r.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registros Recientes */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">📝 Registros Recientes</h2>
          <div className="space-y-2">
            {stats.recentRegistrations.map((r: any) => (
              <div key={r.id} className="flex justify-between p-3 border-b last:border-0">
                <div>
                  <span className="font-bold">{r.name}</span>
                  <span className="text-gray-600"> - {r.ownerName}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(r.registeredAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario de registro manual */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">➕ Registro Manual</h2>
          <p className="text-sm text-gray-600 mb-4">
            Si un estudiante tiene problemas con el auto-registro, usa este formulario.
          </p>
          <a
            href="/admin/manual-register"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir al formulario →
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Base de Datos - Schemas

Ya definido en **FASE 0**, pero aquí el resumen:

```
RegisteredRegenmon
├─ id (cuid)
├─ appUrl (unique)
├─ name
├─ ownerName
├─ ownerEmail
├─ sprite
├─ stage
├─ stats (JSON)
├─ totalPoints
├─ balance
├─ privyUserId
├─ registeredAt
├─ lastSynced
├─ isActive
└─ relaciones: snapshots[], visits[]

Snapshot
├─ id
├─ regenmonId
├─ balance
├─ totalPoints
├─ trainingHistory (JSON)
└─ createdAt

Visit
├─ id
├─ regenmonId
├─ visitorIp
├─ visitorCountry
├─ referrer
└─ createdAt

AdminLog
├─ id
├─ action
├─ details (JSON)
├─ adminIp
└─ createdAt
```

---

## 🔌 Endpoints que el Estudiante debe Exponer

**Los estudiantes deben crear estos endpoints en SU app (generados con prompts en Sesión 4):**

### Endpoint 1: `/api/regenmon-data`
**Método:** GET
**Autenticación:** No requerida (público)

**Respuesta esperada:**
```json
{
  "name": "Leafy",
  "sprite": "🌱",
  "stage": 2,
  "stats": {
    "happiness": 80,
    "energy": 60,
    "hunger": 40
  },
  "totalPoints": 520,
  "userId": "privy:did:xxx",
  "owner": "Juan Pérez"
}
```

---

### Endpoint 2: `/api/regenmon-balance`
**Método:** GET
**Autenticación:** No requerida (público)

**Respuesta esperada:**
```json
{
  "balance": 142,
  "totalPoints": 520,
  "trainingHistory": [
    {
      "score": 85,
      "category": "impact",
      "feedback": "¡Increíble acción! Plantar árboles...",
      "timestamp": "2025-02-05T10:30:00Z"
    },
    {
      "score": 72,
      "category": "personal",
      "feedback": "Buen progreso en tu aprendizaje...",
      "timestamp": "2025-02-04T15:20:00Z"
    }
  ]
}
```

**Nota:** `trainingHistory` puede incluir o no las imágenes (base64). Si las incluye, el array será más pesado. Recomendación: solo metadata (sin imágenes).

---

## ✅ Checklist de Implementación

### Pre-bootcamp (1 semana antes)

**Infraestructura:**
- [ ] Repositorio creado en GitHub
- [ ] Next.js proyecto inicializado
- [ ] Supabase proyecto creado
- [ ] Privy cuenta creada y configurada
- [ ] Upstash Redis creado
- [ ] Variables de entorno configuradas
- [ ] Base de datos con Prisma migrada
- [ ] Deploy inicial a Vercel

**APIs Backend:**
- [ ] POST /api/registry/validate - funcionando
- [ ] POST /api/registry/register - funcionando
- [ ] GET /api/registry/all - funcionando
- [ ] GET /api/registry/:id - funcionando
- [ ] POST /api/admin/manual-register - funcionando
- [ ] GET /api/admin/stats - funcionando
- [ ] Rate limiting configurado

**Frontend Público:**
- [ ] Página home (/) - funcionando
- [ ] Página /register - funcionando
- [ ] Página /gallery - funcionando
- [ ] Página /visit/:id con iFrame - funcionando

**Dashboard Admin:**
- [ ] NextAuth configurado
- [ ] Página /admin/login - funcionando
- [ ] Página /admin - dashboard completo
- [ ] Stats en tiempo real
- [ ] Formulario de registro manual

**Testing:**
- [ ] Probar registro con URL de prueba
- [ ] Probar galería con 3+ Regenmons de prueba
- [ ] Probar iFrame con app de ejemplo
- [ ] Probar admin login
- [ ] Probar stats en dashboard
- [ ] Probar registro manual

**Documentación:**
- [ ] README con instrucciones de setup
- [ ] Documentación de APIs para estudiantes
- [ ] Guía de troubleshooting
- [ ] Credenciales admin documentadas (seguras)

---

### Durante el Bootcamp

**Semana 1 (Sesiones 1-3):**
- [ ] Compartir NEXT_PUBLIC_PRIVY_APP_ID con estudiantes
- [ ] Monitorear que Privy esté funcionando
- [ ] NO hay interacción con tu backend aún

**Semana 2 - Sesión 4:**
- [ ] Compartir documentación de endpoints que deben crear
- [ ] Prompts Maestros listos para Sesión 4
- [ ] Validar que los estudiantes creen `/api/regenmon-data`
- [ ] Validar que los estudiantes creen `/api/regenmon-balance`

**Semana 2 - Sesión 5:**
- [ ] Portal de registro activo y funcionando
- [ ] Dashboard admin monitoreando registros en vivo
- [ ] Soporte activo para estudiantes con problemas
- [ ] Registro manual disponible como backup
- [ ] Galería pública funcionando
- [ ] Celebrar cuando todos estén registrados 🎉

---

### Post-bootcamp

**Mantenimiento:**
- [ ] Backup de base de datos
- [ ] Exportar lista de todos los Regenmons (CSV)
- [ ] Screenshots de la galería completa
- [ ] Análisis de stats finales
- [ ] Feedback de estudiantes
- [ ] Documentar mejoras para próximo bootcamp

---

## 🚀 Deployment

### Vercel Setup

1. **Conectar repo a Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

2. **Variables de entorno en Vercel:**
- Ir a Settings → Environment Variables
- Agregar todas las variables del `.env.local`
- Marcar como "Production"

3. **Custom domain (opcional):**
- Agregar dominio en Vercel
- O usar: `regenmon-hub.vercel.app`

---

## 📞 Soporte y Troubleshooting

### Problemas Comunes

**1. "No se encuentra el endpoint /api/regenmon-data"**
- Causa: Estudiante no creó el endpoint
- Solución: Verificar que usó el Prompt Maestro de Sesión 4
- Backup: Registro manual

**2. "CORS error al validar URL"**
- Causa: App del estudiante bloquea fetch externo
- Solución: Agregar headers CORS en su API:
```typescript
export async function GET(req: NextRequest) {
  const response = NextResponse.json({ /* data */ });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

**3. "Rate limit exceeded"**
- Causa: Demasiados intentos de registro
- Solución: Esperar 1 hora o ajustar límite en código

**4. "iFrame no carga la app"**
- Causa: Política de seguridad del navegador
- Solución: Verificar que la app del estudiante no bloquee iFrames
- Alternativa: Botón "Abrir en nueva pestaña"

---

## 🎉 Fin del Documento

Este plan cubre **TODO** lo que necesitas construir para que el bootcamp funcione. Cualquier duda, revisa las secciones específicas o consulta el código de ejemplo.

**Próximos pasos:**
1. Ejecutar FASE 0 (setup inicial)
2. Implementar FASE 1 (backend APIs)
3. Implementar FASE 2 (frontend público)
4. Implementar FASE 3 (dashboard admin)
5. Testing completo
6. ¡Lanzar el bootcamp! 🚀

---

**Documento generado el:** 2025-02-05
**Versión:** 1.0
**Autor:** Infraestructura Regenmon - Frutero Bootcamp
