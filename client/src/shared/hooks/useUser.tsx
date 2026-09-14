import { useAuth } from "@features/auth/hooks/useAuth.tsx";
import type { User } from "../types/user.ts";

function useUser() {
  const { user, ...rest } = useAuth();

  return {
    ...rest,
    user: user as User,
  };
}

export default useUser;
