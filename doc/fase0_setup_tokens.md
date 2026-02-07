# 🎫 FASE 0: Tokens de Desarrollo - Setup Inicial

**Proyecto:** Regenmon Hub
**Carpeta:** `/home/brianweb3/Frutero/Regenmon`
**Estado:** ✅ Repositorio creado | 🔄 En configuración

---

## ✅ COMPLETADO

- [x] Repositorio GitHub creado
- [x] Carpeta del proyecto lista: `/home/brianweb3/Frutero/Regenmon`

---

## 📋 CHECKLIST DE FASE 0

### 🗓️ DÍA 1: Configuración del Proyecto (2-3 horas)

#### ✅ Token 1: Inicializar Next.js
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
cd /home/brianweb3/Frutero/Regenmon
npx create-next-app@latest . --typescript --tailwind --app --src-dir
```

**Preguntas que te hará (responde así):**
```
✔ Would you like to use ESLint? → Yes
✔ Would you like to use `src/` directory? → Yes (ya incluido en comando)
✔ Would you like to use App Router? → Yes (ya incluido en comando)
✔ Would you like to customize the default import alias? → No
```

**Verificación:**
```bash
ls -la
# Debes ver:
# - package.json
# - tsconfig.json
# - tailwind.config.ts
# - src/app/
# - node_modules/
```

**Resultado esperado:**
- ✅ Proyecto Next.js 14 con TypeScript
- ✅ Tailwind CSS configurado
- ✅ App Router activado
- ✅ Carpeta `src/` creada

---

#### ✅ Token 2: Instalar Dependencias Core
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
npm install @supabase/supabase-js prisma @prisma/client zod next-auth
```

**Tiempo estimado:** 2-3 minutos

**Verificación:**
```bash
cat package.json | grep -E "@supabase|prisma|zod|next-auth"
```

**Resultado esperado:**
```json
"@supabase/supabase-js": "^2.x.x",
"prisma": "^5.x.x",
"@prisma/client": "^5.x.x",
"zod": "^3.x.x",
"next-auth": "^4.x.x"
```

---

#### ✅ Token 3: Instalar Dependencias Adicionales
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
npm install @upstash/redis @upstash/ratelimit recharts
```

**Tiempo estimado:** 1-2 minutos

**Verificación:**
```bash
cat package.json | grep -E "@upstash|recharts"
```

**Resultado esperado:**
```json
"@upstash/redis": "^1.x.x",
"@upstash/ratelimit": "^1.x.x",
"recharts": "^2.x.x"
```

---

#### ✅ Token 4: Inicializar Prisma
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
npx prisma init
```

**Resultado esperado:**
```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.
```

**Verificación:**
```bash
ls -la prisma/
# Debes ver:
# - schema.prisma
```

**Archivos creados:**
- ✅ `prisma/schema.prisma`
- ✅ `.env` (Prisma lo crea automáticamente)

**⚠️ IMPORTANTE:** Prisma crea `.env` pero nosotros usaremos `.env.local` (Next.js standard)

---

#### ✅ Token 5: Crear estructura de carpetas
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
mkdir -p src/lib src/components
```

**Verificación:**
```bash
tree src -L 1
# src/
# ├── app/
# ├── lib/
# └── components/
```

**Resultado esperado:**
- ✅ `src/lib/` para utilidades (prisma, auth)
- ✅ `src/components/` para componentes React

---

### 🗓️ DÍA 2: Crear Cuentas en Servicios Externos (1-2 horas)

#### ✅ Token 6: Crear cuenta en Supabase
**Estado:** 🔄 PENDIENTE

**Pasos:**
1. Ir a: https://supabase.com
2. Click en **"Start your project"**
3. Sign up con GitHub (recomendado) o Email
4. Click en **"New Project"**

**Configuración del proyecto:**
```
Project name: regenmon-hub
Database Password: [GENERA UNA SEGURA - GUÁRDALA]
Region: South America (sao) o US East (us-east-1)
Pricing Plan: Free
```

5. Click en **"Create new project"**
6. ⏳ Espera ~2 minutos

**📋 COPIAR ESTOS 3 DATOS:**

Ir a **Settings → API**

```
# 1. Project URL
SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"

# 2. Project API keys → anon/public
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc..."
```

Ir a **Settings → Database → Connection String → URI**

```
# 3. Connection string (para Prisma)
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**⚠️ REEMPLAZA `[YOUR-PASSWORD]` con la contraseña que generaste**

**Guardar en archivo temporal:**
```bash
# Crear archivo para guardar credenciales temporalmente
nano ~/supabase-credentials.txt
# Pega los 3 valores
# Ctrl+O (guardar), Ctrl+X (salir)
```

---

#### ✅ Token 7: Crear cuenta en Privy
**Estado:** 🔄 PENDIENTE

**Pasos:**
1. Ir a: https://privy.io
2. Click en **"Start Building"**
3. Sign up con Email
4. Verificar email
5. Click en **"Create your first app"**

**Configuración del app:**
```
App name: Regenmon Bootcamp
```

6. Click en **"Create app"**

**Configurar métodos de login:**

7. Ir a **Settings → Login methods**
   - ✅ Activar **Email**
   - ✅ Activar **Google** (OAuth)

8. Ir a **Settings → Domains**
   - Click en **"Add domain"**
   - Agregar: `*.vercel.app`
   - Agregar: `localhost`

**📋 COPIAR ESTE DATO:**

Ir a **Settings → Basics**

```
# App ID
NEXT_PUBLIC_PRIVY_APP_ID="clpxxxxxxxxxxxxxxxxxxxxx"
```

**Guardar:**
```bash
echo "NEXT_PUBLIC_PRIVY_APP_ID=clpxxxxxxxxxxxxxxxxxxxxx" >> ~/supabase-credentials.txt
```

---

#### ✅ Token 8: Crear cuenta en Upstash
**Estado:** 🔄 PENDIENTE

**Pasos:**
1. Ir a: https://upstash.com
2. Click en **"Get Started"**
3. Sign up con GitHub o Email
4. Click en **"Create Database"**

**Configuración de Redis:**
```
Name: regenmon-ratelimit
Type: Redis
Region: us-east-1 (o el más cercano a ti)
Eviction: No eviction
```

5. Click en **"Create"**

**📋 COPIAR ESTOS 2 DATOS:**

En tu database → **Details** tab

```
# Endpoint
UPSTASH_REDIS_REST_URL="https://xxxxxxxx-xxxxx.upstash.io"

# REST Token
UPSTASH_REDIS_REST_TOKEN="AYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Guardar:**
```bash
echo "UPSTASH_REDIS_REST_URL=https://..." >> ~/supabase-credentials.txt
echo "UPSTASH_REDIS_REST_TOKEN=AYxxx..." >> ~/supabase-credentials.txt
```

---

#### ✅ Token 9: Crear archivo `.env.local`
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
cd /home/brianweb3/Frutero/Regenmon
nano .env.local
```

**Pega este contenido (REEMPLAZA los valores con los que copiaste):**

```env
# ==============================================
# SUPABASE (Base de Datos PostgreSQL)
# ==============================================
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==============================================
# PRIVY (Autenticación de Estudiantes)
# ==============================================
NEXT_PUBLIC_PRIVY_APP_ID="clpxxxxxxxxxxxxxxxxxxxxx"

# ==============================================
# UPSTASH (Rate Limiting)
# ==============================================
UPSTASH_REDIS_REST_URL="https://xxxxxxxx-xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ==============================================
# ADMIN (Autenticación del Dashboard)
# ==============================================
ADMIN_PASSWORD="Bootcamp2025_Regenmon_Secure!"

# ==============================================
# NEXTAUTH (Sistema de Autenticación)
# ==============================================
NEXTAUTH_SECRET="GENERA_STRING_AQUI_32_CARACTERES_MINIMO"
NEXTAUTH_URL="http://localhost:3000"
```

**Guardar:** Ctrl+O, Enter, Ctrl+X

---

#### ✅ Token 10: Generar NEXTAUTH_SECRET
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
openssl rand -base64 32
```

**Resultado (ejemplo):**
```
X8vK9mPqL7nRtYwU3aZbC5dE6fG1hJ2iK0
```

**Actualizar `.env.local`:**
```bash
nano .env.local
# Busca la línea NEXTAUTH_SECRET
# Reemplaza con el string generado
# Guardar: Ctrl+O, Enter, Ctrl+X
```

**Verificación:**
```bash
cat .env.local | grep NEXTAUTH_SECRET
# Debe mostrar un string aleatorio de ~44 caracteres
```

---

#### ✅ Token 11: Agregar `.env.local` a `.gitignore`
**Estado:** 🔄 PENDIENTE

**Verificar que `.env.local` YA esté en `.gitignore`:**
```bash
cat .gitignore | grep .env.local
```

**Si NO aparece, agregarlo:**
```bash
echo ".env.local" >> .gitignore
```

**⚠️ CRÍTICO:** NUNCA subas `.env.local` a GitHub (contiene credenciales)

---

### 🗓️ DÍA 3: Setup de Base de Datos con Prisma (1-2 horas)

#### ✅ Token 12: Actualizar schema de Prisma
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
nano prisma/schema.prisma
```

**BORRAR TODO el contenido y REEMPLAZAR con:**

```prisma
// ==============================================
// PRISMA SCHEMA - REGENMON HUB
// ==============================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==============================================
// TABLA: RegisteredRegenmon
// Regenmons registrados en el hub público
// ==============================================
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

// ==============================================
// TABLA: Snapshot
// Historial de balance y puntos (sincronización)
// ==============================================
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

// ==============================================
// TABLA: Visit
// Analytics de visitas a cada Regenmon
// ==============================================
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

// ==============================================
// TABLA: AdminLog
// Logs de acciones del admin
// ==============================================
model AdminLog {
  id              String   @id @default(cuid())
  action          String   // "manual_register", "delete", "update"
  details         Json
  adminIp         String?

  createdAt       DateTime @default(now())

  @@index([createdAt])
}
```

**Guardar:** Ctrl+O, Enter, Ctrl+X

**Verificación:**
```bash
cat prisma/schema.prisma | grep "model RegisteredRegenmon"
# Debe aparecer la línea
```

---

#### ✅ Token 13: Crear migración de base de datos
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
npx prisma migrate dev --name init
```

**Tiempo estimado:** 1-2 minutos

**Salida esperada:**
```
✔ Enter a name for the new migration: ... init
Applying migration `20250205xxxxxx_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20250205xxxxxx_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

**Verificación:**
```bash
ls -la prisma/migrations/
# Debe haber una carpeta con fecha_init/
```

**✅ Esto creó 4 tablas en Supabase:**
- `RegisteredRegenmon`
- `Snapshot`
- `Visit`
- `AdminLog`

**Ver en Supabase:**
1. Ir a https://supabase.com → tu proyecto
2. Click en **Table Editor** (sidebar)
3. Deberías ver las 4 tablas creadas

---

#### ✅ Token 14: Generar Prisma Client
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
npx prisma generate
```

**Salida esperada:**
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

**Verificación:**
```bash
ls node_modules/@prisma/client/
# Debe tener archivos generados
```

---

#### ✅ Token 15: Crear helper de Prisma
**Estado:** 🔄 PENDIENTE

**Comando:**
```bash
nano src/lib/prisma.ts
```

**Pega este contenido:**

```typescript
// ==============================================
// PRISMA CLIENT SINGLETON
// Evita múltiples instancias en desarrollo
// ==============================================

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Guardar:** Ctrl+O, Enter, Ctrl+X

**Verificación:**
```bash
cat src/lib/prisma.ts | grep "export const prisma"
# Debe aparecer la línea
```

---

#### ✅ Token 16: Probar conexión a base de datos
**Estado:** 🔄 PENDIENTE

**Crear script de prueba:**
```bash
nano test-db.ts
```

**Pega:**
```typescript
import { prisma } from './src/lib/prisma';

async function main() {
  console.log('🔍 Probando conexión a base de datos...');

  const count = await prisma.registeredRegenmon.count();
  console.log(`✅ Conexión exitosa! Regenmons registrados: ${count}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Guardar:** Ctrl+O, Enter, Ctrl+X

**Ejecutar:**
```bash
npx tsx test-db.ts
```

**Salida esperada:**
```
🔍 Probando conexión a base de datos...
✅ Conexión exitosa! Regenmons registrados: 0
```

**Limpiar:**
```bash
rm test-db.ts
```

---

#### ✅ Token 17: Crear archivo `.gitignore` adicional
**Estado:** 🔄 PENDIENTE

**Verificar que estos estén en `.gitignore`:**
```bash
cat .gitignore
```

**Debe incluir (si falta algo, agrégalo):**
```
# dependencies
/node_modules

# env files
.env
.env.local
.env*.local

# database
/prisma/*.db
/prisma/*.db-journal

# temp
~/supabase-credentials.txt
```

---

### 🗓️ VERIFICACIÓN FINAL: Todo listo para FASE 1

#### ✅ Token 18: Checklist final
**Estado:** 🔄 PENDIENTE

**Ejecutar verificación completa:**

```bash
echo "=== VERIFICACIÓN FINAL FASE 0 ==="
echo ""

echo "✓ Proyecto Next.js:"
[ -f "package.json" ] && echo "  ✅ package.json existe" || echo "  ❌ package.json NO existe"
[ -f "tsconfig.json" ] && echo "  ✅ TypeScript configurado" || echo "  ❌ TypeScript NO configurado"
[ -d "src/app" ] && echo "  ✅ App Router configurado" || echo "  ❌ App Router NO configurado"

echo ""
echo "✓ Dependencias:"
cat package.json | grep -q "@supabase/supabase-js" && echo "  ✅ Supabase instalado" || echo "  ❌ Supabase faltante"
cat package.json | grep -q "prisma" && echo "  ✅ Prisma instalado" || echo "  ❌ Prisma faltante"
cat package.json | grep -q "next-auth" && echo "  ✅ NextAuth instalado" || echo "  ❌ NextAuth faltante"
cat package.json | grep -q "@upstash/redis" && echo "  ✅ Upstash instalado" || echo "  ❌ Upstash faltante"

echo ""
echo "✓ Configuración:"
[ -f ".env.local" ] && echo "  ✅ .env.local existe" || echo "  ❌ .env.local NO existe"
[ -f "prisma/schema.prisma" ] && echo "  ✅ Prisma schema existe" || echo "  ❌ Prisma schema NO existe"
[ -f "src/lib/prisma.ts" ] && echo "  ✅ Prisma helper existe" || echo "  ❌ Prisma helper NO existe"

echo ""
echo "✓ Base de datos:"
[ -d "prisma/migrations" ] && echo "  ✅ Migraciones creadas" || echo "  ❌ Migraciones NO creadas"

echo ""
echo "=== FASE 0 COMPLETADA ==="
```

**Salida esperada: TODO con ✅**

---

## 📊 RESUMEN DE TOKENS COMPLETADOS

```
DÍA 1: Configuración del Proyecto
├─ Token 1:  [ ] Inicializar Next.js
├─ Token 2:  [ ] Instalar dependencias core
├─ Token 3:  [ ] Instalar dependencias adicionales
├─ Token 4:  [ ] Inicializar Prisma
└─ Token 5:  [ ] Crear estructura de carpetas

DÍA 2: Servicios Externos
├─ Token 6:  [ ] Crear cuenta Supabase
├─ Token 7:  [ ] Crear cuenta Privy
├─ Token 8:  [ ] Crear cuenta Upstash
├─ Token 9:  [ ] Crear .env.local
├─ Token 10: [ ] Generar NEXTAUTH_SECRET
└─ Token 11: [ ] Actualizar .gitignore

DÍA 3: Base de Datos
├─ Token 12: [ ] Actualizar schema Prisma
├─ Token 13: [ ] Crear migración
├─ Token 14: [ ] Generar Prisma Client
├─ Token 15: [ ] Crear helper Prisma
├─ Token 16: [ ] Probar conexión
├─ Token 17: [ ] Verificar .gitignore
└─ Token 18: [ ] Checklist final
```

---

## 🎯 PRÓXIMOS PASOS

Cuando TODOS los tokens estén ✅:

**→ Avanzar a FASE 1: Backend APIs**
- 6 API endpoints
- Código completo listo para copiar

---

## 📝 NOTAS IMPORTANTES

### ⚠️ SEGURIDAD
- ❌ NUNCA subas `.env.local` a GitHub
- ❌ NUNCA compartas tu `SUPABASE_ANON_KEY` públicamente
- ❌ NUNCA expongas tu `ADMIN_PASSWORD`

### 💡 TIPS
- Guarda las credenciales en un gestor de contraseñas
- Haz backup de `.env.local` en un lugar seguro
- Si pierdes credenciales, puedes regenerarlas desde cada servicio

### 🆘 TROUBLESHOOTING

**Error: "Can't reach database server"**
```bash
# Verifica DATABASE_URL en .env.local
cat .env.local | grep DATABASE_URL
# Debe tener el formato correcto de Supabase
```

**Error: "prisma generate failed"**
```bash
# Reinstala Prisma
npm install prisma @prisma/client --save-dev
npx prisma generate
```

**Error: "Module not found: @/lib/prisma"**
```bash
# Verifica que el archivo existe
ls src/lib/prisma.ts
# Verifica tsconfig.json tenga paths configurados
```

---

**Última actualización:** 2025-02-05
**Versión:** 1.0
**Proyecto:** Regenmon Hub - Fase 0
