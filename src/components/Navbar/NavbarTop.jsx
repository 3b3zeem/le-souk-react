import React from "react";
import Logo from "./Logo";
import NavbarSearch from "./NavbarSearch";
import NavbarIcons from "./NavbarIcons";
import NavbarUserMenu from "./NavbarUserMenu";
import { motion, AnimatePresence } from "framer-motion";

const navbarTopVariants = {
  hidden: {
    opacity: 0,
    y: -40,
    pointerEvents: "none",
    transition: {
      duration: 0.08, 
      ease: "linear",   
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: {
      duration: 0.1,
      ease: "linear",
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    pointerEvents: "none",
    transition: {
      duration: 0.08,
      ease: "linear",
    },
  },
};

const NavbarTop = (props) => (
  <AnimatePresence mode="wait" initial={false}>
    {props.show && (
      <motion.div
  key="navbar-top"
  variants={navbarTopVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  className={`container mx-auto max-w-7xl flex items-center justify-between transition-all duration-150 px-4 bg-[#e8e4dd] relative ${
    props.scrolled ? "py-2" : "py-6"
  }`}
  style={{ zIndex: 201 }}
>
  <Logo />
  <NavbarSearch />
  <div className="flex items-center gap-4">
    <NavbarIcons {...props} />
    <NavbarUserMenu {...props} />
  </div>
</motion.div>

    )}
  </AnimatePresence>
);

export default NavbarTop; 