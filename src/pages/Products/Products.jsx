import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  PackageX,
  ChevronDown,
  CornerDownRight,
  AlignJustify,
  Table,
} from "lucide-react";
import useProducts from "../../hooks/Products/useProduct";
import SkeletonLoader from "../../layouts/SkeletonLoader";
import { renderStars } from "../../utils/ratingUtils";
import { ring2 } from "ldrs";
import useWishlistCRUD from "../../hooks/WishList/useWishlist";
import useCartCRUD from "../../hooks/Cart/UseCart";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../../context/WishList/WishlistContext";
import Filters from "./Filters";
import { useRef, useState as useLocalState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Meta from "../../components/Meta/Meta";
import Banner from "../../assets/products.jpg";
import Banner2 from "../../assets/products2.jpg";
import useSettings from "../../hooks/Settings/useSettings";
ring2.register();

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const initialCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ? parseInt(initialCategory) : null
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [perPage, setPerPage] = useState(9);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [inStock, setInStock] = useState(null);
  const [sliderPrice, setSliderPrice] = useState([minPrice, maxPrice]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const { products, categories, loading, error, meta, links } = useProducts(
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    perPage,
    page,
    sortBy,
    sortDirection,
    inStock
  );
  const { addToCart } = useCartCRUD();
  const [bgImage, setBgImage] = useState(Banner);

  // * Fetch Settings to show the Banner Image
  const { settings } = useSettings();
  const banner = settings.find(setting => setting.key === "products_banner_image");
  const bannerUrl = banner?.value;
  
  const { toggleWishlist, fetchWishlist } = useWishlistCRUD();
  const { wishlistItems, fetchWishlistItems, fetchWishlistCount } =
    useWishlist();
  const [loadingStates, setLoadingStates] = useState({
    cart: {},
    wishlist: {},
  });
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchWishlist();

    scrollTo(0, 0);
  }, []);

  // * Set Parameters' Filters in URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");
    if (selectedCategory) params.set("category", selectedCategory);
    else params.delete("category");
    if (minPrice !== 0) params.set("min_price", minPrice);
    else params.delete("min_price");
    if (maxPrice !== 100000) params.set("max_price", maxPrice);
    else params.delete("max_price");
    if (inStock) params.set("in_stock", inStock);
    else params.delete("in_stock");
    if (sortBy !== "created_at" || sortDirection !== "desc") {
      params.set("sort_by", sortBy);
      params.set("sort_direction", sortDirection);
    } else {
      params.delete("sort_by");
      params.delete("sort_direction");
    }
    if (page !== 1) params.set("page", page);
    else params.delete("page");
    setSearchParams(params);
  }, [
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortDirection,
    page,
    setSearchParams,
  ]);

  // * Set initial values for filters from URL
  useEffect(() => {
    const pageFromParams = searchParams.get("page");
    const categoryFromParams = searchParams.get("category");

    if (pageFromParams) {
      setPage(parseInt(pageFromParams));
    }

    setSelectedCategory(
      categoryFromParams ? parseInt(categoryFromParams) : null
    );
  }, [searchParams]);
  useEffect(() => {
    const searchFromParams = searchParams.get("search") || "";
    setSearchQuery(searchFromParams);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setPage(1);

    const params = new URLSearchParams(searchParams);
    if (newQuery.trim()) {
      params.set("search", newQuery);
    } else {
      params.delete("search");
    }
    params.delete("page");
    setSearchParams(params);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.delete("page");
    setSearchParams(params);
  };
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "created_at_desc") {
      setSortBy("created_at");
      setSortDirection("desc");
    } else if (value === "created_at_asc") {
      setSortBy("created_at");
      setSortDirection("asc");
    } else if (value === "price_desc") {
      setSortBy("price");
      setSortDirection("desc");
    } else if (value === "price_asc") {
      setSortBy("price");
      setSortDirection("asc");
    }
    setPage(1);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // * Handle Add to Cart and Toggle Wishlist
  const handleAddToCart = async (productId, quantity) => {
    setLoadingStates((prev) => ({
      ...prev,
      cart: { ...prev.cart, [productId]: true },
    }));
    try {
      await addToCart(productId, quantity);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        cart: { ...prev.cart, [productId]: false },
      }));
    }
  };
  const handleToggleWishlist = async (productId) => {
    setLoadingStates((prev) => ({
      ...prev,
      wishlist: { ...prev.wishlist, [productId]: true },
    }));

    try {
      await toggleWishlist(productId);
      await fetchWishlistItems();
      await fetchWishlistCount();
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        wishlist: { ...prev.wishlist, [productId]: false },
      }));
    }
  };
  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  // * Handle Pagination
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // * Pagination component
  const Pagination = () => {
    if (!meta || meta.last_page <= 1) return null;
    const pages = [];
    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(i);
    }
    return (
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={meta.current_page === 1}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-200 transition-all duration-200"
        >
          {t("prev")}
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1 border border-gray-400 rounded cursor-pointer ${
              meta.current_page === p
                ? "bg-[#333e2c] text-white hover:bg-[#333e2c] transition-all duration-100"
                : "hover:bg-gray-200 transition-all duration-200"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(Math.min(meta.last_page, page + 1))}
          disabled={meta.current_page === meta.last_page}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-200 transition-all duration-200"
        >
          {t("next")}
        </button>
      </div>
    );
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const sortOptions = [
    { value: "created_at_desc", label: t("sortNewest") },
    { value: "created_at_asc", label: t("sortOldest") },
    { value: "price_desc", label: t("highestPrice") },
    { value: "price_asc", label: t("lowestPrice") },
  ];

  function useOutsideAlerter(ref, setOpen) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, setOpen]);
  }

  const [sortDropdownOpen, setSortDropdownOpen] = useLocalState(false);
  const sortDropdownRef = useRef(null);
  useOutsideAlerter(sortDropdownRef, setSortDropdownOpen);

  return (
    <div>
      <Meta
        title="Explore Products"
        description="Discover a wide range of products available for purchase."
      />

      {/* Shop Banner */}
      <div className="relative w-full h-65 mb-8 overflow-hidden shadow-md">
          <img
            src={bannerUrl || bgImage}
            alt="Shop Banner"
            className="w-full h-full object-cover"
            onError={() => setBgImage(Banner)}
          />
      </div>

      <div
        className="max-w-7xl mx-auto py-14 sm:px-6 lg:px-8"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <Filters
            t={t}
            language={language}
            colors={colors}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            inStock={inStock}
            setInStock={setInStock}
            sliderPrice={sliderPrice}
            setSliderPrice={setSliderPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setPage={setPage}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Products Section */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-wrap items-start ms-3 md:items-center gap-10 md:flex-row md:justify-between mb-6">
              {/* Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-[200px] focus-within:w-[300px] transition-all duration-200"
              >
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full py-3 px-4 pr-7 border text-sm focus:outline-none shadow-sm"
                  style={{ borderColor: colors.borderLight }}
                />
                <span
                  className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer ${
                    language === "ar" ? "left-3" : "right-3"
                  }`}
                  onClick={handleSearchSubmit}
                >
                  <Search
                    size={15}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  />
                </span>
              </form>

              {/* Show Per Page Selector */}
              <div className="flex items-center gap-2 text-base select-none">
                <span className="text-gray-700 font-semibold">
                  {language === "ar" ? "عرض" : "Show"} :
                </span>
                {[9, 12, 18, 24].map((num, idx, arr) => (
                  <React.Fragment key={num}>
                    <span
                      onClick={() => {
                        setPerPage(num);
                        setPage(1);
                      }}
                      className={
                        perPage === num
                          ? "font-bold text-[#333e2c] cursor-pointer"
                          : "text-gray-400 cursor-pointer hover:text-black transition-all duration-200"
                      }
                      style={{ userSelect: "none" }}
                    >
                      {num}
                    </span>
                    {idx < arr.length - 1 && (
                      <span className="text-gray-300">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 ml-4">
                {/* List Icon */}
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${
                    viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                  title="List view"
                >
                  <AlignJustify
                    size={22}
                    className={
                      viewMode === "list"
                        ? "text-[#333e2c] cursor-pointer"
                        : "text-gray-400 cursor-pointer"
                    }
                  />
                </button>
                {/* Grid Icon */}
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${
                    viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                  title="Grid view"
                >
                  <Table
                    size={22}
                    className={
                      viewMode === "grid"
                        ? "text-[#333e2c] cursor-pointer"
                        : "text-gray-400 cursor-pointer"
                    }
                  />
                </button>
              </div>

              {/* Sort */}
              <div className="relative w-48" ref={sortDropdownRef}>
                <button
                  type="button"
                  className="flex justify-between items-center w-full py-3 px-4 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white border-gray-200 text-gray-700 appearance-none cursor-pointer"
                  style={{ borderColor: colors.borderLight }}
                  onClick={() => setSortDropdownOpen((open) => !open)}
                >
                  {
                    sortOptions.find(
                      (opt) => opt.value === `${sortBy}_${sortDirection}`
                    )?.label
                  }
                  <ChevronDown
                    className={`w-5 h-5 text-blue-500 absolute ${
                      language === "ar" ? "left-3" : "right-3"
                    } pointer-events-none ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      {sortOptions.map((option) => (
                        <li
                          key={option.value}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition ${
                            `${sortBy}_${sortDirection}` === option.value
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setSortDropdownOpen(false);
                            handleSortChange({
                              target: { value: option.value },
                            });
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {loading ? (
              <SkeletonLoader viewMode={viewMode} />
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <PackageX className="w-16 h-16 mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">
                  {t("no_products_found")}
                </h2>
                <p className="text-sm text-gray-400">
                  {t("try_changing_filters")}
                </p>
              </div>
            ) : (
              <>
                {/* Products List */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {products.map((product, idx) => {
                    const primaryImage = product.primary_image_url;
                    const secondImage =
                      product.images && product.images.length > 1
                        ? product.images[1].image_url
                        : primaryImage;

                    // List view
                    if (viewMode === "list") {
                      return (
                        <div
                          key={product.id}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="flex flex-col md:flex-row bg-white shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
                          style={{ minHeight: 240 }}
                          onClick={() => handleProductClick(product.id)}
                        >
                          {/* Discount badge */}
                          {product.discount_percentage && (
                            <span
                              className="absolute"
                              style={{
                                top: 18,
                                left: -38,
                                background: "#ef233c",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                padding: "10px 48px",
                                transform: "rotate(-35deg)",
                                zIndex: 30,
                                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                                letterSpacing: "1px",
                                borderRadius: "6px",
                                textShadow: "0 1px 2px rgba(0,0,0,0.10)",
                                borderTopLeftRadius: "0.5rem",
                                borderTopRightRadius: "0.5rem",
                              }}
                            >
                              -{product.discount_percentage}% {t("offer")}
                            </span>
                          )}

                          {/* Image */}
                          <div
                            className="flex-shrink-0 flex items-center justify-center bg-gray-50 p-6 md:w-1/2 relative h-100"
                            style={{ minHeight: 220 }}
                          >
                            <img
                              src={
                                hoveredIndex === idx
                                  ? secondImage
                                  : primaryImage
                              }
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-col flex-1 p-6 gap-2 justify-center relative">
                            {/* Name */}
                            <h3
                              className="text-2xl font-semibold mb-1 text-gray-800 cursor-pointer"
                              onClick={() => handleProductClick(product.id)}
                            >
                              {product.name}
                            </h3>

                            {/* Categories */}
                            <div className="text-gray-400 text-sm mb-1">
                              {product.categories &&
                              product.categories.length > 0
                                ? product.categories
                                    .map((cat) => cat.name)
                                    .join(", ")
                                : ""}
                            </div>

                            {/* Price */}
                            <div className="flex items-end gap-2 mb-2">
                              {product.min_sale_price &&
                              product.min_sale_price !== product.min_price ? (
                                <div className="flex flex-col">
                                  <span className="line-through text-gray-400 text-xs font-normal">
                                    {product.min_price}{" "}
                                    {language === "ar" ? "د.ك" : "KWD"}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <CornerDownRight
                                      size={20}
                                      style={{ color: colors.primary }}
                                    />
                                    <span
                                      className="text-2xl font-bold"
                                      style={{ color: colors.primary }}
                                    >
                                      {product.min_sale_price}{" "}
                                      {language === "ar" ? "د.ك" : "KWD"}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span
                                  className="text-2xl font-bold"
                                  style={{ color: colors.primary }}
                                >
                                  {product.min_price}{" "}
                                  {language === "ar" ? "د.ك" : "KWD"}
                                </span>
                              )}
                            </div>

                            {/* Discount duration */}
                            {product.sale_starts_at &&
                              product.sale_ends_at &&
                              (() => {
                                const start = new Date(product.sale_starts_at);
                                const end = new Date(product.sale_ends_at);
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(
                                  diffTime / (1000 * 60 * 60 * 24)
                                );
                                const diffMonths = Math.floor(diffDays / 30);
                                return (
                                  <div className="mb-2">
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                      {diffMonths > 0
                                        ? t("discount_for_months", {
                                            count: diffMonths,
                                          })
                                        : t("discount_for_days", {
                                            count: diffDays,
                                          })}
                                    </span>
                                  </div>
                                );
                              })()}

                            {/* Description */}
                            <div className="text-gray-500 text-base mb-4 line-clamp-2">
                              {product.description}
                            </div>

                            {/* Stock */}
                            {product.total_stock === 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {t("outOfStock")}:
                                </span>
                                <span className="text-xs font-semibold text-red-600">
                                  {t("soldOut")}
                                </span>
                              </div>
                            )}

                            {/* wishLis & Cart */}
                            <div className="flex justify-start items-center gap-4">
                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWishlist(product.id);
                                }}
                                disabled={loadingStates.wishlist[product.id]}
                                className={`bg-white border border-gray-300 p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
                                ${
                                  loadingStates.wishlist[product.id]
                                    ? "opacity-50 cursor-not-allowed"
                                    : isProductInWishlist(product.id)
                                    ? "bg-red-100 hover:bg-red-200"
                                    : "hover:bg-blue-100"
                                }
                              `}
                                style={{ borderColor: colors.borderLight }}
                              >
                                <Heart
                                  size={22}
                                  className={`transition ${
                                    loadingStates.wishlist[product.id]
                                      ? "text-gray-400"
                                      : isProductInWishlist(product.id)
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }`}
                                  fill={
                                    isProductInWishlist(product.id)
                                      ? "red"
                                      : "none"
                                  }
                                />
                                <span className="ml-2 text-sm text-gray-700 font-medium hidden sm:inline">
                                  {language === "ar"
                                    ? "أضف إلى المفضلة"
                                    : "Add to Wishlist"}
                                </span>
                              </button>
                              {/* Cart */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product.id, 1);
                                }}
                                disabled={loadingStates.cart[product.id]}
                                className={`bg-white border border-gray-300 p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
                                  ${
                                    loadingStates.cart[product.id]
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-blue-100"
                                  }`}
                                style={{ borderColor: colors.borderLight }}
                              >
                                <ShoppingCart
                                  size={22}
                                  className="text-gray-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 font-medium hidden sm:inline">
                                  {language === "ar"
                                    ? "أضف إلى السلة"
                                    : "Add to Cart"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Grid view
                    return (
                      <div
                        key={product.id}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative group border overflow-hidden bg-white shadow-md hover:shadow-sm transition-shadow duration-300 cursor-pointer flex flex-col"
                        style={{
                          borderColor: colors.borderLight,
                          minHeight: 420,
                        }}
                      >
                        <div
                          className="relative flex justify-center items-center h-56 bg-gray-50 cursor-pointer"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <img
                            src={
                              hoveredIndex === idx ? secondImage : primaryImage
                            }
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          {/* WishList */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(product.id);
                            }}
                            disabled={loadingStates.wishlist[product.id]}
                            className={`absolute top-3 ${
                              language === "ar" ? "left-3" : "right-3"
                            } z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center
                              opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
                              transition-all duration-300 delay-50 cursor-pointer
                            ${
                              loadingStates.wishlist[product.id]
                                ? "opacity-50 cursor-not-allowed"
                                : isProductInWishlist(product.id)
                                ? "bg-red-100 hover:bg-red-200"
                                : "hover:bg-blue-100"
                            }`}
                            style={{ borderColor: colors.borderLight }}
                          >
                            <Heart
                              size={22}
                              className={`transition ${
                                loadingStates.wishlist[product.id]
                                  ? "text-gray-400"
                                  : isProductInWishlist(product.id)
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                              fill={
                                isProductInWishlist(product.id) ? "red" : "none"
                              }
                            />
                          </button>
                          {/* Cart */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id, 1);
                            }}
                            disabled={loadingStates.cart[product.id]}
                            className={`absolute bottom-3 ${
                              language === "ar" ? "left-3" : "right-3"
                            } z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center
                              opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
                              transition-all duration-300 delay-150 cursor-pointer
                            ${
                              loadingStates.cart[product.id]
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-100"
                            }`}
                            style={{ borderColor: colors.borderLight }}
                          >
                            <ShoppingCart size={22} className="text-gray-500" />
                          </button>
                          {/* Discount badge */}
                          {product.discount_percentage && (
                            <span
                              className="absolute"
                              style={{
                                top: 12,
                                left: -38,
                                background: "#ef233c",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                padding: "10px 48px",
                                transform: "rotate(-35deg)",
                                zIndex: 30,
                                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                                letterSpacing: "1px",
                                borderRadius: "6px",
                                textShadow: "0 1px 2px rgba(0,0,0,0.10)",
                                borderTopLeftRadius: "0.5rem",
                                borderTopRightRadius: "0.5rem",
                              }}
                            >
                              -{product.discount_percentage}% {t("offer")}
                            </span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col flex-1 p-4">
                          <h3
                            className="text-base font-bold mb-1 truncate"
                            style={{
                              color: colors.productTitle,
                              minHeight: 24,
                            }}
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            {product.name}
                          </h3>
                          <p
                            className="text-sm text-gray-500 mb-2 truncate"
                            style={{ minHeight: 20 }}
                          >
                            {product.description}
                          </p>

                          {/* Price */}
                          <div className="flex items-end gap-2 mb-2">
                            {product.on_sale === "true" &&
                            product.min_sale_price &&
                            product.min_sale_price !== product.min_price ? (
                              <div className="flex flex-col">
                                <span className="line-through text-gray-400 text-xs font-normal">
                                  {product.min_price}{" "}
                                  {language === "ar" ? "د.ك" : "KWD"}
                                </span>
                                <div className="flex items-center gap-2">
                                  <CornerDownRight
                                    size={20}
                                    style={{ color: colors.primary }}
                                  />
                                  <span
                                    className="text-lg font-bold"
                                    style={{ color: colors.primary }}
                                  >
                                    {product.min_sale_price}{" "}
                                    {language === "ar" ? "د.ك" : "KWD"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span
                                className="text-lg font-bold"
                                style={{ color: colors.primary }}
                              >
                                {product.min_price}{" "}
                                {language === "ar" ? "د.ك" : "KWD"}
                              </span>
                            )}
                          </div>

                          {/* Discount duration */}
                          {product.on_sale === "true" &&
                            product.sale_starts_at &&
                            product.sale_ends_at &&
                            (() => {
                              const start = new Date(product.sale_starts_at);
                              const end = new Date(product.sale_ends_at);
                              const diffTime = Math.abs(end - start);
                              const diffDays = Math.ceil(
                                diffTime / (1000 * 60 * 60 * 24)
                              );
                              const diffMonths = Math.floor(diffDays / 30);
                              return (
                                <div className="mb-2">
                                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                    {diffMonths > 0
                                      ? t("discount_for_months", {
                                          count: diffMonths,
                                        })
                                      : t("discount_for_days", {
                                          count: diffDays,
                                        })}
                                  </span>
                                </div>
                              );
                            })()}

                          {/* Stock*/}
                          {product.total_stock === 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {t("outOfStock")}:
                              </span>
                              <span className="text-xs font-semibold text-red-600">
                                {t("soldOut")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <Pagination />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
