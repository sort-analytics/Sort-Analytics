/**
 * Visualizer
 * Renderiza el arreglo como barras verticales.
 * No conoce nada sobre algoritmos: sólo recibe el array y los índices resaltados.
 */
export class Visualizer {
  constructor(container) {
    this.container = container;
    this.bars = [];
    this.max = 1;
  }

  setData(array) {
    this.container.innerHTML = '';
    this.bars = [];
    this.max = Math.max(...array, 1);

    const n = array.length;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < n; i++) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = this._height(array[i]);
      frag.appendChild(bar);
      this.bars.push(bar);
    }

    this.container.appendChild(frag);
    this.container.style.gap = n > 140 ? '1px' : n > 70 ? '2px' : n > 30 ? '3px' : '5px';
  }

  render(array, highlights) {
    const n = array.length;
    for (let i = 0; i < n; i++) {
      const bar = this.bars[i];
      if (!bar) continue;

      bar.style.height = this._height(array[i]);

      let cls = 'bar';
      if (highlights.sorted.has(i)) cls += ' sorted';
      else if (highlights.swap.has(i)) cls += ' swap';
      else if (highlights.compare.has(i)) cls += ' compare';
      else if (highlights.pivot.has(i)) cls += ' pivot';

      if (bar.className !== cls) bar.className = cls;
    }
  }

  markAllSorted(array) {
    const set = new Set(array.map((_, i) => i));
    this.render(array, { sorted: set, swap: new Set(), compare: new Set(), pivot: new Set() });
  }

  _height(value) {
    return `${(value / this.max) * 100}%`;
  }
}
