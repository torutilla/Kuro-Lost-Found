import type { User } from "@shared/types/user.ts";
import { fetchHandler } from "@shared/utils/fetchHandler.ts";
import useAsync from "@shared/hooks/useAsync.tsx";

function useGoogleOAuth() {
  const { run, loading, error } = useAsync<User>();
  async function login() {
    return await run(() => fetchHandler(`api/v1/auth/google`));
  }
  return { login, loading, error };
}

export default useGoogleOAuth;
