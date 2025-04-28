import React, { useEffect, useState } from "react";
import { Edit2, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import useUserProfile from "../../hooks/Profile/useProfile";
import { useOrder } from "../../hooks/Order/useOrder";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/Language/LanguageContext";
import LanguageDropdown from "../../components/Language/LanguageDropdown";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/Auth/AuthContext";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Profile = () => {
  const { userData, loading, error, updateUserProfile } = useUserProfile();
  const { fetchOrders, cancelOrder } = useOrder();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
  });
  const [updateError, setUpdateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        toast.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    setCancelLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await cancelOrder(orderId);
      const updatedOrders = await fetchOrders();
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
    } catch (err) {
      toast.error(err);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // * Open overlay Edit
  const openOverlay = () => {
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      image: null,
    });
    setIsOverlayOpen(true);
  };

  // * Close overlay Edit
  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setUpdateError(null);
  };

  // * Edit Functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await updateUserProfile(formData);
    setIsSubmitting(false);
    if (result.success) {
      closeOverlay();
    } else {
      setUpdateError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-semibold"
            style={{ color: colors.productTitle }}
          >
            {t("profileSettings")}
          </h1>
          <button
            onClick={openOverlay}
            className="flex items-center transition-colors cursor-pointer px-4 py-2 rounded customEffect"
            style={{ color: colors.lightText, backgroundColor: colors.primary }}
          >
            <span className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 mr-1" />
              {t("editProfile")}
            </span>
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex justify-center items-center mb-3">
            <div className="relative w-40 h-40 border-4 border-gray-300 rounded-full p-2">
              <img
                src={
                  userData?.image ||
                  "https://ecommerce.ershaad.net/storage/images/default/customer.png"
                }
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.productTitle }}
            >
              {t("name")}
            </label>
            <div
              className="w-full p-3 rounded-md"
              style={{
                backgroundColor: colors.borderLight,
                color: colors.productName,
              }}
            >
              {userData?.name || "Not provided"}
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.productTitle }}
            >
              {t("emailAddress")}
            </label>
            <div
              className="w-full p-3 rounded-md"
              style={{
                backgroundColor: colors.borderLight,
                color: colors.productName,
              }}
            >
              {userData?.email || "Not provided"}
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.productTitle }}
            >
              {t("phone")}
            </label>
            <div
              className="w-full p-3 rounded-md"
              style={{
                backgroundColor: colors.borderLight,
                color: colors.productName,
              }}
            >
              {userData?.phone || "Not provided"}
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.productTitle }}
            >
              {t("address")}
            </label>
            <div
              className="w-full p-3 rounded-md"
              style={{
                backgroundColor: colors.borderLight,
                color: colors.productName,
              }}
            >
              {userData?.address || "Not provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg w-full max-w-lg relative"
            >
              <button
                onClick={closeOverlay}
                className={`absolute p-1 top-4 ${language === "ar" ? "left-4" : "right-4"} text-gray-600 hover:bg-gray-200 transition-all duration-200 cursor-pointer`}
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.productTitle }}
              >
                {t("editProfile")}
              </h2>
              {updateError && (
                <p className="text-red-500 mb-4">{updateError}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.productTitle }}
                  >
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border"
                    style={{
                      borderColor: colors.borderLight,
                      color: colors.productName,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.productTitle }}
                  >
                    {t("emailAddress")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border"
                    style={{
                      borderColor: colors.borderLight,
                      color: colors.productName,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.productTitle }}
                  >
                    {t("phone")}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={11}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full p-3 rounded-md border"
                    style={{
                      borderColor: colors.borderLight,
                      color: colors.productName,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.productTitle }}
                  >
                    {t("address")}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border"
                    style={{
                      borderColor: colors.borderLight,
                      color: colors.productName,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.productTitle }}
                  >
                    {t("profileImage")}
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="w-full p-3 rounded-md border"
                    style={{
                      borderColor: colors.borderLight,
                      color: colors.productName,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-md text-white customEffect cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.primary,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{isSubmitting ? t("saving") : t("saveChanges")}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full bg-white p-8 shadow-md border-t border-gray-200">
        <div className="flex justify-start items-start mb-6 gap-5">
          <h1
            className="text-2xl font-semibold"
            style={{ color: colors.productTitle }}
          >
            {t("changeLanguage")}:
          </h1>
          <LanguageDropdown />
        </div>
      </div>

      <div className="w-full mx-auto bg-white p-8 shadow-md mt-6 border-t border-gray-200">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: colors.productTitle }}
        >
          {t("myOrders")}
        </h2>
        {ordersLoading ? (
          <div className="text-center py-6">
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600">{t("noOrdersFound")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.borderLight }}>
                  <th
                    className="py-3 px-4 font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {t("orderId")}
                  </th>
                  <th
                    className="py-3 px-4 font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {t("status")}
                  </th>
                  <th
                    className="py-3 px-4 font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {t("totalPrice")}
                  </th>
                  <th
                    className="py-3 px-4 font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {t("createdAt")}
                  </th>
                  <th
                    className="py-3 px-4 font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {t("items")}
                  </th>
                  <th
                    className="py-3 px-4 font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                    style={{ borderColor: colors.borderLight }}
                  >
                    <td className="py-3 px-4" style={{ color: colors.productName }}>
                      {order.id}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.productName }}>
                      {order.status}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.productName }}>
                      {order.total_price} {language === "ar" ? "ج.م" : "LE"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.productName }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.productName }}>
                      <ul className="list-decimal list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product.name} ( x{item.quantity} )
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4">
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancelLoading[order.id]}
                          className={`py-2 px-4 rounded customEffect text-white cursor-pointer ${
                            cancelLoading[order.id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          style={{
                            backgroundColor: "#d01e1e",
                          }}
                        >
                          {cancelLoading[order.id] ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("cancelling")}
                            </span>
                          ) : (
                            <span>{t("cancelOrder")}</span>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
