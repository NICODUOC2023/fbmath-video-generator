// src/Root.jsx
import { Composition } from 'remotion';
import { ReelTest } from './reel-test';
import { reelTestSchema } from './schema';

export const RemotionRoot = () => {
return (
<>
<Composition
id="ReelTest"
component={ReelTest}
width={1080}
height={1920}
fps={30}
durationInFrames={300}
schema={reelTestSchema}
defaultProps={{
q: '¿Cuánto es la mitad de 5?',
options: [
  { id: 'A', text: '2.5', isCorrect: true },
  { id: 'B', text: '3', isCorrect: false },
  { id: 'C', text: '5', isCorrect: false },
  { id: 'D', text: '2', isCorrect: false },
],
audioFile: 'question_001.mp3',
countdownTickAudio: 'countdown-tick.mp3',
buttonHoverAudio: 'button-hover.mp3',
revealWhooshAudio: 'reveal-whoosh.mp3',
correctAnswerAudio: 'correct-answer.mp3',
timeWarningAudio: 'time-warning.mp3',
durQ: 180,
theme: 'teal',
cta: 'Comenta tu respuesta ↓',
}}
/>
</>
);
};