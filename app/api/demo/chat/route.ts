// ==============================================
// CHAT API - Session 2 (OpenAI)
// ==============================================
// Endpoint para chat con personalidad dinámica usando OpenAI

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { message, regenmonData } = await req.json();

    if (!message || !regenmonData) {
      return NextResponse.json(
        { error: "Missing message or regenmonData" },
        { status: 400 }
      );
    }

    // Generate personality prompt based on stats
    const { name, sprite, stats } = regenmonData;
    const systemPrompt = generatePersonalityPrompt(name, sprite, stats);

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const replyText = response.choices[0]?.message?.content || "";

    return NextResponse.json({
      response: replyText,
      statsEffects: {
        happiness: 5,   // Chat aumenta felicidad
        energy: -10,    // Chat consume energía
        hunger: 0,
      },
    });
  } catch (error: any) {
    console.error("Chat error:", error);

    // Handle quota/rate limit errors gracefully
    if (error.status === 429 || error.message?.includes("rate_limit")) {
      return NextResponse.json({
        response: `😴 Zzz... tu Regenmon está descansando. La API está temporalmente no disponible. ¡Intenta más tarde!`,
        statsEffects: {
          happiness: 5,
          energy: -10,
          hunger: 0,
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}

function generatePersonalityPrompt(
  name: string,
  sprite: string,
  stats: { happiness: number; energy: number; hunger: number }
): string {
  // Personality based on stats
  let personality = "";

  // Happiness
  if (stats.happiness > 70) {
    personality += "Estás muy feliz y juguetón. ";
  } else if (stats.happiness > 40) {
    personality += "Estás de buen humor pero tranquilo. ";
  } else {
    personality += "Estás un poco triste y necesitas ánimo. ";
  }

  // Energy
  if (stats.energy > 70) {
    personality += "Tienes mucha energía y quieres jugar. ";
  } else if (stats.energy > 40) {
    personality += "Tienes energía moderada. ";
  } else {
    personality += "Estás cansado y necesitas descansar. ";
  }

  // Hunger
  if (stats.hunger > 70) {
    personality += "Tienes mucha hambre y piensas en comida. ";
  } else if (stats.hunger > 40) {
    personality += "Tienes un poco de hambre. ";
  } else {
    personality += "Estás satisfecho. ";
  }

  return `Eres ${name}, un Regenmon ${sprite}. Tu personalidad actual: ${personality}

Responde en primera persona como ${name}. Sé breve (1-2 oraciones máximo). Refleja tu estado emocional en tus respuestas. Usa emojis relacionados con ${sprite}.`;
}
