import { useMapProvider } from "./MapProvider.tsx";
import BaseMap from "./BaseMap.tsx";
import { type LatLngTuple } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MapController from "./MapController.tsx";
import { createIcon, statusMarker } from "./Markers.tsx";
import PetPopup from "./PetPopup.tsx";
import { useCurrentLocation } from "@shared/context/CurrentLocationProvider.tsx";
import { useEffect } from "react";

function HomeMap({ center }: { center: LatLngTuple }) {
  const { markers, setFlyToTarget } = useMapProvider();
  const { location } = useCurrentLocation();
  useEffect(() => {
    if (!location) return;
    setFlyToTarget(location);
  }, [location]);
  return (
    <BaseMap center={center}>
      <MapController />
      {markers.map((marker) => (
        <Marker
          pane={marker.markerType == "current" ? "top" : "base"}
          position={marker.latLng}
          key={marker.pet?.id}
          icon={createIcon(statusMarker[marker.markerType])}
        >
          <Popup>{marker.pet && <PetPopup pet={marker.pet} />}</Popup>
        </Marker>
      ))}
      {location && (
        <Marker position={location} icon={createIcon(statusMarker.current)} />
      )}
    </BaseMap>
  );
}

export default HomeMap;
