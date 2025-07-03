import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ring } from "ldrs";
import imageCompression from "browser-image-compression";

ring.register();

const AddProductForm = ({
  isOpen,
  setIsOpen,
  productData,
  setProductData,
  addProduct,
  categories,
  language,
  t,
  imageInputRef,
  resetProductData,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.en_name) {
      toast.error(t("product_name_required"));
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("status", productData.status);
    formData.append("en[name]", productData.en_name);
    formData.append("en[description]", productData.en_description);
    formData.append("ar[name]", productData.ar_name);
    formData.append("ar[description]", productData.ar_description);
    productData.category_ids.forEach((id, index) =>
      formData.append(`categories[${index}]`, id)
    );
    productData.images.forEach((file, index) =>
      formData.append(`images[${index}]`, file)
    );
    productData.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][color]`, variant.color);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][sku]`, variant.sku);
      formData.append(`variants[${index}][stock]`, variant.stock);
    });

    const success = await addProduct(formData);

    if (success) {
      setIsOpen(false);
      resetProductData();
    }
    setIsSubmitting(false);
  };

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", price: "", sku: "", stock: "" }],
    }));
  };

  const updateVariant = (index, field, value) => {
    setProductData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index][field] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariant = (index) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async  (e) => {
    const files = Array.from(e.target.files);
    const compressionOptions = {
      maxSizeMB: 1,          
      maxWidthOrHeight: 1920, 
      useWebWorker: true,     
    };

    try {
      // Compress all selected images simultaneously using Promise.all
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            const compressedFile = await imageCompression(file, compressionOptions);
            return compressedFile;
          } catch (error) {
            console.error("Error compressing image:", error);
            return file;
          }
        })
      );

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedFiles],
      }));
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images");
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (id) => {
    setProductData((prev) => {
      const isSelected = prev.category_ids.includes(id);
      const newSelected = isSelected
        ? prev.category_ids.filter((catId) => catId !== id)
        : [...prev.category_ids, id];
      return { ...prev, category_ids: newSelected };
    });
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
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition cursor-pointer"
            >
              <X size={22} className="text-gray-500" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {t("add_product")}
            </h2>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "basic"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("basic_info")}
              </button>

              <button
                onClick={() => setActiveTab("images")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "images"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("images")}
              </button>

              <button
                onClick={() => setActiveTab("variants")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "variants"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("variants")}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Tab Content */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* Categories Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("categories")}
                    </label>
                    <div className="relative">
                      <div
                        onClick={() =>
                          setShowCategoryDropdown(!showCategoryDropdown)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        {productData.category_ids.length > 0
                          ? categories
                              .filter((cat) =>
                                productData.category_ids.includes(cat.id)
                              )
                              .map((cat) => cat.name)
                              .join(", ")
                          : t("select_categories")}
                      </div>
                      {showCategoryDropdown && (
                        <div className="absolute z-40 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                          {categories.map((category) => (
                            <label
                              key={category.id}
                              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                value={category.id}
                                checked={productData.category_ids.includes(
                                  category.id
                                )}
                                onChange={() =>
                                  handleCategoryChange(category.id)
                                }
                                className="mr-2 accent-blue-500"
                              />
                              {category.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("click_to_select_multiple")}
                    </p>
                  </div>

                  {/* English Name and Description */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("product_name")} (English)
                      </label>
                      <input
                        type="text"
                        value={productData.en_name}
                        onChange={(e) =>
                          setProductData({
                            ...productData,
                            en_name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                        placeholder={t("enter_product_name")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("product_name")} (Arabic)
                      </label>
                      <input
                        dir="rtl"
                        type="text"
                        value={productData.ar_name}
                        onChange={(e) =>
                          setProductData({
                            ...productData,
                            ar_name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-right"
                        placeholder={t("enter_product_name_ar")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("description")} (English)
                      </label>
                      <textarea
                        value={productData.en_description}
                        onChange={(e) =>
                          setProductData({
                            ...productData,
                            en_description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                        rows="4"
                        placeholder={t("enter_description")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("description")} (Arabic)
                      </label>
                      <textarea
                        dir="rtl"
                        value={productData.ar_description}
                        onChange={(e) =>
                          setProductData({
                            ...productData,
                            ar_description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-right"
                        rows="4"
                        placeholder={t("enter_description_ar")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "images" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("product_images")}
                    </label>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/webp,image/gif"
                      multiple
                      placeholder=""
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:transition-all duration-200 file:cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">
                      {productData.images.length > 0
                        ? `${productData.images.length} image(s) selected`
                        : "No file chosen"}
                    </span>
                  </div>
                  <div className="overflow-y-auto">
                    {productData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 h-80">
                        {productData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-40 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 cursor-pointer bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                            <p className="mt-1 text-xs text-gray-600 truncate">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "variants" && (
                <div className="space-y-6">
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-sm font-medium text-gray-700 text-left border-r border-gray-400">
                            {t("size")}
                          </th>
                          <th className="p-3 text-sm font-medium text-gray-700 text-left">
                            {t("color")}
                          </th>
                          <th className="p-3 text-sm font-medium text-gray-700 text-left border-r border-gray-400">
                            {t("sku")}
                          </th>
                          <th className="p-3 text-sm font-medium text-gray-700 text-left border-r border-gray-400">
                            {t("price")}
                          </th>
                          <th className="p-3 text-sm font-medium text-gray-700 text-left border-r border-gray-400">
                            {t("stock")}
                          </th>
                          <th className="p-3 text-sm font-medium text-gray-700 text-left">
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.variants.map((variant, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              <input
                                type="text"
                                value={variant.size}
                                onChange={(e) =>
                                  updateVariant(index, "size", e.target.value)
                                }
                                placeholder={t("size")}
                                list="sizeSuggestions"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                              />
                              <datalist id="sizeSuggestions">
                                <option value="small">{t("small")}</option>
                                <option value="medium">{t("medium")}</option>
                                <option value="large">{t("large")}</option>
                              </datalist>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={variant.color}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className="w-12 h-9 border  border-gray-300 rounded-lg cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={variant.color}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("color")}
                                  list="colorSuggestions"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 lowercase"
                                />
                              </div>
                              <datalist id="colorSuggestions">
                                <option value="Red" />
                                <option value="Blue" />
                                <option value="Green" />
                                <option value="Yellow" />
                                <option value="Black" />
                                <option value="White" />
                                <option value="Orange" />
                                <option value="Purple" />
                                <option value="Pink" />
                                <option value="Brown" />

                                <option value="Light Blue" />
                                <option value="Dark Green" />
                                <option value="Sky Blue" />
                                <option value="Olive Green" />
                                <option value="Coral Pink" />
                                <option value="Beige" />
                                <option value="Maroon" />
                                <option value="Navy Blue" />
                                <option value="Turquoise" />
                                <option value="Magenta" />
                              </datalist>
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) =>
                                  updateVariant(index, "sku", e.target.value)
                                }
                                placeholder={t("sku")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                  updateVariant(index, "price", e.target.value)
                                }
                                placeholder={t("price")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                  updateVariant(index, "stock", e.target.value)
                                }
                                placeholder={t("stock")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                              />
                            </td>
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-all duration-200 cursor-pointer"
                  >
                    {t("add_variant")}
                  </button>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition cursor-pointer"
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#333e2c] text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow transition cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <l-ring
                        size="20"
                        stroke="3"
                        bg-opacity="0"
                        speed="2"
                        color="#fff"
                      ></l-ring>
                      {t("adding")}
                    </span>
                  ) : (
                    t("add")
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

export default AddProductForm;
