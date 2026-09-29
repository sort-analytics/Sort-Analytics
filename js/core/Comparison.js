/**
 * Comparison
 * Modo comparación: ejecuta DOS algoritmos sobre EXACTAMENTE el mismo arreglo,
 * cada uno en su propio panel (barras + código), controlados a la vez por
 * los mismos botones (play/pausa, paso, reiniciar) y la misma velocidad.
 *
 * Reutiliza Player / Visualizer / CodePanel sin modificarlos: internamente
 * hay dos Player independientes que esta clase mantiene sincronizados.
 *
 * Expone la misma interfaz que Player para que main.js pueda tratarlos igual:
 *   toggle(), pause(), reset(), stepAndRender(), setSpeed(sps)
 *
 * Callbacks:
 *   onStateChange({ playing, finished, canStep })  // agregado de ambos
 *   onInfo(algo)                                   // botón ⓘ de un panel
 */
import { Visualizer } from './Visualizer.js';
import { CodePanel }  from './CodePanel.js';
import { Player }     from './Player.js';
import { benchmark }  from './Benchmark.js';

const CASE_TO_COMPLEXITY = { random: 'average', best: 'best', worst: 'worst' };

/* Métricas de la tabla. `lowerIsBetter` define quién "gana" la fila. */
const METRICS = [
  { key: 'iterations',  label: 'Iteraciones (pasos)', win: true },
  { key: 'comparisons', label: 'Comparaciones',       win: true },
  { key: 'swaps',       label: 'Intercambios',        win: true },
  { key: 'time',        label: 'Tiempo de ejecución', win: true },
];

export class Comparison {
  constructor({ onSorted = null, onInfo = null } = {}) {
    this.onStateChange = null;
    this.onInfo = onInfo;

    this.data = [];
    this.caseType = 'random';

    this.slots = ['a', 'b'].map((key) => {
      const el = (id) => document.getElementById(`cmp-${key}-${id}`);
      const player = new Player(new Visualizer(el('bars')), new CodePanel(el('code')));
      const slot = {
        key, player,
        nameEl: el('name'), statusEl: el('status'), infoBtn: el('info'),
        algo: null, timeMs: null,
      };
      player.onStateChange   = (s) => this._onPlayerState(slot, s);
      player.onCountersChange = ()  => this._renderStats();
      slot.infoBtn.addEventListener('click', () => {
        if (slot.algo && this.onInfo) this.onInfo(slot.algo);
      });
      return slot;
    });

    // El sonido sólo se reproduce para el panel A (dos melodías a la vez serían ruido).
    this.slots[0].player.onSorted = onSorted;

    this.summary = document.getElementById('cmp-summary');
    this._buildSummary();
  }

  get playing()  { return this.slots.some((s) => s.player.playing); }
  get finished() { return this.slots.every((s) => s.player.finished); }

  /** Carga los dos algoritmos con una COPIA del mismo arreglo. */
  load(algoA, algoB, data, caseType = 'random') {
    this.data = data.slice();
    this.caseType = caseType;
    const [a, b] = this.slots;
    a.algo = algoA;
    b.algo = algoB;
    a.timeMs = b.timeMs = null;

    for (const s of this.slots) {
      s.nameEl.textContent = s.algo.name;
      s.player.load(s.algo, this.data);   // Player copia el arreglo internamente
    }

    this._fillSummaryHeader();
    this._renderStats();
    this._emit();
  }

  /* ── Controles sincronizados ── */

  toggle() {
    if (this.playing) { this.pause(); return; }
    const [a, b] = this.slots.map((s) => s.player);
    // Si ambos terminaron, Player.play() reinicia cada uno con los mismos datos.
    for (const p of [a, b]) if (!p.finished || this.finished) p.play();
    // Arrancan en el mismo instante para que avancen al unísono.
    if (a.playing && b.playing) { b.lastTime = a.lastTime; b.acc = 0; }
    this._emit();
  }

  pause() {
    this.slots.forEach((s) => s.player.pause());
    this._emit();
  }

  reset() {
    this.slots.forEach((s) => { s.timeMs = null; s.player.reset(); s.player.pause(); });
    this._renderStats();
    this._emit();
  }

  stepAndRender() {
    if (this.playing) return;
    this.slots.forEach((s) => { if (!s.player.finished) s.player.stepAndRender(); });
    this._emit();
  }

  setSpeed(sps) { this.slots.forEach((s) => s.player.setSpeed(sps)); }

  /** Detiene todo sin emitir (al cambiar de modo). */
  stop() { this.slots.forEach((s) => s.player.stop()); }

  /* ── Estado ── */

  _onPlayerState(slot, { playing, finished }) {
    if (!finished) {
      slot.timeMs = null;
    } else if (slot.timeMs === null) {
      // Al terminar, medimos el tiempo real del algoritmo (sin animación).
      slot.timeMs = benchmark(slot.algo, this.data);
    }
    slot.statusEl.textContent = finished ? '✓ Terminado' : playing ? '● En curso' : 'Listo';
    slot.statusEl.className = 'cmp-status ' + (finished ? 'done' : playing ? 'running' : '');
    this._renderStats();
    this._emit();
  }

  _emit() {
    if (typeof this.onStateChange !== 'function') return;
    const playing = this.playing;
    const finished = this.finished;
    this.onStateChange({ playing, finished, canStep: !playing && !finished });
  }

  /* ── Panel comparativo ── */

  _buildSummary() {
    this.summary.innerHTML = `
      <div class="cmp-summary-head">
        <h3>Comparación</h3>
        <span class="cmp-verdict" id="cmp-verdict">Ejecuta ambos algoritmos para ver el resumen.</span>
      </div>
      <table class="cmp-table">
        <thead>
          <tr>
            <th>Métrica</th>
            <th><span class="cmp-tag a">A</span> <span data-name="a"></span></th>
            <th><span class="cmp-tag b">B</span> <span data-name="b"></span></th>
          </tr>
        </thead>
        <tbody>
          ${METRICS.map((m) => `
            <tr data-row="${m.key}">
              <th scope="row">${m.label}</th>
              <td data-cell="a"></td><td data-cell="b"></td>
            </tr>`).join('')}
          <tr data-row="theory">
            <th scope="row">Complejidad teórica <small id="cmp-case-label"></small></th>
            <td data-cell="a"></td><td data-cell="b"></td>
          </tr>
        </tbody>
      </table>
      <p class="cmp-note">Ambos algoritmos reciben el mismo arreglo.
        “Mejor” = arreglo ya ordenado · “Peor” = arreglo invertido.
        El tiempo se mide al terminar, sin animación (promedio de varias corridas).</p>`;

    this.cells = {};
    this.summary.querySelectorAll('tr[data-row]').forEach((tr) => {
      this.cells[tr.dataset.row] = {
        a: tr.querySelector('[data-cell="a"]'),
        b: tr.querySelector('[data-cell="b"]'),
      };
    });
    this.verdictEl = this.summary.querySelector('#cmp-verdict');
  }

  _fillSummaryHeader() {
    const [a, b] = this.slots;
    this.summary.querySelector('[data-name="a"]').textContent = a.algo.name;
    this.summary.querySelector('[data-name="b"]').textContent = b.algo.name;

    const cKey = CASE_TO_COMPLEXITY[this.caseType] ?? 'average';
    const caseName = { best: 'mejor', average: 'promedio', worst: 'peor' }[cKey];
    this.summary.querySelector('#cmp-case-label').textContent = `(caso ${caseName})`;

    for (const s of this.slots) {
      const c = s.algo.complexity ?? {};
      this.cells.theory[s.key].textContent =
        `${c[cKey] ?? '—'}${c.space ? ` · espacio ${c.space}` : ''}`;
    }
  }

  _renderStats() {
    if (!this.cells || !this.slots[0].algo) return;
    const [a, b] = this.slots;
    const done = this.finished;

    const value = (s, key) => {
      if (key === 'time') return s.timeMs;
      return s.player.counters[key];
    };

    for (const m of METRICS) {
      const va = value(a, m.key);
      const vb = value(b, m.key);
      this._setCell(this.cells[m.key].a, this._fmt(m.key, va));
      this._setCell(this.cells[m.key].b, this._fmt(m.key, vb));

      // Ganador de la fila: sólo cuando ambos terminaron y hay diferencia.
      const bothKnown = done && va !== null && vb !== null;
      this.cells[m.key].a.classList.toggle('win', bothKnown && va < vb);
      this.cells[m.key].b.classList.toggle('win', bothKnown && vb < va);
    }

    this._renderVerdict(done);
  }

  _renderVerdict(done) {
    if (!done) {
      const running = this.playing;
      this.verdictEl.textContent = running
        ? 'Ejecutando en paralelo…'
        : 'Ejecuta ambos algoritmos para ver el resumen.';
      this.verdictEl.classList.remove('final');
      return;
    }
    const [a, b] = this.slots;
    const pick = (va, vb) => (va === vb ? null : va < vb ? a : b);
    const bySteps = pick(a.player.counters.iterations, b.player.counters.iterations);
    const byTime  = pick(a.timeMs, b.timeMs);

    const parts = [];
    parts.push(bySteps ? `Menos pasos: ${bySteps.algo.name}` : 'Mismos pasos');
    parts.push(byTime  ? `Más rápido: ${byTime.algo.name}`  : 'Mismo tiempo');
    this.verdictEl.textContent = parts.join('  ·  ');
    this.verdictEl.classList.add('final');
  }

  _fmt(key, v) {
    if (v === null || v === undefined) return '—';
    if (key === 'time') return v < 0.01 ? '< 0.01 ms' : `${v.toFixed(2)} ms`;
    return v.toLocaleString('es-MX');
  }

  _setCell(el, text) {
    if (el.textContent !== text) el.textContent = text;
  }
}
