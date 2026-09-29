export const heapSort = {
  id: 'heap',
  name: 'Heap Sort',
  description: 'Construye un max-heap y extrae repetidamente el máximo hacia el final.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },

  code: [
    'function heapSort(a) {',
    '  const n = a.length;',
    '  for (let i = (n >> 1) - 1; i >= 0; i--)',
    '    heapify(a, n, i);',
    '  for (let i = n - 1; i > 0; i--) {',
    '    [a[0], a[i]] = [a[i], a[0]];',
    '    heapify(a, i, 0);',
    '  }',
    '}',
    '',
    'function heapify(a, n, i) {',
    '  let largest = i;',
    '  const l = 2 * i + 1, r = 2 * i + 2;',
    '  if (l < n && a[l] > a[largest]) largest = l;',
    '  if (r < n && a[r] > a[largest]) largest = r;',
    '  if (largest !== i) {',
    '    [a[i], a[largest]] = [a[largest], a[i]];',
    '    heapify(a, n, largest);',
    '  }',
    '}',
  ],

  *run(a) {
    const n = a.length;

    for (let i = (n >> 1) - 1; i >= 0; i--) {
      yield* heapify(a, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      yield { line: 5, swap: [0, i], sorted: [i] };
      yield* heapify(a, i, 0);
    }

    yield { line: 0, sorted: [0] };
  },
};

function* heapify(a, n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n) {
    yield { line: 13, compare: [l, largest] };
    if (a[l] > a[largest]) largest = l;
  }
  if (r < n) {
    yield { line: 14, compare: [r, largest] };
    if (a[r] > a[largest]) largest = r;
  }

  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    yield { line: 16, swap: [i, largest] };
    yield* heapify(a, n, largest);
  }
}
