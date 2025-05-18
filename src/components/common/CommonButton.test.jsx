import React from "react";
import { render, screen } from "@testing-library/react";
import CommonButton from "./CommonButton";

describe("CommonButton", () => {
  it("renders a label and an input element", () => {
    render(<CommonButton id="testId" type="button" />);
    const labelElement = screen.getByRole("button", { name: "" });
    const inputElement = screen.getByRole("button", { hidden: true });

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it("renders the children inside the label", () => {
    render(<CommonButton id="testId">Click Me</CommonButton>);
    const labelElement = screen.getByText("Click Me");
    expect(labelElement).toBeInTheDocument();
  });

  it("passes the id prop to both label and input", () => {
    render(<CommonButton id="testId">Click Me</CommonButton>);
    const labelElement = screen.getByText("Click Me");
    const inputElement = screen.getByRole("textbox", { hidden: true });
    expect(labelElement.htmlFor).toBe("testId");
    expect(inputElement.id).toBe("testId");
  });

  it("passes other props to the input element", () => {
    render(<CommonButton id="testId" type="button" value="Submit" />);
    const inputElement = screen.getByRole("button", { hidden: true });
    expect(inputElement).toHaveAttribute("type", "button");
    expect(inputElement).toHaveAttribute("value", "Submit");
  });
});
