import { Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import BaseMap from "@features/map/components/BaseMap.tsx";
import { createIcon, statusMarker } from "./Markers";
import type { LatLngTuple } from "leaflet";

type Props = {
  value?: LatLngTuple | null;
  onChange: (coords: LatLngTuple) => void;
};

function MapClickHandler({ onSelect }: { onSelect: (c: LatLngTuple) => void }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

function MapPicker({ value, onChange }: Props) {
  const [position, setPosition] = useState<LatLngTuple | null>(value ?? null);

  const handleSelect = (coords: LatLngTuple) => {
    setPosition(coords);
    onChange(coords);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-56 w-full rounded-lg overflow-hidden">
        <BaseMap
          center={position ?? [14.6507, 121.1029]}
          zoom={13}
          className="w-full h-full"
        >
          <MapClickHandler onSelect={handleSelect} />

          {position && (
            <Marker position={position} icon={createIcon(statusMarker.lost)} />
          )}
        </BaseMap>
      </div>

      <p className="text-xs text-neutral-500">
        {position
          ? `Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}`
          : "Click on the map to pin location"}
      </p>
    </div>
  );
}

export default MapPicker;
