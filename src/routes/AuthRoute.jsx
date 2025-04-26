import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";

const AuthRoute = ({ redirectPath = "/" }) => {
  const { token } = useAuthContext();

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;