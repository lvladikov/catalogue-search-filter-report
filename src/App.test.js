import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./utils/pdf-gen-worker.js");

test("renders Upload component initially", () => {
  render(<App />);
  expect(
    screen.getByText(/Please upload your Observations Data source/i)
  ).toBeInTheDocument();
});
