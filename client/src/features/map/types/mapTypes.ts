import type { LatLngTuple } from "leaflet";
import type { Pet } from "../../home/schema/petSchema.ts";
export type MarkerInfo = {
    latLng: LatLngTuple;
    pet?: Pet;
    markerType: "current" | "lost" | "found";
}