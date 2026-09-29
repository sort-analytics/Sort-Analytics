
export const fichas = {
  bubble: {
    idea: 'Recorre repetidamente el arreglo comparando pares adyacentes e intercambiándolos si están en orden incorrecto. En cada pasada el mayor "burbujea" hasta su posición final. Si una pasada completa no registra intercambios, el arreglo ya está ordenado y se detiene.',
    pasos: [
      'Para i = 0 hasta n − 2:',
      'Inicializar swapped = false.',
      'Para j = 0 hasta n − 2 − i: comparar a[j] con a[j+1]; si a[j] > a[j+1], intercambiar y marcar swapped = true.',
      'El elemento a[n−1−i] queda en su posición definitiva.',
      'Si swapped == false, terminar (el resto ya está ordenado).',
    ],
    justificacion: {
      mejor:     'Si el arreglo ya está ordenado, la primera pasada no registra swaps y el corte temprano reduce el costo a solo n−1 comparaciones.',
      promedio:  'Se requieren ~n/2 pasadas y cada una hace ~n comparaciones; total ≈ n²/2.',
      peor:      'Con el arreglo en orden inverso cada pasada provoca el máximo de swaps y nunca se activa el corte temprano.',
    },
    notas: 'La bandera swapped es la optimización clave: sin ella, el mejor caso también sería O(n²).',
  },

  selection: {
    idea: 'Divide el arreglo en una zona ordenada al inicio (vacía al comenzar) y una zona no ordenada al final. En cada iteración busca el mínimo de la zona no ordenada y lo coloca al inicio de esa zona con un único intercambio.',
    pasos: [
      'Para i = 0 hasta n − 2:',
      'Suponer que el mínimo está en i (min = i).',
      'Para j = i+1 hasta n−1: si a[j] < a[min], actualizar min = j.',
      'Si min ≠ i, intercambiar a[i] con a[min].',
      'Marcar a[i] como ordenado.',
    ],
    justificacion: {
      mejor:     'Incluso si el arreglo ya está ordenado, el bucle interno recorre toda la zona no ordenada para confirmar que i es el mínimo. No hay corte temprano posible.',
      promedio:  'Σ (n−1−i) = n(n−1)/2 comparaciones. El número es independiente del orden inicial.',
      peor:      'Idéntico al promedio: el costo depende solo de n, no de la disposición de los datos.',
    },
    notas: 'Hace como máximo un intercambio por pasada; su costo está en las comparaciones, no en los movimientos. Útil para contrastar con Exchange Sort.',
  },

  insertion: {
    idea: 'Construye la parte ordenada de izquierda a derecha. Toma el siguiente elemento (la "llave") y lo inserta en su lugar correcto dentro de la parte ya ordenada, desplazando los mayores una posición a la derecha.',
    pasos: [
      'Para i = 1 hasta n − 1:',
      'Guardar key = a[i].',
      'j = i − 1.',
      'Mientras j ≥ 0 y a[j] > key: mover a[j] a a[j+1] y decrementar j.',
      'Colocar key en a[j+1].',
    ],
    justificacion: {
      mejor:     'Con el arreglo ya ordenado, en cada i la condición a[j] > key falla de inmediato: solo n−1 comparaciones.',
      promedio:  'Cada inserción desplaza en promedio la mitad de la parte ordenada; total ≈ n²/4.',
      peor:      'Con orden inverso, cada i desplaza los i elementos previos: Σ i = n(n−1)/2.',
    },
    notas: 'Es la base de algoritmos híbridos modernos (Timsort, Introsort) por su excelente comportamiento en entradas casi ordenadas.',
  },

  exchange: {
    idea: 'Para cada posición i compara a[i] con todos los elementos posteriores e intercambia inmediatamente cuando encuentra uno menor. Es una variante ingenua del Selection Sort: no espera al mínimo, intercambia en cada hallazgo.',
    pasos: [
      'Para i = 0 hasta n − 2:',
      'Para j = i+1 hasta n−1: si a[j] < a[i], intercambiar a[i] y a[j].',
      'Marcar a[i] como ordenado.',
    ],
    justificacion: {
      mejor:     'El doble bucle siempre se recorre completo (n(n−1)/2 comparaciones). Solo cambia el número de swaps: 0 si ya está ordenado.',
      promedio:  'Σ (n−1−i) comparaciones; los swaps ocurren en aproximadamente la mitad de los casos.',
      peor:      'Con orden inverso cada comparación provoca un swap: se realizan los n(n−1)/2 intercambios máximos.',
    },
    notas: 'Ejemplo didáctico de que mismo orden asintótico ≠ mismo rendimiento constante: Exchange y Selection son ambos O(n²), pero Exchange hace ~n²/2 swaps contra ~n de Selection.',
  },

  gnome: {
    idea: 'Un único índice avanza y retrocede. Si el elemento actual está en orden respecto al anterior, avanza; si no, intercambia y retrocede un paso. Es esencialmente Insertion Sort con un solo bucle y sin variable key.',
    pasos: [
      'i = 0.',
      'Mientras i < n:',
      'Si i == 0, avanzar (i++).',
      'Si a[i] ≥ a[i−1], avanzar.',
      'En caso contrario, intercambiar a[i] con a[i−1] y retroceder (i--).',
    ],
    justificacion: {
      mejor:     'Con el arreglo ordenado, i solo avanza: nunca retrocede. Solo n−1 comparaciones.',
      promedio:  'Cada elemento se desplaza hacia atrás la mitad de la distancia; el total de swaps ≈ n²/4.',
      peor:      'Con orden inverso, cada elemento recorre toda la distancia hacia atrás: Σ i = n(n−1)/2 swaps.',
    },
    notas: 'Comparte complejidades con Insertion Sort. Su interés es didáctico: muestra cómo una estructura muy simple tiene buen comportamiento en entradas casi ordenadas.',
  },

  stooge: {
    idea: 'Algoritmo recursivo deliberadamente ineficiente. Asegura primero que los extremos l y h estén en orden; luego, si el rango tiene más de dos elementos, se aplica recursivamente a los primeros 2/3, a los últimos 2/3 y otra vez a los primeros 2/3.',
    pasos: [
      'Si a[l] > a[h], intercambiar a[l] y a[h].',
      'Si h − l + 1 > 2:',
      't = ⌊(h − l + 1) / 3⌋.',
      'stooge(l, h − t).',
      'stooge(l + t, h).',
      'stooge(l, h − t)  ← por tercera vez el mismo bloque.',
    ],
    justificacion: {
      mejor:     'Aun en el mejor caso se realizan las tres llamadas recursivas sobre 2/3 del rango: no hay atajo.',
      promedio:  'Idéntico al mejor: el número de operaciones no depende del orden de entrada.',
      peor:      'Resolviendo T(n) = 3·T(2n/3) + O(1) por el Teorema Maestro: Θ(n^log_{3/2}3) ≈ Θ(n^2.7095).',
    },
    notas: 'Implementado con índices (l, h) sin slicing, por lo que el espacio auxiliar real es O(log n) (stack de recursión). Su valor es puramente didáctico: contraste con Quick y Merge que también usan divide y vencerás.',
  },

  merge: {
    idea: 'Divide el arreglo en dos mitades, ordena cada mitad recursivamente y luego las fusiona en una secuencia ordenada usando dos arreglos auxiliares L y R.',
    pasos: [
      'mergeSort(a, lo, hi): si lo ≥ hi, retornar.',
      'mid = ⌊(lo + hi) / 2⌋.',
      'mergeSort(a, lo, mid).',
      'mergeSort(a, mid+1, hi).',
      'merge(a, lo, mid, hi): copiar a[lo..mid] en L y a[mid+1..hi] en R.',
      'Con dos punteros i, j recorrer L y R; escribir en a[k] el menor de L[i], R[j].',
      'Copiar los sobrantes de L y luego de R.',
    ],
    justificacion: {
      mejor:     'Cada nivel de la recursión procesa n elementos durante la fusión; hay log₂ n niveles. Total Θ(n log n).',
      promedio:  'El número de fusiones y comparaciones es el mismo sin importar el orden de entrada.',
      peor:      'Resolviendo T(n) = 2·T(n/2) + O(n): Θ(n log n). Garantizado, sin casos degenerados.',
    },
    notas: 'La fusión es estable porque ante empate se elige el elemento de L (L[i] <= R[j]). Es el contraste perfecto con Quick Sort: garantiza O(n log n) al costo de O(n) memoria extra.',
  },

  quick: {
    idea: 'Divide y vencerás in-place: elige un pivote, particiona el arreglo de modo que todo lo menor quede a la izquierda y lo mayor a la derecha, y ordena recursivamente cada lado.',
    pasos: [
      'quickSort(a, lo, hi): si lo ≥ hi, retornar.',
      'p = partition(a, lo, hi).',
      'quickSort(a, lo, p−1).',
      'quickSort(a, p+1, hi).',
      'partition (Lomuto): pivot = a[hi]; i = lo.',
      'Para j = lo hasta hi−1: si a[j] < pivot, intercambiar a[i] y a[j], luego i++.',
      'Intercambiar a[i] con a[hi] (colocar el pivote) y retornar i.',
    ],
    justificacion: {
      mejor:     'Si el pivote cae siempre en la mediana, cada partición divide en dos mitades ≈ n/2: log₂ n niveles × O(n) por nivel.',
      promedio:  'Con pivote aleatorio, la profundidad esperada es ≈ 2·ln n ≈ 1.39·log₂ n; total Θ(n log n).',
      peor:      'Si el pivote es siempre el mínimo o máximo (p. ej. arreglo ya ordenado con pivote al final), cada partición reduce el rango en 1: Σ i = n(n−1)/2.',
    },
    notas: 'Se usa pivote = último elemento por simplicidad didáctica. Por eso el worstCase(n) es un arreglo ascendente y no invertido. Se documenta para defenderlo en la revisión.',
  },

  heap: {
    idea: 'Modela el arreglo como un max-heap binario implícito. Primero construye el heap bottom-up; luego extrae repetidamente el máximo (raíz) hacia el final del arreglo reduciendo el heap en uno.',
    pasos: [
      'Para i = ⌊n/2⌋ − 1 hasta 0: heapify(a, n, i)  ← construir el max-heap.',
      'Para i = n−1 hasta 1:',
      'Intercambiar a[0] con a[i]  ← el máximo va al final.',
      'heapify(a, i, 0)  ← restaurar el heap en el rango reducido.',
      'heapify(a, n, i): largest = i; l = 2i+1; r = 2i+2.',
      'Si l < n y a[l] > a[largest], largest = l.',
      'Si r < n y a[r] > a[largest], largest = r.',
      'Si largest ≠ i, intercambiar y recursar en largest.',
    ],
    justificacion: {
      mejor:     'La fase de extracción siempre hace n llamadas a heapify de altura O(log n), sin importar el orden inicial.',
      promedio:  'El número de comparaciones depende solo de n.',
      peor:      'Construcción del heap O(n) (amortizado) + n extracciones × O(log n) cada una: Θ(n log n).',
    },
    notas: 'Combina lo mejor de Merge y Quick: garantiza O(n log n) en el peor caso y es in-place. Su desventaja práctica es la poca localidad de caché por los saltos 2i+1, 2i+2.',
  },
};