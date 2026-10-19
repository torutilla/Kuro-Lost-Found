import { useNavigate } from "react-router-dom";
import { fetchHandler } from "../../../shared/index.ts";
import { useAuth } from "./useAuth.tsx";

export default function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      // The logout endpoint is POST — a GET would 404 and leave the session
      // cookies in place (so a refresh would silently sign the user back in).
      await fetchHandler("api/v1/auth/logout", { method: "POST" });
    } catch {
      // Even if the server call fails, drop local state so the UI signs out.
      console.error("Logout request failed; local session state was cleared anyway.");
    } finally {
      setUser(null);
      navigate("/login");
    }
  };
  return logout;
}
