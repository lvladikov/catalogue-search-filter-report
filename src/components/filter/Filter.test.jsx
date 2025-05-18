import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "./Filter";
import { months } from "../../utils/options";

import { mockConsoleLog } from "../../utils/test-helpers";

// Mock the utils functions
jest.mock("../../utils/date-and-time", () => ({
  getCurrentMonthIndex: () => 0,
  getCurrentYear: () => 2023,
  getMonthsOfTheYear: () => ["jan", "feb"],
  getDaysOfTheWeek: () => ["mon", "tue"],
}));

jest.mock("../../utils/filter", () => ({
  getFilteredData: jest.fn(() => []),
}));

describe("Filter Component", () => {
  const mockData = [
    { id: 1, name: "Observation 1" },
    { id: 2, name: "Observation 2" },
  ];
  const mockOnUpdateFilters = jest.fn();
  const mockOnShowLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );
  });

  it("updates filterByText state when input changes", () => {
    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );
    const inputElement = screen.getByLabelText("Filter by text:");
    fireEvent.change(inputElement, { target: { value: "test" } });
    expect(inputElement.value).toBe("test");
  });

  it("updates selectedMonth state when month select changes", () => {
    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );
    const selectElement = screen.getByLabelText("Filter by Month:");
    fireEvent.change(selectElement, { target: { value: months[1].value } }); // Select the second month
    expect(selectElement.value).toBe(months[1].value);
  });

  it("updates filterStartAt state when input changes", () => {
    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );
    const inputElement = screen.getByLabelText("Results start from:");
    fireEvent.change(inputElement, { target: { value: "5" } });
    expect(inputElement.value).toBe("5");
  });

  it("calls handleFilterFormSubmit when the form is submitted", () => {
    mockConsoleLog();

    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );
    const submitButton = screen.getByTitle(
      "Process Data based on Filters applied"
    );
    fireEvent.click(submitButton);
    expect(mockOnUpdateFilters).toHaveBeenCalledTimes(1);
    expect(mockOnShowLoading).toHaveBeenCalledTimes(1);
  });

  it("calls handleReset when the reset button is clicked", () => {
    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );
    const resetButton = screen.getByTitle(
      "Reset all filtering options (no preselected dates)"
    );
    fireEvent.click(resetButton);
    expect(mockOnUpdateFilters).toHaveBeenCalledTimes(1);
  });

  it("shows a confirmation dialog when serverIsLive is false and filterLimit is over 100", () => {
    const confirmSpy = jest.spyOn(window, "confirm");
    confirmSpy.mockImplementation(() => true);

    mockConsoleLog();

    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={false}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );

    const limitInput = screen.getByLabelText("Results limit:");
    fireEvent.change(limitInput, { target: { value: "101" } });

    const submitButton = screen.getByTitle(
      "Process Data based on Filters applied"
    );
    fireEvent.click(submitButton);

    expect(confirmSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("does not show a confirmation dialog when serverIsLive is true and filterLimit is over 100", () => {
    const confirmSpy = jest.spyOn(window, "confirm");
    confirmSpy.mockImplementation(() => true);

    mockConsoleLog();

    render(
      <Filter
        data={mockData}
        onUpdateFilters={mockOnUpdateFilters}
        serverIsLive={true}
        loading={false}
        onShowLoading={mockOnShowLoading}
      />
    );

    const limitInput = screen.getByLabelText("Results limit:");
    fireEvent.change(limitInput, { target: { value: "101" } });

    const submitButton = screen.getByTitle(
      "Process Data based on Filters applied"
    );
    fireEvent.click(submitButton);

    expect(confirmSpy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
