// ==============================================
// RATE LIMITING - UPSTASH REDIS
// ==============================================
// Previene abuso de APIs con sliding window (10 requests/min)

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Validar variables de entorno
if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL is not defined");
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("UPSTASH_REDIS_REST_TOKEN is not defined");
}

// Cliente Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limiter con sliding window
// 10 requests por 1 minuto
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "regenmon",
});

/**
 * Verifica si un identificador ha excedido el rate limit
 * @param identifier - Identificador único (IP, regenmonId, etc.)
 * @returns { success: boolean, remaining: number }
 */
export async function checkRateLimit(identifier: string) {
  try {
    const { success, remaining, reset } = await ratelimit.limit(identifier);
    return { success, remaining, reset };
  } catch (error) {
    console.error("Rate limit error:", error);
    // En caso de error de Redis, permitir la operación (fail open)
    return { success: true, remaining: 10, reset: Date.now() + 60000 };
  }
}

/**
 * Obtiene el identificador de IP desde los headers de la request
 * @param headers - Headers de NextRequest
 * @returns IP address o "unknown"
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIP = headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}
