import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useHome from "../../hooks/HomeComponents/useHome";
import { motion, AnimatePresence } from "framer-motion";
import useCategories from "../../hooks/Categories/useCategories";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const SearchOverlay = ({ open, onClose, className = "" }) => {
  const [query, setQuery] = useState("");
  const { products, loading } = useHome(10);
  const { categories } = useCategories(10, 0);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const overlayRef = useRef();

  const filteredProducts = query
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleSelect = (id) => {
    navigate(`/products/${encodeURIComponent(id)}`);
    onClose();
  };

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`${className}`}
          onClick={onClose}
        >
          <motion.div
            ref={overlayRef}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#e8e4dd] flex w-[80vw] max-w-4xl min-h-[400px] overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Suggestions */}
            <div className="flex-1 p-8">
              <h3 className="text-lg font-bold mb-4 text-[#333e2c]">
                {language === 'ar' ? 'منتجات مقترحة' : 'Suggestion products'}
              </h3>
              <div>
                {filteredProducts.length === 0 ? (
                  <div className="text-gray-400">No products found</div>
                ) : (
                  filteredProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 py-2 cursor-pointer hover:bg-gray-100 rounded px-2"
                      onClick={() => handleSelect(product.id)}
                    >
                      <img
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-gray-700 text-sm">
                          {product.min_sale_price ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">
                                {product.min_price} KWD
                              </span>
                              <span className="text-[#333e2c] font-bold">
                                {product.min_sale_price} KWD
                              </span>
                            </>
                          ) : (
                            <span className="text-[#333e2c] font-bold">
                              {product.min_price} KWD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Categories */}
            <div className="w-1/3 bg-gray-100 p-8">
              <h3 className="text-lg font-bold mb-4 text-[#333e2c]">
                {t("categories")}
              </h3>
              <ul>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => {
                      navigate(`/products?category=${cat.id}`);
                      onClose();
                    }}
                    className="mb-2 text-gray-700 hover:text-[#333e2c] transition-all duration-200 cursor-pointer"
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
