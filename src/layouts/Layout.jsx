import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useAuthContext } from "../context/Auth/AuthContext";

const LayOut = () => {
  const { profile } = useAuthContext();
  const isAdmin = profile?.is_admin || false;

  return (
    <React.Fragment>
      <Navbar />
      <Outlet />
      <Footer />
      {/* {!isAdmin && <Footer />} */}
    </React.Fragment>
  );
};

export default LayOut;
