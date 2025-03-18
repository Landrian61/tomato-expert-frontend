import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import Diagnosis from "./Diagnosis";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the components used in Diagnosis
vi.mock("@/components/diagnosis/ImageUploader", () => ({
  default: ({ onImageSelected }: { onImageSelected: (file: File) => void }) => {
    const handleUpload = () => {
      const file = new File(["dummy content"], "test.jpg", {
        type: "image/jpeg"
      });
      onImageSelected(file);
    };

    return (
      <div data-testid="image-uploader">
        <button onClick={handleUpload} data-testid="upload-button">
          Upload Image
        </button>
      </div>
    );
  }
}));

vi.mock("@/components/diagnosis/DiagnosisResult", () => ({
  default: ({ isActive }: { isActive: boolean }) => (
    <div
      data-testid="diagnosis-result"
      style={{ display: isActive ? "block" : "none" }}
    >
      Diagnosis Result Content
    </div>
  )
}));

vi.mock("@/components/layout/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">
      <h1>Plant Diagnosis</h1>
      {children}
    </div>
  )
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe("Diagnosis Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the image uploader component", () => {
    render(<Diagnosis />);
    expect(screen.getByTestId("image-uploader")).toBeInTheDocument();
  });

  it("initially does not show the diagnosis result", () => {
    render(<Diagnosis />);
    const result = screen.getByTestId("diagnosis-result");
    expect(result).toHaveStyle("display: none");
  });

  it("shows validation alert after image selection", async () => {
    render(<Diagnosis />);

    // Simulate image upload
    fireEvent.click(screen.getByTestId("upload-button"));

    // Check for validation status message
    await waitFor(() => {
      expect(screen.getByText(/Validating Image/i)).toBeInTheDocument();
    });

    // After validation period
    await waitFor(
      () => {
        expect(screen.queryByText(/Validating Image/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Image Validated/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("shows analyze button after valid image selection", async () => {
    render(<Diagnosis />);

    // Simulate image upload
    fireEvent.click(screen.getByTestId("upload-button"));

    // Wait for validation to complete
    await waitFor(
      () => {
        expect(screen.getByText(/Image Validated/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check for analyze button
    expect(screen.getByText("Analyze Image")).toBeInTheDocument();
  });

  it("shows diagnosis result after analyzing", async () => {
    render(<Diagnosis />);

    // Simulate image upload
    fireEvent.click(screen.getByTestId("upload-button"));

    // Wait for validation to complete
    await waitFor(
      () => {
        expect(screen.getByText(/Image Validated/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click analyze button
    fireEvent.click(screen.getByText("Analyze Image"));

    // Check for loading state
    expect(screen.getByText(/Analyzing Image.../i)).toBeInTheDocument();

    // Wait for analysis to complete
    await waitFor(
      () => {
        const result = screen.getByTestId("diagnosis-result");
        expect(result).toHaveStyle("display: block");
      },
      { timeout: 3000 }
    );
  });
});
