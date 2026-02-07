// Configuración de Prisma para desarrollo local y Vercel
// En Vercel, las variables de entorno se configuran en el dashboard
// En local, se cargan desde .env.local (prioridad) y .env (fallback)

import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Solo cargar archivos .env en desarrollo local (no en Vercel)
if (process.env.NODE_ENV !== "production") {
  // .env.local tiene prioridad sobre .env
  config({ path: ".env.local" });
  config({ path: ".env" });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
