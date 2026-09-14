import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapProvider } from "./MapProvider";

function MapController() {
  const map = useMap();
  const { flyToTarget } = useMapProvider();

  useEffect(() => {
    if (flyToTarget) {
      map.flyTo(flyToTarget, 14, { duration: 1, easeLinearity: 1 });
      console.log(`to: ${flyToTarget}`);
    }
  }, [flyToTarget, map]);

  return null;
}

export default MapController;
