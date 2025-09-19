type Coordinate = {
  lat: number;
  lng: number;
};

const API_URL = "http://localhost:5000/points";

/**
 * Submits an array of coordinates to the backend API.
 * @param coordinates - An array of coordinate objects to be submitted.
 * @returns A promise that resolves with the server's response.
 */
export const submitPoints = async (coordinates: Coordinate[]) => {
  // Prepare payload for the backend, ensuring it has the "points" key
  const payload = {
    points: coordinates,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred on the server." }));
    throw new Error(
      `Server error: ${response.status} - ${
        errorData.message || "Failed to submit points."
      }`
    );
  }

  return response.json();
};
