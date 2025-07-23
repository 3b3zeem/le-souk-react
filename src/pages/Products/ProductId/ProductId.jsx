import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  SearchX,
  X,
  CornerDownLeft,
  ChevronUp,
  ChevronDown,
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
import { motion } from "framer-motion";
import PackagesSlider from "./PackagesSlider";
import RelatedProducts from "./RelatedProducts";
import Meta from "../../../components/Meta/Meta";

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const ProductId = () => {
  const navigate = useNavigate();
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
  const [variantImages, setVariantImages] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  // const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const [timeLeft, setTimeLeft] = useState(null);
  const imageRef = useRef(null);
  const { token, profile } = useAuthContext();
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (productDetails?.name) {
      const slug = encodeURIComponent(productDetails.name.replace(/\s+/g, "-"));
      if (!window.location.pathname.includes(`/${slug}`)) {
        navigate(`/products/${productId}/${slug}`, { replace: true });
      }
    }
  }, [productDetails?.name, productId, navigate]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
      if (token) {
        fetchWishlist();
      }
    }

    scrollTo(0, 0);
  }, [productId, language]);

  // useEffect(() => {
  //   const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    if (productDetails) {
      // Set main image only once when product details are loaded
      if (productDetails.images && productDetails.images.length > 0) {
        setMainImage(productDetails.images[0].image_url);
      } else if (productDetails.primary_image_url) {
        setMainImage(
          `https://le-souk.dinamo-app.com/storage/${productDetails.primary_image_url}`
        );
      }

      // Reset variant-related states
      setSelectedVariant(null);
      setVariantImages([]);
      setSliderIndex(0);
    }
  }, [productDetails]);

  useEffect(() => {
    setSelectedVariant(null);
    setVariantImages([]);
  }, [productDetails]);

  useEffect(() => {
    if (productDetails && productDetails.sale_ends_at) {
      const updateCountdown = () => {
        const now = new Date();
        const end = new Date(productDetails.sale_ends_at);
        const diff = end - now;
        if (diff > 0) {
          const hours = String(
            Math.floor((diff / (1000 * 60 * 60)) % 24)
          ).padStart(2, "0");
          const minutes = String(
            Math.floor((diff / (1000 * 60)) % 60)
          ).padStart(2, "0");
          const seconds = String(Math.floor((diff / 1000) % 60)).padStart(
            2,
            "0"
          );
          const days = String(
            Math.floor(diff / (1000 * 60 * 60 * 24))
          ).padStart(2, "0");
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft(null);
        }
      };
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [productDetails && productDetails.sale_ends_at]);

  const handleAddToCart = async () => {
    setLoadingStates((prev) => ({ ...prev, cart: true }));
    try {
      if (
        productDetails.variants &&
        productDetails.variants.length > 0 &&
        selectedVariant
      ) {
        const isValidVariant = productDetails.variants.some(
          (variant) => variant.id === selectedVariant.id
        );

        if (!isValidVariant) {
          toast.error("The selected variant does not belong to this product.");
          return;
        }
      }

      await addToCart(productId, quantity, selectedVariant?.id);
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setLoadingStates((prev) => ({ ...prev, cart: false }));
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!profile) {
      toast.error("Please log in to add items to your wishlist.");
    }

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

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      setZoomPosition(() => ({
        x: (x / width) * 100,
        y: (y / height) * 100,
        visible: true,
      }));
    } else {
      setZoomPosition((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setZoomPosition({ ...zoomPosition, visible: false });
  };

  const handleImageClick = () => {
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleVariantSelect = (variant) => {
    if (selectedVariant?.id === variant.id) {
      setSelectedVariant(null);
      setVariantImages([]);
      setMainImage(
        productDetails.primary_image_url
          ? `${productDetails.primary_image_url}`
          : productDetails.images?.[0]?.image_url || ""
      );
    } else {
      setSelectedVariant(variant);

      const relatedImages = productDetails.images.filter(
        (img) => img.product_variant_id === variant.id
      );

      if (relatedImages.length > 0) {
        setVariantImages(relatedImages);
        setMainImage(relatedImages[0].image_url);
      } else if (variant.image_url) {
        setVariantImages([]);
        setMainImage(variant.image_url);
      } else {
        setVariantImages([]);
        setMainImage(
          productDetails.primary_image_url
            ? `${productDetails.primary_image_url}`
            : productDetails.images?.[0]?.image_url || ""
        );
      }
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
    infinite: productDetails.images?.length > 1,
    slidesToShow:  Math.min(4, productDetails.images?.length || 1),
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: window.innerWidth >= 1024,
    beforeChange: (oldIndex, newIndex) => {
      setSliderIndex(newIndex);
      if (productDetails.images && productDetails.images[newIndex]) {
        setMainImage(productDetails.images[newIndex].image_url);
      }
    },
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title={productDetails.name}
        keywords={productDetails.keywords || ""}
        description={productDetails.description || ""}
        image={productDetails.images[0].image_url}
        url={`https://le-souk.vercel.app/products/${productId}/${encodeURIComponent(
          productDetails.name.replace(/\s+/g, "-")
        )}`}
      />
      <div className="flex flex-col items-start lg:flex-row gap-6 border-b border-gray-300 py-12">
        {/* Left Section - Product Image */}
        <div
          className={`lg:sticky lg:top-0 w-full lg:w-1/2 flex flex-col-reverse items-start lg:items-center ${
            language === "ar"
              ? "lg:flex-row-reverse gap-4"
              : "lg:flex-row-reverse gap-0"
          }`}
        >
          {/* Main Image with Magnifier */}
          <div className="relative w-full" style={{ maxWidth: 500 }}>
            <img
              ref={imageRef}
              src={mainImage}
              alt={productDetails.name}
              className="w-full h-[600px] lg:h-[500px] object-cover rounded cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
            />
            {zoomPosition.visible && (
              <div
                className="absolute w-50 h-50 border-2 border-gray-300 rounded pointer-events-none overflow-hidden"
                style={{
                  top: `calc(${zoomPosition.y}% - 64px)`,
                  left: `calc(${zoomPosition.x}% - 64px)`,
                  backgroundImage: `url(${mainImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `250%`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  zIndex: 10,
                }}
              />
            )}
          </div>

          {/* Thumbnails Slider */}
          <div
            className={`lg:order-2 focus:outline-none focus:border-none max-w-[85%] md:max-w-[70%] lg:max-w-[14%] overflow-hidden mr-2`}
          >
            {variantImages.length > 1 ? (
              <div
                className={`flex m-0 p-0 overflow-x-auto`}
                style={{ gap: 0 }}
              >
                {variantImages.map((img, idx) => (
                  <div key={img.id}>
                    <img
                      src={img.image_url}
                      alt={`thumb-${idx}`}
                      className={`object-cover rounded-md border cursor-pointer transition
                        ${
                          mainImage === img.image_url
                            ? "ring-1 ring-[#333e2c] border-[#333e2c]"
                            : "border-gray-300"
                        }`}
                      onClick={() => {
                        setMainImage(img.image_url);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : selectedVariant ? null : (
              <Slider {...sliderSettings}>
                {productDetails.images &&
                  productDetails.images.map((img, idx) => (
                    <div key={img.id} className={`flex m-0 p-0 overflow-x-auto`}
                style={{ gap: 0 }}>
                      <img
                        src={img.image_url}
                        alt={`thumb-${idx}`}
                        className={`w-16 h-16 object-cover rounded-md border cursor-pointer transition
                          ${
                            mainImage === img.image_url
                              ? "ring-1 ring-[#333e2c] border-[#333e2c]"
                              : "border-gray-300"
                          }`}
                        onClick={() => {
                          setMainImage(img.image_url);
                          setSliderIndex(idx);
                        }}
                      />
                    </div>
                  ))}
              </Slider>
            )}
          </div>
        </div>
        {/* Overlay Modal */}
        {isOverlayOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-5000">
            <div className="relative rounded-lg p-4 max-w-4xl w-full">
              <button
                className="absolute top-[-50px] right-1/2 -translate-x-1/2 text-gray-200 text-4xl cursor-pointer hover:text-gray-400 transition-all duration-200 p-1 hover:bg-gray-600"
                onClick={closeOverlay}
              >
                <X />
              </button>
              <div className="flex flex-col items-center">
                <img
                  src={mainImage}
                  alt={productDetails.name}
                  className="w-full h-[400px] md:h-[500px] object-contain rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Section - Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center mt-6 lg:mt-0">
          {/* Product Title */}
          <h1
            className="text-3xl sm:text-2xl font-bold mb-2"
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

          {/* Price */}
          <p
            className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-3"
            style={{ color: colors.primary }}
          >
            {selectedVariant ? (
              selectedVariant.sale_price &&
              selectedVariant.sale_price !== selectedVariant.price ? (
                <>
                  <span className="line-through text-gray-400 text-base font-normal">
                    {selectedVariant.price} {language === "ar" ? "د.ك" : "KWD"}
                  </span>
                  <span>
                    {selectedVariant.sale_price}{" "}
                    {language === "ar" ? "د.ك" : "KWD"}
                  </span>
                  {selectedVariant.discount_percentage && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                      {t("discount")}-{selectedVariant.discount_percentage}%
                    </span>
                  )}
                </>
              ) : (
                <span>
                  {selectedVariant.price} {language === "ar" ? "د.ك" : "KWD"}
                </span>
              )
            ) : productDetails.min_sale_price &&
              productDetails.min_sale_price !== productDetails.min_price ? (
              <>
                <span className="line-through text-gray-400 text-base font-normal">
                  {productDetails.min_price} {language === "ar" ? "د.ك" : "KWD"}
                </span>
                <span>
                  {productDetails.min_sale_price}{" "}
                  {language === "ar" ? "د.ك" : "KWD"}
                </span>
                {productDetails.discount_percentage && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                    {t("discount")}-{productDetails.discount_percentage}%
                  </span>
                )}
              </>
            ) : (
              <span>
                {productDetails.min_price} {language === "ar" ? "د.ك" : "KWD"}
              </span>
            )}
          </p>

          {/* offer duration */}
          {productDetails &&
            productDetails.sale_starts_at &&
            productDetails.sale_ends_at &&
            timeLeft &&
            productDetails.min_sale_price && (
              <div className="mb-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="bg-gray-100 text-gray-800 font-bold px-3 py-2 rounded text-lg">
                    {timeLeft.days}
                  </span>
                  <span className="text-xl font-bold">:</span>
                  <span className="bg-gray-100 text-gray-800 font-bold px-3 py-2 rounded text-lg">
                    {timeLeft.hours}
                  </span>
                  <span className="text-xl font-bold">:</span>
                  <span className="bg-gray-100 text-gray-800 font-bold px-3 py-2 rounded text-lg">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-xl font-bold">:</span>
                  <span className="bg-gray-100 text-gray-800 font-bold px-3 py-2 rounded text-lg">
                    {timeLeft.seconds}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {language === "ar"
                    ? "متبقي حتى نهاية العرض"
                    : "Remains until the end of the offer"}
                </span>
              </div>
            )}

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            {productDetails.description}
          </p>

          {/* Categories and Stock */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 flex-wrap gap-2">
            <span
              className="font-medium text-sm sm:text-base"
              style={{ color: colors.productTitle }}
            >
              {t("category")}:
            </span>
            {productDetails.categories &&
            productDetails.categories.length > 0 ? (
              productDetails.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm"
                  style={{ color: colors.productName }}
                >
                  {cat.name}
                </span>
              ))
            ) : (
              <span
                className="ml-2 text-sm"
                style={{ color: colors.productName }}
              >
                {t("noCategory")}
              </span>
            )}
            {/* <span
              className="font-medium text-sm sm:text-base mt-2 sm:mt-0 sm:ml-4"
              style={{ color: colors.productTitle }}
            >
              {t("inStock")}:
            </span>
            <span
              className="ml-2 text-sm"
              style={{ color: colors.productName }}
            >
              {productDetails.total_stock}
            </span> */}
          </div>

          {/* Variants */}
          {productDetails.variants && productDetails.variants.length > 0 && (
            <div className="mb-4">
              <span
                className="font-medium text-sm sm:text-base mb-2 block"
                style={{ color: colors.productTitle }}
              >
                {t("variants")}:
              </span>
              {/* خيارات القطع أو المقاسات */}
              <div className="flex flex-wrap gap-2 mb-4">
                {productDetails.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleVariantSelect(variant)}
                      className={`px-4 py-2 rounded-md border font-medium transition flex items-center gap-2
              ${
                isSelected
                  ? "border-[#333e2c] bg-blue-50"
                  : "border-gray-200 bg-white"
              }
              ${
                variant.stock <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-[#333e2c] hover:bg-blue-100"
              }
              focus:outline-none cursor-pointer`}
                      disabled={variant.stock <= 0}
                    >
                      {isSelected ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                      {variant.color != "undefined" ? (
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: variant?.color }}
                        ></span>
                      ) : (
                        ""
                      )}
                      <span className="font-semibold capitalize">
                        {variant?.size}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* تفاصيل المتغير المختار */}
              {selectedVariant && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <div className="flex flex-col gap-2 text-gray-800">
                    {/* Size or pcs */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">
                        {t("Size")}:
                      </span>
                      <span className="font-semibold">
                        {selectedVariant.size || selectedVariant.pcs}
                      </span>
                    </div>
                    {/* Color */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">
                        {t("Color")}:
                      </span>
                      <span className="font-semibold capitalize">
                        {selectedVariant.color}
                      </span>
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: selectedVariant.color }}
                      ></span>
                    </div>
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">
                        {t("Price")}:
                      </span>
                      {selectedVariant.sale_price &&
                      selectedVariant.sale_price !== selectedVariant.price ? (
                        <>
                          <span className="line-through text-gray-400 text-sm font-normal">
                            {selectedVariant.price}{" "}
                            {language === "ar" ? "د.ك" : "KWD"}
                          </span>
                          <span
                            className="text-base font-semibold"
                            style={{ color: colors.primary }}
                          >
                            {selectedVariant.sale_price}{" "}
                            {language === "ar" ? "د.ك" : "KWD"}
                          </span>
                          {selectedVariant.discount_percentage && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                              {t("discount")}-
                              {selectedVariant.discount_percentage}%
                            </span>
                          )}
                        </>
                      ) : (
                        <span
                          className="text-base font-semibold"
                          style={{ color: colors.primary }}
                        >
                          {selectedVariant.price}{" "}
                          {language === "ar" ? "د.ك" : "KWD"}
                        </span>
                      )}
                    </div>
                    {/* Stock */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">
                        {t("Stock")}:
                      </span>
                      <span
                        className={`font-semibold flex items-center gap-1 px-2 py-1 rounded-md ${
                          selectedVariant.stock > 0
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {selectedVariant.stock > 0 ? `` : t("Out of stock")}
                        {selectedVariant.stock > 0 && (
                          <span className="text-green-700 font-medium text-xs sm:text-base">
                            {t("available")}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span
              className="font-medium mr-4"
              style={{ color: colors.productTitle }}
            >
              {t("quantity")}:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                disabled={quantity <= 1}
                className="px-2 border disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                style={{ borderColor: colors.borderLight }}
              >
                -
              </button>

              <input
                type="number"
                min="1"
                max={productDetails.total_stock}
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    return;
                  }
                  const parsedValue = parseInt(value);
                  if (isNaN(parsedValue)) {
                    return;
                  }
                  setQuantity(
                    Math.min(
                      productDetails.total_stock,
                      Math.max(1, parsedValue)
                    )
                  );
                }}
                className="w-16 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#333e2c] transition-all duration-200 text-center"
                style={{ borderColor: colors.borderLight }}
              />

              <button
                onClick={() => {
                  if (quantity < productDetails.total_stock) {
                    setQuantity(quantity + 1);
                  }
                }}
                disabled={quantity >= productDetails.total_stock}
                className="px-2 border disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                style={{ borderColor: colors.borderLight }}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
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

            {/* <button
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

      <PackagesSlider product_id={productId} language={language} />
      <RelatedProducts
        productId={productId}
        language={language}
        category={productDetails.categories}
      />
      {/* <Reviews
        reviews={productDetails.reviews || []}
        productId={productId}
        fetchProductDetails={fetchProductDetails}
      /> */}
    </div>
  );
};

export default ProductId;
