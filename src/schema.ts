import { z } from "zod";

// Schema para las opciones de respuesta múltiple
const optionSchema = z.object({
  id: z.string().describe("ID de la opción (A, B, C, D)"),
  text: z.string().describe("Texto de la opción de respuesta"),
  isCorrect: z.boolean().describe("Si esta opción es la respuesta correcta")
});

// Schema principal para el componente ReelTest
export const reelTestSchema = z.object({
  q: z.string()
    .describe("Pregunta matemática (puede incluir LaTeX, ej: 5\\times x = 20)")
    .default("¿Cuál es el resultado de 5 × 7?"),
  
  options: z.array(optionSchema)
    .length(4)
    .describe("Array de 4 opciones de respuesta múltiple")
    .default([
      { id: "A", text: "30", isCorrect: false },
      { id: "B", text: "35", isCorrect: true },
      { id: "C", text: "40", isCorrect: false },
      { id: "D", text: "32", isCorrect: false }
    ]),
  
  audioFile: z.string()
    .optional()
    .describe("Nombre del archivo de audio TTS (ej: question_001.mp3)")
    .default("question_001.mp3"),
  
  // Efectos de sonido como props opcionales
  countdownTickAudio: z.string()
    .optional()
    .describe("Audio del tick del cronómetro")
    .default("countdown-tick.mp3"),
  
  buttonHoverAudio: z.string()
    .optional()
    .describe("Audio del hover de botones")
    .default("button-hover.mp3"),
  
  revealWhooshAudio: z.string()
    .optional()
    .describe("Audio del whoosh al revelar respuesta")
    .default("reveal-whoosh.mp3"),
  
  correctAnswerAudio: z.string()
    .optional()
    .describe("Audio de respuesta correcta")
    .default("correct-answer.mp3"),
  
  timeWarningAudio: z.string()
    .optional()
    .describe("Audio de advertencia de tiempo")
    .default("time-warning.mp3"),
  
  durQ: z.number()
    .int()
    .min(60)
    .max(600)
    .describe("Duración del countdown en frames (180 = 6 segundos a 30fps)")
    .default(180),
  
  theme: z.enum(["teal", "violet", "orange"])
    .describe("Tema de colores para la interfaz")
    .default("teal"),
  
  cta: z.string()
    .describe("Texto del Call-to-Action en la parte inferior")
    .default("Comenta tu respuesta ↓"),
  
  bg: z.string()
    .optional()
    .describe("Ruta al video de fondo (relativa a assets/backgrounds/)")
});

// Exportar el tipo TypeScript generado
export type ReelTestProps = z.infer<typeof reelTestSchema>;
