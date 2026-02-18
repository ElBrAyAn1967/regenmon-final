// ==============================================
// ZOD VALIDATION SCHEMAS
// ==============================================
// Schemas de validación para todos los endpoints

import { z } from "zod";

// ==============================================
// STATS DEL REGENMON
// ==============================================
export const StatsSchema = z.object({
  happiness: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
  hunger: z.number().min(0).max(100),
});

// ==============================================
// TRAINING HISTORY
// ==============================================
export const TrainingHistoryItemSchema = z.object({
  score: z.number().min(0).max(100),
  category: z.string().optional(),
  date: z.string().datetime(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const TrainingHistorySchema = z.array(TrainingHistoryItemSchema);

// ==============================================
// REGISTRO DE NUEVO REGENMON
// ==============================================
export const RegisterRegenmonSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Name contains invalid characters"),
  ownerName: z
    .string()
    .min(1, "Owner name is required")
    .max(100, "Owner name must be 100 characters or less"),
  ownerEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  privyUserId: z.string().optional(),
  appUrl: z
    .string()
    .url("Invalid URL format")
    .refine(
      (url) => url.includes("vercel.app") || url.includes("localhost"),
      "URL must be from Vercel or localhost"
    ),
  sprite: z.string().url("Sprite must be a valid URL"),
});

// ==============================================
// SINCRONIZACIÓN DE DATOS
// ==============================================
export const SyncRegenmonSchema = z.object({
  regenmonId: z.string().cuid("Invalid Regenmon ID format"),
  stats: StatsSchema,
  totalPoints: z.number().min(0, "Points cannot be negative"),
  trainingHistory: TrainingHistorySchema,
});

// ==============================================
// FEED ACTION
// ==============================================
export const FeedRegenmonSchema = z.object({
  regenmonId: z.string().cuid("Invalid Regenmon ID format"),
  action: z.literal("feed"),
});

// ==============================================
// SOCIAL: FEED ANOTHER REGENMON
// ==============================================
export const FeedOtherRegenmonSchema = z.object({
  fromRegenmonId: z.string().cuid("Invalid sender Regenmon ID"),
});

// ==============================================
// SOCIAL: GIFT TOKENS TO ANOTHER REGENMON
// ==============================================
export const GiftTokensSchema = z.object({
  fromRegenmonId: z.string().cuid("Invalid sender Regenmon ID"),
  amount: z.number().int().min(1, "Amount must be at least 1").max(1000, "Amount too large"),
});

// ==============================================
// SOCIAL: SEND MESSAGE TO ANOTHER REGENMON
// ==============================================
export const SendMessageSchema = z.object({
  fromRegenmonId: z.string().cuid("Invalid sender Regenmon ID"),
  fromName: z.string().min(1).max(100),
  message: z.string().min(1, "Message is required").max(140, "Message must be 140 characters or less"),
});

// ==============================================
// QUERY PARAMS - LEADERBOARD
// ==============================================
export const LeaderboardQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// ==============================================
// TIPOS TYPESCRIPT INFERIDOS
// ==============================================
export type StatsInput = z.infer<typeof StatsSchema>;
export type TrainingHistoryItem = z.infer<typeof TrainingHistoryItemSchema>;
export type TrainingHistory = z.infer<typeof TrainingHistorySchema>;
export type RegisterRegenmonInput = z.infer<typeof RegisterRegenmonSchema>;
export type SyncRegenmonInput = z.infer<typeof SyncRegenmonSchema>;
export type FeedRegenmonInput = z.infer<typeof FeedRegenmonSchema>;
export type FeedOtherRegenmonInput = z.infer<typeof FeedOtherRegenmonSchema>;
export type GiftTokensInput = z.infer<typeof GiftTokensSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>;
