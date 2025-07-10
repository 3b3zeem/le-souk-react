import React from "react";
import logo from "../../assets/Images/3x/navbar.png";
import{Link,useNavigate}from "react-router-dom"
const Logo = () => (
  <div className="flex items-center">
    <Link to="./">
        <img src={logo} width={150} alt="logo" />
    </Link>
  </div>
);

export default Logo; 