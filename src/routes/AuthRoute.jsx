import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";
import Loader from "../layouts/Loader";

const AuthRoute = ({ redirectPath = "/" }) => {
  const { token, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loader />;
  }

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
