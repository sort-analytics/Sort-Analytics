import { algorithms, getAlgorithm } from './algorithms/index.js';
import { Visualizer }      from './core/Visualizer.js';
import { CodePanel }       from './core/CodePanel.js';
import { Player }          from './core/Player.js';
import { AudioEngine }     from './core/AudioEngine.js';
import { ComplexityChart } from './core/ComplexityChart.js';
import { generateData, CaseType } from './core/DataFactory.js';
import { Controls, SPEEDS } from './ui/Controls.js';

const state = {
  algorithmId: algorithms[0].id,
  size: 40,
  caseType: CaseType.RANDOM,
  speed: SPEEDS[1],
};

const visualizer = new Visualizer(document.getElementById('bars'));
const codePanel  = new CodePanel(document.getElementById('code'));
const audio      = new AudioEngine();
const player     = new Player(visualizer, codePanel);
const chart      = new ComplexityChart(document.getElementById('complexity-chart'));

const controls = new Controls({
  algorithms,
  onAlgorithmChange(algo) { state.algorithmId = algo.id; regenerate(); },
  onSizeChange(size)      { state.size = size; regenerate(); },
  onCaseChange(c)         { state.caseType = c; regenerate(); },
  onSpeedChange(speed)    { state.speed = speed; player.setSpeed(speed.sps); },
  onPlayToggle()          { player.toggle(); },
  onStep()                { player.stepAndRender(); },
  onReset()               { player.reset(); player.pause(); },
  onNewData()             { regenerate(); },
  onSoundToggle()         { controls.setSoundEnabled(audio.toggle()); },
});

/* ── Hooks del Player ── */

let wasFinished = false;

player.onStateChange = ({ playing, finished, canStep }) => {
  controls.setPlaying(playing);
  controls.setStepEnabled(canStep);
  if (finished) controls.btnPlay.textContent = '↻ Repetir';

  // Sólo marcamos en la transición false → true
  if (finished && !wasFinished) {
    chart.markExecution(player.length, player.counters.iterations, state.caseType);
  }
  wasFinished = finished;
};

player.onCountersChange = (c) => controls.updateStats(c);
player.onSorted         = (index, value, total) => audio.play(value / total);

/* ── Desbloqueo de audio tras primer gesto ── */
const unlock = () => {
  audio.unlock();
  document.removeEventListener('click', unlock);
  document.removeEventListener('keydown', unlock);
};
document.addEventListener('click', unlock);
document.addEventListener('keydown', unlock);

/* ── Flujo principal ── */
function regenerate() {
  const algo = getAlgorithm(state.algorithmId);
  const data = generateData(state.size, state.caseType, algo);
  player.setSpeed(state.speed.sps);
  player.load(algo, data);
  chart.setAlgorithm(algo);   // redibuja curvas y limpia el marcador
  wasFinished = false;
}

/* ── Atajos ── */
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select, textarea')) return;
  if (e.code === 'Space')      { e.preventDefault(); player.toggle(); }
  if (e.code === 'ArrowRight') { e.preventDefault(); player.stepAndRender(); }
  if (e.code === 'KeyR')       { player.reset(); }
  if (e.code === 'KeyM')       { controls.setSoundEnabled(audio.toggle()); }
});

regenerate();
