import { createContext, useContext, useState } from "react";
import type { MarkerInfo } from "../types/mapTypes.ts";
import type { LatLngTuple } from "leaflet";

type MapProviderType = {
  markers: MarkerInfo[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerInfo[]>>;
  flyToTarget: LatLngTuple | undefined;
  setFlyToTarget: React.Dispatch<React.SetStateAction<LatLngTuple | undefined>>;
};
const MapProviderContext = createContext<MapProviderType | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [flyToTarget, setFlyToTarget] = useState<LatLngTuple>();
  return (
    <MapProviderContext
      value={{ markers, setMarkers, flyToTarget, setFlyToTarget }}
    >
      {children}
    </MapProviderContext>
  );
}

export function useMapProvider() {
  const context = useContext(MapProviderContext);
  if (!context) throw new Error("Provider not attached");

  return context;
}
