import useFetchPets from "../hooks/useFetchPets.tsx";
import { useEffect, useRef } from "react";
import LoadingScreen from "@shared/components/layout/LoadingScreen.tsx";
import HomeMap from "@features/map/components/HomeMap.tsx";

import { useCurrentLocation } from "@shared/context/CurrentLocationProvider.tsx";
import { useMapProvider } from "@features/map/components/MapProvider.tsx";
import useSocketEvent from "@shared/hooks/useSocketEvent.tsx";
import PetDrawer from "../components/layout/PetDrawer.tsx";
import Button from "../../../shared/components/common/Button.tsx";
import { Add, LocationSearching } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Home() {
  const { pets, loading, loadMore, addPet } = useFetchPets();
  const { location } = useCurrentLocation();
  const { setMarkers, setFlyToTarget } = useMapProvider();
  const navigate = useNavigate();

  useSocketEvent({
    event: "pet:created",
    callback: addPet,
  });

  const didRun = useRef(false); // to be removed when prod.
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    loadMore();
  }, []);
  useEffect(() => {
    if (pets.length > 0) {
      setMarkers(
        pets
          .filter((pet) => pet.location_point)
          .map((pet) => ({
            pet: pet,
            latLng: [pet.location_point!.lat, pet.location_point!.lng],
            markerType: pet.status,
          })),
      );
    }
  }, [pets]);

  return (
    <div className="relative bg-white h-full">
      {loading && <LoadingScreen />}
      <div className="absolute bottom-20 left-4 z-40 flex flex-col gap-2 lg:bottom-4">
        <Button
          variant="solid"
          color="grayscale"
          className="p-2.5 shadow-lg ring-1 ring-black/5"
          onClick={() => {
            if (!location) return;
            setFlyToTarget([...location]);
          }}
          aria-label="Center on my location"
        >
          <LocationSearching fontSize="small" />
        </Button>
        <Button
          className="h-9 w-9 rounded-full p-0 shadow-lg lg:hidden"
          onClick={() => navigate("/post")}
          aria-label="Report a pet"
        >
          <Add fontSize="small" />
        </Button>
      </div>
      <HomeMap center={location ?? [14.6507, 121.1029]} />

      <PetDrawer pets={pets} />
    </div>
  );
}

export default Home;
