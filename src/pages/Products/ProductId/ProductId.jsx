import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  Heart,
  AlertCircle,
  SearchX,
} from "lucide-react";
import useProducts from "../../../hooks/Products/useProduct";
import useCartCRUD from "../../../hooks/Cart/UseCart";
import useWishlistCRUD from "../../../hooks/WishList/useWishlist";
import { renderStars } from "../../../utils/ratingUtils";
import toast from "react-hot-toast";
import Reviews from "../Reviews/Reviews";
import Loader from "../../../layouts/Loader";
import NotFound from "../../../components/NotFound/NotFound";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const ProductId = () => {
  const { productId } = useParams();
  const {
    productDetails,
    productDetailsLoading,
    productDetailsError,
    fetchProductDetails,
  } = useProducts();
  const { addToCart } = useCartCRUD();
  const { toggleWishlist, wishlistItems, fetchWishlist } = useWishlistCRUD();
  const [quantity, setQuantity] = useState(1);
  const [loadingStates, setLoadingStates] = useState({
    cart: false,
    wishlist: false,
  });
  const { token } = useAuthContext();
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
      if (token) {
        fetchWishlist();
      }
    }
  }, [productId]);

  const handleAddToCart = async () => {
    setLoadingStates((prev) => ({ ...prev, cart: true }));
    try {
      await addToCart(productId, quantity);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, cart: false }));
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

  const isProductInWishlist = () => {
    return wishlistItems.some((item) => item.id === parseInt(productId));
  };

  const handlePayNow = () => {
    toast.success("Redirecting to payment...");
  };

  if (productDetailsLoading) return <Loader />;
  if (productDetailsError) return <NotFound productId={productId} />;
  if (!productDetails || !productDetails.id)
    return (
      <div
        className="flex flex-col items-center justify-center py-10"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-6 py-4 rounded-md shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-3">
            <SearchX className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold mb-2">{t("noProductFound")}</h2>
          <p className="text-sm text-gray-600">
            {t("productNotFoundDescription")}
          </p>
        </div>
      </div>
    );

  return (
    <div
      className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section - Product Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={productDetails.image}
            alt={productDetails.name}
            className="max-w-full h-auto object-contain"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* Right Section - Product Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: colors.productTitle }}
          >
            {productDetails.name}
          </h1>

          <div className="flex items-center mb-2">
            <div className="flex">{renderStars(productDetails.rating)}</div>
            <span
              className="ml-2 text-sm"
              style={{ color: colors.productName }}
            >
              {productDetails.rating}.0
            </span>
          </div>

          <p
            className="text-xl font-semibold mb-4"
            style={{ color: colors.primary }}
          >
            {productDetails.price} {language === "ar" ? "ج.م" : "LE"}
          </p>

          <p className="text-gray-600 mb-4">{productDetails.description}</p>

          <div className="flex items-center mb-4">
            <span
              className="font-medium"
              style={{ color: colors.productTitle }}
            >
              {t("category")}:
            </span>
            <span className="ml-2" style={{ color: colors.productName }}>
              {productDetails.category.name}.
            </span>
            <span
              className="ml-4 font-medium"
              style={{ color: colors.productTitle }}
            >
              {t("inStock")}:
            </span>
            <span className="ml-2" style={{ color: colors.productName }}>
              {productDetails.stock_quantity}
            </span>
          </div>

          <div className="flex items-center mb-6">
            <span
              className="font-medium mr-4"
              style={{ color: colors.productTitle }}
            >
              {t("quantity")}:
            </span>
            <input
              type="number"
              min="1"
              max={productDetails.stock_quantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              className="w-16 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{ borderColor: colors.borderLight }}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={loadingStates.cart}
              className={`flex-1 py-3 rounded-md text-white font-medium cursor-pointer ${
                loadingStates.cart
                  ? "opacity-50 cursor-not-allowed"
                  : "customEffect"
              }`}
              style={{ backgroundColor: colors.primary }}
            >
              <span className="flex justify-center items-center gap-2">
                <ShoppingCart size={20} className="inline-block" />
                {loadingStates.cart ? t("addingToCart") : t("addToCart")}
              </span>
            </button>

            <button
              onClick={handlePayNow}
              className="flex-1 py-3 rounded-md text-white font-medium cursor-pointer customEffect"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="flex justify-center items-center gap-2">
                <CreditCard size={20} className="inline-block" />
                {t("payNow")}
              </span>
            </button>

            {productDetails?.id && (
              <button
                onClick={() => handleToggleWishlist(productDetails.id)}
                disabled={loadingStates.wishlist?.[productDetails.id]}
                className={`p-2 rounded border border-gray-300 transition duration-200 cursor-pointer ${
                  loadingStates.wishlist?.[productDetails.id]
                    ? "opacity-50 cursor-not-allowed"
                    : isProductInWishlist(productDetails.id)
                    ? "bg-red-100 hover:bg-red-200"
                    : "hover:bg-gray-100"
                }`}
                style={{ borderColor: colors.borderLight }}
              >
                <Heart
                  size={25}
                  className={`${
                    loadingStates.wishlist?.[productDetails.id]
                      ? "text-gray-400"
                      : isProductInWishlist(productDetails.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                  fill={isProductInWishlist(productDetails.id) ? "red" : "none"}
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <Reviews
        reviews={productDetails.reviews || []}
        productId={productId}
        fetchProductDetails={fetchProductDetails}
      />
    </div>
  );
};

export default ProductId;
