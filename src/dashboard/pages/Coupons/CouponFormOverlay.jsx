import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronDown, X } from "lucide-react";

import { ring } from "ldrs";
ring.register();

const CouponFormOverlay = ({
  isOpen,
  onClose,
  couponData: initialCouponData,
  onSuccess,
  isEdit = false,
  couponId,
  addCoupon,
  updateCoupon,
  fetchCoupons,
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [loadingButton, setLoadingButton] = useState(null);
  const [couponData, setCouponData] = useState({
    code: "",
    status: "active",
    type: "percentage",
    value: "",
    minimum_spend: "",
    maximum_discount: "",
    usage_limit: "",
    user_usage_limit: "",
    starts_at: "",
    expires_at: "",
    en_name: "",
    en_description: "",
    ar_name: "",
    ar_description: "",
  });

  const resetCouponData = () => {
    setCouponData({
      code: "",
      status: "active",
      type: "percentage",
      value: "",
      minimum_spend: "",
      maximum_discount: "",
      usage_limit: "",
      user_usage_limit: "",
      starts_at: "",
      expires_at: "",
      en_name: "",
      en_description: "",
      ar_name: "",
      ar_description: "",
    });
  };

  useEffect(() => {
    if (isEdit && initialCouponData) {
      setCouponData({
        code: initialCouponData.code || "",
        status: initialCouponData.status || "active",
        type: initialCouponData.type || "percentage",
        value: initialCouponData.value || "",
        minimum_spend: initialCouponData.minimum_spend || "",
        maximum_discount: initialCouponData.maximum_discount || "",
        usage_limit: initialCouponData.usage_limit || "",
        user_usage_limit: initialCouponData.user_usage_limit || "",
        starts_at: initialCouponData.starts_at
          ? initialCouponData.starts_at.slice(0, 16)
          : "",
        expires_at: initialCouponData.expires_at
          ? initialCouponData.expires_at.slice(0, 16)
          : "",
        en_name:
          initialCouponData.translations?.find((t) => t.locale === "en")
            ?.name || "",
        en_description:
          initialCouponData.translations?.find((t) => t.locale === "en")
            ?.description || "",
        ar_name:
          initialCouponData.translations?.find((t) => t.locale === "ar")
            ?.name || "",
        ar_description:
          initialCouponData.translations?.find((t) => t.locale === "ar")
            ?.description || "",
      });
    } else {
      resetCouponData();
    }

    return () => {
      if (!isOpen) {
        resetCouponData();
      }
    };
  }, [isEdit, initialCouponData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingButton("submit");
    try {
      const formData = new FormData();
      Object.entries(couponData).forEach(([key, value]) => {
        if (value !== "") {
          if (key === "en_name") formData.append("en[name]", value);
          else if (key === "en_description")
            formData.append("en[description]", value);
          else if (key === "ar_name") formData.append("ar[name]", value);
          else if (key === "ar_description")
            formData.append("ar[description]", value);
          else formData.append(key, value);
        }
      });

      if (isEdit) {
        await updateCoupon(couponId, formData);
        await fetchCoupons();
      } else {
        await addCoupon(formData);
        await fetchCoupons();
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.message || "Failed to save coupon";
      const errors = err.response?.data?.errors;

      if (errors) {
        const errorList = Object.values(errors).flat().join("\n");
        toast.error(errorList);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoadingButton(null);
    }
  };

  const handleCancel = () => {
    setLoadingButton("cancel");
    setTimeout(() => {
      setLoadingButton(null);
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-500 p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between  mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {t(isEdit ? "edit_coupon" : "add_coupon")}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer hover:bg-gray-100 transition-all duration-200 p-2 rounded-full"
                onClick={onClose}
              >
                <X />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Coupon Code */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("code")}
                </label>
                <input
                  type="text"
                  name="code"
                  value={couponData.code}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                  required
                />
              </div>

              {/* Status */}
              <div className="col-span-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("status")}
                </label>
                <select
                  name="status"
                  value={couponData.status}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 appearance-none pr-10 transition-all duration-200 hover:border-gray-400 bg-white focus:outline-none"
                >
                  <option value="active">{t("active")}</option>
                  <option value="inactive">{t("inactive")}</option>
                </select>
                <div className="absolute top-11 right-3 pointer-events-none text-gray-500">
                  <ChevronDown />
                </div>
              </div>

              {/* Type */}
              <div className="col-span-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("type")}
                </label>
                <select
                  name="type"
                  value={couponData.type}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 appearance-none pr-10 transition-all duration-200 hover:border-gray-400 bg-white focus:outline-none"
                >
                  <option value="percentage">{t("percentage")}</option>
                  <option value="fixed_amount">{t("fixed_amount")}</option>
                </select>
                <div className="absolute top-11 right-3 pointer-events-none text-gray-500">
                  <ChevronDown />
                </div>
              </div>

              {/* Value */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("value")}
                </label>
                <input
                  type="text"
                  name="value"
                  value={couponData.value}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                  required
                />
              </div>

              {/* Minimum Spend */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("minimum_spend")}
                </label>
                <input
                  type="text"
                  name="minimum_spend"
                  value={couponData.minimum_spend}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                />
              </div>

              {/* Maximum Discount */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("maximum_discount")}
                </label>
                <input
                  type="text"
                  name="maximum_discount"
                  value={couponData.maximum_discount}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                />
              </div>

              {/* Usage Limit */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("usage_limit")}
                </label>
                <input
                  type="text"
                  name="usage_limit"
                  value={couponData.usage_limit}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                />
              </div>

              {/* User Usage Limit */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("user_usage_limit")}
                </label>
                <input
                  type="text"
                  name="user_usage_limit"
                  value={couponData.user_usage_limit}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                />
              </div>

              {/* Start Date */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("starts_at")}
                </label>
                <input
                  type="datetime-local"
                  name="starts_at"
                  value={couponData.starts_at}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                />
              </div>

              {/* Expiry Date */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("expires_at")}
                </label>
                <input
                  type="datetime-local"
                  name="expires_at"
                  value={couponData.expires_at}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                />
              </div>

              {/* English Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("en_name")}
                </label>
                <input
                  type="text"
                  name="en_name"
                  value={couponData.en_name}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                  required
                />
              </div>

              {/* Arabic Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("ar_name")}
                </label>
                <input
                  type="text"
                  name="ar_name"
                  value={couponData.ar_name}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 focus:outline-none"
                  required
                />
              </div>

              {/* English Description */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("en_description")}
                </label>
                <textarea
                  name="en_description"
                  value={couponData.en_description}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 resize-none focus:outline-none"
                  required
                />
              </div>

              {/* Arabic Description */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("ar_description")}
                </label>
                <textarea
                  name="ar_description"
                  value={couponData.ar_description}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all duration-200 hover:border-gray-400 resize-none focus:outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="col-span-full flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium shadow-sm cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm cursor-pointer"
                  disabled={loadingButton !== null}
                >
                  {loadingButton === "submit" ? (
                    <span className="flex items-center gap-2">
                      <l-ring
                        size="20"
                        stroke="3"
                        bg-opacity="0"
                        speed="2"
                        color="#fff"
                      ></l-ring>
                      {t(isEdit ? "update" : "add")}
                    </span>
                  ) : (
                    t(isEdit ? "update" : "add")
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CouponFormOverlay;
