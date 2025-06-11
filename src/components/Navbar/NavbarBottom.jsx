import React from "react";
import { NavLink } from "react-router-dom";

const NavbarBottom = ({ navLinks, hover, setHover }) => (
  <div className="bg-[#1e70d0]">
    <div className="container mx-auto max-w-7xl flex items-center justify-start py-6">
      {navLinks.map((link, index) => (
        <NavLink
          key={index}
          to={link.path}
          className={({ isActive }) =>
            `mx-4 cursor-pointer font-[500] transition duration-200 ease-in-out b-bottom text-[.90rem]
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
  </div>
);

export default NavbarBottom;
