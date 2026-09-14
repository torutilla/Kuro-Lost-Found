import { useAuth } from "@features/auth/hooks/useAuth.tsx";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "@/shared/components/layout/LoadingScreen";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
