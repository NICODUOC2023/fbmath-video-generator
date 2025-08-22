// scripts/generate-audio.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_22f73d5ca3e38bbf31fd63675cc1ca2680d45755f09f60ef';
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Voz por defecto (Sarah)

// Crear directorios si no existen
if (!existsSync('public/audio')) {
  mkdirSync('public/audio', { recursive: true });
}
if (!existsSync('public')) {
  mkdirSync('public', { recursive: true });
}

async function generateAudioWithElevenLabs(text, voiceId = VOICE_ID) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0.1,
        speed: 1.2,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Error de API: ${response.status} - ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

async function generateAudio() {
  try {
    // Leer datos de preguntas desde my-questions.js
    const { myQuestions } = await import('../data/my-questions.js');
    
    console.log('🎵 Generando audios con ElevenLabs...\n');
    console.log(`📊 Total de preguntas encontradas: ${myQuestions.length}\n`);
    
    // Generar audios para todas las preguntas
    for (let i = 0; i < myQuestions.length; i++) {
      const item = myQuestions[i];
      console.log(`\n🎯 Procesando pregunta ${i + 1}: "${item.question}"`);
      
      // Audio de la pregunta
      await generateQuestionAudio(item, i);
      
      // Audio de la respuesta correcta
      await generateAnswerAudio(item, i);
    }
    
    console.log('\n🎉 ¡Todos los audios generados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function generateQuestionAudio(item, questionIndex) {
  const audioFileName = `question_${item.id}_elevenlabs.mp3`;
  const audioPath = `public/audio/${audioFileName}`;
  
  // Skip si ya existe
  if (existsSync(audioPath)) {
    console.log(`⏭️  ${audioFileName} ya existe, saltando...`);
    return;
  }

  // Frases introductorias normales
  const introductoryPhrases = {
    'math': [
      'Ejercita tu mente.',
      'Test de inteligencia!',
      'Veamos qué tan inteligente eres.',
      '¿Cuántas preguntas puedes responder?'
    ],
    'science': [
      'Probemos tus conocimientos científicos.',
      'Veamos si sabes de ciencias.',
      'Es momento de hablar de ciencia.',
      'Pongamos a prueba tu cultura científica.'
    ],
    'history': [
      'Viajemos en el tiempo con esta pregunta.',
      'Pongamos a prueba tu conocimiento histórico.',
      'Veamos si conoces este dato histórico.',
      'Es momento de recordar la historia.'
    ],
    'geography': [
      'Exploremos el mundo con esta pregunta.',
      'Pongamos a prueba tu geografía.',
      'Veamos si conoces el mundo.',
      'Es hora de hablar de geografía.'
    ],
    'language': [
      'Probemos tu dominio del lenguaje.',
      'Veamos tus conocimientos lingüísticos.',
      'Es momento de hablar de literatura.',
      'Pongamos a prueba tu vocabulario.'
    ]
  };

  // Frases especiales cada 2 preguntas (empezando desde la pregunta 2, índice 1)
  const specialPhrases = [
    'Dime',
    'Y',
    'Sabes'
  ];

  let fullText = '';

  // Cada 2 preguntas usar frases especiales
  if ((questionIndex + 1) % 2 === 0) {
    // Usar frase especial
    const randomSpecialPhrase = specialPhrases[Math.floor(Math.random() * specialPhrases.length)];
    fullText = `${randomSpecialPhrase} ${item.question}`;
    console.log(`🎭 Usando frase especial: "${randomSpecialPhrase}"`);
  } else {
    // Usar frase introductoria normal
    let theme = 'math'; // Por defecto
    if (item.id.includes('science')) theme = 'science';
    else if (item.id.includes('history')) theme = 'history';
    else if (item.id.includes('geography')) theme = 'geography';
    else if (item.id.includes('language')) theme = 'language';
    
    const phrases = introductoryPhrases[theme];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    fullText = `${randomPhrase} ${item.question}`;
    console.log(`📝 Usando frase normal: "${randomPhrase}"`);
  }
  
  console.log(`�️  Generando: ${audioFileName}`);
  console.log(`📝 Texto completo: "${fullText}"`);
  
  try {
    const audio = await generateAudioWithElevenLabs(fullText, VOICE_ID);
    writeFileSync(audioPath, Buffer.from(audio));
    console.log(`✅ Guardado: ${audioPath}`);
    
  } catch (error) {
    console.error(`❌ Error generando audio para pregunta ${item.id}:`, error.message);
  }
}

async function generateAnswerAudio(item) {
  const audioFileName = `answer_${item.id}_elevenlabs.mp3`;
  const audioPath = `public/audio/${audioFileName}`;
  
  // Skip si ya existe
  if (existsSync(audioPath)) {
    console.log(`⏭️  ${audioFileName} ya existe, saltando...`);
    return;
  }

  // Encontrar la respuesta correcta
  const correctAnswer = item.options.find(option => option.isCorrect);
  if (!correctAnswer) {
    console.error(`❌ No se encontró respuesta correcta para pregunta ${item.id}`);
    return;
  }

  // Frases para respuestas correctas
  const answerPhrases = [
    `Tienes razón, es ${correctAnswer.text}`,
    `Correcto! Es ${correctAnswer.text}`,
    `Acertaste, era ${correctAnswer.text}`
  ];

  const randomAnswerPhrase = answerPhrases[Math.floor(Math.random() * answerPhrases.length)];
  
  console.log(`🎯 Generando respuesta: ${audioFileName}`);
  console.log(`✅ Respuesta: "${randomAnswerPhrase}"`);
  
  try {
    const audio = await generateAudioWithElevenLabs(randomAnswerPhrase, VOICE_ID);
    writeFileSync(audioPath, Buffer.from(audio));
    console.log(`✅ Guardado: ${audioPath}`);
    
  } catch (error) {
    console.error(`❌ Error generando audio de respuesta para ${item.id}:`, error.message);
  }
}

// Función para generar efectos de sonido
async function generateSoundEffect(text, duration = 3, prompt_influence = 0.3) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        duration_seconds: duration,
        prompt_influence: prompt_influence
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error generando efecto de sonido:', error);
    throw error;
  }
}

// Función para generar todos los efectos de sonido
async function generateAllSoundEffects() {
  const soundEffects = [
    { name: 'countdown-tick', text: 'clock ticking sound, countdown timer', duration: 1 },
    { name: 'correct-answer', text: 'success chime, victory sound, positive ding', duration: 2 },
    { name: 'reveal-whoosh', text: 'smooth whoosh transition sound', duration: 1.5 },
    { name: 'button-hover', text: 'subtle button hover sound, UI click', duration: 0.5 },
    { name: 'time-warning', text: 'urgent beep, time running out alert', duration: 1 },
  ];

  for (const effect of soundEffects) {
    console.log(`🎵 Generando efecto: ${effect.name}`);
    
    try {
      const audioBuffer = await generateSoundEffect(effect.text, effect.duration);
      const audioPath = `public/${effect.name}.mp3`;
      
      writeFileSync(audioPath, Buffer.from(audioBuffer));
      console.log(`✅ Efecto guardado: ${audioPath}`);
    } catch (error) {
      console.error(`❌ Error con ${effect.name}:`, error);
    }
  }
}

// Ejecutar función principal
if (process.argv.includes('--effects')) {
  generateAllSoundEffects();
} else {
  generateAudio();
}
