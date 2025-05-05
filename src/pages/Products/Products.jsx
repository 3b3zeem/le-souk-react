import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Heart, Search } from "lucide-react";
import useProducts from "../../hooks/Products/useProduct";
import Loader from "../../layouts/Loader";
import { renderStars } from "../../utils/ratingUtils";
import { ring2 } from "ldrs";
import useWishlistCRUD from "../../hooks/WishList/useWishlist";
import useCartCRUD from "../../hooks/Cart/UseCart";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [inStock, setInStock] = useState(null);
  const [sliderPrice, setSliderPrice] = useState([minPrice, maxPrice]);
  const navigate = useNavigate();

  const {
    products,
    categories,
    loading,
    error,
    meta,
    links,
  } = useProducts(
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
  const { toggleWishlist, wishlistItems, fetchWishlist } = useWishlistCRUD();
  const [loadingStates, setLoadingStates] = useState({ cart: {}, wishlist: {} });
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    fetchWishlist();

    scrollTo(0, 0)
  }, []);

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
  }, [searchQuery, selectedCategory, minPrice, maxPrice, inStock, sortBy, sortDirection, page, setSearchParams]);


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

  const handleAddToCart = async (productId, quantity) => {
    setLoadingStates((prev) => ({ ...prev, cart: { ...prev.cart, [productId]: true } }));
    try {
      await addToCart(productId, quantity);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, cart: { ...prev.cart, [productId]: false } }));
    }
  };

  const handleToggleWishlist = async (productId) => {
    setLoadingStates((prev) => ({ ...prev, wishlist: { ...prev.wishlist, [productId]: true } }));
    try {
      await toggleWishlist(productId);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, wishlist: { ...prev.wishlist, [productId]: false } }));
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Pagination component
  const Pagination = () => {
    // if (!meta || meta.last_page <= 1) return null;
    const pages = [];
    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(i);
    }
    return (
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={meta.current_page === 1}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-200 transition-all duration-200"
        >
          {t("prev")}
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 border border-gray-400 rounded cursor-pointer ${meta.current_page === p ? "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-100" : "hover:bg-gray-200 transition-all duration-200"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
          disabled={meta.current_page === meta.last_page}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-200 transition-all duration-200"
        >
          {t("next")}
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Section */}
        <div className="w-full lg:w-1/3 h-[100%] border border-gray-200 rounded-md shadow-md p-3">

          <div className="mb-8">
            <h3 className="relative inline-block font-bold text-2xl mb-6" style={{ color: colors.productName }}>
              {t("categories")}
              <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCategory(null);
                      } else {
                        setSelectedCategory(category.id);
                      }
                      setPage(1);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg border transition
                      ${isSelected ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-200 bg-white"}
                      hover:border-blue-400 hover:bg-blue-100
                      focus:outline-none cursor-pointer
                    `}
                    style={{ minWidth: 120 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition
                      ${isSelected ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}
                      bg-white overflow-hidden`}>
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-7 h-7 object-cover rounded-full"
                      />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                      {category.name}
                    </span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-600 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 flex justify-between">
            {/* In Stock Only */}
            <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
              <span className="font-medium" style={{ color: colors.productName }}>
                {t("inStock")}
              </span>
              <span className="relative inline-block w-10 h-6">
                <input
                  type="checkbox"
                  checked={inStock === 1}
                  onChange={() => setInStock(inStock === 1 ? null : 1)}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span
                  className={`absolute left-0 top-0 w-10 h-6 rounded-full transition ${inStock === 1 ? "bg-blue-500" : "bg-gray-300"} peer-focus:ring-2 peer-focus:ring-blue-300`}
                ></span>
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition ${inStock === 1 ? "translate-x-4" : ""}`}
                ></span>
              </span>
            </label>
          </div>

          <div className="mb-5">
            <h3 className="relative inline-block font-bold text-2xl" style={{ color: colors.productName }}>
              {t("price")}
              <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
            </h3>
            <div className="flex flex-col gap-4 mb-4">
              <Slider
                range
                min={0}
                max={100000}
                value={sliderPrice}
                onChange={([min, max]) => setSliderPrice([min, max])}
                allowCross={false}
                step={100}
                trackStyle={[{ backgroundColor: colors.primary }]}
                handleStyle={[
                  { borderColor: colors.primary, backgroundColor: colors.primary },
                  { borderColor: colors.primary, backgroundColor: colors.primary }
                ]}
              />
              <div className="flex justify-between text-sm">
                <span>{sliderPrice[0]} {language === "ar" ? "ج.م" : "LE"}</span>
                <span>{sliderPrice[1]} {language === "ar" ? "ج.م" : "LE"}</span>
              </div>
              <button
                onClick={() => {
                  setMinPrice(sliderPrice[0]);
                  setMaxPrice(sliderPrice[1]);
                  setPage(1);
                }}
                className="w-[100px] py-2 text-sm font-medium cursor-pointer customEffect"
                style={{ backgroundColor: colors.primary, color: colors.lightText }}
              >
                <span>{t("apply")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="w-full lg:w-3/4">
          {/* Search and Filter Section */}
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
              <span className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${language === "ar" ? "left-3" : "right-3"}`}>
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
              <span className={`pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2`}>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <>
              {/* Products List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="h-100 border overflow-hidden bg-white shadow-sm cursor-pointer"
                    style={{ borderColor: colors.borderLight }}
                  >
                    <div
                      className="flex justify-center items-center h-48"
                      onClick={() => {
                        navigate(`/products/${product.id}`);
                      }}
                    >
                      <img
                        src={product.primary_image_url ? `https://le-souk.dinamo-app.com/storage/${product.primary_image_url}` : ""}
                        alt={product.name}
                        lazy
                        className="h-full object-contain p-4 hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-4">
                      <h3
                        className="text-base font-bold"
                        style={{ color: colors.text }}
                        onClick={() => {
                          navigate(`/products/${product.id}`);
                        }}
                      >
                        {product.name}
                      </h3>
                      <h3 className="text-base font-semibold truncate my-3" style={{ color: colors.productName }}>
                        {product.description}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          {/* {renderStars(product.rating)} */}
                          {/* <span className="ml-1 text-sm" style={{ color: colors.text }}>
                            {product.reviews.length} {t("reviewsCount")}
                          </span> */}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-2">
                        <p className="text-sm font-semibold mt-2" style={{ color: colors.primary }}>
                          {product.min_price} {language === "ar" ? "ج.م" : "LE"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product.id, 1)}
                            disabled={loadingStates.cart[product.id]}
                            className={`p-3 rounded-full border group transition duration-200 cursor-pointer ${loadingStates.cart[product.id]
                              ? "bg-gray-200 cursor-not-allowed"
                              : "hover:bg-[#569be1] hover:text-white"
                              }`}
                            style={{ borderColor: colors.borderLight }}
                          >
                            <ShoppingCart size={20} className="text-gray-500 group-hover:text-white transition duration-200" />
                          </button>

                          <button
                            onClick={() => handleToggleWishlist(product.id)}
                            disabled={loadingStates.wishlist[product.id]}
                            className={`p-3 rounded-full border border-gray-300 transition duration-200 cursor-pointer ${loadingStates.wishlist[product.id]
                              ? "opacity-50 cursor-not-allowed"
                              : isProductInWishlist(product.id)
                                ? "bg-red-100 hover:bg-red-200"
                                : "hover:bg-[#569be1]"
                              }`}
                            style={{ borderColor: colors.borderLight }}
                          >
                            <Heart
                              size={20}
                              className={`$${loadingStates.wishlist[product.id]
                                ? "text-gray-400"
                                : isProductInWishlist(product.id)
                                  ? "text-red-500"
                                  : "text-gray-500 hover:text-white"
                                }`}
                              fill={isProductInWishlist(product.id) ? "red" : "none"}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
