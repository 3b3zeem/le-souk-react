import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import imageCompression from "browser-image-compression";

const defaultForm = {
  is_active: true,
  en: { image: null },
  ar: { image: null },
};

const AddEditSliderForm = ({
  isOpen,
  setIsOpen,
  initialData,
  onSubmit,
  loading,
  t,
  language,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState({ en: null, ar: null });
  const [error, setError] = useState(null);
  const imageInputRef = useRef({ en: null, ar: null });

  useEffect(() => {
    if (!isOpen) return;

    if (!initialData) {
      setForm(defaultForm);
      setImagePreview({ en: null, ar: null });
    } else {
      setForm({
        is_active: initialData.is_active ?? true,
        en: { image: null },
        ar: { image: null },
      });
      setImagePreview({
        en: initialData?.images?.en?.image_url || null,
        ar: initialData?.images?.ar?.image_url || null,
      });
    }

    if (imageInputRef.current.en) imageInputRef.current.en.value = "";
    if (imageInputRef.current.ar) imageInputRef.current.ar.value = "";
    setError(null);
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("en_") || name.startsWith("ar_")) {
      const lang = name.startsWith("en_") ? "en" : "ar";
      const field = name.split("_")[1];
      setForm((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = async (e, lang) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      setForm((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          image: compressed,
        },
      }));
      setImagePreview((prev) => ({
        ...prev,
        [lang]: URL.createObjectURL(compressed),
      }));
      setError(null);
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          image: file,
        },
      }));
      setImagePreview((prev) => ({
        ...prev,
        [lang]: URL.createObjectURL(file),
      }));
      setError(`Error compressing ${lang} image: ${err.message}`);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setForm(defaultForm);
      setImagePreview({ en: null, ar: null });
      if (imageInputRef.current.en) imageInputRef.current.en.value = "";
      if (imageInputRef.current.ar) imageInputRef.current.ar.value = "";
      setError(null);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("is_active", form.is_active ? 1 : 0);

    // English Image (Add logic)
    if (!initialData && !form.en.image) {
      setError("The Arabic image is required.");
      return;
    }
    if (form.en.image) {
      formData.append("en[image]", form.en.image);
    } else if (initialData?.images?.en?.image_url) {
      formData.append("en_image_url", initialData?.images?.en?.image_url);
    }

    // Arabic Image (Add logic)
    if (!initialData && !form.ar.image) {
      setError("The Arabic image is required.");
      return;
    }
    if (form.ar.image) {
      formData.append("ar[image]", form.ar.image);
    } else if (initialData?.images?.ar?.image_url) {
      formData.append("ar_image_url", initialData?.images?.ar?.image_url);
    }

    const ok = await onSubmit(formData);
    if (ok) handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-500 px-4"
          onClick={handleClose}
        >
          <motion.form
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition cursor-pointer"
            >
              <X size={22} className="text-gray-500" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {initialData ? t("editSliderHero") : t("addSliderHero")}
            </h2>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* English Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("image")} (EN)
                </label>
                <div className="flex flex-col gap-2 border border-dashed border-[#333e2c] rounded-lg p-1">
                  <label
                    htmlFor="file-en"
                    className="cursor-pointer flex items-center justify-center w-full h-52 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    {imagePreview.en ? (
                      <img
                        src={imagePreview.en}
                        alt="Current/Selected English Image"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">{t("uploadImage")}</span>
                    )}
                  </label>
                  <input
                    id="file-en"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "en")}
                    ref={(el) => (imageInputRef.current.en = el)}
                    className="hidden"
                    required={!initialData?.images?.en?.image_url}
                  />
                </div>
              </div>

              {/* Arabic Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("image")} (AR)
                </label>
                <div className="flex flex-col gap-2 border border-dashed border-[#333e2c] rounded-lg p-1">
                  <label
                    htmlFor="file-ar"
                    className="cursor-pointer flex items-center justify-center w-full h-52 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    {imagePreview.ar ? (
                      <img
                        src={imagePreview.ar}
                        alt="Current/Selected Arabic Image"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">{t("uploadImage")}</span>
                    )}
                  </label>
                  <input
                    id="file-ar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "ar")}
                    ref={(el) => (imageInputRef.current.ar = el)}
                    className="hidden"
                    required={!initialData?.images?.ar?.image_url}
                  />
                </div>
              </div>

              {/* is_active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-[#333e2c] cursor-pointer"
                  id="is_active"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {t("isActive")}
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 px-6 py-3 bg-[#333e2c] text-white font-semibold text-lg disabled:opacity-60 cursor-pointer customEffect"
              disabled={loading}
            >
              <span>
                {loading
                  ? t("loading")
                  : initialData
                  ? t("updateSliderHero")
                  : t("addSliderHero")}
              </span>
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEditSliderForm;
