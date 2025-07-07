import React from "react";
import Logo from "./Logo";
import NavbarSearch from "./NavbarSearch";
import NavbarIcons from "./NavbarIcons";
import NavbarUserMenu from "./NavbarUserMenu";
import { motion, AnimatePresence } from "framer-motion";

const navbarTopVariants = {
  hidden: { opacity: 0, y: -40, pointerEvents: "none", transition: { duration: 0.35, ease: "easeInOut" } },
  visible: { opacity: 1, y: 0, pointerEvents: "auto", transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -40, pointerEvents: "none", transition: { duration: 0.35, ease: "easeInOut" } },
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
        className="container mx-auto max-w-7xl flex items-center justify-between py-6 px-4 bg-[#e8e4dd] relative transition-all duration-200"
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