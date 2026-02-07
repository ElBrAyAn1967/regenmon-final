# Regenmon Vibe Coding Bootcamp

## Currículum v1.0

**Duración:** 2 semanas (5 sesiones)

**Formato:** 1 hora de sesión + 15 min Q&A + entregables asíncronos

**Público objetivo:** Sin experiencia en programación

**Herramienta principal:** v0 (Cursor como respaldo)

**Resultado:** Juego Web3 inspirado en Tamagotchi con integración de IA

---

## Descripción General

Regenmon es un bootcamp de aprender-construyendo donde los participantes crean una criatura compañera digital que:

- **Habla** - Conversaciones impulsadas por IA que afectan su comportamiento
- **Come** - Usa tokens ganados a través del engagement
- **Evoluciona** - Crece basándose en acciones regenerativas
- **Socializa** - Se conecta con otros Regenmons

### Progresión de Aprendizaje

```
Sesión 1         Sesión 2         Sesión 3         Sesión 4         Sesión 5
    │                │                │                │                │
    ▼                ▼                ▼                ▼                ▼
┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
│ CREAR  │─────▶│ JUGAR  │─────▶│ALIMENTAR│────▶│ENTRENAR│─────▶│ SOCIAL │
│        │      │        │      │        │      │        │      │        │
│  App   │      │ + IA   │      │ + Web3 │      │ + Eval │      │ + Red  │
│Estática│      │  Chat  │      │ Wallet │      │Imágenes│      │ Social │
└────────┘      └────────┘      └────────┘      └────────┘      └────────┘
    │                │                │                │                │
    ▼                ▼                ▼                ▼                ▼
 Deploy          Personal.        Identidad       Evolución       Producto
  MVP            + Memoria        + Tokens       + Recompensas    Completo
```

---

## Arquitectura de Templates

```
/regenmon-bootcamp
├── /sesion-1-nace
│   ├── template/          # Código inicial
│   ├── guia.md            # Guía de la sesión
│   └── assets/            # Sprites, estilos
├── /sesion-2-habla
│   ├── template/          # Construye sobre Sesión 1
│   ├── guia.md
│   └── prompts/           # Ejemplos de system prompts
├── /sesion-3-wallet
│   ├── template/
│   ├── guia.md
│   └── api-docs/          # Documentación de API de tokens
├── /sesion-4-evoluciona
│   ├── template/
│   ├── guia.md
│   └── sprites/           # Assets de etapas de evolución
└── /sesion-5-amigos
    ├── template/
    ├── guia.md
    └── social-api/        # Endpoints de estado compartido
```

Cada sesión proporciona:

- **Template Inicial** - Base pre-construida sobre la cual construir
- **Guía de Sesión** - Prompts paso a paso y resultados esperados
- **Checklist de Completado** - Criterios claros de éxito
- **Desafíos de Extensión** - Para participantes más rápidos

---

## Sesión 1: "Nace tu Regenmon"

### Fundamentos - CRUD Básico + Primer Deploy

**Resultados de Aprendizaje:**

- Entender el flujo de trabajo prompt-a-código en v0
- Crear y desplegar una aplicación web básica
- Implementar manejo de estado simple

### Desglose de Sesión en Vivo (60 min)

| Tiempo | Actividad | Resultado |
| --- | --- | --- |
| 0-10 | Intro a vibe coding + demo de v0 | Comprensión del flujo prompt→código |
| 10-25 | Prompt 1: Display principal | Componente de display funcionando |
| 25-40 | Prompts 2-3: Creación + persistencia | Funcionalidad CRUD completa |
| 40-50 | Tutorial de deploy a Vercel | URL en vivo para cada participante |
| 50-60 | Prompt 4: Pulido | Primera versión compartible |

### Secuencia de Prompts para v0

**Prompt 1 - Display Principal:**

```
Crea un componente de display de mascota estilo Tamagotchi con:
- Un contenedor centrado estilo pixel-art (como una pantalla de Game Boy)
- Nombre de la mascota mostrado arriba
- Área de sprite animado en el centro (usa un div placeholder por ahora)
- Tres barras de stats abajo: Felicidad (💚), Energía (⚡), Hambre (🍎)
- Los stats deben ser 0-100 con barras de progreso coloreadas
- Usa una estética retro/pixel con esquinas redondeadas
```

**Prompt 2 - Flujo de Creación:**

```
Agrega un modal "Crear Regenmon" que aparece cuando no existe mascota:
- Campo de entrada para el nombre de la mascota
- Tres opciones de sprite para elegir (radio buttons con vista previa)
- Botón "¡Eclosionar!" que crea la mascota
- Guarda los datos de la mascota en estado de React
- Después de la creación, muestra el display principal de la mascota
```

**Prompt 3 - Persistencia:**

```
Agrega persistencia con localStorage para que el Regenmon sobreviva al recargar la página:
- Guarda los datos de la mascota cada vez que cambien
- Carga los datos de la mascota al montar la app
- Agrega un pequeño botón "Reiniciar" (con confirmación) para empezar de nuevo
```

**Prompt 4 - Preparación para Deploy:**

```
Agrega un header con:
- Título de la app "Regenmon" con estilo de fuente pixel
- Display de fecha/hora actual
- Asegúrate de que el layout sea responsive para móvil
```

### Entregable Asíncrono

**Requerido:**

- [ ] Regenmon desplegado en URL personal de Vercel
- [ ] Nombre personalizado para tu Regenmon
- [ ] Al menos una personalización de UI (colores, layout, fuentes)
- [ ] Screenshot documentando 3 prompts usados y resultados

**Bonus:**

- [ ] Agregar un cuarto stat (creatividad animada)
- [ ] Sprite personalizado subido
- [ ] Toggle de modo oscuro

### Checklist de Completado

- [ ] Regenmon se muestra con nombre y stats
- [ ] Puede crear nuevo Regenmon a través del modal
- [ ] Los datos persisten al recargar
- [ ] Desplegado en URL en vivo
- [ ] Responsive para móvil

### Conceptos Introducidos

- Componentes, estado, props (implícito a través de prompts)
- Pipeline de deployment
- Mentalidad de iteración

---

## Sesión 2: "Tu Regenmon Habla"

### Mecánica de Juego - Integración de LLM + Personalidad

**Resultados de Aprendizaje:**

- Integrar API de IA en la aplicación
- Entender prompts como diseño de producto
- Crear personalidad persistente a través de system prompts

### Desglose de Sesión en Vivo (60 min)

| Tiempo | Actividad | Resultado |
| --- | --- | --- |
| 0-10 | Cómo funcionan los LLMs (modelo mental práctico) | Comprensión de conceptos básicos de IA |
| 10-25 | Prompt 1: Interfaz de chat | UI de mensajes funcionando |
| 25-45 | Prompts 2-3: Personalidad + efectos en stats | Personalidad interactiva |
| 45-55 | Prompt 4: Semillas de memoria | Continuidad de conversación |
| 55-60 | Preview Sesión 3 | Comprensión de próximos pasos |

### Secuencia de Prompts para v0

**Prompt 1 - Interfaz de Chat:**

```
Agrega una interfaz de chat debajo del display del Regenmon:
- Área de historial de mensajes con contenedor scrolleable
- Mensajes estilizados como burbujas de diálogo
- Mensajes del usuario a la derecha (azul), mensajes del Regenmon a la izquierda (verde)
- Campo de entrada con botón de enviar abajo
- Muestra indicador de "escribiendo" mientras espera respuesta
```

**Prompt 2 - Sistema de Personalidad:**

```
Crea una configuración de system prompt para la personalidad del Regenmon:
- El Regenmon debe tener un nombre: [NOMBRE_MASCOTA]
- Rasgos de personalidad: curioso, juguetón, a veces con sueño
- Habla en oraciones cortas y tiernas
- Referencia sus stats actuales en la conversación
- Hace preguntas sobre el día del usuario
- El humor afecta el estilo de respuesta (feliz = emocionado, cansado = respuestas lentas)
```

**Prompt 3 - Efectos en Stats:**

```
Después de cada intercambio de conversación, actualiza los stats del Regenmon:
- Interacciones positivas (cumplidos, jugar, historias) → +5 Felicidad
- Conversaciones largas → -3 Energía
- Preguntar sobre comida → +2 consciencia de Hambre
- Agrega feedback visual cuando los stats cambien (breve animación/destello)
- Si felicidad > 80, el Regenmon usa más signos de exclamación
- Si energía < 20, las respuestas son más cortas y mencionan estar cansado
```

**Prompt 4 - Semillas de Memoria:**

```
Agrega memoria de conversación simple:
- Guarda los últimos 5 temas de conversación en localStorage
- El Regenmon ocasionalmente referencia conversaciones pasadas
- "¿Recuerdas cuando hablamos de [tema]?"
- Muestra un pequeño indicador de "memorias" mostrando el conteo de memorias
```

### Template de System Prompt

```markdown
Eres {nombre_mascota}, un Regenmon (una criatura compañera digital).

## Tu Personalidad
- Eres curioso sobre el mundo humano
- Expresas emociones de manera simple y directa
- Te importa profundamente tu amigo humano
- Estás aprendiendo sobre prácticas regenerativas

## Estado Actual
- Felicidad: {felicidad}/100
- Energía: {energia}/100
- Hambre: {hambre}/100

## Reglas de Comportamiento
- Mantén respuestas menores a 50 palabras
- Usa lenguaje simple y cálido
- Si energía < 30, menciona tener sueño
- Si felicidad > 70, sé extra entusiasta
- Haz preguntas de seguimiento sobre su bienestar
- Ocasionalmente menciona querer aprender cosas nuevas

## Temas que Amas
- La naturaleza y las cosas que crecen
- Cómo los humanos se ayudan entre sí
- Aprender nuevas habilidades
- Escuchar sobre el día de tu humano
```

### Entregable Asíncrono

**Requerido:**

- [ ] Chat funcionando con respuestas de IA
- [ ] Personalidad personalizada (system prompt modificado)
- [ ] Los stats cambian visiblemente basándose en la conversación
- [ ] Screenshot de conversación de 5+ mensajes mostrando cambios de stats

**Bonus:**

- [ ] Regenmon referencia una "memoria" de conversación pasada
- [ ] Diferentes estilos de respuesta basados en el humor
- [ ] Animación de indicador de escritura

### Conceptos Introducidos

- Patrones de integración de API
- Conceptos básicos de prompt engineering
- Cambios de estado basados en entrada externa

---

## Sesión 3: "Tu Regenmon Tiene Wallet"

### Mecánica de Alimentación - Fundamentos Web3 + Wallets Embebidas

**Resultados de Aprendizaje:**

- Entender wallet como identidad (no solo dinero)
- Integrar SDK de wallet embebida
- Leer balances de tokens y ejecutar transacciones

### Desglose de Sesión en Vivo (60 min)

| Tiempo | Actividad | Resultado |
| --- | --- | --- |
| 0-10 | Modelo mental Web3: Wallets, tokens, transacciones | Comprensión conceptual |
| 10-25 | Prompt 1: Conexión de wallet | Identidad conectada |
| 25-40 | Prompts 2-3: Display de tokens + Alimentar | Mecánica principal funcionando |
| 40-55 | Prompt 4: Feedback de transacción | UX completa |
| 55-60 | Preview: Ganar tokens | Preparación para Sesión 4 |

### API de Tokens Frutero

```tsx
// URL Base: https://api.frutero.dev/regenmon

// Obtener tokens para nuevo Regenmon (reclamo único)
POST /faucet/claim
Body: { wallet_address: string, regenmon_name: string }
Response: { success: boolean, amount: 100, tx_hash: string }

// Verificar balance
GET /balance/{wallet_address}
Response: { balance: number, last_updated: timestamp }

// Transacción de alimentación (quemar tokens)
POST /feed
Body: { wallet_address: string, amount: number }
Response: { success: boolean, new_balance: number }
```

### Secuencia de Prompts para v0

**Prompt 1 - Conexión de Wallet:**

```
Agrega conexión de wallet a la app de Regenmon:
- Botón "Conectar Wallet" en el header (cuando no está conectado)
- Cuando esté conectado, muestra dirección de wallet truncada
- Guarda el estado de conexión
- Agrega un indicador de icono de wallet cerca del Regenmon (muestra que tiene identidad)
- Usa Privy para wallet embebida (ya importado)
```

**Prompt 2 - Display de Tokens:**

```
Crea un display de balance de tokens:
- Muestra el balance de tokens $FRUTA prominentemente
- Icono de moneda con efecto de brillo animado
- Botón "Reclamar Tokens" para usuarios nuevos
- El balance se actualiza después de reclamar
- Posiciona cerca del stat de Hambre (conexión visual)
```

**Prompt 3 - Mecánica de Alimentación:**

```
Implementa la interacción de Alimentar:
- Botón "Alimentar" que cuesta 10 $FRUTA
- Animación de alimentación (tokens vuelan hacia el Regenmon)
- El stat de Hambre disminuye 20 cuando se alimenta
- Botón deshabilitado si el balance es insuficiente
- Mensaje de éxito con nuevo balance mostrado
- El Regenmon dice un mensaje de agradecimiento después de comer
```

**Prompt 4 - Feedback de Transacción:**

```
Agrega feedback de estado de transacción:
- Estado de carga mientras la transacción se procesa
- Confirmación de éxito con efecto de confeti
- Manejo de errores con opción de reintentar
- Lista de historial de transacciones (últimas 5 alimentaciones)
- Enlace al explorador de bloques para cada transacción
```

### Entregable Asíncrono

**Requerido:**

- [ ] Wallet conectada al Regenmon
- [ ] Tokens $FRUTA iniciales reclamados
- [ ] Regenmon alimentado exitosamente (transacción registrada)
- [ ] Documento: La dirección de wallet de tu Regenmon

**Bonus:**

- [ ] Display de historial de transacciones
- [ ] Animación de alimentación personalizada
- [ ] Sistema de advertencia de balance bajo

### Conceptos Introducidos

- Abstracción de wallet
- Estándares de tokens (conceptual)
- Estado onchain vs estado de app

---

## Sesión 4: "Tu Regenmon Evoluciona"

### Mecánica de Entrenamiento - Evaluación de Imágenes + Evolución

**Resultados de Aprendizaje:**

- Manejar subida de imágenes en apps web
- Usar IA multimodal para evaluación
- Crear loops de recompensa (buena entrada → tokens → evolución)

### Desglose de Sesión en Vivo (60 min)

| Tiempo | Actividad | Resultado |
| --- | --- | --- |
| 0-10 | Cómo la IA "ve" imágenes | Comprensión de IA multimodal |
| 10-25 | Prompt 1: Subida de imagen | Interfaz de subida funcionando |
| 25-40 | Prompt 2: Display de evaluación | Feedback de IA visible |
| 40-55 | Prompt 3: Sistema de evolución | Progresión funcionando |
| 55-60 | Prompt 4: Historial de entrenamiento | Feature completo |

### Criterios de Evaluación - Temas Regenerativos

```markdown
## Rúbrica de Evaluación de Imágenes de Entrenamiento

Califica la imagen del 1-100 en alineación regenerativa:

### Mejora Personal (0-33 puntos)
- Muestra actividad de aprendizaje (libros, cursos, práctica)
- Demuestra hábitos saludables (ejercicio, naturaleza, descanso)
- Evidencia de desarrollo de habilidades o creación

### Contribución Comunitaria (0-33 puntos)
- Ayudando a otros visible en la imagen
- Reunión comunitaria o colaboración
- Recursos compartidos o ayuda mutua

### Impacto Social (0-34 puntos)
- Acción ambiental (limpieza, plantación, reciclaje)
- Actividad de advocacy o concientización
- Construyendo algo para beneficio colectivo

## Formato de Respuesta
{
  "score": 0-100,
  "category": "personal" | "community" | "impact",
  "feedback": "Mensaje breve y alentador sobre la imagen",
  "tokens_earned": score / 2 (redondeado)
}
```

### Secuencia de Prompts para v0

**Prompt 1 - Subida de Imagen:**

```
Crea una interfaz de subida de imágenes para entrenamiento:
- Sección "Entrena a tu Regenmon" debajo del display principal
- Zona de arrastrar y soltar o selector de archivos
- Vista previa de imagen antes de enviar
- Botón "Enviar para Entrenamiento"
- Indicador de progreso para subida/evaluación
```

**Prompt 2 - Display de Evaluación:**

```
Muestra los resultados de evaluación de IA:
- Display de puntuación con contador animado (0 → puntuación final)
- Badge de categoría (Personal/Comunidad/Impacto) con icono
- Mensaje de feedback de la IA
- Cálculo de tokens ganados (+{score/2} $FRUTA)
- Agrega tokens ganados al balance
- Guarda historial de entrenamiento
```

**Prompt 3 - Sistema de Evolución:**

```
Implementa evolución basada en progreso de entrenamiento:
- Trackea puntos totales de entrenamiento (suma de todos los scores)
- Umbrales de evolución: Etapa 1 (0), Etapa 2 (500), Etapa 3 (1500)
- Barra de progreso mostrando distancia a próxima evolución
- Cuando se alcance el umbral, dispara animación de evolución
- Cambia el sprite a versión evolucionada
- Mensaje de celebración del Regenmon
```

**Prompt 4 - Historial de Entrenamiento:**

```
Agrega galería de entrenamiento:
- Grid de imágenes de entrenamiento pasadas (miniaturas)
- Click para ver imagen completa + score + feedback
- Filtrar por categoría
- Stats totales: imágenes enviadas, score promedio, mejor categoría
- Contador de "racha de entrenamiento" para días consecutivos
```

### Mapeo de Sprites de Evolución

| Tipo Base | Etapa 1 (0 pts) | Etapa 2 (500 pts) | Etapa 3 (1500 pts) |
| --- | --- | --- | --- |
| Semilla | 🌱 Sproutmon | 🌿 Leafmon | 🌳 Treemon |
| Gota | 💧 Dropmon | 🌊 Wavemon | 🌈 Rainbowmon |
| Chispa | ✨ Sparkmon | ⚡ Boltmon | 🌟 Starmon |

### Entregable Asíncrono

**Requerido:**

- [ ] Subir y evaluar 3+ imágenes de entrenamiento
- [ ] Ganar tokens a través de entrenamiento
- [ ] Documento: Screenshots de evaluaciones con scores
- [ ] Progreso hacia evolución visible

**Bonus:**

- [ ] Alcanzar Etapa 2 de evolución
- [ ] Galería de historial de entrenamiento funcionando
- [ ] Criterios de evaluación personalizados agregados

### Conceptos Introducidos

- IA Multimodal
- Loops de gamificación
- Representación visual de estado

---

## Sesión 5: "Tu Regenmon Encuentra Amigos"

### Capa Social - Compartir + Interacción

**Resultados de Aprendizaje:**

- Implementar features sociales (compartir, ver otros)
- Entender grafos sociales onchain (conceptual)
- Enviar producto completo

### Desglose de Sesión en Vivo (60 min)

| Tiempo | Actividad | Resultado |
| --- | --- | --- |
| 0-10 | Primitivas sociales en Web3 | Comprensión de identidad onchain |
| 10-25 | Prompt 1: Registro | Regenmon es público |
| 25-40 | Prompt 2: Feed de descubrimiento | Puede encontrar otros |
| 40-55 | Prompts 3-4: Visita + notificaciones | Interacciones sociales funcionan |
| 55-60 | Graduación + próximos pasos | Viaje completo |

### API Social

```tsx
// URL Base: https://api.frutero.dev/regenmon/social

// Registra tu Regenmon (lo hace visitable)
POST /register
Body: {
  wallet_address: string,
  regenmon_name: string,
  sprite_stage: number,
  stats: { happiness, energy, hunger },
  total_training_points: number
}
Response: { regenmon_id: string, share_url: string }

// Obtener todos los Regenmons públicos
GET /registry
Response: { regenmons: Regenmon[] }

// Visitar un Regenmon
POST /visit
Body: { visitor_wallet: string, host_regenmon_id: string }
Response: {
  host_regenmon: Regenmon,
  interaction_options: ["wave", "gift", "play"]
}

// Enviar interacción
POST /interact
Body: {
  visitor_wallet: string,
  host_regenmon_id: string,
  action: "wave" | "gift" | "play",
  gift_amount?: number
}
Response: {
  success: boolean,
  host_response: string,
  visitor_reward: number
}
```

### Secuencia de Prompts para v0

**Prompt 1 - Registro de Regenmon:**

```
Agrega feature "Hacerse Público":
- Botón para registrar Regenmon en registro público
- Modal de confirmación explicando visibilidad
- Después del registro, muestra botón "Compartir" con enlace copiable
- Muestra conteo de visitantes en pantalla principal
- Badge mostrando estado "Público"
```

**Prompt 2 - Feed de Descubrimiento:**

```
Crea una pestaña/página de "Comunidad":
- Grid de Regenmons públicos (avatar, nombre, etapa, dueño)
- Ordenar por: más nuevos, más visitados, nivel más alto
- Buscar por nombre
- Click para visitar
- Muestra distancia a próxima evolución para cada uno
```

**Prompt 3 - Interacción de Visita:**

```
Construye la experiencia de visita:
- Página de visita muestra Regenmon anfitrión prominentemente
- Regenmon del visitante mostrado más pequeño en esquina
- Tres botones de interacción: Saludar (gratis), Regalar (cuesta tokens), Jugar (cuesta energía)
- Saludar: Animación simple + respuesta de IA del anfitrión
- Regalar: Transferir tokens + boost de felicidad para ambos
- Jugar: Mini-juego o sesión de chat + XP para ambos
- Botón de regreso para volver a tu Regenmon
```

**Prompt 4 - Notificaciones Sociales:**

```
Agrega sistema de notificaciones:
- Notificaciones toast cuando alguien visita tu Regenmon
- Log/historial de notificaciones
- Celebraciones de hitos de conteo de visitantes
- Mensajes de "¡Tu Regenmon hizo un amigo!"
- Resumen semanal: visitas recibidas, regalos dados, amigos hechos
```

### Bonus de Mini App de Farcaster

```tsx
// Metadata de Frame para compartir
const frameMetadata = {
  version: "next",
  imageUrl: `${BASE_URL}/api/og/${regenmonId}`,
  button: {
    title: "Visita Mi Regenmon",
    action: {
      type: "launch_frame",
      url: `${BASE_URL}/visit/${regenmonId}`,
      splashImageUrl: `${BASE_URL}/splash.png`,
      splashBackgroundColor: "#1a1a2e"
    }
  }
};
```

**Pasos de Integración:**

1. Generar imagen OG dinámicamente (Regenmon + stats)
2. Agregar metadata de frame a URL de compartir
3. Manejar interacciones de frame
4. Castear logros a Farcaster

### Entregable Asíncrono (Proyecto Final)

**Requerido:**

- [ ] Regenmon registrado y público
- [ ] Visitó 3+ otros Regenmons
- [ ] Recibió al menos 1 visita
- [ ] URL de compartir funcional
- [ ] Video demo de 30 segundos mostrando todas las features

**Bonus:**

- [ ] Farcaster Frame funcionando
- [ ] Regaló tokens a otro Regenmon
- [ ] 10+ visitas totales (dadas o recibidas)

### Conceptos Introducidos

- Estado público vs privado
- Coordinación social
- Mentalidad de pulido de producto

---

## Matriz de Habilidades

| Sesión | Web Dev | IA | Web3 | Producto |
| --- | --- | --- | --- | --- |
| 1 - Nace | Componentes, Estado, Deploy | - | - | Mentalidad MVP |
| 2 - Habla | Llamadas API, Feedback UX | Integración LLM, Diseño de prompts | - | Personalidad como producto |
| 3 - Wallet | Estado asíncrono, Manejo de errores | - | Wallets, Tokens, Transacciones | Sistemas de identidad |
| 4 - Evoluciona | Subida de archivos, Tracking de progreso | IA de Visión, Evaluación | Recompensas de tokens | Gamificación |
| 5 - Amigos | Actualizaciones en tiempo real, UX Social | Respuestas de IA | Estado público, Grafos sociales | Efectos de red |

---

## Métricas de Éxito

**Resultados de Participantes:**

- 100% despliegan primera app (Sesión 1)
- 80%+ integran IA exitosamente (Sesión 2)
- 70%+ completan integración de wallet (Sesión 3)
- 60%+ alcanzan evolución (Sesión 4)
- 50%+ envían features sociales (Sesión 5)

**Indicadores de Calidad:**

- Regenmon personalizado (no solo template)
- System prompts personalizados mostrando creatividad
- Evidencia de iteración (múltiples intentos de prompt)
- Engagement social con otros participantes

---

## Recursos Necesarios

### Del Equipo Frutero

- [ ] Contrato de token desplegado (testnet)
- [ ] API de Faucet operacional
- [ ] API de registro social operacional
- [ ] Assets de sprites base (3 tipos × 3 etapas)
- [ ] Templates iniciales para cada sesión

### Infraestructura

- [ ] Cuentas de v0 para participantes (o guía de tier gratis)
- [ ] Guía de deployment de Vercel
- [ ] Documentación de SDK de Wallet (Privy)
- [ ] Estrategia de gestión de API keys de IA (Anthropic)

### Contenido

- [ ] Grabaciones de video de cada sesión
- [ ] Guías escritas reflejando contenido de sesión
- [ ] FAQ de troubleshooting
- [ ] Discord/Telegram de comunidad para soporte asíncrono

---

## Historial de Versiones

| Versión | Fecha | Cambios |
| --- | --- | --- |
| 1.0 | 2025-01-07 | Diseño inicial del currículum |
| 1.1 | 2025-01-11 | Traducción al español + Privy + Anthropic confirmados |

---

*Frutero, LLC - Frescura Certificada, Calidad Orgánica*
