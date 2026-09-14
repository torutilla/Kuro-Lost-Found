import CurrentLocationProvider from "../../../shared/context/CurrentLocationProvider.tsx";
import { MapProvider } from "../../map/components/MapProvider.tsx";
import Home from "./Home.tsx";

function HomeWrapper() {
  return (
    <MapProvider>
      <CurrentLocationProvider>
        <Home />
      </CurrentLocationProvider>
    </MapProvider>
  );
}

export default HomeWrapper;
