import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NavbarUserMenu = ({
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
}) => {
  const navigate = useNavigate();
  // if (!isLoggedIn) return null;
  return (
    <div className="cursor-pointer relative">
      <div
        ref={avatarRef}
        className="flex items-center gap-2"
        onClick={() => setIsOpenUser((prev) => !prev)}
      >
        <div className="w-9 h-9 p-1 rounded-full bg-gray-300 flex items-center justify-center">
          <img
            src={avatar}
            alt={t("userProfile")}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/user.png";
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {isOpenUser && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${language === "ar" ? "left-0" : "right-0"} mt-3 w-52 bg-[#e8e4dd] rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden`}
          >
            <div className="flex flex-col gap-3 px-4 py-6 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">{t("welcome")}</p>
              <p className="font-bold text-gray-800">{userName}</p>
            </div>
            {renderAdminLink && renderAdminLink()}
            <button
              onClick={() => {
                navigate("/profile");
                setIsOpenUser(false);
              }}
              className="flex items-center gap-3 w-full text-right px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100"
            >
              <User className="w-5 h-5" />
              {t("userProfile")}
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
  );
};

export default NavbarUserMenu;