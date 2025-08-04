import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PackageX,
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
import Meta from "../../components/Meta/Meta";
import { useSettingsContext } from "../../context/Settings/SettingsContext";
import ListView from "./ListView";
import GridView from "./GridView";
import ToolbarOptions from "./ToolbarOptions";
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
  const [maxPrice, setMaxPrice] = useState(500);
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

  // * Fetch Settings to show the Banner Image
  const { settings } = useSettingsContext();
  const banner = settings.find(
    (setting) => setting.key === "products_banner_image"
  );
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
    if (maxPrice !== 500) params.set("max_price", maxPrice);
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

    const totalPages = meta.last_page;
    const currentPage = meta.current_page;

    const getPages = () => {
      const pages = new Set();

      if (totalPages <= 7) {
        // عرض كل الصفحات مباشرة
        for (let i = 1; i <= totalPages; i++) {
          pages.add(i);
        }
      } else {
        // أول صفحتين
        pages.add(1);

        if (currentPage > 3) pages.add("...");

        // صفحات قريبة من الحالية
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (i > 1 && i < totalPages) {
            pages.add(i);
          }
        }

        if (currentPage < totalPages - 2) pages.add("...");

        pages.add(totalPages);
      }

      return Array.from(pages);
    };

    return (
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-200 transition-all duration-200"
        >
          {t("prev")}
        </button>

        {getPages().map((p, index) =>
          p === "..." ? (
            <span key={`dots-${index}`} className="px-3 py-1">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(Number(p))}
              className={`px-3 py-1 border border-gray-400 rounded cursor-pointer ${
                currentPage === p
                  ? "bg-[#333e2c] text-white hover:bg-[#333e2c] transition-all duration-100"
                  : "hover:bg-gray-200 transition-all duration-200"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
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
    <React.Fragment>
      <Meta
        title="Explore Products"
        description="Discover a wide range of products available for purchase."
      />

      {/* Shop Banner */}
      <div className="relative w-full h-100 mb-8 overflow-hidden shadow-md">
        <img
          src={bannerUrl}
          alt="Shop Banner"
          className="w-full h-full object-cover"
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
              <ToolbarOptions
                handleSearchSubmit={handleSearchSubmit}
                language={language}
                t={t}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                colors={colors}
                setPerPage={setPerPage}
                setPage={setPage}
                perPage={perPage}
                setViewMode={setViewMode}
                viewMode={viewMode}
                sortDropdownRef={sortDropdownRef}
                setSortDropdownOpen={setSortDropdownOpen}
                sortOptions={sortOptions}
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortDropdownOpen={sortDropdownOpen}
                handleSortChange={handleSortChange}
              />
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
              <React.Fragment>
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
                        <ListView
                          product={product}
                          setHoveredIndex={setHoveredIndex}
                          handleProductClick={handleProductClick}
                          hoveredIndex={hoveredIndex}
                          secondImage={secondImage}
                          primaryImage={primaryImage}
                          language={language}
                          t={t}
                          colors={colors}
                          handleToggleWishlist={handleToggleWishlist}
                          loadingStates={loadingStates}
                          isProductInWishlist={isProductInWishlist}
                          handleAddToCart={handleAddToCart}
                          idx={idx}
                        />
                      );
                    }

                    // Grid view
                    return (
                      <GridView
                        product={product}
                        setHoveredIndex={setHoveredIndex}
                        handleProductClick={handleProductClick}
                        hoveredIndex={hoveredIndex}
                        secondImage={secondImage}
                        primaryImage={primaryImage}
                        language={language}
                        t={t}
                        colors={colors}
                        handleToggleWishlist={handleToggleWishlist}
                        loadingStates={loadingStates}
                        isProductInWishlist={isProductInWishlist}
                        handleAddToCart={handleAddToCart}
                        idx={idx}
                        navigate={navigate}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                <Pagination />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Products;
