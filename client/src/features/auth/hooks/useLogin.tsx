import AuthService from "../services/authService.ts";
import type { User } from "@shared/types/user.ts";
import useAsync from "@shared/hooks/useAsync.tsx";

function useLogin() {
  const { run, loading, error } = useAsync<User>();

  const login = async (email: string, password: string) => {
    return await run(() => AuthService.login(email, password));
  };

  return { login, loading, error };
}

export default useLogin;
