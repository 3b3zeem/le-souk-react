import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useAuthContext } from "../context/Auth/AuthContext";

const LayOut = () => {
  const { profile } = useAuthContext();
  const isAdmin = profile?.is_admin || false;

  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register")

  return (
    <React.Fragment>
      <Navbar />
      <Outlet />
      {!hideFooter && <Footer />}
      {/* {!isAdmin && <Footer />} */}
    </React.Fragment>
  );
};

export default LayOut;
