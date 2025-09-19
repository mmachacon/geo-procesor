// components/MapWrapper.tsx
"use client"; // This component itself needs to be a client component

import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import React from "react"; // Import React for the optional loading fallback

// Dynamically import your Map component with SSR disabled
const MapLeaflet = dynamic(() => import("./Map"), {
  ssr: false, // <--- THIS IS THE CRUCIAL PART! It disables server-side rendering for Map.tsx
  loading: () => <p className="text-white text-center p-4">Loading map...</p>, // Optional: A fallback component to display while the map loads
});

// Define props for MapWrapper
interface MapWrapperProps {
  initialLocation: { lat: number; lng: number; name: string } | null;
}

export default function MapWrapper() {
  return (
    // This div ensures the Map component has a defined height/width
    <div className="h-full w-full bg-gray-100 p-4">
      {/* Pass the initialLocation prop to the dynamically imported Map component */}
      <MapLeaflet />
    </div>
  );
}
