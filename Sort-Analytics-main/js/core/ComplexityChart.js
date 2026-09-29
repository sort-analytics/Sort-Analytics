/**
 * ComplexityChart
 * Dibuja las curvas teóricas de complejidad del algoritmo actual y coloca
 * una "X" en el punto real (n, iteraciones) cuando la ejecución termina.
 *
 * Calibración automática: al terminar una ejecución, las curvas se
 * multiplican por K = ops_reales / f_teorica(n) del caso ejecutado, de modo
 * que el marcador caiga exactamente sobre la curva correspondiente. Esto
 * compensa las constantes y términos de menor orden que la notación Big-O
 * no representa. La leyenda muestra ×K cuando K ≠ 1.
 *
 * No conoce ningún algoritmo: sólo lee `algo.complexity` (metadata que ya
 * existe en cada plugin). Agregar un algoritmo nuevo no requiere tocar
 * este módulo.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ── Parser de notación Big-O → f(n) ── */
const PATTERNS = [
  { re: /^O\(1\)$/i,             fn: () => 1 },
  { re: /^O\(log\s*n\)$/i,       fn: (n) => Math.log2(Math.max(2, n)) },
  { re: /^O\(n\)$/i,             fn: (n) => n },
  { re: /^O\(n\s*log\s*n\)$/i,   fn: (n) => n * Math.log2(Math.max(2, n)) },
  { re: /^O\(n\s*\^\s*2\)$/i,    fn: (n) => n * n },
  { re: /^O\(n²\)$/i,            fn: (n) => n * n },
  { re: /^O\(n\s*\^\s*3\)$/i,    fn: (n) => n * n * n },
  { re: /^O\(n³\)$/i,            fn: (n) => n * n * n },
  { re: /^O\(2\s*\^\s*n\)$/i,    fn: (n) => Math.pow(2, n) },
  { re: /^O\(2ⁿ\)$/i,            fn: (n) => Math.pow(2, n) },
];

function buildFn(expr) {
  if (!expr) return null;
  const s = String(expr).trim();
  for (const { re, fn } of PATTERNS) if (re.test(s)) return fn;
  return null;
}

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return String(Math.round(n));
}

const CASE_MAP = { random: 'average', best: 'best', average: 'average', worst: 'worst' };

export class ComplexityChart {
  constructor(container) {
    this.container = container;
    this.curves = [];         // deduplicadas, para dibujar
    this.allCurves = [];      // todas (con caseType), para calibrar
    this.calibrationK = 1;
    this.marker = null;
    this._init();
  }

  _init() {
    this.container.innerHTML = `
      <div class="chart-header">
        <span class="chart-title">Complejidad</span>
        <div class="chart-legend" id="chart-legend"></div>
      </div>
      <svg class="chart-svg" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="chart-hint" id="chart-hint">Ejecutá un algoritmo para ver el punto real.</div>
    `;
    this.svgEl    = this.container.querySelector('.chart-svg');
    this.legendEl = this.container.querySelector('#chart-legend');
    this.hintEl   = this.container.querySelector('#chart-hint');
    this._draw();
  }

  setAlgorithm(algo) {
    const c = algo?.complexity || {};
    const all = [];
    const add = (caseType, expr, style) => {
      const fn = buildFn(expr);
      if (!fn) return;
      all.push({ caseType, expr, fn, style });
    };
    add('best',    c.best,    'best');
    add('average', c.average, 'average');
    add('worst',   c.worst,   'worst');

    /* Dedupe por función: O(n²) === O(n²) se dibuja una sola vez */
    const seen = new Set();
    const uniq = [];
    for (const curve of all) {
      const key = curve.fn.toString();
      if (seen.has(key)) continue;
      seen.add(key);
      uniq.push(curve);
    }

    this.allCurves = all;
    this.curves = uniq;
    this.calibrationK = 1;
    this.marker = null;
    this._updateLegend();
    this._draw();
  }

  /** Marca el punto real y calibra las curvas al caso ejecutado. */
  markExecution(n, ops, caseType = 'average') {
    if (!n || !ops) return;
    this.marker = { n, ops, caseType };

    const targetCase = CASE_MAP[caseType] || caseType;
    const target = this.allCurves.find(c => c.caseType === targetCase)
                || this.allCurves[0];

    if (target) {
      const theo = target.fn(n);
      if (theo > 0 && isFinite(theo)) {
        const k = ops / theo;
        this.calibrationK = (isFinite(k) && k > 0) ? k : 1;
      }
    }

    this._updateLegend();
    this._draw();
  }

  clearMarker() {
    this.marker = null;
    this.calibrationK = 1;
    this._updateLegend();
    this._draw();
  }

  _updateLegend() {
    this.legendEl.innerHTML = '';
    for (const c of this.curves) {
      const item = document.createElement('span');
      item.className = `chart-legend-item style-${c.style}`;
      item.textContent = c.expr;
      this.legendEl.appendChild(item);
    }
    if (this.marker) {
      const item = document.createElement('span');
      item.className = 'chart-legend-item style-marker';
      item.textContent = '● Real';
      item.title = `n = ${this.marker.n}, ops = ${this.marker.ops}`;
      this.legendEl.appendChild(item);

      if (Math.abs(this.calibrationK - 1) > 0.01) {
        const k = document.createElement('span');
        k.className = 'chart-legend-item';
        k.textContent = `×${this.calibrationK.toFixed(2)}`;
        k.title = 'Factor de ajuste aplicado a las curvas para alinearlas con el punto real';
        this.legendEl.appendChild(k);
      }
    }
    this.hintEl.style.display = this.marker ? 'none' : 'block';
  }

  _draw() {
    const s = this.svgEl;
    while (s.firstChild) s.removeChild(s.firstChild);

    const W = 400, H = 220;
    const pad = { top: 12, right: 12, bottom: 26, left: 40 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    const maxN = this.marker ? Math.max(50, this.marker.n * 1.5) : 200;
    const K = this.calibrationK;

    /* Rango Y: máximo entre curvas calibradas y el marcador */
    const SAMPLES = 100;
    let maxY = 1;
    for (const c of this.curves) {
      const y = c.fn(maxN) * K;
      if (y > maxY) maxY = y;
    }
    if (this.marker && this.marker.ops > maxY) maxY = this.marker.ops;
    maxY *= 1.08;

    const logMax = Math.log(1 + maxY);
    const yOf = (v) => H - pad.bottom - (Math.log(1 + Math.max(0, v)) / logMax) * plotH;
    const xOf = (n) => pad.left + (n / maxN) * plotW;

    /* Fondo */
    s.appendChild(svg('rect', {
      x: pad.left, y: pad.top, width: plotW, height: plotH,
      class: 'chart-plot-bg',
    }));

    /* Grid */
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * plotH;
      s.appendChild(svg('line', { x1: pad.left, y1: y, x2: W - pad.right, y2: y, class: 'chart-grid' }));
    }
    for (let i = 0; i <= 4; i++) {
      const x = pad.left + (i / 4) * plotW;
      s.appendChild(svg('line', { x1: x, y1: pad.top, x2: x, y2: H - pad.bottom, class: 'chart-grid' }));
    }

    /* Ejes */
    s.appendChild(svg('line', { x1: pad.left, y1: H - pad.bottom, x2: W - pad.right, y2: H - pad.bottom, class: 'chart-axis' }));
    s.appendChild(svg('line', { x1: pad.left, y1: pad.top,        x2: pad.left,      y2: H - pad.bottom, class: 'chart-axis' }));

    /* Curvas teóricas calibradas */
    for (const c of this.curves) {
      const pts = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const n = (i / SAMPLES) * maxN;
        pts.push(`${xOf(n)},${yOf(c.fn(Math.max(1, n)) * K)}`);
      }
      s.appendChild(svg('polyline', { points: pts.join(' '), class: `chart-curve style-${c.style}` }));
    }

    /* Marcador real */
    if (this.marker) {
      const x = xOf(Math.min(this.marker.n, maxN));
      const y = yOf(this.marker.ops);

      s.appendChild(svg('line', { x1: pad.left, y1: y, x2: x, y2: y,                class: 'chart-dashed' }));
      s.appendChild(svg('line', { x1: x, y1: y, x2: x, y2: H - pad.bottom, class: 'chart-dashed' }));

      const k = 5;
      s.appendChild(svg('line', { x1: x - k, y1: y - k, x2: x + k, y2: y + k, class: 'chart-marker' }));
      s.appendChild(svg('line', { x1: x - k, y1: y + k, x2: x + k, y2: y - k, class: 'chart-marker' }));

      const lbl = svg('text', {
        x: Math.min(x + k + 4, W - pad.right - 4),
        y: y - k - 3,
        class: 'chart-marker-label',
        'text-anchor': x > W / 2 ? 'end' : 'start',
      });
      lbl.textContent = `(${this.marker.n}, ${fmt(this.marker.ops)})`;
      s.appendChild(lbl);
    }

    /* Ticks Y */
    const yTop = svg('text', { x: pad.left - 6, y: pad.top + 4,        class: 'chart-tick', 'text-anchor': 'end' });
    yTop.textContent = fmt(maxY);
    s.appendChild(yTop);

    const yBot = svg('text', { x: pad.left - 6, y: H - pad.bottom + 4, class: 'chart-tick', 'text-anchor': 'end' });
    yBot.textContent = '0';
    s.appendChild(yBot);

    /* Ticks X */
    for (let i = 0; i <= 4; i++) {
      const t = svg('text', { x: xOf((i / 4) * maxN), y: H - pad.bottom + 14, class: 'chart-tick', 'text-anchor': 'middle' });
      t.textContent = fmt((i / 4) * maxN);
      s.appendChild(t);
    }

    /* Etiquetas de ejes */
    const ax = svg('text', { x: W - pad.right, y: H - 4, class: 'chart-axis-label', 'text-anchor': 'end' });
    ax.textContent = 'n';
    s.appendChild(ax);

    const ay = svg('text', { x: 8, y: pad.top + 4, class: 'chart-axis-label', 'text-anchor': 'start' });
    ay.textContent = 'ops';
    s.appendChild(ay);

    if (this.curves.length === 0) {
      const msg = svg('text', { x: W / 2, y: H / 2, class: 'chart-tick', 'text-anchor': 'middle' });
      msg.textContent = 'sin datos de complejidad';
      s.appendChild(msg);
    }
  }
}
