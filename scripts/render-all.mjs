// scripts/render-all.mjs
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';


const data = JSON.parse(readFileSync('data/questions.jsx', 'utf8'));


for (const item of data) {
const out = `out/reel_${String(item.id).padStart(3, '0')}.mp4`;
const props = JSON.stringify(item);
console.log(`\n▶ Render ${out}`);
const run = spawnSync('npx', [
'remotion', 'render',
'ReelTest', out,  // Cambiar de 'Reel' a 'ReelTest'
'--props', props
], { stdio: 'inherit' });
if (run.status !== 0) {
console.error('❌ Error en render', item.id);
process.exit(run.status ?? 1);
}
}
console.log('\n✅ Batch completo');