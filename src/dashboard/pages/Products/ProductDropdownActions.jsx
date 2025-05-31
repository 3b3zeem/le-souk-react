import React, { useState, useRef } from "react";
import {
  Eye,
  SquarePen,
  Trash2,
  MoreVertical,
  Plus,
  Check,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../context/Language/LanguageContext";

const ProductDropdownActions = ({
  product,
  t,
  loading,
  onView,
  onEdit,
  onDelete,
  onAddDiscount,
  onAssignImages,
  onSetPrimaryImage,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { language } = useLanguage();
  const buttonRef = useRef(null);

  const handleAction = (action) => {
    setOpen(false);
    switch (action) {
      case "view":
        onView(product.id);
        break;
      case "edit":
        onEdit(product.id);
        break;
      case "delete":
        onDelete(product.id);
        break;
      case "addDiscount":
        onAddDiscount(product.id);
        break;
      case "assignImages":
        onAssignImages(product);
        break;
      case "setPrimaryImage":
        onSetPrimaryImage(product.id);
        break;
      default:
        break;
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 220;
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
      [language === "ar" ? "left" : "right"]: 50,
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
        [language === "ar" ? "left" : "right"]: 50,
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
          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
        >
          <SquarePen size={16} className="text-blue-600" />
          {t("edit")}
        </button>
        <button
          onClick={() => handleAction("addDiscount")}
          className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} className="text-green-600" />
          {t("add_discount")}
        </button>
        <button
          onClick={() => handleAction("assignImages")}
          className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 cursor-pointer"
        >
          <Check size={16} className="text-green-600" />
          {t("select_images")}
        </button>
        <button
          onClick={() => handleAction("setPrimaryImage")}
          className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
        >
          <Image size={16} className="text-blue-600" />
          {t("set_primary_image")}
        </button>
        <button
          onClick={() => handleAction("delete")}
          disabled={loading}
          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Trash2 size={16} className="text-red-600" />
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

export default ProductDropdownActions;
