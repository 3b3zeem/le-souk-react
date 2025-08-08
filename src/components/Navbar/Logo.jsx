import React from "react";
import logo from "../../assets/Images/3x/navbar.png";
import { Link } from "react-router-dom";
const Logo = ({ isWhite, showLogo }) => {
  if (!showLogo) return null;

  return (
    <div
      className={`flex items-center transition-all duration-200 ${
        isWhite ? "bg-white p-3 rounded" : ""
      }`}
    >
      <Link to="./">
        <img
          src={logo}
          width={isWhite ? 120 : 150}
          height={isWhite ? 120 : 150}
          alt="logo"
          className={`transition-all duration-200 w-[150px] aspect-[1501/395] ${
            isWhite ? "opacity-90" : ""
          }`}
        />
      </Link>
    </div>
  );
};

export default Logo;
