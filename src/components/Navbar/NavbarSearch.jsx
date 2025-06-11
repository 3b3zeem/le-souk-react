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
        className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
        onFocus={() => setOpen(true)}
      />
      <span
        className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${
          language === "ar" ? "left-3" : "right-3"
        }`}
      >
        <Search size={19} className="text-gray-500" />
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
