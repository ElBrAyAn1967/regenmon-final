-- ==============================================
-- REGENMON HUB - INITIAL DATABASE SCHEMA
-- ==============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Settings → Database → SQL Editor → New query

-- Tabla: RegisteredRegenmon
-- Regenmons registrados en el hub público
CREATE TABLE "RegisteredRegenmon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appUrl" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "privyUserId" TEXT,
    "sprite" TEXT NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 1,
    "stats" JSONB NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSynced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- Índices para RegisteredRegenmon
CREATE INDEX "RegisteredRegenmon_registeredAt_idx" ON "RegisteredRegenmon"("registeredAt");
CREATE INDEX "RegisteredRegenmon_totalPoints_idx" ON "RegisteredRegenmon"("totalPoints");
CREATE INDEX "RegisteredRegenmon_balance_idx" ON "RegisteredRegenmon"("balance");
CREATE INDEX "RegisteredRegenmon_ownerEmail_idx" ON "RegisteredRegenmon"("ownerEmail");

-- Tabla: Snapshot
-- Historial de balance y puntos (sincronización)
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regenmonId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "trainingHistory" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Snapshot_regenmonId_fkey" FOREIGN KEY ("regenmonId") REFERENCES "RegisteredRegenmon"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índice para Snapshot
CREATE INDEX "Snapshot_regenmonId_createdAt_idx" ON "Snapshot"("regenmonId", "createdAt");

-- Tabla: Visit
-- Analytics de visitas a cada Regenmon
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regenmonId" TEXT NOT NULL,
    "visitorIp" TEXT,
    "visitorCountry" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Visit_regenmonId_fkey" FOREIGN KEY ("regenmonId") REFERENCES "RegisteredRegenmon"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índice para Visit
CREATE INDEX "Visit_regenmonId_createdAt_idx" ON "Visit"("regenmonId", "createdAt");

-- Tabla: AdminLog
-- Logs de acciones del admin
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "adminIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para AdminLog
CREATE INDEX "AdminLog_createdAt_idx" ON "AdminLog"("createdAt");

-- Tabla: TokenTransaction
-- Historial de transacciones de tokens $FRUTA
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regenmonId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TokenTransaction_regenmonId_fkey" FOREIGN KEY ("regenmonId") REFERENCES "RegisteredRegenmon"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para TokenTransaction
CREATE INDEX "TokenTransaction_regenmonId_createdAt_idx" ON "TokenTransaction"("regenmonId", "createdAt");
CREATE INDEX "TokenTransaction_type_idx" ON "TokenTransaction"("type");
CREATE INDEX "TokenTransaction_createdAt_idx" ON "TokenTransaction"("createdAt");

-- Tabla: TokenSystemConfig
-- Configuración global del sistema de tokens
CREATE TABLE "TokenSystemConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalSupply" INTEGER NOT NULL DEFAULT 100000,
    "rewardRate" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "feedCost" INTEGER NOT NULL DEFAULT 10,
    "evolutionBonus" INTEGER NOT NULL DEFAULT 100,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT
);

-- Insertar configuración inicial del sistema de tokens
INSERT INTO "TokenSystemConfig" ("id", "totalSupply", "rewardRate", "feedCost", "evolutionBonus", "updatedAt")
VALUES ('default_config', 100000, 0.5, 10, 100, CURRENT_TIMESTAMP);

-- Mensaje de confirmación
SELECT '✅ Base de datos inicializada correctamente - 6 tablas creadas' AS resultado;
