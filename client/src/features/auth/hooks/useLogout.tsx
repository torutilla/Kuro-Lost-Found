import { useNavigate } from "react-router-dom";
import { fetchHandler } from "../../../shared/index.ts";
import { useAuth } from "./useAuth.tsx";

export default function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await fetchHandler("api/v1/auth/logout");
    } catch (error) {
      throw error;
    } finally {
      setUser(null);
      navigate("/login");
    }
  };
  return logout;
}
