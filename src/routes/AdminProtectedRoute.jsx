import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";
import Loader from "../layouts/Loader";

const AdminProtectedRoute = ({ redirectPath = "/unauthorized", allowedAdminValues = [1] }) => {
  const { token, user, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedAdminValues.includes(user.is_admin)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
