import useAsync from "@shared/hooks/useAsync.tsx";
import { fetchHandler } from "@shared/index.ts";
import type { PetRequest } from "../schema/petSchema.ts";
function usePostPet() {
  const { run, loading, error } = useAsync<string>();
  const postPet = async (data: PetRequest) => {
    return run(() =>
      fetchHandler("api/v1/pets/create", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    );
  };
  return { postPet, loading, error };
}

export default usePostPet;
