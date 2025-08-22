# 📝 Guía para Agregar Tus Propias Preguntas

## 🚀 Inicio Rápido

1. **Edita el archivo**: `data/my-questions.js`
2. **Copia este formato** para cada nueva pregunta:

```javascript
{
  id: "tu_id_unico",
  question: "¿Tu pregunta aquí?",
  options: [
    { id: "A", text: "Opción A", isCorrect: false },
    { id: "B", text: "Opción B", isCorrect: true },
    { id: "C", text: "Opción C", isCorrect: false }
  ],
  duration: 180,
  theme: "teal",
  background: "image2.png",
  audioFile: "tu_audio.mp3",
  cta: "¡Tu mensaje final!"
}
```

## ⚙️ Configuración

### 🎨 Temas disponibles:
- `"teal"` - Verde azulado (amarillo en timer)
- `"violet"` - Morado  
- `"orange"` - Naranja

### 🖼️ Fondos disponibles:
- `"image1.png"`
- `"image2.png"`
- O agrega tus propias imágenes en `public/assets/backgrounds/`

### ⏱️ Duración:
- `180` frames = 6 segundos (a 30fps)
- `150` frames = 5 segundos
- `210` frames = 7 segundos

### 🔊 Audio (opcional):
- Agrega archivos `.mp3` en `public/audio/`
- Usa el nombre del archivo sin la ruta

## 📄 Aplicar tus preguntas

### Opción 1: Editar Root.jsx directamente
```javascript
// En src/Root.jsx, cambia defaultProps:
defaultProps={{
  q: 'Tu pregunta',
  options: [
    { id: 'A', text: 'Opción A', isCorrect: true },
    { id: 'B', text: 'Opción B', isCorrect: false },
    { id: 'C', text: 'Opción C', isCorrect: false },
  ],
  // ... resto de configuración
}}
```

### Opción 2: Importar desde my-questions.js
```javascript
import { myQuestions } from '../data/my-questions.js';

// Usar la primera pregunta
defaultProps={myQuestions[0]}
```

## 🎬 Renderizar el video

1. **Vista previa**: `npm run dev`
2. **Renderizar**: `npm run build`

## 📁 Estructura de archivos

```
public/
  assets/
    backgrounds/
      image1.png
      image2.png
      layer1.mp4 (overlay de 20% opacidad)
  audio/
    question_001.mp3
    countdown-tick.mp3
    ...

data/
  my-questions.js (TUS PREGUNTAS AQUÍ)

src/
  Root.jsx (configuración principal)
  reel-test.tsx (componente principal)
```

## 💡 Tips

- **IDs únicos**: Usa IDs descriptivos como "math_001", "science_002"
- **Respuesta correcta**: Solo una opción debe tener `isCorrect: true`
- **Textos cortos**: Las opciones se ven mejor con 1-3 palabras
- **Testing**: Usa `npm run dev` para ver cambios en tiempo real

¡Listo para crear contenido viral! 🔥
