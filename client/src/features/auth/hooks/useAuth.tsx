import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@shared/types/user.ts";
import { UserService } from "../services/userService.ts";

type AuthContextType = {
  user?: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
const AuthContext = createContext<AuthContextType | null>(null);
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await UserService.getUser();
        setUser(res);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Provider not attached");
  return context;
}
