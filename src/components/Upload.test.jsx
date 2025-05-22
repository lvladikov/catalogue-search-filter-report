/* eslint-disable testing-library/no-wait-for-multiple-assertions */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Upload from "./Upload";

import {
  mockFetch,
  mockGetTime,
  mockConsoleError,
} from "../utils/test-helpers";

const mockOnUpdateData = jest.fn();
const mockOnUpdateImageCache = jest.fn();
const mockOnUpdateServerIsLive = jest.fn();
const mockSetFile = jest.fn();

const fileContent = {
  observationsMeta: {
    "image1.jpg": { somekey: "Value 1" },
    "image2.jpg": { somekey: "Value 2" },
  },
};

const fileContentResultArray = [
  { imagePath: "image1.jpg", somekey: "Value 1" },
  { imagePath: "image2.jpg", somekey: "Value 2" },
];

const mockFile = new File([JSON.stringify(fileContent)], "test.json", {
  type: "application/json",
});

describe("Upload Component", () => {
  const renderComponent = (props = {}) => {
    return render(
      <Upload
        onUpdateData={mockOnUpdateData}
        onUpdateImageCache={mockOnUpdateImageCache}
        onUpdateServerIsLive={mockOnUpdateServerIsLive}
        file={null}
        setFile={mockSetFile}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
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
    renderComponent({ file: mockFile });
    expect(
      screen.queryByText("Please upload your Observations Data source.")
    ).not.toBeInTheDocument();
  });

  it("calls setFile when a file is selected", async () => {
    renderComponent();

    // eslint-disable-next-line testing-library/no-node-access
    const inputElement = document.querySelector('input[type="file"]');

    fireEvent.change(inputElement, {
      target: { files: [mockFile] },
    });

    await waitFor(() => {
      expect(mockSetFile).toHaveBeenCalledWith(mockFile);
    });
  });

  it("calls mockSetFile and onUpdateData when a file is uploaded", async () => {
    renderComponent();

    // eslint-disable-next-line testing-library/no-node-access
    const inputElement = document.querySelector('input[type="file"]');
    fireEvent.change(inputElement, {
      target: { files: [mockFile] },
    });

    await waitFor(() => {
      expect(mockSetFile).toHaveBeenCalledWith(mockFile);
      expect(mockOnUpdateData).toHaveBeenCalledWith(fileContentResultArray);
    });
  });

  it("calls onUpdateData with an empty array when an invalid JSON file is uploaded", async () => {
    mockConsoleError(() => "expected error, don't break or log");
    const fileContent = "invalid json";
    const mockFile = new File([fileContent], "test.json", {
      type: "application/json",
    });

    renderComponent();

    // eslint-disable-next-line testing-library/no-node-access
    const inputElement = document.querySelector('input[type="file"]');
    fireEvent.change(inputElement, {
      target: { files: [mockFile] },
    });

    await waitFor(() => {
      expect(mockOnUpdateData).toHaveBeenCalledWith([]);
    });
  });

  it("fetches server status and updates state when file changes", async () => {
    mockGetTime(123);
    mockFetch({ status: "ok", id: "123" });
    mockFetch({
      status: "ok",
      id: "123",
      cache: fileContentResultArray.map((i) => i.imagePath),
    });

    renderComponent({ file: mockFile });

    await waitFor(() => {
      expect(mockOnUpdateServerIsLive).toHaveBeenCalledWith(true);
      expect(mockOnUpdateImageCache).toHaveBeenCalledWith(
        fileContentResultArray.map((i) => i.imagePath)
      );
    });
  });

  it("handles server down scenario", async () => {
    mockFetch({ status: "error", id: "123" });

    renderComponent({ file: mockFile });

    await waitFor(() => {
      expect(mockOnUpdateServerIsLive).toHaveBeenCalledWith(false);
      expect(mockOnUpdateImageCache).toHaveBeenCalledWith([]);
    });
  });

  it("handles image cache fetch error", async () => {
    mockFetch(new Error("Failed to fetch image cache"), true);

    renderComponent({ file: mockFile });

    await waitFor(() => {
      expect(mockOnUpdateImageCache).toHaveBeenCalledWith([]);
    });
  });
});
