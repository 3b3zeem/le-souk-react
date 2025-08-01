import React, { useEffect, useState } from "react";
import useCartCRUD from "../../hooks/Cart/UseCart";
import toast from "react-hot-toast";
import { ChevronRight, House, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import { useOrder } from "../../hooks/Order/useOrder";
import { useAuthContext } from "../../context/Auth/AuthContext";
import Meta from "../../components/Meta/Meta";
import Loader from "../../layouts/Loader";

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    fetchCart,
    setCartQuantity,
    clearCart,
    validateCoupon,
    finalTotal,
    couponData,
    discount,
    couponValue,
    subtotal,
    loading,
    error,
    success,
  } = useCartCRUD();
  const [loadingStates, setLoadingStates] = useState({
    remove: {},
    quantity: {},
  });
  const [coupon, setCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const { token, profile } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  }, [error, success]);

  const handleRemove = async (productId) => {
    setLoadingStates((prev) => ({
      ...prev,
      remove: { ...prev.remove, [productId]: true },
    }));

    try {
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item from cart.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        remove: { ...prev.remove, [productId]: false },
      }));
    }
  };

  const handleQuantityChange = async (productId, type, currentQuantity) => {
    const newQuantity =
      type === "inc" ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;

    setLoadingStates((prev) => ({
      ...prev,
      quantity: { ...prev.quantity, [productId]: true },
    }));

    try {
      await setCartQuantity(productId, newQuantity);
      await fetchCart();

      if (type === "inc") {
        toast.success("Quantity increased successfully!");
      } else if (type === "dec") {
        toast.success("Quantity decreased successfully!");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        quantity: { ...prev.quantity, [productId]: false },
      }));
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    try {
      if (profile.user.is_admin === false) {
        await validateCoupon(coupon);
      } else {
        toast.error("Not allowed for the admin!");
      }
      setCoupon("");
    } catch (err) {
      toast.error(err);
    }
    setCouponLoading(false);
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div
        className="bg-gray-200 p-10 mb-10"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <Meta
          title="My Shopping Bag"
          description="View and manage your shopping cart items."
        />
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className="text-2xl font-bold uppercase"
            style={{ color: colors.productTitle }}
          >
            {t("myShoppingBag")}
          </h1>
          <div className="flex items-center text-gray-600 gap-1">
            <House
              onClick={() => navigate("/")}
              size={20}
              className="cursor-pointer"
            />
            <ChevronRight size={20} />
            <span className="text-[17px]">{t("cart")}</span>
          </div>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto p-6"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart
              size={64}
              className="mb-4"
              style={{ color: colors.productName, opacity: 0.3 }}
            />
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.productTitle }}
            >
              {t("yourCartIsEmpty")}
            </h2>
            <p
              className="text-sm mb-6 max-w-md"
              style={{ color: colors.productName }}
            >
              {t("emptyCartDescription")}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="py-3 px-6 rounded-md customEffect cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              <span>{t("startShopping")}</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="border-b-1 border-gray-300">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 mb-5 text-white rounded-md customEffect cursor-pointer"
              >
                <span>{t("clearCart")}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => {
                  const isRemoving = loadingStates.remove[item.id] || false;
                  const isUpdatingQuantity =
                    loadingStates.quantity[item.id] || false;

                  return (
                    <div
                      key={item.id}
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
                        {item.variant ? (
                          <div
                            className="text-sm uppercase"
                            style={{ color: colors.productName }}
                          >
                            <p>
                              {t("size")} {item.variant.size || "N/A"}
                            </p>
                            <p>
                              {t("color")} {item.variant.color || "غير محدد"}
                            </p>
                            <p>
                              {t("sku")}: {item.variant.sku || "N/A"}
                            </p>
                            <p>
                              {t("unitPrice")}:{" "}
                              {(item.unit_price / 100).toFixed(2)}{" "}
                              {language === "ar" ? "د.ك" : "KWD"}
                            </p>
                          </div>
                        ) : (
                          <p
                            className="text-sm uppercase"
                            style={{ color: colors.productName }}
                          >
                            {t("noVariant")}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                "dec",
                                item.quantity
                              )
                            }
                            disabled={
                              isRemoving ||
                              isUpdatingQuantity ||
                              item.quantity <= 1
                            }
                            className="px-2 border disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                            style={{ borderColor: colors.borderLight }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                "inc",
                                item.quantity
                              )
                            }
                            disabled={isRemoving || isUpdatingQuantity}
                            className="px-2 border disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                            style={{ borderColor: colors.borderLight }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <p
                          className="text-lg font-semibold"
                          style={{ color: colors.primary }}
                        >
                          {item.total} {language === "ar" ? "د.ك" : "KWD"}
                        </p>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isRemoving || isUpdatingQuantity}
                          className={`bg-[#d01e1e] text-white font-bold py-2 px-4 rounded cursor-pointer customEffect ${
                            isRemoving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <span>
                            {isRemoving ? t("removing") : <Trash2 size={18} />}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Section */}
              <div
                className="border p-6 space-y-6 h-fit"
                style={{ borderColor: colors.borderLight }}
              >
                <h2
                  className="text-lg font-bold border-b pb-4 uppercase"
                  style={{
                    borderColor: colors.lineBg,
                    color: colors.productTitle,
                  }}
                >
                  {t("summary")}
                </h2>

                <div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.productName }}
                  >
                    {t("promoCodePrompt")}
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder={t("enterCode")}
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="border border-gray-300 p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#333e2c] transition duration-200"
                    />
                    <button
                      className="px-4 uppercase customEffect cursor-pointer"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.lightText,
                      }}
                      disabled={couponLoading || !coupon}
                      onClick={handleApplyCoupon}
                    >
                      <span>{couponLoading ? t("loading") : t("apply")}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <p style={{ color: colors.productName }}>{t("subtotal")}</p>
                  <p style={{ color: colors.productName }}>
                    {subtotal} {language === "ar" ? "د.ك" : "KWD"}
                  </p>
                </div>

                {couponData && (
                  <>
                    <div
                      className="border-t pt-4 flex justify-between font-semibold"
                      style={{ borderColor: colors.lineBg }}
                    >
                      <p style={{ color: colors.productTitle }}>
                        {language === "ar"
                          ? "نسبة الخصم"
                          : "Discount Percentage"}
                      </p>
                      <p style={{ color: colors.productTitle }}>
                        {couponValue}
                      </p>
                    </div>
                    <div
                      className="border-t pt-4 flex justify-between font-semibold"
                      style={{ borderColor: colors.lineBg }}
                    >
                      <p style={{ color: colors.productTitle }}>
                        {language === "ar" ? "قيمة الخصم" : "Discount amount"}
                      </p>
                      <p style={{ color: colors.productTitle }}>
                        {discount} {language === "ar" ? "د.ك" : "KWD"}
                      </p>
                    </div>
                  </>
                )}

                <div
                  className="border-t pt-4 flex justify-between font-semibold"
                  style={{ borderColor: colors.lineBg }}
                >
                  <p style={{ color: colors.productTitle }}>
                    {t("estimatedTotal")}
                  </p>
                  <p style={{ color: colors.productTitle }}>
                    {finalTotal ? finalTotal : subtotal}{" "}
                    {language === "ar" ? "د.ك" : "KWD"}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/checkOut")}
                  className={`w-full py-3 mt-4 customEffect cursor-pointer $`}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.lightText,
                  }}
                >
                  <span className="uppercase">{t("checkout")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Cart;
