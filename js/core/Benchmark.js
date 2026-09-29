/**
 * Benchmark
 * Mide el tiempo de ejecución real (ms) de un algoritmo sobre un arreglo,
 * SIN animación ni pausas: consume el generador a máxima velocidad.
 *
 * Como performance.now() tiene resolución limitada (~0.1 ms) y una sola
 * corrida puede durar microsegundos, se repite la ejecución hasta acumular
 * un tiempo mínimo y se devuelve el promedio por corrida.
 * La primera corrida (calentamiento del JIT) no se cuenta salvo que sea lenta.
 */
const MIN_TOTAL_MS = 8;     // tiempo mínimo acumulado para promediar
const MAX_REPS     = 200;   // tope de repeticiones
const SLOW_RUN_MS  = 40;    // si una corrida ya es lenta, no repetir

function runOnce(algorithm, data) {
  const copy = data.slice();
  const t0 = performance.now();
  for (const _ of algorithm.run(copy)) { /* consumir pasos */ }
  return performance.now() - t0;
}

export function benchmark(algorithm, data) {
  const first = runOnce(algorithm, data);           // calentamiento
  if (first >= SLOW_RUN_MS) return first;

  let total = 0;
  let reps = 0;
  while (total < MIN_TOTAL_MS && reps < MAX_REPS) {
    total += runOnce(algorithm, data);
    reps++;
  }
  return total / reps;
}
