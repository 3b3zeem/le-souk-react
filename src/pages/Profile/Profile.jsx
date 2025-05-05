import React, { useRef, useState } from "react";
import { Edit2, Eye, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import useUserProfile from "../../hooks/Profile/useProfile";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/Language/LanguageContext";
import LanguageDropdown from "../../components/Language/LanguageDropdown";
import { useTranslation } from "react-i18next";
import Order from "./Order/Order";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const { language } = useLanguage();
  const { t } = useTranslation();

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
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleClickBox = () => {
    fileInputRef.current.click();
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
                className={`absolute p-1 top-4 ${
                  language === "ar" ? "left-4" : "right-4"
                } text-gray-600 hover:bg-gray-200 transition-all duration-200 cursor-pointer`}
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.productTitle }}
                  >
                    {t("userImage")}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <div
                    onClick={handleClickBox}
                    className="w-30 h-30 border border-dashed flex items-center justify-center rounded-full cursor-pointer"
                    style={{
                      borderColor: colors.borderLight,
                      color: colors.productName,
                      overflow: "hidden",
                    }}
                  >
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={t("imagePreview")}
                        className="w-full h-full object-cover"
                      />
                    ) : userData?.image ? (
                      <img
                        src={userData.image}
                        alt={t("userImageAlt")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{t("clickToChooseImage")}</span>
                    )}
                  </div>
                </div>
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

      <Order />
    </div>
  );
};

export default Profile;
