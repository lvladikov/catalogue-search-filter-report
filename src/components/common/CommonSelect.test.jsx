import React from "react";
import { render, screen } from "@testing-library/react";
import CommonSelect from "./CommonSelect";

describe("CommonSelect Component", () => {
  const options = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" },
    { value: "option3", text: "Option 3" },
  ];

  const renderComponent = (props = {}) => {
    return render(
      <CommonSelect
        id="testSelect"
        children="Test Label"
        options={options}
        {...props}
      />
    );
  };

  it("renders the label and select element", () => {
    renderComponent();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { id: "testSelect" })
    ).toBeInTheDocument();
  });

  it("renders the options correctly", () => {
    renderComponent();
    options.forEach((option) => {
      expect(screen.getByText(option.text)).toBeInTheDocument();
    });
  });

  it("sets the correct values for options", () => {
    renderComponent();
    const selectElement = screen.getByRole("combobox", { id: "testSelect" });
    const optionElements = screen.getAllByRole("option");

    expect(selectElement).toBeInTheDocument();

    optionElements.forEach((optionElement, index) => {
      expect(optionElement.value).toBe(options[index].value);
    });
  });

  it("passes other props to the select element", () => {
    renderComponent({
      className: "custom-class",
      "data-testid": "custom-testid",
    });

    const selectElement = screen.getByRole("combobox", { id: "testSelect" });
    expect(selectElement.classList.contains("custom-class")).toBe(true);
    expect(selectElement).toHaveAttribute("data-testid", "custom-testid");
  });
});
