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
import { useOrder } from "../../../hooks/Order/useOrder";
import Slider from "react-slick";
import { useWishlist } from "../../../context/WishList/WishlistContext";

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
  const { toggleWishlist, fetchWishlist } = useWishlistCRUD();
    const { wishlistItems, fetchWishlistItems, fetchWishlistCount } =
      useWishlist();
  const { placeOrder, loading: orderLoading } = useOrder();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    cart: false,
    wishlist: false,
  });
  const [mainImage, setMainImage] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
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

    scrollTo(0, 0);
  }, [productId, language]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      productDetails &&
      productDetails.images &&
      productDetails.images.length > 0
    ) {
      setMainImage(productDetails.images[0].image_url);
      setSliderIndex(0);
    } else if (productDetails && productDetails.primary_image_url) {
      setMainImage(
        `https://le-souk.dinamo-app.com/storage/${productDetails.primary_image_url}`
      );
      setSliderIndex(0);
    }
  }, [productDetails]);

  useEffect(() => {
    setSelectedVariant(null);
  }, [productDetails]);

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

  const handlePayNow = async () => {
    if (!token) {
      toast.error(t("noAccount"));
      return;
    }

    try {
      const items = [
        {
          product_id: productId,
          quantity: quantity,
        },
      ];
      await placeOrder(items);
    } catch (err) {
      toast.error(err);
    }
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

  const sliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: window.innerWidth >= 768,
    beforeChange: (oldIndex, newIndex) => {
      setSliderIndex(newIndex);
      if (productDetails.images && productDetails.images[newIndex]) {
        setMainImage(productDetails.images[newIndex].image_url);
      }
    },
  };

  return (
    <div
      className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section - Product Image */}
        <div
          className={`w-full md:w-1/2 flex flex-col md:flex-row items-center justify-center ${
            language === "ar" ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          {/* Thumbnails Slider */}
          <div
            className={`md:order-2 focus:outline-none focus:border-none  ${
              language === "ar" ? "order-1" : "order-2"
            }`}
            style={{ maxWidth: isDesktop ? 90 : "45%" }}
          >
            <Slider {...sliderSettings}>
              {productDetails.images &&
                productDetails.images.map((img, idx) => (
                  <div key={img.id}>
                    <img
                      src={img.image_url}
                      alt={`thumb-${idx}`}
                      className={`w-16 h-16 object-cover rounded-md border cursor-pointer transition
                ${
                  mainImage === img.image_url
                    ? "ring-2 ring-blue-400 border-blue-400"
                    : "border-gray-300"
                }
              `}
                      onClick={() => {
                        setMainImage(img.image_url);
                        setSliderIndex(idx);
                      }}
                    />
                  </div>
                ))}
            </Slider>
          </div>
          {/* Main Image */}
          <img
            src={mainImage}
            alt={productDetails.name}
            className={`w-full h-[300px] md:h-[500px] object-cover rounded ${
              language === "ar" ? "order-2" : "order-1"
            }`}
            style={{ maxWidth: 350 }}
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

          {/* <div className="flex items-center mb-2">
            <div className="flex">{renderStars(productDetails.rating)}</div>
            <span
              className="ml-2 text-sm"
              style={{ color: colors.productName }}
            >
              {productDetails.rating}.0
            </span>
          </div> */}

          <p
            className="text-xl font-semibold mb-4"
            style={{ color: colors.primary }}
          >
            {selectedVariant
              ? `${selectedVariant.price} ${language === "ar" ? "ج.م" : "LE"}`
              : productDetails.min_price === productDetails.max_price
              ? `${productDetails.min_price} ${
                  language === "ar" ? "ج.م" : "LE"
                }`
              : `${productDetails.min_price} ${
                  language === "ar" ? "ج.م" : "LE"
                }`}
          </p>

          <p className="text-gray-600 mb-4">{productDetails.description}</p>

          <div className="flex items-center mb-4 flex-wrap gap-2">
            <span
              className="font-medium"
              style={{ color: colors.productTitle }}
            >
              {t("category")}:
            </span>
            {productDetails.categories &&
            productDetails.categories.length > 0 ? (
              productDetails.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs"
                  style={{ color: colors.productName }}
                >
                  {cat.name}
                </span>
              ))
            ) : (
              <span className="ml-2" style={{ color: colors.productName }}>
                {t("noCategory")}
              </span>
            )}
            <span
              className="ml-4 font-medium"
              style={{ color: colors.productTitle }}
            >
              {t("inStock")}:
            </span>
            <span className="ml-2" style={{ color: colors.productName }}>
              {productDetails.total_stock}
            </span>
          </div>

          {productDetails.variants && productDetails.variants.length > 0 && (
            <div className="mb-4">
              <span
                className="font-medium"
                style={{ color: colors.productTitle }}
              >
                {t("variants")}:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {productDetails.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() =>
                        setSelectedVariant(isSelected ? null : variant)
                      }
                      className={`
                        px-4 py-2 rounded-lg border transition
                        ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white"
                        }
                        hover:border-blue-400 hover:bg-blue-100
                        focus:outline-none cursor-pointer text-md font-medium
                      `}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* <div className="flex items-center mb-6">
            <span
              className="font-medium mr-4"
              style={{ color: colors.productTitle }}
            >
              {t("quantity")}:
            </span>
            <input
              type="number"
              min="1"
              maxLength={productDetails.stock_quantity}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setQuantity(
                  Math.min(productDetails.stock_quantity, Math.max(1, value))
                );
              }}
              className="w-16 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{ borderColor: colors.borderLight }}
            />
          </div> */}

          <div className="flex gap-4">
            {/* <button
              onClick={handleAddToCart}
              disabled={loadingStates.cart}
              className={`flex-1 py-3 rounded-md text-white font-medium cursor-pointer ${loadingStates.cart
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
              disabled={orderLoading}
              className={`flex-1 py-3 rounded-md text-white font-medium cursor-pointer ${orderLoading ? "opacity-50 cursor-not-allowed" : "customEffect"
                }`}
              style={{ backgroundColor: colors.primary }}
            >
              <span className="flex justify-center items-center gap-2">
                <CreditCard size={20} className="inline-block" />
                {orderLoading ? t("loading") : t("payNow")}
              </span>
            </button> */}

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
      {/* <Reviews
        reviews={productDetails.reviews || []}
        productId={productId}
        fetchProductDetails={fetchProductDetails}
      /> */}
    </div>
  );
};

export default ProductId;
