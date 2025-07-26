import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { useLanguage } from "../../context/Language/LanguageContext";
import SearchOverlay from "./SearchOverlay";

const NavbarSearch = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Always navigate to products page with search query
      // This ensures the page re-renders and search works
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-4 relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search_placeholder")}
        className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] transition"
        onFocus={() => setOpen(true)}
      />
      <span
        className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer ${
          language === "ar" ? "left-3" : "right-3"
        }`}
        onClick={handleSearch}
      >
        <Search
          size={19}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        />
      </span>

      <SearchOverlay
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 top-22 bg-black/40 z-[9999] flex items-start justify-center cursor-pointer"
      />
    </form>
  );
};

export default NavbarSearch;
