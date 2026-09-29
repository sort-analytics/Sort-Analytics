/**
 * Controls
 * Construye y gestiona los controles del sidebar.
 * Se alimenta del registro de algoritmos: agregar uno nuevo
 * lo hace aparecer automáticamente en el <select>.
 */
export const SPEEDS = [
  { label: '0.5×', sps: 4 },
  { label: '1×',   sps: 12 },
  { label: '2×',   sps: 35 },
  { label: '4×',   sps: 90 },
  { label: '8×',   sps: 250 },
  { label: '16×',  sps: 800 },
];

export class Controls {
  constructor(opts) {
    const {
      algorithms,
      onAlgorithmChange, onSizeChange, onCaseChange, onSpeedChange,
      onPlayToggle, onStep, onReset, onNewData, onSoundToggle,
    } = opts;

    this.algorithms = algorithms;

    this.select     = document.getElementById('algo-select');
    this.desc       = document.getElementById('algo-desc');
    this.complexity = document.getElementById('algo-complexity');
    this.sizeRange  = document.getElementById('size-range');
    this.sizeVal    = document.getElementById('size-val');
    this.caseGroup  = document.getElementById('case-group');
    this.speedGroup = document.getElementById('speed-group');
    this.btnPlay    = document.getElementById('btn-play');
    this.btnStep    = document.getElementById('btn-step');
    this.btnReset   = document.getElementById('btn-reset');
    this.btnNew     = document.getElementById('btn-new');
    this.btnSound   = document.getElementById('btn-sound');

    this.statIterations  = document.getElementById('stat-iterations');
    this.statComparisons = document.getElementById('stat-comparisons');
    this.statSwaps       = document.getElementById('stat-swaps');
    this.statSorted      = document.getElementById('stat-sorted');

    this._buildAlgorithmSelect();
    this._buildSpeeds();
    this._bindEvents({
      onAlgorithmChange, onSizeChange, onCaseChange, onSpeedChange,
      onPlayToggle, onStep, onReset, onNewData, onSoundToggle,
    });

    this.setSpeed(SPEEDS[1]);
    this.updateAlgorithmMeta(algorithms[0]);
    this.setSoundEnabled(true);
  }

  _buildAlgorithmSelect() {
    this.algorithms.forEach((algo) => {
      const opt = document.createElement('option');
      opt.value = algo.id;
      opt.textContent = algo.name;
      this.select.appendChild(opt);
    });
  }

  _buildSpeeds() {
    SPEEDS.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.textContent = s.label;
      btn.dataset.speed = String(i);
      if (i === 1) btn.classList.add('active');
      this.speedGroup.appendChild(btn);
    });
  }

  _bindEvents(cb) {
    this.select.addEventListener('change', (e) => {
      const algo = this.algorithms.find((a) => a.id === e.target.value);
      this.updateAlgorithmMeta(algo);
      cb.onAlgorithmChange?.(algo);
    });

    this.sizeRange.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      this.sizeVal.textContent = v;
      cb.onSizeChange?.(v);
    });

    this.caseGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-case]');
      if (!btn) return;
      this._activate(this.caseGroup, btn);
      cb.onCaseChange?.(btn.dataset.case);
    });

    this.speedGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-speed]');
      if (!btn) return;
      this._activate(this.speedGroup, btn);
      cb.onSpeedChange?.(SPEEDS[Number(btn.dataset.speed)]);
    });

    this.btnPlay.addEventListener('click', () => cb.onPlayToggle?.());
    this.btnStep.addEventListener('click', () => cb.onStep?.());
    this.btnReset.addEventListener('click', () => cb.onReset?.());
    this.btnNew.addEventListener('click', () => cb.onNewData?.());
    this.btnSound.addEventListener('click', () => cb.onSoundToggle?.());
  }

  _activate(group, btn) {
    group.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  }

  updateAlgorithmMeta(algo) {
    this.desc.textContent = algo.description ?? '';
    this.complexity.innerHTML = '';
    const c = algo.complexity ?? {};
    const labels = { best: 'Mejor', average: 'Promedio', worst: 'Peor', space: 'Espacio' };
    Object.entries(labels).forEach(([key, label]) => {
      if (!c[key]) return;
      const span = document.createElement('span');
      span.textContent = `${label}: ${c[key]}`;
      this.complexity.appendChild(span);
    });
  }

  /** Recibe { iterations, comparisons, swaps, sorted, total }. */
  updateStats({ iterations, comparisons, swaps, sorted, total }) {
    this._setVal(this.statIterations,  iterations);
    this._setVal(this.statComparisons, comparisons);
    this._setVal(this.statSwaps,       swaps);
    this.statSorted.textContent = `${sorted} / ${total}`;
  }

  _setVal(el, val) {
    const s = String(val);
    if (el.textContent === s) return;
    el.textContent = s;
    el.classList.remove('flash');
    void el.offsetWidth; // reinicia la animación
    el.classList.add('flash');
  }

  setSpeed(speed) {
    document.querySelectorAll('#speed-group button').forEach((b) => b.classList.remove('active'));
    const idx = SPEEDS.indexOf(speed);
    this.speedGroup.children[idx]?.classList.add('active');
  }

  setPlaying(playing) {
    this.btnPlay.textContent = playing ? '⏸ Pausar' : '▶ Iniciar';
  }

  setStepEnabled(enabled) {
    this.btnStep.disabled = !enabled;
  }

  setSoundEnabled(enabled) {
    this.btnSound.textContent = enabled ? '🔊 Sonido' : '🔇 Silencio';
    this.btnSound.classList.toggle('sound-off', !enabled);
  }

  getSize() { return Number(this.sizeRange.value); }
}
