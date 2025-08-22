// src/Root.jsx
import { Composition } from 'remotion';
import { ReelTest } from './reel-test.tsx';
import { reelTestSchema } from './schema.ts';
import { myQuestions } from '../data/my-questions.js';

// Calcular duración total basada en el número de preguntas con duraciones dinámicas
const calculateTotalDuration = () => {
  let totalFrames = 0;
  for (let i = 0; i < myQuestions.length; i++) {
    const questionDuration = i === 0 ? 240 : 180; // Primera pregunta: 8s, resto: 6s
    const totalQuestionDuration = questionDuration + 30; // +1 segundo extra para respuesta
    totalFrames += totalQuestionDuration + 60; // duración total + pausa
  }
  return totalFrames;
};

const totalDurationFrames = calculateTotalDuration();

export const RemotionRoot = () => {
return (
<>
<Composition
id="ReelTest"
component={ReelTest}
durationInFrames={totalDurationFrames} // Duración dinámica
fps={30}
width={1080}
height={1920}
defaultProps={{
q: myQuestions[0].question,
options: myQuestions[0].options,
theme: myQuestions[0].theme,
cta: myQuestions[0].cta,
}}
/>
</>
);
};