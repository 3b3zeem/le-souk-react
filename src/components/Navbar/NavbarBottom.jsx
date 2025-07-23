import React from "react";
import { NavLink } from "react-router-dom";
import NavbarIcons from "./NavbarIcons";
import NavbarUserMenu from "./NavbarUserMenu";

const NavbarBottom = ({
  navLinks,
  hover,
  setHover,
  scrolled,
  iconsProps,
  userMenuProps,
}) => (
  <div className="bg-[#333e2c]">
    <div
      className={`container mx-auto max-w-7xl flex items-center justify-between transition-all duration-150 ${
        scrolled ? "py-8" : "py-6"
      }`}
    >
      <div className="flex items-center">
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `${scrolled ? "mx-4" : "mx-4"} cursor-pointer font-[500] transition duration-150  b-bottom text-[.90rem]
              ${
                isActive
                  ? "text-white font-[700] underline"
                  : "text-white/80"
              }
              ${
                hover === index && !isActive
                  ? "text-white underline"
                  : ""
              }`
            }
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      {scrolled && (
        <div className="flex items-center gap-4">
          <NavbarIcons {...iconsProps} />
          <NavbarUserMenu {...userMenuProps} />
        </div>
      )}
    </div>
  </div>
);

export default NavbarBottom;
