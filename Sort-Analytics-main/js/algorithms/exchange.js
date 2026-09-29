export const exchangeSort = {
  id: 'exchange',
  name: 'Exchange Sort',
  description: 'Compara el primer elemento no ordenado con todos los subsiguientes, intercambiándolos inmediatamente cuando encuentra uno menor.',
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },

  code: [
    'for (let i = 0; i < n - 1; i++) {',
    '  for (let j = i + 1; j < n; j++) {',
    '    if (a[j] < a[i]) {',
    '      [a[i], a[j]] = [a[j], a[i]];',
    '    }',
    '  }',
    '}',
  ],

  *run(a) {
    const n = a.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        yield { line: 3, compare: [i, j] };

        if (a[j] < a[i]) {
          [a[i], a[j]] = [a[j], a[i]];
          yield { line: 4, swap: [i, j] };
        }
      }
      yield { line: 7, sorted: [i] };
    }

    const rest = Array.from({ length: n }, (_, idx) => idx);
    yield { line: 7, sorted: rest };
  },
};