export const mergeSort = {
  id: 'merge',
  name: 'Merge Sort',
  description: 'Divide el arreglo en mitades, las ordena recursivamente y las fusiona.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },

  code: [
    'function mergeSort(a, lo, hi) {',
    '  if (lo >= hi) return;',
    '  const mid = (lo + hi) >> 1;',
    '  mergeSort(a, lo, mid);',
    '  mergeSort(a, mid + 1, hi);',
    '  merge(a, lo, mid, hi);',
    '}',
    '',
    'function merge(a, lo, mid, hi) {',
    '  const L = a.slice(lo, mid + 1);',
    '  const R = a.slice(mid + 1, hi + 1);',
    '  let i = 0, j = 0, k = lo;',
    '  while (i < L.length && j < R.length) {',
    '    a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];',
    '  }',
    '  while (i < L.length) a[k++] = L[i++];',
    '  while (j < R.length) a[k++] = R[j++];',
    '}',
  ],

  *run(a) {
    yield* msort(a, 0, a.length - 1);
    yield { line: 0, sorted: a.map((_, i) => i) };
  },
};

function* msort(a, lo, hi) {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;

  yield { line: 2, pivot: mid };

  yield* msort(a, lo, mid);
  yield* msort(a, mid + 1, hi);
  yield* merge(a, lo, mid, hi);
}

function* merge(a, lo, mid, hi) {
  const L = a.slice(lo, mid + 1);
  const R = a.slice(mid + 1, hi + 1);

  let i = 0, j = 0, k = lo;

  while (i < L.length && j < R.length) {
    yield { line: 13, compare: [lo + i, mid + 1 + j] };
    a[k] = L[i] <= R[j] ? L[i++] : R[j++];
    yield { line: 13, set: [k] };
    k++;
  }
  while (i < L.length) {
    a[k] = L[i++];
    yield { line: 15, set: [k] };
    k++;
  }
  while (j < R.length) {
    a[k] = R[j++];
    yield { line: 16, set: [k] };
    k++;
  }
}
