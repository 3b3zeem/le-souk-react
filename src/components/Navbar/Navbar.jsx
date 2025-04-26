import React, { useEffect, useState } from "react";
import {
  X,
  Menu,
  LayoutDashboard,
  User,
  LogOut,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuthContext } from "../../context/Auth/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/Cart/CartContext";
import { useWishlist } from "../../context/WishList/WishlistContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const isLoggedIn = !!user;
  const avatar = user?.image;
  const userName = user?.name;
  const isAdmin = localStorage.getItem("isAdmin");

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  // Color variables
  const colors = {
    primary: "#1e70d0",
    textDark: "#333333",
    bgLight: "#ffffff",
  };

  const navLinks = [
    { path: "/", label: "HOME", isPrimary: true },
    { path: "/products", label: "PRODUCTS", isPrimary: true },
    { path: "/about", label: "ABOUT US", isPrimary: true },
    { path: "/contact", label: "CONTACT US", isPrimary: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!", {
      duration: 1000,
      position: "top-right",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
    setIsOpenUser((prev) => !prev);
  };

  return (
    <React.Fragment>
      {/* Desktop Navigation */}
      <div
        className={`sticky top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out bg-white hidden md:flex items-center justify-between ${
          scrolled ? "py-6 shadow-md" : "py-4 shadow-sm"
        } px-6`}
      >
        <div className="flex items-center">
          <div className="text-3xl font-bold" style={{ color: colors.primary }}>
            Bazario
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              style={{ color: hover === index ? colors.primary : undefined }}
              className="cursor-pointer font-[500] transition duration-200 ease-in-out b-bottom text-[.90rem]"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          {isLoggedIn ? (
            <div className="cursor-pointer relative">
              <div className="flex items-center gap-5">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCartClick}
                    className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer relative"
                    style={{ borderColor: colors.borderLight }}
                  >
                    <ShoppingCart size={20} className="text-gray-500" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleWishlistClick}
                    className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer relative"
                    style={{ borderColor: colors.borderLight }}
                  >
                    <Heart size={20} className="text-gray-500" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </div>

                <div
                  className="flex items-center gap-2"
                  onClick={() => setIsOpenUser((prev) => !prev)}
                >
                  <p className="text-center text mt-2 mb-2 text-gray-700 font-bold">
                    Hello, {userName}
                  </p>
                  <div className="w-9 h-9 p-1 rounded-full bg-gray-300 flex items-center justify-center">
                    <img src={avatar} alt={userName} className="rounded-full" />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isOpenUser && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50"
                  >
                    {isAdmin !== "null" && (
                      <button className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <LayoutDashboard />
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsOpenUser((prev) => !prev);
                      }}
                      className="flex items-center gap-3 w-full text-right px-4 py-4 hover:bg-gray-100 cursor-pointer border-b"
                    >
                      <div className="w-8 h-8 p-1 rounded-full bg-gray-300 flex items-center justify-center">
                        <User />
                      </div>
                      User Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full mt-3 text-white bg-red-500 hover:bg-red-600 transition duration-200 px-4 py-2 rounded-xl rounded-t cursor-pointer"
                    >
                      <LogOut />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#1e70d0] text-white font-bold py-2 px-4 rounded me-5 cursor-pointer customEffect"
            >
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`sticky top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out bg-white md:hidden flex items-center justify-between ${
          scrolled ? "py-6 shadow-md" : "py-4 shadow-sm"
        } px-6`}
      >
        <div className="text-2xl font-bold" style={{ color: colors.primary }}>
          Bazario
        </div>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCartClick}
                    className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer relative"
                    style={{ borderColor: colors.borderLight }}
                  >
                    <ShoppingCart size={20} className="text-gray-500" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleWishlistClick}
                    className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer relative"
                    style={{ borderColor: colors.borderLight }}
                  >
                    <Heart size={20} className="text-gray-500" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-1 focus:outline-none rounded hover:bg-gray-200 transition duration-200 ease-in-out cursor-pointer"
                >
                  <Menu size={24} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-[#1e70d0] text-white font-bold py-1 px-4 rounded me-5 cursor-pointer customEffect"
              >
                <span>Login</span>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 focus:outline-none rounded hover:bg-gray-200 transition duration-200 ease-in-out cursor-pointer"
              >
                <Menu size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/40 z-50"
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="h-full w-[300px] bg-white flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  Bazario
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded bg-gray-200 cursor-pointer"
                >
                  <X size={24} color={colors.primary} />
                </button>
              </div>

              <div className="flex flex-col p-4 gap-5">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    style={{
                      color: hover === index ? colors.primary : undefined,
                    }}
                    className="cursor-pointer font-[500] transition duration-200 ease-in-out b-bottom text-[.90rem]"
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* User Dropdown with animation as before */}
                <div className="cursor-pointer relative">
                  {isLoggedIn && (
                    <div
                      className="flex items-center gap-2"
                      onClick={() => setIsOpenUser((prev) => !prev)}
                    >
                      <p className="text-center text mt-2 mb-2 text-gray-700 font-bold">
                        Hello, {userName}
                      </p>
                      <div className="w-9 h-9 p-1 rounded-full bg-gray-300 flex items-center justify-center">
                        <img
                          src={avatar}
                          alt={userName}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {isOpenUser && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50"
                      >
                        {isAdmin !== "null" && (
                          <button className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            <LayoutDashboard />
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => navigate("/profile")}
                          className="flex items-center gap-3 w-full text-right px-4 py-4 hover:bg-gray-100 cursor-pointer border-b"
                        >
                          <div className="w-8 h-8 p-1 rounded-full bg-gray-300 flex items-center justify-center">
                            <User />
                          </div>
                          User Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full mt-3 text-white bg-red-500 hover:bg-red-600 transition duration-200 px-4 py-2 rounded-xl rounded-t cursor-pointer"
                        >
                          <LogOut />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Navbar;
