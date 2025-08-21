# 🎬 FBMath Video Generator

Generador automático de videos educativos para preguntas de matemáticas usando Remotion y TTS.

## ✨ Características

- 🎯 **Generación automática** de videos de preguntas múltiple opción
- 🗣️ **Text-to-Speech** con ElevenLabs API
- ⏱️ **Contador visual** con cronómetro circular
- 🎵 **Efectos de sonido** sincronizados (ticks, whoosh, éxito)
- 🎨 **Temas personalizables** (teal, violet, orange)
- 📝 **Editor visual** con schema para Remotion Studio
- 🎪 **Animaciones fluidas** con spring physics

## 🛠️ Tecnologías

- **Remotion 4.0** - Framework de videos con React
- **React 19** - Biblioteca de componentes
- **TypeScript/JavaScript** - Lenguajes de programación
- **ElevenLabs API** - Text-to-Speech y efectos de sonido
- **Zod** - Validación de schemas para editor visual

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/fbmath-video-generator.git
cd fbmath-video-generator

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env
# Editar .env con tu API key de ElevenLabs
```

## 🚀 Uso

### Desarrollo
```bash
# Iniciar el estudio de Remotion
npm run dev

# Renderizar video específico
npm run render
```

### Renderizado en lote
```bash
# Renderizar todos los videos
npm run render:all
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── reel-test.tsx      # Componente principal del video
│   ├── schema.ts          # Schema para editor visual
│   ├── Root.jsx           # Configuración de composiciones
│   └── index.js           # Punto de entrada
├── data/
│   └── questions.jsx      # Preguntas y respuestas
├── public/
│   └── audio/            # Archivos de audio generados
├── scripts/
│   └── render-all.mjs    # Script de renderizado en lote
└── assets/               # Recursos estáticos
    ├── backgrounds/
    ├── fonts/
    └── graphics/
```

## ⚙️ Configuración

### Variables de Entorno
```env
ELEVENLABS_API_KEY=tu_api_key_aqui
```

### Personalización de Preguntas

Edita `data/questions.jsx` para agregar tus propias preguntas:

```javascript
export const questions = [
  {
    id: 1,
    question: "¿Cuál es el resultado de 2 + 2?",
    options: [
      { id: "A", text: "3", isCorrect: false },
      { id: "B", text: "4", isCorrect: true },
      { id: "C", text: "5", isCorrect: false },
      { id: "D", text: "6", isCorrect: false }
    ]
  }
];
```

## 🎨 Temas Disponibles

- **Teal** (`#00F5D4`) - Aguamarina vibrante
- **Violet** (`#B388FF`) - Violeta suave  
- **Orange** (`#FFB703`) - Naranja energético

## 🎵 Efectos de Sonido

El sistema incluye 5 efectos de sonido sincronizados:
- **Countdown Tick** - Cada segundo del cronómetro
- **Button Hover** - Interacción con opciones
- **Reveal Whoosh** - Al revelar la respuesta
- **Correct Answer** - Sonido de éxito
- **Time Warning** - Celebración final

## 📖 Scripts Disponibles

```bash
npm run dev          # Remotion Studio
npm run build        # Build para producción  
npm run render       # Renderizar video
npm run render:all   # Renderizar todos los videos
npm run upgrade      # Actualizar Remotion
```

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

¿Tienes preguntas? Abre un [issue](https://github.com/tu-usuario/fbmath-video-generator/issues) o contacta al equipo.

---

Hecho con ❤️ para la educación matemática

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/JonnyBurger/remotion/blob/main/LICENSE.md).
