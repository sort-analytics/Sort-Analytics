import { algorithms, getAlgorithm } from './algorithms/index.js';
import { Visualizer }      from './core/Visualizer.js';
import { CodePanel }       from './core/CodePanel.js';
import { Player }          from './core/Player.js';
import { Comparison }      from './core/Comparison.js';
import { AudioEngine }     from './core/AudioEngine.js';
import { ComplexityChart } from './core/ComplexityChart.js';
import { generateData, CaseType } from './core/DataFactory.js';
import { Controls, SPEEDS } from './ui/Controls.js';

const Mode = Object.freeze({ SINGLE: 'single', COMPARE: 'compare' });

const state = {
  mode: Mode.SINGLE,
  algorithmId: algorithms[0].id,
  algorithmBId: algorithms[1].id,   // sólo se usa en modo comparación
  size: 40,
  caseType: CaseType.RANDOM,
  speed: SPEEDS[1],
};

const visualizer = new Visualizer(document.getElementById('bars'));
const codePanel  = new CodePanel(document.getElementById('code'));
const audio      = new AudioEngine();
const player     = new Player(visualizer, codePanel);
const chart      = new ComplexityChart(document.getElementById('complexity-chart'));

/* Modo comparación: dos Player sincronizados sobre el mismo arreglo. */
const comparison = new Comparison({
  onSorted: (index, value, total) => audio.play(value / total),  // sólo panel A
  onInfo:   (algo) => controls.openFicha(algo),
});

/** Motor activo. Player y Comparison comparten la misma interfaz de control. */
const active = () => (state.mode === Mode.COMPARE ? comparison : player);

const controls = new Controls({
  algorithms,
  onModeChange(mode)       { setMode(mode); },
  onAlgorithmChange(algo)  { state.algorithmId = algo.id; regenerate(); },
  onAlgorithmBChange(algo) { state.algorithmBId = algo.id; regenerate(); },
  onSizeChange(size)       { state.size = size; regenerate(); },
  onCaseChange(c)          { state.caseType = c; regenerate(); },
  onSpeedChange(speed)     { state.speed = speed; active().setSpeed(speed.sps); },
  onPlayToggle()           { active().toggle(); },
  onStep()                 { active().stepAndRender(); },
  onReset()                { active().reset(); if (state.mode === Mode.SINGLE) player.pause(); },
  onNewData()              { regenerate(); },
  onSoundToggle()          { controls.setSoundEnabled(audio.toggle()); },
});

/* ── Estado de reproducción (común a ambos modos) ── */

let wasFinished = false;

function applyPlaybackState({ playing, finished, canStep }) {
  controls.setPlaying(playing);
  controls.setStepEnabled(canStep);
  if (finished) controls.btnPlay.textContent = '↻ Repetir';
}

/* ── Hooks del Player (modo individual) ── */
player.onStateChange = (s) => {
  if (state.mode !== Mode.SINGLE) return;
  applyPlaybackState(s);

  // Sólo marcamos en la transición false → true
  if (s.finished && !wasFinished) {
    chart.markExecution(player.length, player.counters.iterations, state.caseType);
  }
  wasFinished = s.finished;
};

player.onCountersChange = (c) => { if (state.mode === Mode.SINGLE) controls.updateStats(c); };
player.onSorted         = (index, value, total) => audio.play(value / total);

/* ── Hook de la comparación ── */
comparison.onStateChange = (s) => {
  if (state.mode !== Mode.COMPARE) return;
  applyPlaybackState(s);
};

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
  if (state.mode === Mode.COMPARE) {
    // Un único arreglo, generado sin sesgo de algoritmo, compartido por A y B.
    const data = generateData(state.size, state.caseType);
    comparison.setSpeed(state.speed.sps);
    comparison.load(getAlgorithm(state.algorithmId), getAlgorithm(state.algorithmBId), data, state.caseType);
    return;
  }

  const algo = getAlgorithm(state.algorithmId);
  const data = generateData(state.size, state.caseType, algo);
  player.setSpeed(state.speed.sps);
  player.load(algo, data);
  chart.setAlgorithm(algo);   // redibuja curvas y limpia el marcador
  wasFinished = false;
}

function setMode(mode) {
  if (mode === state.mode) return;

  // Detener el motor que deja de estar activo
  if (state.mode === Mode.COMPARE) comparison.stop(); else player.stop();

  state.mode = mode;
  if (mode === Mode.COMPARE) {
    state.algorithmBId = controls.getAlgorithmBId();
    // A y B deben ser distintos
    if (state.algorithmBId === state.algorithmId) {
      const other = algorithms.find((a) => a.id !== state.algorithmId);
      state.algorithmBId = other.id;
      controls.selectB.value = other.id;
    }
    controls._syncDistinct();
  }
  controls.setPlaying(false);
  regenerate();
}

/* ── Atajos ── */
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select, textarea')) return;
  if (e.code === 'Space')      { e.preventDefault(); active().toggle(); }
  if (e.code === 'ArrowRight') { e.preventDefault(); active().stepAndRender(); }
  if (e.code === 'KeyR')       { active().reset(); }
  if (e.code === 'KeyM')       { controls.setSoundEnabled(audio.toggle()); }
});

regenerate();
