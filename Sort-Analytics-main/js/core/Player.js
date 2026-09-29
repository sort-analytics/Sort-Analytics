/**
 * Player
 * Orquesta la ejecución: consume el generador del algoritmo,
 * acumula índices "ordenados", lleva contadores y pide el render.
 *
 * Callbacks externos (opcionales):
 *   onStateChange({ playing, finished, canStep })
 *   onCountersChange({ iterations, comparisons, swaps, sorted, total })
 *   onSorted(index, value, total)  // se dispara por cada índice NUEVO ordenado
 */
export class Player {
  constructor(visualizer, codePanel) {
    this.visualizer = visualizer;
    this.codePanel = codePanel;

    this.algorithm = null;
    this.sourceArray = [];
    this.array = [];
    this.generator = null;

    this.sorted = new Set();
    this.highlight = { compare: new Set(), swap: new Set(), pivot: new Set() };
    this.currentLine = 0;

    this.counters = { iterations: 0, comparisons: 0, swaps: 0, sorted: 0 };

    this.finished = false;
    this.playing = false;
    this.sps = 12;
    this.acc = 0;
    this.lastTime = 0;
    this.rafId = null;

    this.onStateChange = null;
    this.onCountersChange = null;
    this.onSorted = null;

    this.tick = this.tick.bind(this);
  }

  load(algorithm, array) {
    this.stop();
    this.algorithm = algorithm;
    this.sourceArray = array.slice();
    this.array = array.slice();
    this.generator = algorithm.run(this.array);

    this.sorted = new Set();
    this._clearHighlight();
    this.currentLine = 0;
    this.finished = false;
    this.counters = { iterations: 0, comparisons: 0, swaps: 0, sorted: 0 };

    this.visualizer.setData(this.array);
    this.codePanel.setCode(algorithm.code);
    this.render();
    this._emitState();
  }

  reset() {
    if (this.algorithm) this.load(this.algorithm, this.sourceArray);
  }

  play() {
    if (this.playing) return;
    if (this.finished) this.reset();
    this.playing = true;
    this.lastTime = performance.now();
    this.acc = 0;
    this.rafId = requestAnimationFrame(this.tick);
    this._emitState();
  }

  pause() {
    this.playing = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this._emitState();
  }

  toggle() { this.playing ? this.pause() : this.play(); }

  stop() {
    this.playing = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  setSpeed(sps) { this.sps = sps; }

  tick(now) {
    if (!this.playing) return;

    const dt = Math.min(now - this.lastTime, 120);
    this.lastTime = now;
    this.acc += dt;

    const interval = 1000 / this.sps;
    let guard = 0;

    while (this.acc >= interval && guard < 4000) {
      this.acc -= interval;
      if (!this.step()) break;
      guard++;
    }

    this.render();

    if (this.finished) {
      this.playing = false;
      this._emitState();
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
  }

  step() {
    if (this.finished || !this.generator) return false;
    const { value, done } = this.generator.next();
    if (done) { this._finish(); return false; }
    this._applyStep(value);
    return true;
  }

  stepAndRender() {
    if (this.playing) return;
    const ok = this.step();
    this.render();
    this._emitState();
    return ok;
  }

  _applyStep(step) {
    if (!step) return;
    this._clearHighlight();
    this.counters.iterations++;

    if (step.compare?.length) this.counters.comparisons++;
    if (step.swap?.length)    this.counters.swaps++;
    if (step.set?.length)     this.counters.swaps++;

    // Detectar índices NUEVAMENTE ordenados (para audio + contador)
    if (step.sorted) {
      for (const i of step.sorted) {
        if (this.sorted.has(i)) continue;
        this.sorted.add(i);
        this.counters.sorted++;
        if (typeof this.onSorted === 'function') {
          this.onSorted(i, this.array[i], this.array.length);
        }
      }
    }

    if (step.compare) for (const i of step.compare) this.highlight.compare.add(i);
    if (step.swap)    for (const i of step.swap)    this.highlight.swap.add(i);
    if (step.set)     for (const i of step.set)     this.highlight.swap.add(i);
    if (step.pivot !== undefined) this.highlight.pivot.add(step.pivot);

    if (step.line !== undefined) this.currentLine = step.line;
  }

  _clearHighlight() {
    this.highlight.compare.clear();
    this.highlight.swap.clear();
    this.highlight.pivot.clear();
  }

  _finish() {
    this.finished = true;
    this.playing = false;
    this.sorted = new Set(this.array.map((_, i) => i));
    this.counters.sorted = this.array.length;
    this._clearHighlight();
    this.render();
    this._emitState();
  }

  render() {
    this.visualizer.render(this.array, {
      sorted:  this.sorted,
      compare: this.highlight.compare,
      swap:    this.highlight.swap,
      pivot:   this.highlight.pivot,
    });
    this.codePanel.highlight(this.currentLine);
    this._emitCounters(); // throttled naturalmente por RAF
  }

  _emitState() {
    if (typeof this.onStateChange === 'function') {
      this.onStateChange({
        playing: this.playing,
        finished: this.finished,
        canStep: !this.finished && !this.playing,
      });
    }
  }

  _emitCounters() {
    if (typeof this.onCountersChange === 'function') {
      this.onCountersChange({ ...this.counters, total: this.array.length });
    }
  }

  get length() { return this.array.length; }
}
