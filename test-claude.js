// Test de la API de Claude
const Anthropic = require("@anthropic-ai/sdk");

const API_KEY = "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";

async function testClaude() {
  try {
    console.log("🔄 Probando API de Claude Sonnet 4.5...\n");
    console.log("📝 Modelo: claude-sonnet-4-20250514\n");

    const anthropic = new Anthropic.default({
      apiKey: API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: "Responde con una sola palabra: ¿Funciona?",
        },
      ],
    });

    console.log("✅ ¡API DE CLAUDE FUNCIONANDO! 🎉\n");
    console.log("💬 Respuesta de Claude:");
    console.log("─────────────────────────────");
    console.log(message.content[0].text);
    console.log("─────────────────────────────\n");
    console.log("🎉 ¡Perfecto! Claude está listo para el chat\n");
    console.log("✅ Reinicia el servidor con: bun run dev\n");

  } catch (error) {
    console.error("❌ Error al probar Claude:");
    console.error("\nError completo:");
    console.error(JSON.stringify(error, null, 2));

    if (error.status === 401) {
      console.error("\n⚠️  Error de autenticación - verifica que la API key sea correcta");
    } else if (error.status === 429) {
      console.error("\n⚠️  Rate limit excedido - espera un momento");
    }
  }
}

testClaude();
