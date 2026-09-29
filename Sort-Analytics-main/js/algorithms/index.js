/**
 * Registro de algoritmos.
 * ─────────────────────────────────────────────────────────────
 *  Para agregar un nuevo algoritmo:
 *    1. Crear el archivo en /js/algorithms/miAlgoritmo.js
 *    2. Importarlo acá
 *    3. Agregarlo al array `algorithms`
 *  Nada más. La UI se construye automáticamente desde este registro.
 * ─────────────────────────────────────────────────────────────
 */
import { bubbleSort }    from './bubble.js';
import { selectionSort } from './selection.js';
import { insertionSort } from './insertion.js';
import { mergeSort }     from './merge.js';
import { quickSort }     from './quick.js';
import { heapSort }      from './heap.js';
import { exchangeSort }  from './exchange.js';
import { gnomeSort }     from './gnome.js';
import { stoogeSort }    from './stooge.js';

export const algorithms = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  exchangeSort,
  gnomeSort,
  stoogeSort,
];

const byId = new Map(algorithms.map((a) => [a.id, a]));

export function getAlgorithm(id) {
  return byId.get(id) ?? algorithms[0];
}