import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import useHome from "../../../hooks/HomeComponents/useHome";
import Loader from "../../../layouts/Loader";
import { Link } from "react-router-dom";
import { renderStars } from "../../../utils/ratingUtils";
import useCartCRUD from "./../../../hooks/Cart/UseCart";
import useWishlistCRUD from "../../../hooks/WishList/useWishlist";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";

const Products = () => {
  const { products, loading, error } = useHome();
  const [loadingStates, setLoadingStates] = useState({
    cart: {},
    wishlist: {},
  });
  const { addToCart } = useCartCRUD();
  const { toggleWishlist, wishlistItems, fetchWishlist } = useWishlistCRUD();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-4 -translate-y-1/2 bg-blue-600 hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
    >
      <ChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-4 -translate-y-1/2 bg-blue-600 hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
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
    primary: "#1e70d0",
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
    return wishlistItems.some((item) => item.id === productId);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14">
        <div className="bg-red-100 border border-red-400 text-red-700 px-10 py-16 rounded-md shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">
            {t("Something went wrong!")}
          </h2>
          <p className="text-sm">{error}</p>
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
        className="text-2xl sm:text-3xl font-normal mb-6 uppercase"
        style={{ color: colors.categoryTitle }}
      >
        {t("products")}
      </h2>

      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2 h-100">
            <div className="border border-gray-300 rounded-lg group transition-all duration-300 overflow-hidden bg-white">
              <img
                src={
                  product.images[0]?.image_url ||
                  "https://via.placeholder.com/150"
                }
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => {
                  navigate(`/products/${product.id}`);
                }}
              />
              <div className="p-4 text-left">
                <p
                  className="text-xs uppercase text-gray-500 cursor-pointer"
                  onClick={() => {
                    navigate(`/products/${product.id}`);
                  }}
                >
                  {product.categories?.length > 0
                    ? product.categories[0].name
                    : "No category"}
                </p>
                <h3
                  className="text-sm font-medium mt-1 cursor-pointer"
                  style={{ color: colors.text }}
                  onClick={() => {
                    navigate(`/products/${product.id}`);
                  }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-sm mt-1 truncate"
                  style={{ color: colors.categoryName }}
                >
                  {product.description}
                </p>
                <div className="flex mt-2">
                  <span>No rating available</span>
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-gray-300">
                  <p
                    className="text-lg font-semibold mt-2"
                    style={{ color: colors.primary }}
                  >
                    {product.min_price !== "N/A"
                      ? `${product.min_price}$`
                      : "Price not available"}
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => handleAddToCart(product.id, 1)}
                      disabled={loadingStates.cart[product.id]}
                      className={`p-2 rounded-full border border-gray-300 transition duration-200 cursor-pointer ${
                        loadingStates.cart[product.id]
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                      style={{ borderColor: colors.borderLight }}
                    >
                      <ShoppingCart
                        size={20}
                        className={`${
                          loadingStates.cart[product.id]
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      disabled={loadingStates.wishlist[product.id]}
                      className={`p-2 rounded-full border border-gray-300 transition duration-200 cursor-pointer ${
                        loadingStates.wishlist[product.id]
                          ? "opacity-50 cursor-not-allowed"
                          : isProductInWishlist(product.id)
                          ? "bg-red-100 hover:bg-red-200"
                          : "hover:bg-gray-100"
                      }`}
                      style={{ borderColor: colors.borderLight }}
                    >
                      <Heart
                        size={20}
                        className={`${
                          loadingStates.wishlist[product.id]
                            ? "text-gray-400"
                            : isProductInWishlist(product.id)
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                        fill={isProductInWishlist(product.id) ? "red" : "none"}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="flex justify-center mt-8">
        <Link
          to={"/products"}
          className="px-6 py-2 border rounded-md text-md font-medium bg-[#1e70d0] transition duration-200 customEffect"
          style={{ borderColor: colors.primary, color: colors.primary }}
        >
          <span>{t("seeMore")}</span>
        </Link>
      </div>
    </div>
  );
};

export default Products;
