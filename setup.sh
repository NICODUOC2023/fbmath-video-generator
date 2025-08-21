#!/bin/bash

echo "🎬 FBMath Video Generator - Setup Script"
echo "========================================"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tu API key de ElevenLabs"
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p public/audio
mkdir -p assets/backgrounds
mkdir -p assets/fonts
mkdir -p assets/graphics

echo "✅ Setup completado!"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Edita .env con tu API key de ElevenLabs"
echo "2. Ejecuta 'npm run dev' para iniciar Remotion Studio"
echo "3. Personaliza las preguntas en data/questions.jsx"
echo ""
echo "📚 Documentación: README.md"
