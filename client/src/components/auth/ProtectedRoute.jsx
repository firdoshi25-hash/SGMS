import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Loader from "../common/Loader";

function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default ProtectedRoute;