// ==============================================
// EVALUATE API - Session 4 (Claude Vision)
// ==============================================
// Endpoint para evaluar imágenes de entrenamiento con Claude

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, category } = await req.json();

    if (!imageBase64 || !category) {
      return NextResponse.json(
        { error: "Missing imageBase64 or category" },
        { status: 400 }
      );
    }

    // Generate evaluation prompt based on category
    const evaluationPrompt = generateEvaluationPrompt(category);

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Call Claude Vision
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64Data,
              },
            },
            {
              type: "text",
              text: evaluationPrompt,
            },
          ],
        },
      ],
    });

    const responseText = response.content[0].type === "text" ? response.content[0].text : "";

    // Parse score from response
    const score = extractScore(responseText);

    // Calculate rewards
    const points = score; // 1 punto por cada punto de score (0-100)
    const tokens = Math.floor(score * 0.5); // 0.5 tokens por punto

    return NextResponse.json({
      score,
      feedback: responseText,
      points,
      tokens,
      category,
    });
  } catch (error: any) {
    console.error("Evaluate error:", error);

    // Handle quota/rate limit errors gracefully
    if (error.status === 429 || error.message?.includes("rate_limit")) {
      return NextResponse.json(
        {
          fallbackScore: 50,
          fallbackFeedback: "⚠️ Sistema de evaluación temporalmente no disponible. Score por defecto: 50/100. ¡Sigue entrenando!",
          score: 50,
          feedback: "⚠️ Sistema de evaluación temporalmente no disponible. Score por defecto: 50/100",
          points: 50,
          tokens: 25,
          category,
        },
        { status: 200 } // Return 200 to allow fallback
      );
    }

    return NextResponse.json(
      { error: "Failed to evaluate image" },
      { status: 500 }
    );
  }
}

function generateEvaluationPrompt(category: string): string {
  const prompts: Record<string, string> = {
    codigo: `Evalúa este código de programación en una escala de 0-100 considerando:
- Calidad del código (limpieza, organización)
- Buenas prácticas (nomenclatura, estructura)
- Complejidad (¿resuelve algo interesante?)
- Comentarios y documentación

Responde SOLO con un número del 0-100 en la primera línea, seguido de 1-2 oraciones de feedback constructivo.
Formato EXACTO: "Score: X/100. [feedback breve]"`,

    diseño: `Evalúa este diseño visual en una escala de 0-100 considerando:
- Estética y presentación
- Uso de colores y tipografía
- Creatividad y originalidad
- Composición y layout

Responde SOLO con un número del 0-100 en la primera línea, seguido de 1-2 oraciones de feedback constructivo.
Formato EXACTO: "Score: X/100. [feedback breve]"`,

    proyecto: `Evalúa este proyecto completo en una escala de 0-100 considerando:
- Funcionalidad demostrada
- Calidad general
- Complejidad del trabajo
- Presentación

Responde SOLO con un número del 0-100 en la primera línea, seguido de 1-2 oraciones de feedback constructivo.
Formato EXACTO: "Score: X/100. [feedback breve]"`,

    aprendizaje: `Evalúa esta evidencia de aprendizaje en una escala de 0-100 considerando:
- Esfuerzo demostrado
- Comprensión del tema
- Aplicación práctica
- Progreso visible

Responde SOLO con un número del 0-100 en la primera línea, seguido de 1-2 oraciones de feedback constructivo.
Formato EXACTO: "Score: X/100. [feedback breve]"`,
  };

  return prompts[category] || prompts.proyecto;
}

function extractScore(response: string): number {
  // Try to extract score from "Score: X/100" format
  const scoreMatch = response.match(/Score:\s*(\d+)\/100/i);
  if (scoreMatch) {
    return parseInt(scoreMatch[1]);
  }

  // Try to extract any number between 0-100
  const numberMatch = response.match(/\b(\d{1,3})\b/);
  if (numberMatch) {
    const num = parseInt(numberMatch[1]);
    if (num >= 0 && num <= 100) {
      return num;
    }
  }

  // Default to 50 if no score found
  return 50;
}
