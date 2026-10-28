import useAsync from "@shared/hooks/useAsync.tsx";
import { fetchHandler } from "@shared/index.ts";
import type { Pet, PetArrayResponse } from "../schema/petSchema.ts";
import { useState } from "react";

function useFetchPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const { run, loading, error } = useAsync<PetArrayResponse>();
  const [cursor, setCursor] = useState<PetArrayResponse["nextCursor"]>(null);

  const mergePets = (incoming: Pet[]) => {
    setPets((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      incoming.forEach((p) => map.set(p.id, p));

      return Array.from(map.values()).sort(
        (a, b) =>
          new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime(),
      );
    });
  };

  const loadMore = async () => {
    if (loading) return; // prevent double-requests

    const query =
      cursor?.lastObservedAt && cursor?.lastId
        ? `/api/v1/pets?lastObservedAt=${encodeURIComponent(
            cursor.lastObservedAt.toISOString(),
          )}&lastId=${encodeURIComponent(cursor.lastId)}`
        : "/api/v1/pets";

    const res = await run(() => fetchHandler(query));
    if (!res) return;

    mergePets(res.pets);
    setCursor(res.nextCursor);
  };
  const addPet = (newPet: Pet) => {
    setPets((prev) => {
      if (prev.some((p) => p.id === newPet.id)) return prev;
      return [newPet, ...prev];
    });
  };

  return {
    pets,
    loadMore,
    loading,
    error,
    hasMore: cursor !== null,
    addPet,
    mergePets,
  };
}

export default useFetchPets;
