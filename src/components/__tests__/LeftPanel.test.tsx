import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeftPanel from "../LeftPanel";
import {
  CoordinatesProvider,
  useCoordinates,
} from "../../context/CoordinatesContext";
import * as pointService from "../../services/pointService";

// Mock the pointService
jest.mock("../../services/pointService");
const mockedSubmitPoints = pointService.submitPoints as jest.Mock;

// Helper component to render LeftPanel within the provider and expose context values
const TestComponent = () => {
  const { coordinates, bounds, centroid } = useCoordinates();
  return (
    <div>
      <LeftPanel />
      <div data-testid="coordinates">{JSON.stringify(coordinates)}</div>
      <div data-testid="bounds">{JSON.stringify(bounds)}</div>
      <div data-testid="centroid">{JSON.stringify(centroid)}</div>
    </div>
  );
};

describe("LeftPanel", () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockedSubmitPoints.mockClear();
  });

  it("renders textarea and buttons", () => {
    render(
      <CoordinatesProvider>
        <LeftPanel />
      </CoordinatesProvider>
    );
    expect(
      screen.getByLabelText(/Paste coordinates JSON/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  it("shows an error message for invalid JSON", async () => {
    render(
      <CoordinatesProvider>
        <LeftPanel />
      </CoordinatesProvider>
    );

    const textarea = screen.getByLabelText(/Paste coordinates JSON/i);
    fireEvent.change(textarea, { target: { value: "invalid json" } });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid JSON format. Please check your input.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error message if no valid coordinates are found", async () => {
    render(
      <CoordinatesProvider>
        <LeftPanel />
      </CoordinatesProvider>
    );

    const textarea = screen.getByLabelText(/Paste coordinates JSON/i);
    fireEvent.change(textarea, { target: { value: '[{"foo":1}]' } });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("No valid coordinates found in the provided JSON.")
      ).toBeInTheDocument();
    });
  });

  it("handles successful submission, updates context, and shows success message", async () => {
    const mockApiResponse = {
      status: "success",
      message: "Received 2 points.",
      result: {
        bounds: {
          north: 40.7128,
          south: 34.0522,
          east: -74.006,
          west: -118.2437,
        },
        centroid: { lat: 37.3825, lng: -96.12485 },
      },
    };
    mockedSubmitPoints.mockResolvedValue(mockApiResponse);

    render(
      <CoordinatesProvider>
        <TestComponent />
      </CoordinatesProvider>
    );

    const textarea = screen.getByLabelText(/Paste coordinates JSON/i);
    fireEvent.change(textarea, {
      target: {
        value: JSON.stringify({
          points: [
            { lat: 40.7128, lng: -74.006 },
            { lat: 34.0522, lng: -118.2437 },
          ],
        }),
      },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Submitting...");

    // Wait for async operations to complete
    await waitFor(() => {
      // Check for success message
      expect(
        screen.getByText("Points submitted successfully!")
      ).toBeInTheDocument();
    });

    // Check that context was updated correctly
    expect(screen.getByTestId("coordinates")).toHaveTextContent(
      JSON.stringify([
        { lat: 40.7128, lng: -74.006 },
        { lat: 34.0522, lng: -118.2437 },
      ])
    );
    expect(screen.getByTestId("bounds")).toHaveTextContent(
      JSON.stringify([
        [34.0522, -118.2437],
        [40.7128, -74.006],
      ])
    );
    expect(screen.getByTestId("centroid")).toHaveTextContent(
      JSON.stringify({ lat: 37.3825, lng: -96.12485 })
    );

    // Check that button is re-enabled
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent("Submit");
  });

  it("handles API submission failure and shows an error message", async () => {
    mockedSubmitPoints.mockRejectedValue(new Error("Network Error"));

    render(
      <CoordinatesProvider>
        <LeftPanel />
      </CoordinatesProvider>
    );

    const textarea = screen.getByLabelText(/Paste coordinates JSON/i);
    fireEvent.change(textarea, {
      target: { value: '[{"lat":1,"lng":2}]' },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });
  });

  it("clears the textarea and context values when Clear button is pressed", async () => {
    render(
      <CoordinatesProvider>
        <TestComponent />
      </CoordinatesProvider>
    );

    const textarea = screen.getByLabelText<HTMLTextAreaElement>(
      /Paste coordinates JSON/i
    );
    fireEvent.change(textarea, {
      target: { value: '[{"lat":1,"lng":2}]' },
    });
    expect(textarea.value).toBe('[{"lat":1,"lng":2}]');

    // Submit to populate context
    mockedSubmitPoints.mockResolvedValue({ result: {} });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByTestId("coordinates")).not.toBe("[]");
    });

    // Clear
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    fireEvent.click(clearButton);

    // Check if textarea and context are cleared
    expect(textarea.value).toBe("");
    expect(screen.getByTestId("coordinates")).toHaveTextContent("[]");
    expect(screen.getByTestId("bounds")).toHaveTextContent("null");
    expect(screen.getByTestId("centroid")).toHaveTextContent("null");
  });
});
