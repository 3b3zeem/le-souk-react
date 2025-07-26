import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const AssignImagesModal = ({ isOpen, onClose, product, onAssign, loading }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    product_variant_id: "",
    product_image_ids: [],
  });

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageToggle = (imageId) => {
    setForm((prev) => {
      const currentImages = prev.product_image_ids;
      if (currentImages.includes(imageId)) {
        return {
          ...prev,
          product_image_ids: currentImages.filter((id) => id !== imageId),
        };
      } else {
        return {
          ...prev,
          product_image_ids: [...currentImages, imageId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_variant_id || form.product_image_ids.length === 0) {
      toast.error(t("please_select_variant_and_images"));
      return;
    }

    const success = await onAssign({
      productId: product.id,
      productVariantId: form.product_variant_id,
      productImageIds: form.product_image_ids,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-600">
                {t("assign_images_to_variant")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors rounded-full p-2 focus:outline-none hover:bg-gray-100 cursor-pointer"
                disabled={loading}
                aria-label={t("cancel")}
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Select Variants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("select_variant")}
                </label>
                <select
                  name="product_variant_id"
                  value={form.product_variant_id}
                  onChange={handleVariantChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-focus:ring-[#333e2c] duration-200 focus:border-focus:ring-[#333e2c] transition-all focus:outline-none"
                >
                  <option value="">{t("select_variant")}</option>
                  {product?.variants?.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.color} - {variant.size} (ID: {variant.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("select_images")}
                </label>
                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {product?.images?.map((image) => {
                    const isSelected = form.product_image_ids.includes(String(image.id));
                    return (
                      <div
                        key={image.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                          isSelected ? "ring-2 ring-focus:ring-[#333e2c] duration-200" : "ring-1 ring-gray-300"
                        }`}
                        onClick={() => handleImageToggle(String(image.id))}
                      >
                        <img
                          src={image.image_url}
                          alt={`Image ${image.id}`}
                          className="w-full h-24 object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#333e2c]/20 flex items-center justify-center">
                            <Check color="#333e2c" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all font-medium shadow-sm cursor-pointer"
                disabled={loading}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-[#333e2c] rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm flex items-center gap-2 cursor-pointer"
                disabled={loading}
              >
                {loading && (
                  <l-ring
                    size="20"
                    stroke="3"
                    bg-opacity="0"
                    speed="2"
                    color="#fff"
                  ></l-ring>
                )}
                {loading ? t("loading") : t("assign")}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignImagesModal;