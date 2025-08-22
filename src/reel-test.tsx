// src/reel-test.tsx
import React from 'react';
import {
AbsoluteFill,
useCurrentFrame,
useVideoConfig,
spring,
Audio,
staticFile,
Sequence,
Img,
} from 'remotion';
import 'katex/dist/katex.min.css';
import { ReelTestProps } from './schema.ts';
import { myQuestions } from '../data/my-questions.js';

// Agregar los keyframes para la animación del gradiente
const gradientAnimation = `
@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes floatRight {
  0% {
    transform: translateX(-100px) translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateX(50vw) translateY(-20px) rotate(180deg);
  }
  100% {
    transform: translateX(120vw) translateY(0px) rotate(360deg);
  }
}

@keyframes floatLeft {
  0% {
    transform: translateX(120vw) translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateX(50vw) translateY(20px) rotate(-180deg);
  }
  100% {
    transform: translateX(-100px) translateY(0px) rotate(-360deg);
  }
}

@keyframes floatUp {
  0% {
    transform: translateY(120vh) translateX(0px) rotate(0deg);
  }
  50% {
    transform: translateY(50vh) translateX(20px) rotate(180deg);
  }
  100% {
    transform: translateY(-100px) translateX(0px) rotate(360deg);
  }
}

@keyframes floatDown {
  0% {
    transform: translateY(-100px) translateX(0px) rotate(0deg);
  }
  50% {
    transform: translateY(50vh) translateX(-20px) rotate(-180deg);
  }
  100% {
    transform: translateY(120vh) translateX(0px) rotate(-360deg);
  }
}

@keyframes floatDiagonalRightUp {
  0% {
    transform: translateX(-100px) translateY(120vh) rotate(0deg);
  }
  50% {
    transform: translateX(50vw) translateY(50vh) rotate(180deg);
  }
  100% {
    transform: translateX(120vw) translateY(-100px) rotate(360deg);
  }
}

@keyframes floatDiagonalLeftDown {
  0% {
    transform: translateX(120vw) translateY(-100px) rotate(0deg);
  }
  50% {
    transform: translateX(50vw) translateY(50vh) rotate(-180deg);
  }
  100% {
    transform: translateX(-100px) translateY(120vh) rotate(-360deg);
  }
}
`;

// Inyectar los estilos CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gradientAnimation;
  document.head.appendChild(style);
}

const colors: Record<NonNullable<ReelTestProps['theme']>, string> = {
teal: '#B388FF',
violet: '#B388FF',
orange: '#B388FF',
};

export const ReelTest = ({
audioFile,
countdownTickAudio,
buttonHoverAudio,
revealWhooshAudio,
correctAnswerAudio,
timeWarningAudio,
}: Partial<ReelTestProps>) => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Usar las preguntas del archivo my-questions.js
const questions = myQuestions.map(q => ({
  id: q.id,
  q: q.question,
  options: q.options,
  theme: q.theme,
  background: q.background,
  cta: q.cta
}));

// Función para calcular duración de cada pregunta
const getQuestionDuration = (questionIndex: number) => {
  return questionIndex === 0 ? 240 : 180; // Primera pregunta: 8s, resto: 6s
};

// Función para calcular duración total incluyendo el segundo extra de respuesta
const getTotalQuestionDuration = (questionIndex: number) => {
  return getQuestionDuration(questionIndex) + 30; // +1 segundo extra después de mostrar respuesta correcta
};

// Función para calcular el frame de inicio de cada pregunta
const getQuestionStartFrame = (questionIndex: number) => {
  let startFrame = 0;
  for (let i = 0; i < questionIndex; i++) {
    startFrame += getTotalQuestionDuration(i) + 60; // duración total + pausa
  }
  return startFrame;
};

// Función para encontrar la pregunta actual basada en el frame
const getCurrentQuestionIndex = (currentFrame: number) => {
  let frameCount = 0;
  for (let i = 0; i < questions.length; i++) {
    const questionDuration = getTotalQuestionDuration(i) + 60;
    if (currentFrame < frameCount + questionDuration) {
      return i;
    }
    frameCount += questionDuration;
  }
  return questions.length - 1;
};

const currentQuestionIndex = getCurrentQuestionIndex(frame);
const currentQuestion = questions[currentQuestionIndex] || questions[questions.length - 1];
const currentDurQ = getQuestionDuration(currentQuestionIndex);

// Ajustar el frame para la pregunta actual
const adjustedFrame = frame - getQuestionStartFrame(currentQuestionIndex);

// Entrada general para cada pregunta
const enter = spring({ 
  frame: adjustedFrame, 
  fps, 
  config: { damping: 200, stiffness: 120 }
});

// Progreso del círculo para la pregunta actual
const progress = Math.max(0, 1 - (adjustedFrame / currentDurQ));
const timeLeft = Math.ceil((currentDurQ - adjustedFrame) / fps);

// Circunferencia del círculo (radio 120)
const radius = 100;
const circumference = 2 * Math.PI * radius;
const strokeDashoffset = circumference * (1 - progress);

return (
<AbsoluteFill>
{/* Fondo con gradiente animado */}
<AbsoluteFill style={{
background: 'linear-gradient(132deg, #FC415A, #591BC5, #212335)',
backgroundSize: '400% 400%',
animation: 'Gradient 15s ease infinite',
position: 'relative',
height: '100%',
width: '100%',
overflow: 'hidden',
padding: 0,
margin: 0,
}} />

{/* Logo en esquina superior derecha */}
<AbsoluteFill style={{
justifyContent: 'flex-start',
alignItems: 'flex-end',
padding: 90,
}}>
<Img
src={staticFile('assets/backgrounds/logo.png')}
style={{
width: 180,
height: 'auto',

}}
/>
</AbsoluteFill>

{/* Círculo rotatorio con texto en esquina superior derecha - AGRANDADO AL DOBLE */}
<AbsoluteFill style={{
justifyContent: 'flex-start',
alignItems: 'flex-end',
padding: 20 ,
marginLeft: -40
}}>
<div style={{
position: 'relative',
width: 240, // De 120 a 240
height: 240, // De 120 a 240
animation: 'rotate 10s linear infinite',
}}>
<svg
width="240" // De 120 a 240
height="240" // De 120 a 240
viewBox="0 0 240 240" // De 120 a 240
style={{
position: 'absolute',
top: 0,
right: 0,
}}
>
{/* Círculo invisible para el path del texto */}
<defs>
<path
id="circle-path"
d="M 120,120 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
// Centro de 60,60 a 120,120 y radio de 45 a 90
/>
</defs>

{/* Texto curvado siguiendo el círculo */}
<text
fontSize="20" // De 10 a 20
fill="white"
fontFamily="Roboto, sans-serif"
fontWeight="600"
letterSpacing="2px" // De 1px a 2px
>
<textPath href="#circle-path" startOffset="0%">
 TEST YOUR KNOWLEDGE! • HOW FAST ARE YOU? • 
</textPath>
</text>
</svg>

{/* Punto central del círculo */}
<div style={{
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
width: 16, // De 8 a 16
height: 16, // De 8 a 16
borderRadius: '50%',
opacity: 0.8,
}} />
</div>
</AbsoluteFill>

{/* Figuras geométricas flotantes */}
<AbsoluteFill style={{ overflow: 'hidden' }}>
{/* Círculo flotante desde la izquierda */}
<div style={{
position: 'absolute',
width: 210,
height: 210,
borderRadius: '50%',
background: 'rgba(255, 255, 255, 0.1)',
top: '20%',
left: '0%',
animation: 'floatRight 12s ease-in-out infinite',
animationDelay: '0s',
}} />

{/* Triángulo flotante desde la derecha */}
<div style={{
position: 'absolute',
width: 0,
height: 0,
borderLeft: '40px solid transparent',
borderRight: '40px solid transparent',
borderBottom: '70px solid rgba(255, 255, 255, 0.08)',
top: '60%',
right: '0%',
animation: 'floatLeft 15s ease-in-out infinite',
animationDelay: '2s',
}} />

{/* Cuadrado flotante desde arriba */}
<div style={{
position: 'absolute',
width: 80,
height: 80,
background: 'rgba(255, 255, 255, 0.06)',
top: '-100px',
left: '30%',
animation: 'floatDown 18s ease-in-out infinite',
animationDelay: '4s',
}} />

{/* Círculo flotante diagonal */}
<div style={{
position: 'absolute',
width: 120,
height: 120,
borderRadius: '50%',
background: 'rgba(255, 255, 255, 0.05)',
bottom: '-120px',
right: '-120px',
animation: 'floatDiagonalLeftDown 20s ease-in-out infinite',
animationDelay: '6s',
}} />

{/* Hexágono flotante desde la derecha */}
<div style={{
position: 'absolute',
width: 70,
height: 70,
background: 'rgba(255, 255, 255, 0.07)',
clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
top: '40%',
right: '-70px',
animation: 'floatLeft 16s ease-in-out infinite',
animationDelay: '8s',
}} />

{/* Rombo flotante desde abajo */}
<div style={{
position: 'absolute',
width: 50,
height: 50,
background: 'rgba(255, 255, 255, 0.09)',
transform: 'rotate(45deg)',
bottom: '-50px',
left: '45%',
animation: 'floatUp 14s ease-in-out infinite',
animationDelay: '10s',
}} />

{/* Círculo pequeño desde arriba derecha */}
<div style={{
position: 'absolute',
width: 25,
height: 25,
borderRadius: '50%',
background: 'rgba(255, 255, 255, 0.12)',
top: '-25px',
right: '20%',
animation: 'floatDown 10s ease-in-out infinite',
animationDelay: '1s',
}} />

{/* Triángulo grande diagonal */}
<div style={{
position: 'absolute',
width: 0,
height: 0,
borderLeft: '60px solid transparent',
borderRight: '60px solid transparent',
borderBottom: '100px solid rgba(255, 255, 255, 0.04)',
bottom: '-100px',
left: '-60px',
animation: 'floatDiagonalRightUp 22s ease-in-out infinite',
animationDelay: '12s',
}} />

{/* Cuadrado pequeño desde la derecha */}
<div style={{
position: 'absolute',
width: 35,
height: 35,
background: 'rgba(255, 255, 255, 0.08)',
top: '50%',
right: '-35px',
animation: 'floatLeft 13s ease-in-out infinite',
animationDelay: '3s',
}} />

{/* Hexágono grande desde arriba */}
<div style={{
position: 'absolute',
width: 100,
height: 100,
background: 'rgba(255, 255, 255, 0.03)',
clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
top: '-100px',
left: '70%',
animation: 'floatDown 19s ease-in-out infinite',
animationDelay: '14s',
}} />

{/* Círculo mediano desde la izquierda */}
<div style={{
position: 'absolute',
width: 90,
height: 90,
borderRadius: '50%',
background: 'rgba(255, 255, 255, 0.07)',
top: '70%',
left: '-90px',
animation: 'floatRight 17s ease-in-out infinite',
animationDelay: '5s',
}} />

{/* Rombo grande diagonal */}
<div style={{
position: 'absolute',
width: 80,
height: 80,
background: 'rgba(255, 255, 255, 0.05)',
transform: 'rotate(45deg)',
top: '-80px',
left: '-80px',
animation: 'floatDiagonalRightUp 21s ease-in-out infinite',
animationDelay: '16s',
}} />

{/* Triángulo pequeño invertido desde abajo */}
<div style={{
position: 'absolute',
width: 0,
height: 0,
borderLeft: '25px solid transparent',
borderRight: '25px solid transparent',
borderTop: '45px solid rgba(255, 255, 255, 0.10)',
bottom: '-45px',
right: '40%',
animation: 'floatUp 11s ease-in-out infinite',
animationDelay: '7s',
}} />

{/* Cuadrado mediano desde arriba */}
<div style={{
position: 'absolute',
width: 75,
height: 75,
background: 'rgba(255, 255, 255, 0.06)',
top: '-75px',
right: '10%',
animation: 'floatDown 16s ease-in-out infinite',
animationDelay: '9s',
}} />

{/* Círculo extra grande diagonal */}
<div style={{
position: 'absolute',
width: 150,
height: 150,
borderRadius: '50%',
background: 'rgba(255, 255, 255, 0.02)',
bottom: '-150px',
right: '30%',
animation: 'floatDiagonalLeftDown 25s ease-in-out infinite',
animationDelay: '18s',
}} />

{/* Hexágono pequeño desde la derecha */}
<div style={{
position: 'absolute',
width: 45,
height: 45,
background: 'rgba(255, 255, 255, 0.09)',
clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
top: '90%',
right: '-45px',
animation: 'floatLeft 12s ease-in-out infinite',
animationDelay: '11s',
}} />

{/* Rombo pequeño desde abajo */}
<div style={{
position: 'absolute',
width: 30,
height: 30,
background: 'rgba(255, 255, 255, 0.11)',
transform: 'rotate(45deg)',
bottom: '-30px',
left: '20%',
animation: 'floatUp 14s ease-in-out infinite',
animationDelay: '13s',
}} />

{/* Triángulo mediano diagonal */}
<div style={{
position: 'absolute',
width: 0,
height: 0,
borderLeft: '45px solid transparent',
borderRight: '45px solid transparent',
borderBottom: '80px solid rgba(255, 255, 255, 0.06)',
top: '-80px',
right: '-45px',
animation: 'floatDiagonalLeftDown 18s ease-in-out infinite',
animationDelay: '15s',
}} />
</AbsoluteFill>

{/* Audio de la pregunta */}
{audioFile && (
<Audio
  src={staticFile(audioFile.startsWith('audio/') ? audioFile : `audio/${audioFile}`)}
  volume={0.7}
/>
)}

{/* Audio generado con Eleven Labs para cada pregunta */}
{questions.map((question, index) => {
  const questionStartFrame = getQuestionStartFrame(index);
  const questionDuration = getQuestionDuration(index);
  const questionAudioFile = `audio/question_${question.id}_elevenlabs.mp3`;
  
  return (
    <Sequence key={`question-${question.id}`} from={questionStartFrame} durationInFrames={questionDuration}>
      <Audio
        src={staticFile(questionAudioFile)}
        volume={0.8}
      />
    </Sequence>
  );
})}

{/* Audio de respuesta - se reproduce después del timer de cada pregunta */}
{questions.map((question, index) => {
  const questionStartFrame = getQuestionStartFrame(index);
  const questionDuration = getQuestionDuration(index);
  const answerStartFrame = questionStartFrame + questionDuration + 30;
  const answerAudioFile = `audio/answer_${question.id}_elevenlabs.mp3`;
  
  return (
    <Sequence key={`answer-${question.id}`} from={answerStartFrame} durationInFrames={90}>
      <Audio
        src={staticFile(answerAudioFile)}
        volume={0.8}
      />
    </Sequence>
  );
})}

{/* Efectos de sonido - USANDO SEQUENCE PARA TIMING CORRECTO POR PREGUNTA */}
{questions.map((question, index) => {
  const questionStartFrame = getQuestionStartFrame(index);
  const questionDuration = getQuestionDuration(index);
  
  return (
    <div key={`effects-${question.id}`}>
      {/* Tick del cronómetro - cada 30 frames desde frame 30 hasta duración de pregunta */}
      {countdownTickAudio && (
        <>
          {Array.from({ length: Math.floor((questionDuration - 30) / 30) }, (_, i) => (
            <Sequence key={`tick-${index}-${i}`} from={questionStartFrame + 30 + i * 30} durationInFrames={30}>
              <Audio
                src={staticFile(countdownTickAudio.startsWith('audio/') ? countdownTickAudio : `audio/${countdownTickAudio}`)}
                volume={1.0}
              />
            </Sequence>
          ))}
        </>
      )}

      {/* Hover de botones - en frame 60 de cada pregunta */}
      {buttonHoverAudio && (
        <Sequence from={questionStartFrame + 60} durationInFrames={30}>
          <Audio
            src={staticFile(buttonHoverAudio.startsWith('audio/') ? buttonHoverAudio : `audio/${buttonHoverAudio}`)}
            volume={1.0}
          />
        </Sequence>
      )}

      {/* Whoosh al revelar respuesta - al final de cada pregunta */}
      {revealWhooshAudio && (
        <Sequence from={questionStartFrame + questionDuration} durationInFrames={30}>
          <Audio
            src={staticFile(revealWhooshAudio.startsWith('audio/') ? revealWhooshAudio : `audio/${revealWhooshAudio}`)}
            volume={1.0}
          />
        </Sequence>
      )}

      {/* Sonido de éxito - después del whoosh */}
      {correctAnswerAudio && (
        <Sequence from={questionStartFrame + questionDuration + 15} durationInFrames={30}>
          <Audio
            src={staticFile(correctAnswerAudio.startsWith('audio/') ? correctAnswerAudio : `audio/${correctAnswerAudio}`)}
            volume={1.0}
          />
        </Sequence>
      )}

      {/* Celebración final - después del sonido de éxito */}
      {timeWarningAudio && (
        <Sequence from={questionStartFrame + questionDuration + 30} durationInFrames={30}>
          <Audio
            src={staticFile(timeWarningAudio.startsWith('audio/') ? timeWarningAudio : `audio/${timeWarningAudio}`)}
            volume={1.0}
          />
        </Sequence>
      )}
    </div>
  );
})}

{/* Timer en el fondo del canvas */}
{adjustedFrame < currentDurQ && (
<AbsoluteFill style={{ 
justifyContent: 'flex-end', 
alignItems: 'center',
paddingBottom: 170 
}}>
<div style={{
position: 'relative',
width: 240,
height: 240,
}}>
{/* Círculo de fondo */}
<svg
width="300"
height="300"
style={{
position: 'absolute',
bottom: 60,
left: 0,
transform: 'rotate(-90deg)', // Empieza desde arriba
}}
>
<circle
cx="120"
cy="120"
r={radius}
fill="none"
stroke="rgba(255, 255, 255, 0.2)"
strokeWidth="18"
/>
<circle
cx="120"
cy="120"
r={radius}
fill="none"
stroke={colors[currentQuestion.theme]}
strokeWidth="12"
strokeDasharray={circumference}
strokeDashoffset={strokeDashoffset}
strokeLinecap="round"
style={{
transition: 'stroke-dashoffset 0.1s ease',
}}
/>
</svg>

{/* Contador de tiempo */}
<div style={{
position: 'absolute',
top: '26%',
left: '50%',
transform: 'translate(-50%, -50%)',
fontFamily: 'Roboto, sans-serif',
fontSize: 114,
fontWeight: 'bold',
color: 'white',
textAlign: 'center',
}}>
{timeLeft.toString().padStart(2, '')}
</div>
</div>
</AbsoluteFill>
)}

{/* Pregunta y Alternativas */}
<AbsoluteFill style={{ justifyContent: 'start', alignItems: 'center',
  top: 500
}}>
<div style={{
width: 980,
maxWidth: '80%',
transform: `translateY(${(1 - enter) * 100}px)`,
opacity: enter,
}}>
{/* Pregunta */}
<div style={{

borderRadius: 24,
padding: 30,
marginBottom: 70,
}}>
<div style={{
fontFamily: 'Roboto, sans-serif',
fontSize: 68,
fontWeight: 700,
color: 'white',
textAlign: 'center',
lineHeight: 1.2,
}}>
{currentQuestion.q}
</div>
</div>

{/* Alternativas */}
<div style={{
display: 'flex',
flexDirection: 'column',
gap: 30,
}}>
{currentQuestion.options.map((option, index) => (
<div
key={option.id}
style={{
backgroundColor: adjustedFrame > currentDurQ && option.isCorrect 
  ? '#FFD700' // Amarillo para la respuesta correcta
  : 'rgba(255, 255, 255, 0.6)',
borderRadius: 56,
padding: '24px 32px',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
transform: `translateX(${(1 - enter) * (50 * (index + 1))}px)`,
transition: 'background-color 0.5s ease',
border: adjustedFrame > currentDurQ && option.isCorrect ? '3px solid #FFA500' : 'none',
}}
>
<span style={{
fontFamily: 'Roboto, sans-serif',
fontSize: 66,
color:  adjustedFrame > currentDurQ && option.isCorrect 
  ? 'white' // Amarillo para la respuesta correcta
  : 'black',
fontWeight: '300',
}}>
{option.text}
</span>
</div>
))}
</div>
</div>
</AbsoluteFill>

{/* CTA */}
<AbsoluteFill style={{ 
justifyContent: 'flex-end', 
alignItems: 'center',
paddingBottom: 40 
}}>
<div style={{
fontFamily: 'Roboto, sans-serif',
backgroundColor: 'rgba(0,0,0,0.8)',
color: 'white',
padding: '16px 32px',
borderRadius: 25,
fontSize: 28,
fontWeight: '600',
transform: `translateY(${(1 - enter) * 50}px)`,
opacity: enter * 0.9,
}}>
{currentQuestion.cta}
</div>
</AbsoluteFill>
</AbsoluteFill>
);
};
