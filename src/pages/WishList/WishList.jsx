import { ChevronRight, Heart, House, ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useWishlistCRUD from "../../hooks/WishList/useWishlist";
import useCartCRUD from "../../hooks/Cart/UseCart";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import Meta from "../../components/Meta/Meta";

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const WishList = () => {
  const {
    wishlistItems,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
    success: wishlistSuccess,
  } = useWishlistCRUD();
  const { addToCart } = useCartCRUD();
  const [loadingStates, setLoadingStates] = useState({
    remove: {},
    addToCart: {},
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (wishlistSuccess) {
      toast.success(wishlistSuccess);
    }
  }, [wishlistSuccess]);

  const handleRemove = async (productId) => {
    setLoadingStates((prev) => ({
      ...prev,
      remove: { ...prev.remove, [productId]: true },
    }));

    try {
      await removeFromWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove item from wishlist.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        remove: { ...prev.remove, [productId]: false },
      }));
    }
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

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <div
        className="bg-gray-200 p-10 mb-10"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
      <Meta
        title="My Wishlist"
        description="View and manage your wishlist items."
      />
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className="text-2xl font-bold uppercase"
            style={{ color: colors.productTitle }}
          >
            {t("myWishlist")}
          </h1>
          <div className="flex items-center text-gray-600 gap-1">
            <House
              onClick={() => navigate("/")}
              size={20}
              className="cursor-pointer"
            />
            <ChevronRight size={20} />
            <span className="text-[17px]">{t("wishlist")}</span>
          </div>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto p-6"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart
              size={64}
              className="mb-4"
              style={{ color: colors.productName, opacity: 0.3 }}
            />
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.productTitle }}
            >
              {t("yourWishlistIsEmpty")}
            </h2>
            <p
              className="text-sm mb-6 max-w-md"
              style={{ color: colors.productName }}
            >
              {t("emptyWishlistDescription")}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="py-3 px-6 rounded-md customEffect cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              <span>{t("continueShopping")}</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="border-b-1 border-gray-300">
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 bg-red-500 mb-5  text-white rounded-md customEffect cursor-pointer"
              >
                <span>{t("clearWishlist")}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-5">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                {wishlistItems.map((item) => {
                  const isRemoving = loadingStates.remove[item.product.id] || false;

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 border-b pb-6"
                      style={{ borderColor: colors.borderLight }}
                    >
                      <img
                        src={item.product.primary_image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1">
                        <h2
                          className="font-semibold"
                          style={{ color: colors.productName }}
                        >
                          {item.product.name}
                        </h2>
                        <p
                          className="text-sm uppercase"
                          style={{ color: colors.productName }}
                        >
                          {t("itemNo")} {item.product.id}
                        </p>
                        <p
                          className="text-sm uppercase"
                          style={{ color: colors.productName }}
                        >
                          {t("size")} OS
                        </p>
                        <p
                          className="text-sm uppercase"
                          style={{ color: colors.productName }}
                        >
                          {t("color")} Unknown
                        </p>
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <p
                          className="text-lg font-semibold"
                          style={{ color: colors.primary }}
                        >
                          {Number(item.product.min_price)} {language === "ar" ? "د.ك" : "KWD"}
                        </p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAddToCart(item.product.id, 1)}
                            disabled={loadingStates.addToCart[item.product.id]}
                            className={` text-white font-bold py-2 px-4 rounded cursor-pointer customEffect mt-2 ${
                              loadingStates.addToCart[item.product.id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            style={{ backgroundColor: colors.primary }}
                          >
                            <span>
                              {loadingStates.addToCart[item.product.id] ? (
                                t("addingToCart")
                              ) : (
                                <ShoppingCart size={18} />
                              )}
                            </span>
                          </button>
                          <button
                            onClick={() => handleRemove(item.product.id)}
                            disabled={isRemoving}
                            className={`bg-[#d01e1e] text-white font-bold py-2 px-4 rounded cursor-pointer customEffect ${
                              isRemoving ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <span>
                              {isRemoving ? (
                                t("removing")
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default WishList;
