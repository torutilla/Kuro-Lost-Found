import L from "leaflet";

const currentLocationSvg = `<svg width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="10" fill="#3B82F6" opacity="0.2">
    <animate attributeName="r" from="10" to="18" dur="1.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="0.3" to="0" dur="1.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="20" cy="20" r="6" fill="#3B82F6"/>
  <circle cx="20" cy="20" r="2" fill="white"/>
</svg>`;
const lostSvg = `<svg width="40" height="40" viewBox="0 0 24 24">
  <path
  stroke="black"
  stroke-width="0.3"
    d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"
    fill="#EF4444"
  />
  <g fill="white">
    <circle cx="12" cy="10" r="2"/>
    <circle cx="9" cy="8" r="1"/>
    <circle cx="15" cy="8" r="1"/>
    <circle cx="10.5" cy="6" r="1"/>
    <circle cx="13" cy="6" r="1"/>
  </g>
</svg>`;
const foundSvg = `<svg width="40" height="40" viewBox="0 0 24 24">
  <path
    d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"
    fill="#22C55E"
  />
  <g fill="white">
    <circle cx="12" cy="10" r="2"/>
    <circle cx="9" cy="8" r="1"/>
    <circle cx="15" cy="8" r="1"/>
    <circle cx="10" cy="12" r="1"/>
    <circle cx="14" cy="12" r="1"/>
  </g>
</svg>`;

type MarkerIconProps = {
  img: string;
  size: [number, number];
  anchor: [number, number];
};
export const createIcon = (svg: MarkerIconProps) =>
  L.divIcon({
    className: "custom-marker",
    html: svg.img,
    iconSize: svg.size,
    iconAnchor: svg.anchor,
  });

export const statusMarker: Record<string, MarkerIconProps> = {
  current: { img: currentLocationSvg, size: [40, 40], anchor: [20, 20] },
  lost: { img: lostSvg, size: [40, 40], anchor: [20, 20] },
  found: { img: foundSvg, size: [40, 40], anchor: [20, 20] },
};
