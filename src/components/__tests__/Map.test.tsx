import React from "react";
import { render, screen } from "@testing-library/react";
import Map from "../Map";
import { CoordinatesProvider } from "../../context/CoordinatesContext";

describe("Map", () => {
  it("renders no markers when coordinates are empty", () => {
    render(
      <CoordinatesProvider>
        <Map />
      </CoordinatesProvider>
    );
    expect(screen.queryAllByRole("img", { hidden: true }).length).toBe(0);
  });

  it("renders markers for each coordinate", () => {
    const coords = [
      { lat: 1, lng: 2 },
      { lat: 3, lng: 4 },
    ];
    // Custom provider to inject coordinates
    function CustomProvider({ children }: { children: React.ReactNode }) {
      return <CoordinatesProvider>{children}</CoordinatesProvider>;
    }
    // Mock useCoordinates to return coords
    jest
      .spyOn(require("../../context/CoordinatesContext"), "useCoordinates")
      .mockReturnValue({ coordinates: coords, setCoordinates: jest.fn() });
    render(
      <CustomProvider>
        <Map />
      </CustomProvider>
    );
    // There should be two markers
    expect(screen.getAllByText(/Marker at/).length).toBe(2);
  });
});
