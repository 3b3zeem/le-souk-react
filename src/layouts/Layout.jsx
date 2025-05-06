import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useAuthContext } from "../context/Auth/AuthContext";

const LayOut = () => {
  const { profile } = useAuthContext();
  
  return (
    <React.Fragment>
      <Navbar />
      <Outlet />

      {!profile.is_admin && <Footer />}
    </React.Fragment>
  );
};

export default LayOut;
