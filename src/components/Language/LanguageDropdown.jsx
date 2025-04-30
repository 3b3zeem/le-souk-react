import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/Language/LanguageContext";
import { Globe } from "lucide-react";

const LanguageDropdown = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        type="button"
        className="inline-flex items-center justify-center w-full rounded border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
      >
        {/* {language.toUpperCase()} */}
        <span className="text-gray-500">
          <Globe />
        </span>
        <svg
          className="ml-2 h-4 w-4 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-0 mt-2 w-36 rounded bg-white shadow-lg ring-1 ring-gray-500 ring-opacity-5 focus:outline-none z-50 origin-top-right"
          >
            <div className="py-1">
              <button
                onClick={() => selectLanguage("en")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-b border-gray-200 cursor-pointer"
              >
                English
              </button>
              <button
                onClick={() => selectLanguage("ar")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition  cursor-pointer"
              >
                Arabic
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageDropdown;
