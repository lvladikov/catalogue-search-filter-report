import React from "react";
import { render, screen } from "@testing-library/react";
import CommonInput from "./CommonInput";

describe("CommonInput Component", () => {
  it("renders a label and an input field", () => {
    render(<CommonInput id="testId" children="Test Label" />);
    const labelElement = screen.getByText("Test Label");
    const inputElement = screen.getByRole("textbox", { id: "testId" });

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it("associates the label with the input field using the id", () => {
    render(<CommonInput id="testId" children="Test Label" />);
    const labelElement = screen.getByText("Test Label");
    const inputElement = screen.getByRole("textbox", { id: "testId" });

    expect(labelElement.htmlFor).toBe("testId");
    expect(inputElement).toBeInTheDocument();
  });

  it("passes other props to the input field", () => {
    render(
      <CommonInput id="testId" children="Test Label" placeholder="Enter text" />
    );
    const inputElement = screen.getByPlaceholderText("Enter text");

    expect(inputElement).toBeInTheDocument();
  });
});
