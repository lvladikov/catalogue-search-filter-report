/* eslint-disable testing-library/no-wait-for-multiple-assertions */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Upload from "./Upload";

import {
  mockFetch,
  mockGetTime,
  mockConsoleError,
} from "../utils/test-helpers";

const mockOnUpdateData = jest.fn();
const mockOnUpdateFileName = jest.fn();
const mockOnUpdateImageCache = jest.fn();
const mockOnUpdateServerIsLive = jest.fn();

describe("Upload Component", () => {
  const renderComponent = (props = {}) => {
    return render(
      <Upload
        onUpdateData={mockOnUpdateData}
        onUpdateFileName={mockOnUpdateFileName}
        onUpdateImageCache={mockOnUpdateImageCache}
        onUpdateServerIsLive={mockOnUpdateServerIsLive}
        fileName={""}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the upload prompt when no file is selected", () => {
    mockFetch(); //prevents the Cross origin http://localhost forbidden error
    renderComponent();
    expect(
      screen.getByText("Please upload your Observations Data source.")
    ).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it("does not render the upload prompt when a file is selected", () => {
    mockGetTime(123);
    mockFetch({ status: "ok", id: "123" });
    renderComponent({ fileName: "test.json" });
    expect(
      screen.queryByText("Please upload your Observations Data source.")
    ).not.toBeInTheDocument();
  });

  it("calls onUpdateFileName and onUpdateData when a file is uploaded", async () => {
    const fileContent = {
      observationsMeta: {
        "image1.jpg": { somekey: "Value 1" },
        "image2.jpg": { somekey: "Value 2" },
      },
    };
    const file = new File([JSON.stringify(fileContent)], "test.json", {
      type: "application/json",
    });

    renderComponent();

    // eslint-disable-next-line testing-library/no-node-access
    const inputElement = document.querySelector('input[type="file"]');
    fireEvent.change(inputElement, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnUpdateFileName).toHaveBeenCalledWith("test.json");
      expect(mockOnUpdateData).toHaveBeenCalledWith([
        { imagePath: "image1.jpg", somekey: "Value 1" },
        { imagePath: "image2.jpg", somekey: "Value 2" },
      ]);
    });
  });

  it("calls onUpdateData with an empty array when an invalid JSON file is uploaded", async () => {
    mockConsoleError(() => "expected error, don't break or log");
    const file = new File(["invalid json"], "test.json", {
      type: "application/json",
    });

    renderComponent();

    // eslint-disable-next-line testing-library/no-node-access
    const inputElement = document.querySelector('input[type="file"]');
    fireEvent.change(inputElement, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnUpdateData).toHaveBeenCalledWith([]);
    });
  });

  it("fetches data and updates state when fileName changes", async () => {
    mockGetTime(123);
    mockFetch({ status: "ok", id: "123" });
    mockFetch({ status: "ok", id: "123", cache: ["image1.jpg", "image2.jpg"] });

    renderComponent({ fileName: "test.json" });

    await waitFor(() => {
      expect(mockOnUpdateServerIsLive).toHaveBeenCalledWith(true);
      expect(mockOnUpdateImageCache).toHaveBeenCalledWith([
        "image1.jpg",
        "image2.jpg",
      ]);
    });
  });

  it("handles server down scenario", async () => {
    mockFetch({ status: "error", id: "123" });

    renderComponent({ fileName: "test.json" });

    await waitFor(() => {
      expect(mockOnUpdateServerIsLive).toHaveBeenCalledWith(false);
      expect(mockOnUpdateImageCache).toHaveBeenCalledWith([]);
    });
  });

  it("handles image cache error scenario", async () => {
    mockFetch(new Error("Failed to fetch image cache"), true);

    renderComponent({ fileName: "test.json" });

    await waitFor(() => {
      expect(mockOnUpdateImageCache).toHaveBeenCalledWith([]);
    });
  });
});
