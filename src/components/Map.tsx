import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  useMapEvents,
} from "react-leaflet";

import type { MapContainerProps } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Map as LeafletMap, DivIcon } from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useCoordinates } from "@/context/CoordinatesContext";

// Fix for default marker icon which can break in React environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon for the centroid marker
const centroidIcon = new DivIcon({
  className: "centroid-icon",
  html: `<div style="background-color: red; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const DEFAULT_CENTER: [number, number] = [10.987982, -74.789139]; //Plaza de la paz
const DEFAULT_ZOOM = 13;

export default function Map() {
  const mapRef = useRef<LeafletMap>(null);
  const { coordinates, bounds, centroid } = useCoordinates();

  useEffect(() => {
    if (mapRef.current) {
      // If we have bounds from the API, fit the map to them
      if (bounds) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (coordinates.length > 0) {
        // Otherwise, fit to the submitted coordinates
        const coordBounds = L.latLngBounds(
          coordinates.map((c) => [c.lat, c.lng])
        );
        mapRef.current.fitBounds(coordBounds, { padding: [50, 50] });
      }
    }
  }, [coordinates, bounds]);

  return (
    <MapContainer
      center={DEFAULT_CENTER as [number, number]}
      zoom={DEFAULT_ZOOM}
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.map((coord, idx) => (
        <Marker key={`coord-${idx}`} position={[coord.lat, coord.lng]}>
          <Popup>
            Marker at [{coord.lat.toFixed(5)}, {coord.lng.toFixed(5)}]
          </Popup>
        </Marker>
      ))}

      {/* Rectangle for the bounds from the API result */}
      {bounds && <Rectangle bounds={bounds} pathOptions={{ color: "blue" }} />}

      {/* Marker for the centroid from the API result */}
      {centroid && (
        <Marker position={[centroid.lat, centroid.lng]} icon={centroidIcon}>
          <Popup>
            Centroid at [{centroid.lat.toFixed(5)}, {centroid.lng.toFixed(5)}]
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
