import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Menu,
  LayoutDashboard,
  User,
  LogOut,
  ShoppingCart,
  Heart,
  Barcode,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuthContext } from "../../context/Auth/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/Cart/CartContext";
import { useWishlist } from "../../context/WishList/WishlistContext";
import logo from "../../assets/Images/3x/navbar.png";
import { useUserContext } from "../../context/User/UserContext";
import useUserProfile from "../../hooks/Profile/useProfile";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import NavbarTop from "./NavbarTop";
import NavbarBottom from "./NavbarBottom";
import LanguageDropdown from "../Language/LanguageDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { userData: navUser } = useUserProfile();
  const { userData } = useUserContext();
  const { profile, logout } = useAuthContext();
  const navigate = useNavigate();
  const { cartCount, isCartLoading } = useCart();
  const { wishlistCount } = useWishlist();
  const overlayRef = useRef(null);
  const avatarRef = useRef(null);
  const drawerRef = useRef(null);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const ticking = useRef(false);

  const isLoggedIn = !!profile;
  const avatar =
    (userData && userData.image) || (navUser && navUser.image) || "/user.png";
  const userName = userData?.name || navUser?.name;
  const isAdmin = profile?.user?.is_admin || 0;

  // Click outSide { Drawer && USerOverlay }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpenUser(false);
      }

      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };

    const handleClickOutsideDrawer = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideDrawer);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideDrawer);
    };
  }, [overlayRef, avatarRef, drawerRef]);

  const colors = {
    primary: "#333e2c",
    textDark: "#333333",
    bgLight: "#ffffff",
  };

  const navLinks = [
    { path: "/", label: t("home"), isPrimary: true },
    { path: "/categories", label: t("categories"), isPrimary: true },
    { path: "/products", label: t("products"), isPrimary: true },
    { path: "/packages", label: t("packages"), isPrimary: true },
    { path: "/contact", label: t("contact"), isPrimary: true },
  ];

  const renderAdminLink = () => {
    if (isAdmin === 0) return null;
    return (
      <Link
        to="/admin-dashboard"
        onClick={() => {
          setIsOpenUser(false);
          setIsOpen(false);
        }}
        className="flex items-center gap-3 w-full text-right px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      >
        <LayoutDashboard />
        {t("dashboard")}
      </Link>
    );
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        // Update scrolled state
        setScrolled(scrollTop > 5);

        // Update progress
        const progress =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setScrollProgress(progress);

        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Combined scroll effect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!", {
      duration: 1000,
      position: "top-right",
    });
    // setTimeout(() => {
    //   navigate("/login");
    // }, 1000);
    setIsOpenUser((prev) => !prev);
  };

  return (
    <React.Fragment>
      {/* Desktop Navigation */}
      <div
        className={`sticky top-0 left-0 z-200 transition-all duration-150 bg-[#e8e4dd] hidden lg:block`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <NavbarTop
          show={!scrolled}
          scrolled={scrolled}
          handleCartClick={handleCartClick}
          handleWishlistClick={handleWishlistClick}
          cartCount={isCartLoading ? 0 : cartCount}
          wishlistCount={wishlistCount}
          isLoggedIn={isLoggedIn}
          isOpenUser={isOpenUser}
          setIsOpenUser={setIsOpenUser}
          overlayRef={overlayRef}
          avatarRef={avatarRef}
          avatar={avatar}
          userName={userName}
          t={t}
          language={language}
          renderAdminLink={renderAdminLink}
          handleLogout={handleLogout}
          isCartLoading={isCartLoading}
        />
        <NavbarBottom
          navLinks={navLinks}
          hover={hover}
          setHover={setHover}
          scrolled={scrolled}
          iconsProps={{
            handleCartClick,
            handleWishlistClick,
            cartCount: isCartLoading ? 0 : cartCount,
            wishlistCount,
          }}
          userMenuProps={{
            isLoggedIn,
            isOpenUser,
            setIsOpenUser,
            overlayRef,
            avatarRef,
            avatar,
            userName,
            t,
            language,
            renderAdminLink,
            handleLogout,
            isWhite: scrolled,
          }}
          logoProps={{ isWhite: scrolled }}
        />
      </div>

      {/* Mobile Navigation */}
      <div
        className={`sticky top-0 left-0 z-50 w-full transition-all duration-150 bg-[#e8e4dd] lg:hidden flex items-center justify-between ${
          scrolled ? "py-6 shadow-md" : "py-4 shadow-sm"
        } px-6`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div
          className="w-[150px] aspect-[1501/395]"
          style={{ color: colors.primary }}
        >
          <Link to={"/"}>
            <img
              src={logo}
              width={120}
              height={120}
              alt="logo"
              className={`transition-all duration-200`}
            />
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Cart & Wishlist */}
            <div className={"flex justify-center gap-1 sm:gap-4"}>
              <button
                onClick={handleCartClick}
                className="p-2 rounded border border-gray-300 bg-[#f3f3f3] transition duration-200 cursor-pointer relative"
                style={{ borderColor: colors.borderLight }}
                title="Shopping Cart"
              >
                <ShoppingCart size={20} className="text-gray-500" />
                {cartCount > 0 && !isCartLoading && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs z-50">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleWishlistClick}
                className="p-2 rounded border border-gray-300 bg-[#f3f3f3] transition duration-200 cursor-pointer relative"
                style={{ borderColor: colors.borderLight }}
                title="WishList"
              >
                <Heart size={20} className="text-gray-500" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {!isLoggedIn && (
            <Link
              to="/login"
              className="bg-[#333e2c] text-white font-bold py-2 px-4 rounded-md me-5 cursor-pointer customEffect"
            >
              <span>{t("login")}</span>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className=" focus:outline-none rounded-md cursor-pointer bg-[#f3f3f3] p-2"
            title="Side Menu"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className={`h-[3px] w-full bg-gray-100 absolute left-0 -bottom-0`}>
          <div
            className="h-full bg-[#333e2c] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          ></div>
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
            className="lg:hidden fixed inset-0 bg-black/40 z-550 cursor-pointer"
            onClick={() => setIsOpen(false)}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <motion.div
              ref={drawerRef}
              initial={{ x: language === "ar" ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? 300 : -300 }}
              transition={{ duration: 0.3 }}
              className={`h-full md:w-[500px] w-[300px] bg-[#e8e4dd] flex flex-col ${
                language === "ar" ? "ml-auto" : "mr-auto"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <Link to={"/"} onClick={() => setIsOpen(false)}>
                  <img src={logo} width={120} alt="logo" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded bg-gray-200 cursor-pointer"
                >
                  <X size={24} color={colors.primary} />
                </button>
              </div>

              <div className="flex flex-col p-4 gap-5">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    className={({ isActive }) =>
                      `
                        cursor-pointer font-[500] transition duration-200 ease-in-out b-bottom text-[.90rem]
                        ${isActive ? "text-[#333e2c]" : ""}
                        ${hover === index ? "text-[#333e2c]" : ""}
                      `
                    }
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                <LanguageDropdown />

                {/* User Dropdown with animation as before */}
                <div className="cursor-pointer relative">
                  {isLoggedIn && (
                    <div
                      ref={avatarRef}
                      className="flex items-center justify-start gap-2 bg-[#f3f3f3] px-2 border border-gray-300 rounded"
                      onClick={() => setIsOpenUser((prev) => !prev)}
                    >
                      <div className="w-9 h-9 p-1 rounded-full bg-gray-300 flex items-center justify-center">
                        <img
                          src={avatar}
                          alt={t("userProfile")}
                          className="rounded-full w-full h-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/user.png";
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-3 px-4 py-6 border-b border-gray-100">
                        <p className="text-sm text-gray-600">{t("welcome")}</p>
                        <p className="font-bold text-gray-800">{userName}</p>
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {isOpenUser && (
                      <motion.div
                        ref={overlayRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute ${
                          language === "ar" ? "left-0" : "right-0"
                        } absolute mt-3 w-full bg-[#e8e4dd] rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden`}
                      >
                        {renderAdminLink()}
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsOpenUser(false);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-right px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100"
                        >
                          <User className="w-5 h-5" />
                          {t("userProfile")}
                        </button>
                        <button
                          onClick={() => {
                            navigate("/order");
                            setIsOpenUser(false);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-right px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100"
                        >
                          <Barcode className="w-5 h-5" />
                          {t("myOrder")}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          {t("logout")}
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
