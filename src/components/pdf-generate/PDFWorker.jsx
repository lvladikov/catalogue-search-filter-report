import { useEffect } from "react";

import { createPDFWorker } from "../../utils/worker-factory";

const localPDFGenCheckStatusURL =
  "http://localhost:3050/generate-pdf-check-status";

export default function PDFWorker({
  pdfJobID,
  onWorkerDataUpdate,
  onWorkerStatusUpdate,
}) {
  const workerRef = createPDFWorker();

  useEffect(() => {
    workerRef.onmessage = (event) => {
      const { status, data } = event.data;
      onWorkerStatusUpdate(status);
      if (data) onWorkerDataUpdate(data);
    };

    workerRef.postMessage({
      url: `${localPDFGenCheckStatusURL}?id=${pdfJobID.current}`,
    });

    return () => workerRef.terminate(); // Cleanup worker on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return;
}
