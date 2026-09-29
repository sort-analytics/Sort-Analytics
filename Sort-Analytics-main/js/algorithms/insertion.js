export const insertionSort = {
  id: 'insertion',
  name: 'Insertion Sort',
  description: 'Inserta cada elemento en su posición correcta dentro de la parte ya ordenada.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },

  code: [
    'for (let i = 1; i < n; i++) {',
    '  const key = a[i];',
    '  let j = i - 1;',
    '  while (j >= 0 && a[j] > key) {',
    '    a[j + 1] = a[j];',
    '    j--;',
    '  }',
    '  a[j + 1] = key;',
    '}',
  ],

  *run(a) {
    const n = a.length;

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;

      yield { line: 1, pivot: i };

      while (j >= 0) {
        yield { line: 3, compare: [j, j + 1] };
        if (a[j] > key) {
          a[j + 1] = a[j];
          yield { line: 4, set: [j + 1] };
          j--;
        } else {
          break;
        }
      }

      a[j + 1] = key;
      yield { line: 7, set: [j + 1], sorted: [i] };
    }

    yield { line: 0, sorted: a.map((_, i) => i) };
  },
};
