## Planeación del Visualizador web de algoritmos de ordenamiento

## Integrantes:
- **LOPEZ OLIVERA ALEJANDRO ESAU.**
- **RAMIREZ PEREZ OSCAR EMILIANO.**
- **RODRIGUEZ HERNANDEZ LUIS GIOVANNI.**
- **RUIZ LOPEZ CARLOS AARON.**

## Descripción
Sort-Analytics es una aplicación web desarrollada en **HTML, CSS y JavaScript**
Renderiza cada algoritmo de ordenamiento como una serie de barras verticales cuyo color y altura cambian en tiempo real conforme el algoritmo compara, intercambia o fija elementos.
En la pagina se muestran los algoritmos de ordenamiento vistos en la materia de Análisis de Algoritmos.
Cada algoritmo se ejecuta paso a paso sobre un arreglo de datos, mostrando qué elementos se comparan, cuáles se intercambian y cómo cambia el arreglo hasta quedar ordenado.

## Objetivo
Desarrollar una pagina web que ayude a comprender visualmente cómo funciona cada algoritmo de ordenamiento por dentro donde se pueda ver

1. Ver qué elementos se comparan en cada paso.
2. Ver qué elementos se intercambian y por qué.
3. Observar cómo evoluciona el arreglo hasta quedar completamente ordenado.
4. Comparar el rendimiento real de distintos algoritmos con los mismos datos de entrada.
5. Entender la relación entre el comportamiento observado y la complejidad teórica declarada.

## Algoritmos Implementados
- **Bubble Sort:** compara pares adyacentes y "burbujea" el mayor hacia el final. Corte temprano si no hay swaps en una pasada.
- **Selection Sort:** busca el mínimo de la parte no ordenada y lo coloca al inicio con un solo intercambio.
- **Insertion Sort:** inserta cada elemento en su lugar correcto dentro de la parte ya ordenada, desplazando los mayores.
- **Exchange Sort:** variante ingenua del Selection; intercambia inmediatamente cuando encuentra un elemento menor.
- **Gnome Sort:** un solo índice avanza y retrocede; esencialmente Insertion Sort con un solo bucle.
- **Stooge Sort:** recursivo deliberadamente ineficiente; se aplica tres veces sobre los 2/3 del rango.
- **Merge Sort:** divide el arreglo, ordena cada mitad y las fusiona. Estable y garantiza O(n log n).
- **Quick Sort:** elige un pivote (último elemento, esquema de Lomuto) y particiona in-place.
- **Heap Sort:** construye un max-heap implícito y extrae repetidamente el máximo hacia el final.

## Tecnologías utilizadas
- **HTML5** — estructura semántica.
- **CSS3** — variables CSS, Grid, Flexbox, animaciones, tema oscuro.
- **JavaScript**
- **Web Audio API** — síntesis de tonos según el valor del elemento ordenado.
- **SVG** — gráfica de complejidad generada dinámicamente sin librerías.
- **Vercel** — hosting gratuito (ver sección Deployment).

- ## Deployment
- sort-analytics.vercel.app

- ## Ejecutar el Proyecto

- En tu terminal: git clone https://github.com/sort-analytics/Sort-Analytics.git cd Sort-Analytics python3 -m http.server 8000.
- **Despues abre  http://localhost:8000 en tu navegador**
  
## En línea
https://sort-analytics.vercel.app

## Uso de la Aplicación
La pantalla tiene tres partes:
1. **Menú izquierdo:** controles y estadísticas.
2. **Arriba:** las barras que se van ordenando.
3. **Abajo:** el código que se ejecuta y la gráfica de complejidad.

### Controles

- **Algoritmo:** elige cuál quieres ver. El botón **ⓘ** abre su ficha técnica.
- **Tamaño de datos:** de 5 a 200 elementos.
- **Caso:** aleatorio, mejor o peor.
- **Velocidad:** de 0.5× a 16×.
- **Iniciar / Pausar:** corre o detiene la animación.
- **Paso:** avanza un solo paso.
- **Reiniciar:** vuelve al inicio.
- **Nuevos datos:** genera un arreglo nuevo.
- **Sonido:** activa o desactiva el audio.

### Modo comparación
Con el selector **Modo → Comparar** se ejecutan dos algoritmos a la vez sobre **exactamente el mismo arreglo**:
- Dos paneles (A y B) con sus barras y su código, sincronizados por el mismo botón **Iniciar / Pausar**, **Paso** y **Reiniciar**.
- Tamaño, caso y velocidad son compartidos. A y B no pueden ser el mismo algoritmo.
- Panel comparativo con iteraciones (pasos), comparaciones, intercambios, tiempo de ejecución y complejidad teórica del caso elegido. Al terminar ambos se resaltan (✓) los mejores valores y se muestra un veredicto.
- El tiempo se mide al terminar, sin animación (promedio de varias corridas).
- En este modo, *Mejor* = arreglo ordenado y *Peor* = arreglo invertido (mismos datos para ambos). El sonido sólo se reproduce para A.
- Volver a **Un algoritmo** restaura el modo individual sin cambios.

### Atajos
- `Espacio` — Iniciar / Pausar
- `→` — Un paso
- `R` — Reiniciar
- `M` — Silenciar
- `Esc` — Cerrar el modal

### Colores de las barras
- 🔵 Normal
- 🟡 Comparando
- 🔴 Intercambiando
- 🟣 Pivote
- 🟢 Ordenado

### Ficha técnica
El botón **ⓘ** junto a la descripción abre un cuadro con la idea del algoritmo, sus pasos, su complejidad y por qué tiene esa complejidad.

## Organización de Equipo
- **Repositorio:** https://github.com/sort-analytics/Sort-Analytics
- **Tablero de tareas (GitHub Projects):** https://github.com/orgs/sort-analytics/projects/1

## Uso de IA

En el desarrollo del proyecto utilizamos inteligencia artificial como apoyo en distintas etapas. Nos sirvieron para pasar nuestros códigos de algoritmos (que habíamos trabajado antes en Python) a JavaScript, para entender cómo funcionan los generadores y adaptar las cosas de visualización, para resolver dudas de CSS y lograr que la interfaz quedara como la habíamos pensado en el boceto, y también para redactar las fichas técnicas de cada algoritmo y este mismo README para acomodar mejor y no sea solo texto simple. En todos los casos revisamos lo que la IA nos daba, lo probamos, y lo ajustamos hasta que hiciera lo que necesitábamos.

## Aprendizajes y conclusiones
En este proyecto lo que aprendimos fue ver los algoritmos funcionando paso a paso: ver las comparaciones e intercambios dentro de cada ciclo hace que sea mucho más fácil entender cómo trabajan por dentro. También aprendimos a dividir el código en partes y a manejar mejor GitHub.En la parte de la IA nos ayudo a ahorrar tiempo, a transferir los códigos de un lenguaje a otro y poder entender códigos  y dudas que teníamos de la pagina web.





