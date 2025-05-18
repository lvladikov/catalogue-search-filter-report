import { render, screen } from "@testing-library/react";
import LoadingIndicator from "./LoadingIndicator";

describe("LoadingIndicator Component", () => {
  test("renders the loading message", () => {
    render(<LoadingIndicator />);
    const loadingElement = screen.getByText(/Loading data.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  test("has the correct class name", () => {
    render(<LoadingIndicator />);
    const loadingElement = screen.getByText(/Loading data.../i);
    expect(loadingElement).toHaveClass("loading-data-wrapper");
  });
});
