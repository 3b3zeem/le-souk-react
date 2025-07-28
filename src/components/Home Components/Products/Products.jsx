import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CornerDownRight,
} from "lucide-react";
import useHome from "../../../hooks/HomeComponents/useHome";
import { Link } from "react-router-dom";
import { renderStars } from "../../../utils/ratingUtils";
import useCartCRUD from "./../../../hooks/Cart/UseCart";
import useWishlistCRUD from "../../../hooks/WishList/useWishlist";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useWishlist } from "../../../context/WishList/WishlistContext";
import SkeletonLoader from "../../../layouts/SkeletonLoader";

const Products = () => {
  const { products, loading, error } = useHome();
  const [loadingStates, setLoadingStates] = useState({
    cart: {},
    wishlist: {},
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { addToCart } = useCartCRUD();
  const { toggleWishlist, fetchWishlist } = useWishlistCRUD();
  const { wishlistItems, fetchWishlistItems, fetchWishlistCount } =
    useWishlist();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-4 -translate-y-1/2 bg-[#333e2c] hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
    >
      <ChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-4 -translate-y-1/2 bg-[#333e2c] hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
    >
      <ChevronLeft size={20} />
    </button>
  );

  const settings = {
    dots: false,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: Math.min(products.length, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: products.length > 1 ? <NextArrow /> : null,
    prevArrow: products.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const colors = {
    primary: "#333e2c",
    categoryTitle: "#808080",
    categoryName: "#6b7280",
    borderLight: "#e5e7eb",
    lineBg: "#d1d5db",
  };

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

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14">
        <div className="bg-red-100 border border-red-400 text-red-700 px-10 py-16 rounded-md shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold mb-2 ">
            {t("Something went wrong!")}
          </h2>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-300"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2
        className="text-2xl sm:text-3xl font-normal mb-6 uppercase font-serif "
        style={{ color: colors.categoryTitle }}
      >
        {t("featured_products")}
      </h2>

      <Slider {...settings}>
        {products.map((product, idx) => {
          const primaryImage = product.primary_image_url;
          const secondImage =
            product.images && product.images.length > 1
              ? product.images[1].image_url
              : primaryImage;

          return (
            <div key={product.id} className="px-2 h-[470px] ">
              <div
                className="relative group border rounded-md overflow-hidden bg-white shadow-md hover:shadow-sm transition-shadow duration-300 cursor-pointer flex flex-col"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  borderColor: colors.borderLight,
                  minHeight: 420,
                }}
              >
                <div
                  className="relative flex justify-center items-center bg-gray-50 h-80"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img
                    src={hoveredIndex === idx ? secondImage : primaryImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
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
                      -{product.discount_percentage}%{" "}
                      {language === "ar" ? "خصم" : "OFF"}
                    </span>
                  )}
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
                      fill={isProductInWishlist(product.id) ? "red" : "none"}
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
                </div>
                {/* Product Details */}
                <div className="p-4 text-left flex flex-col flex-1">
                  <p
                    className="text-xs uppercase text-gray-500 cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.categories?.length > 0
                      ? product.categories[0].name
                      : "No category"}
                  </p>
                  <h3
                    className="text-base font-bold mt-1 mb-1 truncate cursor-pointer"
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
                        {product.min_price} {language === "ar" ? "د.ك" : "KWD"}
                      </span>
                    )}
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
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <div className="flex justify-center mt-8">
        <Link
          to={"/products"}
          className="px-6 py-2 text-md font-medium bg-[#333e2c] transition duration-200 customEffect"
          style={{ borderColor: colors.primary, color: colors.primary }}
        >
          <span>{t("allProducts")}</span>
        </Link>
      </div>
    </div>
  );
};

export default Products;
