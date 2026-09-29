export const bubbleSort = {
  id: 'bubble',
  name: 'Bubble Sort',
  description: 'Compara elementos adyacentes y los intercambia si están desordenados. Repite hasta que no haya cambios.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },


  
  code: [
    'for (let i = 0; i < n - 1; i++) {',
    '  let swapped = false;',
    '  for (let j = 0; j < n - 1 - i; j++) {',
    '    if (a[j] > a[j + 1]) {',
    '      [a[j], a[j + 1]] = [a[j + 1], a[j]];',
    '      swapped = true;',
    '    }',
    '  }',
    '  if (!swapped) break;',
    '}',
  ],

  *run(a) {
    const n = a.length;
    if (n <= 1) return;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - 1 - i; j++) {
        yield { line: 3, compare: [j, j + 1] };

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
          yield { line: 4, swap: [j, j + 1] };
        }
      }

      yield { line: 8, sorted: [n - 1 - i] };

      if (!swapped) {
        const rest = [];
        for (let k = 0; k <= n - 1 - i; k++) rest.push(k);
        yield { line: 8, sorted: rest };
        return;
      }
    }
    yield { line: 9, sorted: [0] };
  },
};
