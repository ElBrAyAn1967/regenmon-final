// ==============================================
// EVALUATE API - Session 4 (OpenAI Vision)
// ==============================================
// Endpoint para evaluar imágenes de entrenamiento con OpenAI Vision

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  let category = "proyecto";
  try {
    const body = await req.json();
    category = body.category || "proyecto";
    const imageBase64 = body.imageBase64;

    if (!imageBase64 || !category) {
      return NextResponse.json(
        { error: "Missing imageBase64 or category" },
        { status: 400 }
      );
    }

    // Generate evaluation prompt based on category
    const evaluationPrompt = generateEvaluationPrompt(category);

    // Call OpenAI Vision (gpt-4o has vision capabilities)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `Eres un profesor amigable en un juego educativo llamado Regenmon Hub donde estudiantes suben capturas de su trabajo (código, diseños, proyectos, notas de aprendizaje) para entrenar a su mascota virtual. Tu trabajo es dar feedback constructivo y motivador, y asignar un puntaje de 0 a 100. SIEMPRE evalúa la imagen sin importar su contenido. Si no puedes identificar claramente el contenido, da un puntaje base de 40-60 con feedback alentador. Responde siempre en español.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: evaluationPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const responseText = response.choices[0]?.message?.content || "";

    // Parse score from response
    const score = extractScore(responseText);

    // Detect refusal responses (model refused to evaluate)
    const isRefusal = responseText.includes("no puedo") || responseText.includes("no me es posible") || responseText.includes("Lo siento") || !responseText.trim();
    const finalScore = isRefusal ? Math.floor(Math.random() * 21) + 40 : score; // 40-60 random if refused
    const finalFeedback = isRefusal
      ? `Score: ${finalScore}/100. ¡Buen esfuerzo! Tu captura fue recibida. Sigue practicando y subiendo tu trabajo para mejorar tu puntaje.`
      : responseText;

    // Calculate rewards
    const points = finalScore;
    const tokens = Math.floor(finalScore * 0.5);

    return NextResponse.json({
      score: finalScore,
      feedback: finalFeedback,
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
  const base = `Observa esta captura de pantalla que un estudiante subió como evidencia de su trabajo. Da un puntaje y feedback breve.

Formato de respuesta OBLIGATORIO (una sola línea):
Score: [número]/100. [1-2 oraciones de feedback constructivo y motivador]

Ejemplo: "Score: 75/100. Buen trabajo con la estructura del código, se nota dedicación. Intenta agregar más comentarios para mejorar."`;

  const criteria: Record<string, string> = {
    codigo: `Categoría: Código de programación.
Criterios: organización, buenas prácticas, complejidad, documentación.`,

    diseño: `Categoría: Diseño visual (UI/UX o gráfico).
Criterios: estética, uso de colores y tipografía, creatividad, composición.`,

    proyecto: `Categoría: Proyecto completo.
Criterios: funcionalidad, calidad general, complejidad, presentación.`,

    aprendizaje: `Categoría: Evidencia de aprendizaje (notas, ejercicios).
Criterios: esfuerzo demostrado, comprensión del tema, aplicación práctica.`,
  };

  return `${base}\n\n${criteria[category] || criteria.proyecto}`;
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
