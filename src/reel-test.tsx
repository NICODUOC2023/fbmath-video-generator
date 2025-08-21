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
} from 'remotion';
import 'katex/dist/katex.min.css';
import { ReelTestProps } from './schema';

const colors: Record<NonNullable<ReelTestProps['theme']>, string> = {
teal: '#00F5D4',
violet: '#B388FF',
orange: '#FFB703',
};

export const ReelTest = ({
q,
options,
audioFile,
countdownTickAudio,
buttonHoverAudio,
revealWhooshAudio,
correctAnswerAudio,
timeWarningAudio,
durQ = 180,
theme = 'teal',
cta = 'Comenta tu respuesta ↓',
}: ReelTestProps) => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Entrada general
const enter = spring({ frame, fps, config: { damping: 200, stiffness: 120 }});

// Progreso del círculo (de 1 a 0 para countdown)
const progress = Math.max(0, 1 - (frame / durQ));
const timeLeft = Math.ceil((durQ - frame) / fps);

// Circunferencia del círculo (radio 60)
const radius = 60;
const circumference = 2 * Math.PI * radius;
const strokeDashoffset = circumference * (1 - progress);

return (
<AbsoluteFill style={{ 
backgroundColor: '#1a1a2e',
background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
}} >

{/* Audio de la pregunta */}
{audioFile && (
<Audio
  src={staticFile(audioFile.startsWith('audio/') ? audioFile : `audio/${audioFile}`)}
  volume={0.7}
/>
)}

{/* Efectos de sonido - USANDO SEQUENCE PARA TIMING CORRECTO */}
{/* Tick del cronómetro - cada 30 frames desde frame 30 hasta durQ */}
{countdownTickAudio && (
<>
  {Array.from({ length: Math.floor((durQ - 30) / 30) }, (_, i) => (
    <Sequence key={i} from={30 + i * 30} durationInFrames={30}>
      <Audio
        src={staticFile(countdownTickAudio.startsWith('audio/') ? countdownTickAudio : `audio/${countdownTickAudio}`)}
        volume={1.0}
      />
    </Sequence>
  ))}
</>
)}

{/* Hover de botones - en frame 60 */}
{buttonHoverAudio && (
<Sequence from={60} durationInFrames={30}>
  <Audio
    src={staticFile(buttonHoverAudio.startsWith('audio/') ? buttonHoverAudio : `audio/${buttonHoverAudio}`)}
    volume={1.0}
  />
</Sequence>
)}

{/* Whoosh al revelar respuesta - en frame durQ */}
{revealWhooshAudio && (
<Sequence from={durQ} durationInFrames={30}>
  <Audio
    src={staticFile(revealWhooshAudio.startsWith('audio/') ? revealWhooshAudio : `audio/${revealWhooshAudio}`)}
    volume={1.0}
  />
</Sequence>
)}

{/* Sonido de éxito - en frame durQ + 15 */}
{correctAnswerAudio && (
<Sequence from={durQ + 15} durationInFrames={30}>
  <Audio
    src={staticFile(correctAnswerAudio.startsWith('audio/') ? correctAnswerAudio : `audio/${correctAnswerAudio}`)}
    volume={1.0}
  />
</Sequence>
)}

{/* Celebración final - en frame durQ + 30 */}
{timeWarningAudio && (
<Sequence from={durQ + 30} durationInFrames={30}>
  <Audio
    src={staticFile(timeWarningAudio.startsWith('audio/') ? timeWarningAudio : `audio/${timeWarningAudio}`)}
    volume={1.0}
  />
</Sequence>
)}

{/* Timer en el fondo del canvas */}
{frame < durQ && (
<AbsoluteFill style={{ 
justifyContent: 'flex-end', 
alignItems: 'center',
paddingBottom: 120 
}}>
<div style={{
position: 'relative',
width: 120,
height: 120,
}}>
{/* Círculo de fondo */}
<svg
width="120"
height="120"
style={{
position: 'absolute',
top: 0,
left: 0,
transform: 'rotate(-90deg)', // Empieza desde arriba
}}
>
<circle
cx="60"
cy="60"
r={radius}
fill="none"
stroke="rgba(255, 255, 255, 0.2)"
strokeWidth="8"
/>
<circle
cx="60"
cy="60"
r={radius}
fill="none"
stroke={colors[theme]}
strokeWidth="8"
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
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
fontFamily: 'Roboto, sans-serif',
fontSize: 24,
fontWeight: 'bold',
color: 'white',
textAlign: 'center',
}}>
00:{timeLeft.toString().padStart(2, '0')}
</div>
</div>
</AbsoluteFill>
)}

{/* Pregunta y Alternativas */}
<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
<div style={{
width: 980,
maxWidth: '90%',
transform: `translateY(${(1 - enter) * 100}px)`,
opacity: enter,
}}>
{/* Pregunta */}
<div style={{
backgroundColor: 'rgba(255, 255, 255, 0.95)',
borderRadius: 24,
padding: 40,
marginBottom: 40,
}}>
<div style={{
fontFamily: 'Roboto, sans-serif',
fontSize: 48,
fontWeight: 'bold',
color: '#333',
textAlign: 'center',
lineHeight: 1.2,
}}>
{q}
</div>
</div>

{/* Alternativas */}
<div style={{
display: 'flex',
flexDirection: 'column',
gap: 20,
}}>
{options.map((option, index) => (
<div
key={option.id}
style={{
backgroundColor: frame > durQ && option.isCorrect 
  ? '#FFD700' // Amarillo para la respuesta correcta
  : 'rgba(255, 255, 255, 0.9)',
borderRadius: 16,
padding: '24px 32px',
display: 'flex',
alignItems: 'center',
transform: `translateX(${(1 - enter) * (50 * (index + 1))}px)`,
transition: 'background-color 0.5s ease',
border: frame > durQ && option.isCorrect ? '3px solid #FFA500' : 'none',
}}
>
<div style={{
width: 60,
height: 60,
borderRadius: '50%',
backgroundColor: colors[theme],
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
marginRight: 24,
}}>
<span style={{
fontFamily: 'Roboto, sans-serif',
fontSize: 24,
fontWeight: 'bold',
color: 'white',
}}>
{option.id}
</span>
</div>
<span style={{
fontFamily: 'Roboto, sans-serif',
fontSize: 36,
fontWeight: '600',
color: '#333',
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
{cta}
</div>
</AbsoluteFill>
</AbsoluteFill>
);
};
