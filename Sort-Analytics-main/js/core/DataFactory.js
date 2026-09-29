/**
 * DataFactory
 * Genera datos según el caso: random / best / worst.
 * Un algoritmo puede sobrescribir bestCase() o worstCase() si su
 * peor/mejor caso no coincide con "ordenado"/"invertido".
 */
export const CaseType = Object.freeze({
  RANDOM: 'random',
  BEST: 'best',
  WORST: 'worst',
});

function ascending(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function shuffled(n) {
  const a = ascending(n);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateData(size, caseType, algorithm = {}) {
  switch (caseType) {
    case CaseType.BEST:
      return algorithm.bestCase ? algorithm.bestCase(size) : ascending(size);
    case CaseType.WORST:
      return algorithm.worstCase ? algorithm.worstCase(size) : ascending(size).reverse();
    case CaseType.RANDOM:
    default:
      return algorithm.averageCase ? algorithm.averageCase(size) : shuffled(size);
  }
}
