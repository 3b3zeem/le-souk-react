import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  PackageX,
  ChevronDown,
  CornerDownRight,
} from "lucide-react";
import useProducts from "../../hooks/Products/useProduct";
import Loader from "../../layouts/Loader";
import { renderStars } from "../../utils/ratingUtils";
import { ring2 } from "ldrs";
import useWishlistCRUD from "../../hooks/WishList/useWishlist";
import useCartCRUD from "../../hooks/Cart/UseCart";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../../context/WishList/WishlistContext";
import Filters from "./Filters";
ring2.register();

const colors = {
  primary: "#1e70d0",
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
  const [perPage, setPerPage] = useState(12);
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
  const { toggleWishlist, fetchWishlist } = useWishlistCRUD();
  const { wishlistItems, fetchWishlistItems, fetchWishlistCount } =
    useWishlist();
  const [loadingStates, setLoadingStates] = useState({
    cart: {},
    wishlist: {},
  });
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    fetchWishlist();

    scrollTo(0, 0);
  }, []);

  // * Set Parameters' Filters in URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice !== 0) params.set("min_price", minPrice);
    if (maxPrice !== 100000) params.set("max_price", maxPrice);
    if (inStock) params.set("in_stock", inStock);
    if (sortBy !== "created_at" || sortDirection !== "desc") {
      params.set("sort_by", sortBy);
      params.set("sort_direction", sortDirection);
    }
    if (page !== 1) params.set("page", page);
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

  // * Handle Search, Sort, and Category Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "created_at_desc") {
      setSortBy("created_at");
      setSortDirection("desc");
    } else if (value === "created_at_asc") {
      setSortBy("created_at");
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
                ? "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-100"
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

  return (
    <div
      className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8"
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
          {/* Search and Sort Section */}
          <div className="flex flex-col items-start gap-10 md:flex-row md:justify-between mb-6">
            <div className="relative w-[200px] focus-within:w-[300px] transition-all duration-200">
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-4 px-2 pl-4 border text-sm focus:outline-none shadow-sm"
                style={{ borderColor: colors.borderLight }}
              />
              <span
                className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${
                  language === "ar" ? "left-3" : "right-3"
                }`}
              >
                <Search size={20} className="text-gray-500" />
              </span>
            </div>

            <div className="relative w-48">
              <select
                className={`block w-full py-2 pl-4 pr-10 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white border-gray-200 text-gray-700 appearance-none cursor-pointer`}
                style={{ borderColor: colors.borderLight }}
                value={`${sortBy}_${sortDirection}`}
                onChange={handleSortChange}
              >
                <option value="created_at_desc">{t("sortNewest")}</option>
                <option value="created_at_asc">{t("sortOldest")}</option>
              </select>
              <span
                className={`pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2`}
              >
                <ChevronDown className="w-5 h-5 text-blue-500" />
              </span>
            </div>
          </div>

          {loading ? (
            <Loader />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => {
                  const primaryImage = product.primary_image_url;
                  const secondImage =
                    product.images && product.images.length > 1
                      ? product.images[1].image_url
                      : primaryImage;

                  return (
                    <div
                      key={product.id}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative group border rounded-md overflow-hidden bg-white shadow-md hover:shadow-sm transition-shadow duration-300 cursor-pointer flex flex-col"
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
                          className="h-full max-h-52 object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                          style={{ maxWidth: "90%" }}
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
                          } z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
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
                          } z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
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
                          style={{ color: colors.productTitle, minHeight: 24 }}
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
                          {product.min_sale_price &&
                          product.min_sale_price !== product.min_price ? (
                            <div className="flex flex-col">
                              <span className="line-through text-gray-400 text-xs font-normal">
                                {product.min_price}{" "}
                                {language === "ar" ? "ج.م" : "LE"}
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
                                  {language === "ar" ? "ج.م" : "LE"}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span
                              className="text-lg font-bold"
                              style={{ color: colors.primary }}
                            >
                              {product.min_price}{" "}
                              {language === "ar" ? "ج.م" : "LE"}
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

                        {/* Stock*/}
                        <div className="flex items-center gap-2 mt-auto">
                          <span className="text-xs text-gray-400">
                            {t("inStock")}:
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            {product.total_stock}
                          </span>
                        </div>
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
  );
};

export default Products;
