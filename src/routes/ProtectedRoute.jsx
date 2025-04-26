import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { token } = useAuthContext();

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;