// scripts/generate-audio.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

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
    // Leer datos de preguntas
    const data = JSON.parse(readFileSync('data/questions.jsx', 'utf8'));
    
    console.log('🎵 Generando audios con ElevenLabs...\n');
    
    for (const item of data) {
      const audioFileName = `question_${String(item.id).padStart(3, '0')}.mp3`;
      const audioPath = `public/audio/${audioFileName}`;
      
      // Skip si ya existe
      if (existsSync(audioPath)) {
        console.log(`⏭️  ${audioFileName} ya existe, saltando...`);
        continue;
      }
      
      console.log(`🎙️  Generando: ${audioFileName}`);
      console.log(`📝 Texto: "${item.q}"`);
      
      try {
        // Generar audio usando directamente el texto de la pregunta
        const audio = await generateAudioWithElevenLabs(item.q, item.voiceId || VOICE_ID);
        
        // Guardar archivo
        writeFileSync(audioPath, Buffer.from(audio));
        console.log(`✅ Guardado: ${audioPath}\n`);
        
        // Actualizar JSON con ruta del audio
        item.audioFile = `/audio/${audioFileName}`;
        
      } catch (error) {
        console.error(`❌ Error generando audio para pregunta ${item.id}:`, error.message);
      }
    }
    
    // Guardar JSON actualizado
    writeFileSync('data/questions.jsx', JSON.stringify(data, null, 2));
    console.log('✅ Audio generation completo!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
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
