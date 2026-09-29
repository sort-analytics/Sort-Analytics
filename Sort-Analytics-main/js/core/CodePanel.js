/**
 * CodePanel
 * Muestra el código fuente del algoritmo y resalta la línea activa.
 */
export class CodePanel {
  constructor(container) {
    this.container = container;
    this.lineEls = [];
    this.current = -1;
  }

  setCode(lines) {
    this.container.innerHTML = '';
    this.lineEls = [];
    this.current = -1;

    const frag = document.createDocumentFragment();
    lines.forEach((line, i) => {
      const row = document.createElement('div');
      row.className = 'code-line';
      row.innerHTML =
        `<span class="ln">${i + 1}</span>` +
        `<span class="src">${highlight(line) || '&nbsp;'}</span>`;
      frag.appendChild(row);
      this.lineEls.push(row);
    });

    this.container.appendChild(frag);
  }

  highlight(index) {
    if (index === this.current) return;
    if (this.lineEls[this.current]) this.lineEls[this.current].classList.remove('active');
    if (this.lineEls[index]) {
      this.lineEls[index].classList.add('active');
      this._scrollIntoView(index);
    }
    this.current = index;
  }

  clear() {
    if (this.lineEls[this.current]) this.lineEls[this.current].classList.remove('active');
    this.current = -1;
  }

  _scrollIntoView(index) {
    const el = this.lineEls[index];
    if (!el) return;
    const panel = this.container;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < panel.scrollTop || bottom > panel.scrollTop + panel.clientHeight) {
      panel.scrollTop = top - panel.clientHeight / 2;
    }
  }
}

function highlight(src) {
  const escaped = escapeHtml(src);
  return escaped.replace(
    /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+\b)|(\b(?:function|let|const|var|if|else|for|while|return|break|continue|of|in|new)\b)/g,
    (m, comment, str, num, kw) => {
      if (comment) return `<span class="tok-com">${comment}</span>`;
      if (str) return `<span class="tok-str">${str}</span>`;
      if (num) return `<span class="tok-num">${num}</span>`;
      if (kw) return `<span class="tok-kw">${kw}</span>`;
      return m;
    }
  );
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
