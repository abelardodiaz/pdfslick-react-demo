import { usePDFSlick } from "@pdfslick/react";
import "@pdfslick/react/dist/pdf_viewer.css";
import "./index.css";

// PDF de ejemplo servido desde una URL publica (pdf.js de Mozilla).
const DEFAULT_PDF_URL =
  "https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf";

// Permite probar otro PDF via query param: ?pdf=<url>
function getPdfUrl(): string {
  if (typeof window === "undefined") return DEFAULT_PDF_URL;
  const param = new URLSearchParams(window.location.search).get("pdf");
  return param || DEFAULT_PDF_URL;
}

export default function App() {
  const PDF_URL = getPdfUrl();
  /**
   * usePDFSlick crea el visor y un store de Zustand (usePDFSlickStore).
   * El store es la unica fuente de verdad del estado del documento:
   * pageNumber, numPages y la instancia pdfSlick con sus metodos imperativos.
   */
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(PDF_URL, {
    scaleValue: "page-fit",
  });

  // Selectores: el componente solo re-renderiza cuando cambian estos valores.
  const pageNumber = usePDFSlickStore((s) => s.pageNumber);
  const numPages = usePDFSlickStore((s) => s.numPages);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  return (
    <div className="app">
      <header className="toolbar">
        <h1 className="title">PDFSlick React Demo</h1>
        <div className="controls">
          <button
            type="button"
            onClick={() => pdfSlick?.gotoPage(pageNumber - 1)}
            disabled={!pdfSlick || pageNumber <= 1}
          >
            Anterior
          </button>
          <span className="page-info">
            Pagina {numPages ? pageNumber : 0} / {numPages}
          </span>
          <button
            type="button"
            onClick={() => pdfSlick?.gotoPage(pageNumber + 1)}
            disabled={!pdfSlick || pageNumber >= numPages}
          >
            Siguiente
          </button>
        </div>
      </header>

      <div className="viewer-container">
        <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
      </div>
    </div>
  );
}
