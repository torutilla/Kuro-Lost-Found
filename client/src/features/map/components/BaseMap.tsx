import {
  MapContainer,
  Pane,
  TileLayer,
  type MapContainerProps,
} from "react-leaflet";

type BaseMapProps = MapContainerProps & {};
function BaseMap({ center, zoom = 13, children, ...props }: BaseMapProps) {
  return (
    <MapContainer
      {...props}
      zoom={zoom}
      center={center}
      className="h-full w-full z-1"
    >
      <Pane name="base" style={{ zIndex: 400 }} />
      <Pane name="highlight" style={{ zIndex: 500 }} />
      <Pane name="top" style={{ zIndex: 600 }} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}

export default BaseMap;
