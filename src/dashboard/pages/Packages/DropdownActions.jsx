import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Plus, MoreVertical, Eye } from "lucide-react";
import { useLanguage } from "../../../context/Language/LanguageContext";

const DropdownActions = ({
  pkg,
  t,
  loading,
  onView,
  handleOpenEdit,
  handleAddProduct,
  handleDeletePackage,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const handleAction = (action) => {
    setOpen(false);
    switch (action) {
      case "view":
        onView(pkg.id);
        break;
      case "edit":
        handleOpenEdit(pkg.id);
        break;
      case "addProduct":
        handleAddProduct(pkg.id);
        break;
      case "delete":
        handleDeletePackage(pkg.id);
        break;
      default:
        break;
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 150;
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    let topPosition;
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      topPosition = buttonRect.top - dropdownHeight - 5;
    } else {
      topPosition = buttonRect.bottom + 5;
    }

    setPosition({
      top: topPosition,
      [isArabic ? "left" : "right"]: 100,
    });

    setOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const dropdownContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed w-30 md:w-65 rounded-md bg-white border border-gray-200 shadow-lg z-50"
      style={{
        top: position.top,
        [isArabic ? "left" : "right"]: 50,
      }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={() => handleAction("view")}
          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
        >
          <Eye size={16} className="text-green-600" />
          {t("view")}
        </button>
        <button
          onClick={() => handleAction("edit")}
          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none flex items-center gap-2 transition-colors duration-150 cursor-pointer"
          role="menuitem"
        >
          <Edit size={16} className="text-blue-500" />
          {t("edit")}
        </button>
        <button
          onClick={() => handleAction("addProduct")}
          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none flex items-center gap-2 transition-colors duration-150 cursor-pointer"
          role="menuitem"
        >
          <Plus size={16} className="text-green-500" />
          {t("manage_products")}
        </button>
        <button
          onClick={() => handleAction("delete")}
          disabled={loading}
          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none flex items-center gap-2 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          role="menuitem"
        >
          <Trash2 size={16} className="text-red-500" />
          {t("delete")}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label={t("actions")}
      >
        <MoreVertical size={20} className="text-blue-600" />
      </button>

      <AnimatePresence>{open && dropdownContent}</AnimatePresence>
    </div>
  );
};

export default DropdownActions;
