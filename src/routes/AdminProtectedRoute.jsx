import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";
import Loader from "../layouts/Loader";

const AdminProtectedRoute = ({ redirectPath = "/unauthorized", allowedAdminValues = [true] }) => {
  const { token, profile, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || !allowedAdminValues.includes(profile.user.is_admin)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
