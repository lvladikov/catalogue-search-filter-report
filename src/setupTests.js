import "@testing-library/jest-dom";

//Jest workaround for import.meta.url problem
jest.mock("./utils/worker-factory.js", () => {
  return {
    createPDFWorker: jest.fn(() => ({
      onmessage: null,
    })),
  };
});
