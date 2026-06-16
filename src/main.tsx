import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalWorkerOptions } from "pdfjs-dist";
// Vite sirve el worker de pdf.js como asset con ?url (funciona en dev y build).
// Sin esto, pdf.js cae a un "fake worker" y el documento no carga.
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import App from "./App.tsx";
import "./index.css";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
