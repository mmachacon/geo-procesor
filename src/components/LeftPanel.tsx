"use client";
import React, { useState, useCallback } from "react";
import { useCoordinates } from "@/context/CoordinatesContext";
import { submitPoints } from "@/services/pointService";

// Define a type for a single coordinate point for better type safety
type Coordinate = {
  lat: number;
  lng: number;
};

export default function LeftPanel() {
  const [input, setInput] = useState("");
  const { setCoordinates, setBounds, setCentroid, clearAll } = useCoordinates();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setBounds(null);
    setCentroid(null);
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(input);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your input.");
      }

      // Accept either { points: [...] } or just [...]
      const coords: any[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.points)
        ? parsed.points
        : [];

      // Validate coordinates
      const validCoords = coords.filter(
        (pt): pt is Coordinate =>
          pt != null &&
          typeof pt.lat === "number" &&
          typeof pt.lng === "number" &&
          !isNaN(pt.lat) &&
          !isNaN(pt.lng)
      );

      if (validCoords.length === 0 && coords.length > 0) {
        throw new Error("No valid coordinates found in the provided JSON.");
      }

      // Update the map view with the valid coordinates
      setCoordinates(validCoords);

      // Call the dedicated service to submit points
      const result = await submitPoints(validCoords);

      if (result.result && result.result.bounds && result.result.centroid) {
        const { bounds, centroid } = result.result;
        // Convert bounds to the format Leaflet expects: [[south, west], [north, east]]
        const leafletBounds: [[number, number], [number, number]] = [
          [bounds.south, bounds.west],
          [bounds.north, bounds.east],
        ];
        setBounds(leafletBounds);
        setCentroid(centroid);
      }

      console.log("Success:", result);
      setMessage({ type: "success", text: "Points submitted successfully!" });
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unexpected error occurred.";
      console.error("Submission failed:", e);
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [input, setCoordinates, setBounds, setCentroid]);

  const handleClear = useCallback(() => {
    setInput("");
    clearAll();
    setMessage(null);
  }, [clearAll]);

  return (
    <div className="h-full w-full bg-gray-200 p-4 flex flex-col">
      <label htmlFor="json-coords" className="block mb-2 text-black font-bold">
        Paste coordinates JSON:
      </label>
      <textarea
        id="json-coords"
        className="flex-1 bg-black text-white p-2 rounded resize-none border border-gray-700 mb-4"
        style={{ width: "100%" }}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setMessage(null);
        }}
        placeholder='{"points" : [{ "lat": 40.7128, "lng": -74.0060 },{ "lat": 34.0522, "lng": -118.2437 }]}'
        disabled={isLoading}
      />
      {message && (
        <div
          className={`mb-2 text-sm ${
            message.type === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          className="w-full bg-gray-600 text-white py-2 rounded font-bold hover:bg-gray-700 transition disabled:opacity-50"
          onClick={handleClear}
          disabled={isLoading}
        >
          Clear
        </button>
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isLoading || !input}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
