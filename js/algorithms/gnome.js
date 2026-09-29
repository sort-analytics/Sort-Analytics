export const gnomeSort = {
  id: 'gnome',
  name: 'Gnome Sort',
  description: 'Compara el elemento actual con el anterior; si está desordenado intercambia y retrocede un paso, si está ordenado avanza.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },

  code: [
    'let i = 0;',
    'while (i < n) {',
    '  if (i === 0 || a[i] >= a[i - 1]) {',
    '    i++;',
    '  } else {',
    '    [a[i], a[i - 1]] = [a[i - 1], a[i]];',
    '    i--;',
    '  }',
    '}',
  ],

  *run(a) {
    const n = a.length;
    let i = 0;

    while (i < n) {
      if (i === 0) {
        i++;
        continue;
      }

      yield { line: 3, compare: [i - 1, i] };

      if (a[i] >= a[i - 1]) {
        i++;
      } else {
        [a[i], a[i - 1]] = [a[i - 1], a[i]];
        yield { line: 6, swap: [i - 1, i] };
        i--;
      }
    }

    const allSorted = Array.from({ length: n }, (_, idx) => idx);
    yield { line: 9, sorted: allSorted };
  },
};