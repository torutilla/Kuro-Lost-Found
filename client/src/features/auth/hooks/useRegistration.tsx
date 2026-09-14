import AuthService from "../services/authService.ts";
import type { RegistrationInput } from "@shared/types/input.ts";
import type { User } from "@shared/types/user.ts";
import useAsync from "@shared/hooks/useAsync.tsx";

function useRegistration() {
  const { run, loading, error } = useAsync<User>();

  async function signup(input: RegistrationInput) {
    const user = await run(() => AuthService.signup(input));
    return user;
  }
  return { signup, loading, error };
}

export default useRegistration;
