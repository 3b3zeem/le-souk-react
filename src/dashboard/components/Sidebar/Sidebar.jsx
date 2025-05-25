import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers,
  LogOut,
  ShoppingCart,
  Star,
  Settings,
  Menu,
  ShoppingBag,
  Percent,
  Boxes,
} from "lucide-react";
import { useState } from "react";

import logo from "../../../assets/Images/3x/navbar.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!", {
      duration: 1000,
      position: "top-right",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const SidebarItem = ({ to, icon, label, isOpen, className = "" }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded transition cursor-pointer ${
          isActive
            ? "bg-gray-800 text-blue-50 font-semibold"
            : "hover:bg-gray-200"
        } ${className}`
      }
    >
      {icon}
      {isOpen && <span className="text-sm">{t(label)}</span>}
    </NavLink>
  );

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-gray-100 text-gray-900 flex flex-col transition-all duration-300 sticky top-0 border-r border-gray-300`}
      style={{
        [language === "ar" ? "right" : "left"]: 0,
      }}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-400">
        <button
          onClick={toggleSidebar}
          className="cursor-pointer hover:bg-gray-300 p-1 transition-all duration-200"
        >
          <Menu />
        </button>
      </div>

      <div className="hidden md:flex justify-center py-5 border-b border-gray-300">
        <img src={logo} alt="logo" width={100} />
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-2 mt-2">
        <SidebarItem
          to="/admin-dashboard"
          icon={<LayoutDashboard />}
          label="dashboard"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/users"
          icon={<Users />}
          label="users"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/categories"
          icon={<Layers />}
          label="categories"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/products"
          icon={<ShoppingBag />}
          label="products"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/packages"
          icon={<Boxes />}
          label="packages"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/orders"
          icon={<ShoppingCart />}
          label="orders"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/coupons"
          icon={<Percent />}
          label="coupons"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/reviews"
          icon={<Star />}
          label="reviews"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin-dashboard/settings"
          icon={<Settings />}
          label="setting"
          isOpen={isOpen}
        />
      </nav>

      <div className="p-2 border-t border-gray-700" onClick={handleLogout}>
        <SidebarItem
          icon={<LogOut />}
          label="logout"
          isOpen={isOpen}
          className="text-red-400 hover:text-red-600"
        />
      </div>
    </div>
  );
};

export default Sidebar;
