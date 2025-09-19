import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

export type Coordinate = { lat: number; lng: number };
export type Bounds = [[number, number], [number, number]];

export type CoordinatesContextType = {
  coordinates: Coordinate[];
  setCoordinates: (coords: Coordinate[]) => void;
  bounds: Bounds | null;
  setBounds: (bounds: Bounds | null) => void;
  centroid: Coordinate | null;
  setCentroid: (centroid: Coordinate | null) => void;
  clearAll: () => void;
};

const CoordinatesContext = createContext<CoordinatesContextType | undefined>(
  undefined
);

export function useCoordinates() {
  const context = useContext(CoordinatesContext);
  if (!context) {
    throw new Error("useCoordinates must be used within a CoordinatesProvider");
  }
  return context;
}

export function CoordinatesProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [centroid, setCentroid] = useState<Coordinate | null>(null);

  const clearAll = useCallback(() => {
    setCoordinates([]);
    setBounds(null);
    setCentroid(null);
  }, []);

  const value = useMemo(
    () => ({
      coordinates,
      setCoordinates,
      bounds,
      setBounds,
      centroid,
      setCentroid,
      clearAll,
    }),
    [coordinates, bounds, centroid, clearAll]
  );

  return (
    <CoordinatesContext.Provider value={value}>
      {children}
    </CoordinatesContext.Provider>
  );
}
