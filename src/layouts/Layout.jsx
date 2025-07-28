import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useAuthContext } from "../context/Auth/AuthContext";
import Meta from "../components/Meta/Meta";
import CustomCursor from "../components/CustomCursor/CustomCursor";

function generateUniqueId(length = 16) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const LayOut = () => {
  const { profile } = useAuthContext();
  const isAdmin = profile?.user?.is_admin || false;

  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  useEffect(() => {
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = generateUniqueId();
      localStorage.setItem("guest_id", guestId);
    }
  }, []);

  return (
    <React.Fragment>
      <CustomCursor />
      <Navbar />
      <Outlet />
      {!hideFooter && <Footer />}
      {/* {!isAdmin && <Footer />} */}
    </React.Fragment>
  );
};

export default LayOut;
