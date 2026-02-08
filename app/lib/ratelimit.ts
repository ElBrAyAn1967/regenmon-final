// ==============================================
// RATE LIMITING - UPSTASH REDIS (OPTIONAL)
// ==============================================
// Previene abuso de APIs con sliding window (10 requests/min)
// Si no hay Redis configurado, permite todas las requests (dev mode)

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Redis is configured
const REDIS_CONFIGURED = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Cliente Redis (solo si está configurado)
const redis = REDIS_CONFIGURED 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Rate limiter con sliding window (solo si hay Redis)
// 10 requests por 1 minuto
export const ratelimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "regenmon",
    })
  : null;

/**
 * Verifica si un identificador ha excedido el rate limit
 * @param identifier - Identificador único (IP, regenmonId, etc.)
 * @returns { success: boolean, remaining: number }
 */
export async function checkRateLimit(identifier: string) {
  // Si no hay rate limiter configurado, permitir todo (dev mode)
  if (!ratelimit) {
    console.warn("⚠️ Rate limiting disabled - no Redis configured");
    return { success: true, remaining: 999, reset: Date.now() + 60000 };
  }
  
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
