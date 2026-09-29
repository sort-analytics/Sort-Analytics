export const quickSort = {
  id: 'quick',
  name: 'Quick Sort',
  description: 'Elige un pivote (último elemento), particiona alrededor de él y ordena recursivamente.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },

  worstCase(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
  },
  bestCase(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
  },

  code: [
    'function quickSort(a, lo, hi) {',
    '  if (lo >= hi) return;',
    '  const p = partition(a, lo, hi);',
    '  quickSort(a, lo, p - 1);',
    '  quickSort(a, p + 1, hi);',
    '}',
    '',
    'function partition(a, lo, hi) {',
    '  const pivot = a[hi];',
    '  let i = lo;',
    '  for (let j = lo; j < hi; j++) {',
    '    if (a[j] < pivot) {',
    '      [a[i], a[j]] = [a[j], a[i]];',
    '      i++;',
    '    }',
    '  }',
    '  [a[i], a[hi]] = [a[hi], a[i]];',
    '  return i;',
    '}',
  ],

  *run(a) {
    yield* qsort(a, 0, a.length - 1);
    yield { line: 0, sorted: a.map((_, i) => i) };
  },
};

function* qsort(a, lo, hi) {
  if (lo >= hi) {
    if (lo === hi) yield { line: 1, sorted: [lo] };
    return;
  }
  const p = yield* partition(a, lo, hi);
  yield { line: 3, pivot: p, sorted: [p] };
  yield* qsort(a, lo, p - 1);
  yield* qsort(a, p + 1, hi);
}

function* partition(a, lo, hi) {
  const pivot = a[hi];
  yield { line: 8, pivot: hi };

  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield { line: 10, compare: [j, hi] };
    if (a[j] < pivot) {
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        yield { line: 12, swap: [i, j] };
      }
      i++;
    }
  }

  [a[i], a[hi]] = [a[hi], a[i]];
  yield { line: 16, swap: [i, hi] };

  return i;
}
