import type { LatLngTuple } from "leaflet";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type SetStateAction,
} from "react";
export type CurrentLocationType = {
  location: LatLngTuple | null;
  setLocation: React.Dispatch<SetStateAction<LatLngTuple | null>>;
};
const CurrentLocationContext = createContext<CurrentLocationType | null>(null);
function CurrentLocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LatLngTuple | null>(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation([lat, lng]);
    });
  }, []);
  return (
    <CurrentLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </CurrentLocationContext.Provider>
  );
}
export function useCurrentLocation() {
  const context = useContext(CurrentLocationContext);
  if (!context) throw new Error("Provider not attached");
  return context;
}
export default CurrentLocationProvider;
