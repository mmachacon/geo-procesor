# Geo Processor Frontend

This is a Next.js application designed to visualize and process geographical point data. Users can paste GeoJSON data into a text area, submit it to a backend service, and see the original points, a bounding box, and the centroid of the points rendered on an interactive map.

## Features

- **Interactive Map**: Uses Leaflet and React Leaflet for map rendering.
- **JSON Input**: Accepts an array of coordinates or a GeoJSON-like object with a `points` key.
- **Backend Integration**: Submits processed coordinates to a backend service running on `localhost:5000`.
- **Visual Feedback**:
  - Displays submitted points as markers.
  - Draws a rectangle for the bounding box returned by the backend.
  - Places a distinct marker for the centroid returned by the backend.
- **User-Friendly Interface**: Includes loading states, error messages, and success notifications.

## Tech Stack & Architectural Decisions

- **Framework**: Next.js with React and TypeScript.
- **Mapping**: Leaflet is used for its lightweight and robust mapping capabilities, integrated into React using React Leaflet. The map component is loaded dynamically with SSR disabled to ensure compatibility with the browser-only Leaflet library.
- **State Management**: React Context API (`CoordinatesContext`) is used to share geographical data (coordinates, bounds, centroid) between the input panel and the map component, avoiding prop-drilling.
- **API Communication**: The native `fetch` API is used for making `POST` requests to the backend. This logic is abstracted into a dedicated service file (`src/services/pointService.ts`) to separate concerns and improve reusability.
- **CORS Handling (Development)**: To work around Cross-Origin Resource Sharing (CORS) issues between the frontend (`localhost:3000`) and the backend (`localhost:5000`), Next.js Rewrites are configured in `next.config.js`. This proxies requests from `/api/*` on the frontend to the backend, making it seamless from the browser's perspective.
- **Styling**: Tailwind CSS is used for utility-first styling.
- **Testing**: The application is tested using Jest and React Testing Library. Tests cover component rendering, user interactions, and asynchronous logic by mocking the API service.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm
- A running instance of the corresponding backend service on `http://localhost:5000`.

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd geo-processor-frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application

1.  **Start the Backend Service**: Ensure your backend application is running and listening on `http://localhost:5000`.

2.  **Run the Frontend Development Server**:

    ```bash
    npm run dev
    ```

3.  Open http://localhost:3000 with your browser to see the result.

## Running Tests

To run the unit and integration tests for the components, execute the following command:

```bash
npm test
```

Open http://localhost:3000 with your browser to see the result.
