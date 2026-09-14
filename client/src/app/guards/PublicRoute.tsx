import { useAuth } from "@features/auth/hooks/useAuth.tsx";
import LoadingScreen from "@/shared/components/layout/LoadingScreen";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/home" replace />;
  return <Outlet />;
}

export default PublicRoute;
