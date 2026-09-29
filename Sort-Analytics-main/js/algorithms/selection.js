export const selectionSort = {
  id: 'selection',
  name: 'Selection Sort',
  description: 'Busca el mínimo en cada pasada y lo coloca al inicio de la parte no ordenada.',
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },

  code: [
    'for (let i = 0; i < n - 1; i++) {',
    '  let min = i;',
    '  for (let j = i + 1; j < n; j++) {',
    '    if (a[j] < a[min]) min = j;',
    '  }',
    '  if (min !== i) [a[i], a[min]] = [a[min], a[i]];',
    '}',
  ],

  *run(a) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      yield { line: 1, pivot: min };

      for (let j = i + 1; j < n; j++) {
        yield { line: 3, compare: [j, min] };
        if (a[j] < a[min]) {
          min = j;
          yield { line: 3, pivot: min };
        }
      }

      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        yield { line: 5, swap: [i, min] };
      }

      yield { line: 5, sorted: [i] };
    }
    yield { line: 0, sorted: [n - 1] };
  },
};
