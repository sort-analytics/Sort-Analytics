export const stoogeSort = {
  id: 'stooge',
  name: 'Stooge Sort',
  description: 'Algoritmo recursivo ineficiente que intercambia los extremos si están desordenados y luego se aplica recursivamente sobre los primeros 2/3, los últimos 2/3 y nuevamente los primeros 2/3.',
  complexity: { best: 'O(n^2.71)', average: 'O(n^2.71)', worst: 'O(n^2.71)', space: 'O(n)' },

  code: [
    'function stooge(l, h) {',
    '  if (a[l] > a[h]) [a[l], a[h]] = [a[h], a[l]];',
    '  if (h - l + 1 > 2) {',
    '    let t = Math.floor((h - l + 1) / 3);',
    '    stooge(l, h - t);',
    '    stooge(l + t, h);',
    '    stooge(l, h - t);',
    '  }',
    '}',
  ],

  *run(a) {
    const n = a.length;

    function* stoogeRec(l, h) {
      if (l >= h) return;

      yield { line: 2, compare: [l, h] };

      if (a[l] > a[h]) {
        [a[l], a[h]] = [a[h], a[l]];
        yield { line: 2, swap: [l, h] };
      }

      if (h - l + 1 > 2) {
        const t = Math.floor((h - l + 1) / 3);
        yield* stoogeRec(l, h - t);
        yield* stoogeRec(l + t, h);
        yield* stoogeRec(l, h - t);
      }
    }

    yield* stoogeRec(0, n - 1);

    const allSorted = Array.from({ length: n }, (_, idx) => idx);
    yield { line: 9, sorted: allSorted };
  },
};