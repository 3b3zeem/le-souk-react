import React, { useEffect, useRef, useState } from "react";
import { Edit2, Eye, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import useUserProfile from "../../hooks/Profile/useProfile";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/Language/LanguageContext";
import LanguageDropdown from "../../components/Language/LanguageDropdown";
import { useTranslation } from "react-i18next";
import Order from "./Order/Order";
import Meta from "../../components/Meta/Meta";
import useAuth from "../../hooks/Auth/useAuth";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import toast from "react-hot-toast";
import Loader from "./../../layouts/Loader";
import useAddresses from "../../hooks/Addresses/useAddresses";
import AddressModal from "../CheckOut/AddressModal";
import useCountries from "../../hooks/Country/useCountries";

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Profile = () => {
  const { userData, loading, error, updateUserProfile, verifyEmail } =
    useUserProfile();
  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses();
  const { countries, loading: countryLoading } = useCountries();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
  });
  const [addressForm, setAddressForm] = useState({
    name: "",
    type: "both",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "EG",
    phone: "",
    is_default_shipping: false,
    is_default_billing: false,
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const [updateError, setUpdateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { forgotPassword } = useAuth();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [verification, setVerification] = useState("");
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email.");
      return;
    }

    const result = await forgotPassword(forgotEmail);

    console.log(result);

    if (result) {
      toast.success(result.message || "Reset link sent to your email.", {
        duration: 1500,
        position: "top-right",
      });
      setShowForgotModal(false);
      setForgotEmail("");
    } else {
      toast.error(error || "Failed to send reset link.", {
        duration: 1500,
        position: "top-right",
      });
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!verification) {
      toast.error("Please enter your email.");
      return;
    }

    const result = await verifyEmail(verification);

    if (result) {
      toast.success(result.message || "Reset link sent to your email.", {
        duration: 1500,
        position: "top-right",
      });
      setShowVerifyModal(false);
      setVerification("");
    } else {
      toast.error(error || "Failed to send reset link.", {
        duration: 1500,
        position: "top-right",
      });
    }
  };

  const openAddAddress = () => {
    setIsEditing(false);
    setEditingId(null);
    setAddressForm({
      name: "",
      type: "both",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "EG",
      phone: "",
      is_default_shipping: false,
      is_default_billing: false,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (address) => {
    setIsEditing(true);
    setEditingId(address.id);
    setAddressForm({
      name: address.name || "",
      type: address.type || "both",
      address_line_1: address.address_line_1 || "",
      address_line_2: address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "EG",
      phone: address.phone || "",
      is_default_shipping: !!address.is_default_shipping,
      is_default_billing: !!address.is_default_billing,
    });
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.message || t("failedToDeleteAddress")
      );
    }
  };

  const handleSaveAddress = async () => {
    try {
      setSavingAddress(true);
      const payload = { ...addressForm };
      if (isEditing && editingId) {
        await updateAddress(editingId, payload);
      } else {
        await addAddress(payload);
      }
      setIsAddressModalOpen(false);
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.message || t("failedToSaveAddress")
      );
    } finally {
      setSavingAddress(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) return <Loader />;

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="My Profile"
        description="View and manage your profile settings."
      />
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
                src={userData?.image}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user.png";
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          {/* Email Verified */}
          <div>
            <div className="flex justify-between items-center">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.productTitle }}
              >
                {t("email_Verify")}
              </label>
              {userData?.email_verification_status === "Not Verified" && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="block text-md font-bold mb-1 cursor-pointer hover:underline"
                  style={{ color: colors.productTitle }}
                >
                  {t("Verify")}
                </button>
              )}
            </div>
            <div
              className="w-full p-3 rounded-md"
              style={{
                backgroundColor: colors.borderLight,
                color: colors.productName,
              }}
            >
              {userData?.email_verification_status || "Not provided"}
            </div>
          </div>

          {/* Addresses */}
          <div
            className="p-4 rounded-lg border shadow-sm"
            style={{ backgroundColor: colors.bg }}
          >
            <div className="flex items-center justify-between mb-4">
              <label
                className="text-lg font-semibold"
                style={{ color: colors.productTitle }}
              >
                {t("addresses")}
              </label>

              <button
                onClick={openAddAddress}
                className="block text-md font-bold mb-1 cursor-pointer hover:underline"
                style={{ color: colors.productTitle }}
              >
                {addresses.length === 0
                  ? t("addYourFirstAddress")
                  : t("addNewAddress")}
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-lg border flex justify-between items-start  gap-2 shadow-sm hover:shadow-md transition"
                  style={{
                    backgroundColor: colors.borderLight,
                    color: colors.productName,
                  }}
                >
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-sm">{addr.formatted}</p>

                    {addr.is_default_shipping && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        {addr.is_default_shipping && t("defaultShipping")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center flex-col">
                    <button
                      onClick={() => openEditAddress(addr)}
                      className="text-[#333e2c] hover:underline cursor-pointer transition-all duration-300"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-600 hover:underline cursor-pointer transition-all duration-300"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              ))}

              {addresses.length === 0 && (
                <p className="text-gray-500 text-sm italic text-center">
                  {language === "ar" ? "إضافة عنوان جديد" : "Add new address"}
                </p>
              )}
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
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-500"
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/user.png";
                        }}
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

      {/* Forget Password */}
      <div className="w-full bg-white p-8 shadow-md border-t border-gray-200 my-5">
        <button
          type="button"
          onClick={() => setShowForgotModal(true)}
          className="text-2xl font-semibold hover:text-gray-600 transition duration-200 hover:underline cursor-pointer"
          style={{ color: colors.productTitle }}
        >
          {language === "ar" ? "هل نسيت كلمة المرور؟" : "Forget Password?"}
        </button>

        <AnimatePresence>
          {showForgotModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] h-[100vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
              >
                <h3 className="text-xl font-semibold mb-4 text-center text-[#333e2c]">
                  {language === "ar"
                    ? "ادخل الاميل الالكتروني الخاص بك"
                    : "Enter your email"}
                </h3>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#333e2c]"
                  placeholder="Enter your email"
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition cursor-pointer"
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className={`px-4 py-2 bg-[#333e2c] text-white rounded-md hover:bg-[#2b3425] transition ${
                      loading
                        ? "cursor-not-allowed opacity-35"
                        : "cursor-pointer"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <DotSpinner size="20" speed="0.9" color="#fff" />
                    ) : language === "ar" ? (
                      "إرسال الإيميل"
                    ) : (
                      "Send Email"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verify Email */}
      {userData?.email_verification_status === "Not Verified" && (
        <div className="w-full bg-white p-8 shadow-md border-t border-gray-200 my-5">
          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className="text-2xl font-semibold hover:text-gray-600 transition duration-200 hover:underline cursor-pointer"
            style={{ color: colors.productTitle }}
          >
            {language === "ar"
              ? "التحقق من بريدك الإلكتروني؟"
              : "Verify Your Email?"}
          </button>

          <AnimatePresence>
            {showVerifyModal && (
              <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] h-[100vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
                >
                  <h3 className="text-xl font-semibold mb-4 text-center text-[#333e2c]">
                    {language === "ar"
                      ? "ادخل الاميل الالكتروني الخاص بك"
                      : "Enter your email"}
                  </h3>
                  <input
                    type="email"
                    value={verification}
                    onChange={(e) => setVerification(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#333e2c]"
                    placeholder="Enter your email"
                  />
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowVerifyModal(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition cursor-pointer"
                    >
                      {language === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      className={`px-4 py-2 bg-[#333e2c] text-white rounded-md hover:bg-[#2b3425] transition ${
                        loading
                          ? "cursor-not-allowed opacity-35"
                          : "cursor-pointer"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <DotSpinner size="20" speed="0.9" color="#fff" />
                      ) : language === "ar" ? (
                        "إرسال الإيميل"
                      ) : (
                        "Send Email"
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Add Address */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        isEditing={isEditing}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        onSave={handleSaveAddress}
        savingAddress={savingAddress}
        countries={countries}
        countryLoading={countryLoading}
      />

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
