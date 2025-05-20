import { render, screen } from "@testing-library/react";
import LoadingIndicator from "./LoadingIndicator";

describe("LoadingIndicator Component", () => {
  const renderComponent = (props = {}) => {
    return render(<LoadingIndicator {...props} />);
  };
  test("renders the loading message", () => {
    renderComponent();
    const loadingElement = screen.getByText(/Loading data.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  test("has the correct class name", () => {
    renderComponent();
    const loadingElement = screen.getByText(/Loading data.../i);
    expect(loadingElement).toHaveClass("loading-data-wrapper");
  });
});
