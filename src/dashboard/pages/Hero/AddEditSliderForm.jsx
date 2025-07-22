import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import imageCompression from "browser-image-compression";

const defaultForm = {
  is_active: true,
  // link: "",
  // en: { title: "", description: "", button_text: "" },
  // ar: { title: "", description: "", button_text: "" },
  image: null,
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
  // const [activeTab, setActiveTab] = useState("en");
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        is_active: initialData.is_active ?? true,
        // link: initialData.link || "",
        // en: {
        //   title: initialData.en?.title || "",
        //   description: initialData.en?.description || "",
        //   button_text: initialData.en?.button_text || "",
        // },
        // ar: {
        //   title: initialData.ar?.title || initialData.title || "",
        //   description:
        //     initialData.ar?.description || initialData.description || "",
        //   button_text:
        //     initialData.ar?.button_text || initialData.button_text || "",
        // },
        image: null,
      });
      setImagePreview(initialData.image_url || null);
    } else {
      setForm(defaultForm);
      setImagePreview(null);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      setForm((prev) => ({ ...prev, image: compressed }));
      setImagePreview(URL.createObjectURL(compressed));
    } catch (err) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // const handleTab = (tab) => setActiveTab(tab);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setForm(defaultForm);
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("is_active", form.is_active ? 1 : 0);
    // formData.append("link", form.link);
    // formData.append("en[title]", form.en.title);
    // formData.append("en[description]", form.en.description);
    // formData.append("en[button_text]", form.en.button_text);
    // formData.append("ar[title]", form.ar.title);
    // formData.append("ar[description]", form.ar.description);
    // formData.append("ar[button_text]", form.ar.button_text);

    // Handle image requirement for API
    if (form.image) {
      formData.append("image", form.image); // New image uploaded
    } else {
      // Preserve existing image URL for editing if API supports it
      formData.append("image_url", initialData.image_url);
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"
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
            {/* Tabs */}
            {/* <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => handleTab("en")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "en"
                    ? "border-b-2 border-[#333e2c] text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("english")}
              </button>
              <button
                type="button"
                onClick={() => handleTab("ar")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "ar"
                    ? "border-b-2 border-[#333e2c] text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("arabic")}
              </button>
            </div> */}
            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-5">
              <div className="flex justify-between">
                {/* Title */}
                {/* <div className="w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("title")}
                  </label>
                  <input
                    type="text"
                    name={activeTab === "en" ? "en_title" : "ar_title"}
                    value={activeTab === "en" ? form.en.title : form.ar.title}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] transition-all focus:outline-none"
                  />
                </div> */}
                {/* Description */}
                {/* <div className="w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("description")}
                  </label>
                  <textarea
                    name={
                      activeTab === "en" ? "en_description" : "ar_description"
                    }
                    value={
                      activeTab === "en"
                        ? form.en.description
                        : form.ar.description
                    }
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] transition-all focus:outline-none"
                    rows={2}
                  />
                </div> */}
              </div>
              {/* Button Text */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("buttonText")}
                </label>
                <input
                  type="text"
                  name={
                    activeTab === "en" ? "en_button_text" : "ar_button_text"
                  }
                  value={
                    activeTab === "en"
                      ? form.en.button_text
                      : form.ar.button_text
                  }
                  onChange={(e) => {
                    const lang = e.target.name.startsWith("en_") ? "en" : "ar";
                    const newValue = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      [lang]: { ...prev[lang], button_text: newValue },
                    }));
                  }}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] transition-all focus:outline-none"
                />
              </div> */}
              {/* Link */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("link")}*
                </label>
                <input
                  type="text"
                  name="link"
                  placeholder="start with /"
                  value={form.link}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] transition-all focus:outline-none"
                  required
                />
              </div> */}
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("image")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] transition-all focus:outline-none cursor-pointer"
                  required={!initialData || !initialData.image_url}
                />
                {imagePreview && (
                  <div className="flex justify-center w-full mt-2">
                    <img
                    src={imagePreview}
                    alt="preview"
                    className="rounded-lg w-full h-50 object-cover border"
                  />
                  </div>
                )}
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
