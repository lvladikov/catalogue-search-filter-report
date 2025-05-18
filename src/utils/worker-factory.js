const createPDFWorker = () => {
  return new Worker(new URL("pdf-gen-worker.js", import.meta.url));
};

export { createPDFWorker };
