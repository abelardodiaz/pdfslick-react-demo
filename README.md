# PDFSlick React Demo

Demo minima y funcional de [PDFSlick](https://pdfslick.dev), un visor de
documentos PDF para React construido sobre pdf.js, cuyo estado se maneja con un
store de [Zustand](https://github.com/pmndrs/zustand).

## Que demuestra

El punto central de PDFSlick es su patron de estado con Zustand. El hook
`usePDFSlick(url, options)` crea el visor y devuelve, entre otras cosas:

- `viewerRef`: ref callback que se enlaza al contenedor del documento.
- `PDFSlickViewer`: el componente que renderiza el PDF.
- `usePDFSlickStore`: un hook de store de Zustand que es la unica fuente de
  verdad del estado del documento.

En vez de pasar props o callbacks manualmente, la UI lee del store con
selectores y solo se vuelve a renderizar cuando los valores observados cambian:

```tsx
const pageNumber = usePDFSlickStore((s) => s.pageNumber);
const numPages = usePDFSlickStore((s) => s.numPages);
const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
```

La instancia `pdfSlick` expone metodos imperativos como `gotoPage(n)`, que la
toolbar usa para navegar entre paginas. Asi se separa el estado reactivo
(pageNumber, numPages) de las acciones imperativas (gotoPage), todo coordinado
por el mismo store.

Esta demo muestra:

- Un visor de PDF a pantalla completa.
- Una toolbar con la pagina actual, el total de paginas y botones
  Anterior / Siguiente que deshabilitan en los limites del documento.
- Carga de un PDF de ejemplo desde una URL publica.

## Stack

- Vite 6
- React 19 + TypeScript (modo estricto)
- @pdfslick/react 4

## Como correr

Requiere [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev
```

Abre la URL que imprime Vite (por defecto http://localhost:5173).

Para generar el build de produccion:

```sh
pnpm build
pnpm preview
```

## PDF de ejemplo

Por defecto carga un PDF publico de pdf.js de Mozilla (`helloworld.pdf`, 1 pagina).

Puedes probar cualquier otro PDF sin tocar codigo, pasandolo por query param:

```
http://localhost:5173/?pdf=<url-del-pdf>
```

Ejemplo con un PDF de 14 paginas (para probar la navegacion):

```
http://localhost:5173/?pdf=https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf
```

Tambien puedes cambiar la constante `DEFAULT_PDF_URL` en `src/App.tsx`, o colocar
un archivo en `public/` y usar `?pdf=/sample.pdf`.

## Gotcha: el worker de pdf.js en Vite

PDFSlick usa pdf.js, que necesita un Web Worker. En Vite hay que apuntar
`GlobalWorkerOptions.workerSrc` al worker servido como asset (ver `src/main.tsx`):

```ts
import { GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
```

Sin esto, pdf.js cae a un "fake worker", el documento no carga y veras
`Pagina 0 / 0`. `pdfjs-dist` debe estar en la MISMA version que usa
`@pdfslick/core` (aqui 6.0.227) para que el worker sea compatible.

## Estructura

```
.
|- index.html
|- package.json
|- vite.config.ts
|- tsconfig.json
|- tsconfig.app.json
|- tsconfig.node.json
|- src/
   |- main.tsx        Punto de entrada de React
   |- App.tsx         Visor + toolbar (patron Zustand de PDFSlick)
   |- index.css       Estilos del layout
   |- vite-env.d.ts
```

## Licencia

MIT. Ver [LICENSE](./LICENSE).
