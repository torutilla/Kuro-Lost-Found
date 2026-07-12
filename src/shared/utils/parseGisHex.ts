import { Geometry } from "wkx";

type ParsedGeoJSON = {
    type: "Point";
    coordinates: [lng: number, lat: number]
}
export function parseGISHex(hex: string): { lng: number, lat: number } {
    const geom = Geometry.parse(Buffer.from(hex, 'hex'));

    const geoJson = geom.toGeoJSON() as ParsedGeoJSON;

    return {
        lat: geoJson.coordinates[1],
        lng: geoJson.coordinates[0]
    }
}