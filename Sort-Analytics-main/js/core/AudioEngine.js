/**
 * AudioEngine
 * Sintetiza un tono corto con Web Audio API cuando una barra queda ordenada.
 * El AudioContext se crea perezosamente tras el primer gesto del usuario
 * (política de autoplay de los navegadores).
 */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
    this.lastPlay = 0;
    this.minGapMs = 22; // throttle: máx ~45 tonos/seg para no saturar
  }

  /** Llamar tras un gesto del usuario (click / keydown). */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.25; // volumen general
    this.master.connect(this.ctx.destination);
  }

  toggle() { return (this.enabled = !this.enabled); }
  setEnabled(v) { this.enabled = !!v; }

  /**
   * Reproduce un tono.
   * @param {number} t  posición en [0, 1] → mapea a frecuencia (A3..A5)
   */
  play(t = 0.5) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = performance.now();
    if (now - this.lastPlay < this.minGapMs) return;
    this.lastPlay = now;

    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    // 220 Hz (A3) → 880 Hz (A5)
    const freq = 220 * Math.pow(2, Math.max(0, Math.min(1, t)) * 2);
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Envelope corto para evitar clicks
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.9, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);

    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + 0.1);
  }
}
