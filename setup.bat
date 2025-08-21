@echo off
echo 🎬 FBMath Video Generator - Setup Script
echo ========================================

REM Instalar dependencias
echo 📦 Instalando dependencias...
npm install

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy .env.example .env
    echo ⚠️  IMPORTANTE: Edita el archivo .env con tu API key de ElevenLabs
)

REM Crear directorios necesarios
echo 📁 Creando directorios...
if not exist "public\audio" mkdir "public\audio"
if not exist "assets\backgrounds" mkdir "assets\backgrounds"
if not exist "assets\fonts" mkdir "assets\fonts"
if not exist "assets\graphics" mkdir "assets\graphics"

echo ✅ Setup completado!
echo.
echo 🚀 Próximos pasos:
echo 1. Edita .env con tu API key de ElevenLabs
echo 2. Ejecuta 'npm run dev' para iniciar Remotion Studio
echo 3. Personaliza las preguntas en data/questions.jsx
echo.
echo 📚 Documentación: README.md
pause
