import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const ShippingRatesModal = ({
  isOpen,
  onClose,
  shippingMethod,
  selectedRate,
  supportedCountries,
  updateShippingRates,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    country_id: selectedRate?.country_id || supportedCountries[0]?.id || "",
    rate: selectedRate?.rate || shippingMethod?.price || 0,
    free_shipping_threshold: selectedRate?.free_shipping_threshold || 50.0,
    estimated_days_min: selectedRate?.estimated_days_min || 1,
    estimated_days_max: selectedRate?.estimated_days_max || 3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedRate) {
      setFormData({
        country_id: selectedRate.country_id,
        rate: selectedRate.rate,
        free_shipping_threshold: selectedRate.free_shipping_threshold,
        estimated_days_min: selectedRate.estimated_days_min,
        estimated_days_max: selectedRate.estimated_days_max,
      });
    } else {
      setFormData({
        country_id: supportedCountries[0]?.id || "",
        rate: shippingMethod?.price || 0,
        free_shipping_threshold: 50.0,
        estimated_days_min: 1,
        estimated_days_max: 3,
      });
    }
  }, [selectedRate, shippingMethod, supportedCountries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateShippingRates(shippingMethod.id, formData);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "country_id" ? parseInt(value) : parseFloat(value) || value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex backdrop-blur-sm items-center justify-center z-500"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedRate ? t("edit_rate") : t("add_rate")} -{" "}
                {shippingMethod.name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 p-2 rounded transition-colors hover:bg-gray-200 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("country")}
                </label>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {supportedCountries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("rate")} ({language === "ar" ? "د.ك." : "KWD"})
                </label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("free_shipping_threshold")} (
                  {language === "ar" ? "د.ك." : "KWD"})
                </label>
                <input
                  type="number"
                  name="free_shipping_threshold"
                  value={formData.free_shipping_threshold}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("estimated_days_min")}
                </label>
                <input
                  type="number"
                  name="estimated_days_min"
                  value={formData.estimated_days_min}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("estimated_days_max")}
                </label>
                <input
                  type="number"
                  name="estimated_days_max"
                  value={formData.estimated_days_max}
                  onChange={handleChange}
                  min={formData.estimated_days_min}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? t("submitting") : t("save")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShippingRatesModal;
