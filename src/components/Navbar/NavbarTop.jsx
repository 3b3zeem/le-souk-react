import React from "react";
import Logo from "./Logo";
import NavbarSearch from "./NavbarSearch";
import NavbarIcons from "./NavbarIcons";
import NavbarUserMenu from "./NavbarUserMenu";

const NavbarTop = (props) => (
  <div className="container mx-auto max-w-7xl flex items-center justify-between py-6 px-4 bg-[#e8e4dd] relative">
    <Logo />
    <NavbarSearch />
    <div className="flex items-center gap-4">
      <NavbarIcons {...props} />
      <NavbarUserMenu {...props} />
    </div>
  </div>
);

export default NavbarTop; 