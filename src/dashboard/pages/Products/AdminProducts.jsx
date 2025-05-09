import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Search, ShoppingBag, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAdminProducts from "../../hooks/Products/useProducts";
import useProducts from "./../../../hooks/Products/useProduct";
import { ring } from "ldrs";
import Loader from "../../../layouts/Loader";
ring.register();

const AdminProducts = () => {
  const { products, addProduct, loading, error, totalPages, totalCount, currentPage, search, page } =
    useAdminProducts();
  const [productData, setProductData] = useState({
    image: [],
    status: "active",
    en_name: "",
    en_description: "",
    ar_name: "",
    ar_description: "",
    price: "",
    stock: "",
    category_ids: [],
    variants: [{ size: "", price: "", sku: "", stock: "" }],
  });
  const { categories } = useProducts();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    if (newParams.page) params.page = newParams.page.toString();
    if (newParams.per_page) params.per_page = newParams.per_page.toString();
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
  };

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
    productData.image.forEach((file, index) =>
      formData.append(`images[${index}]`, file)
    );
    productData.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][sku]`, variant.sku);
      formData.append(`variants[${index}][stock]`, variant.stock);
    });

    const success = await addProduct(formData);

    if (success) {
      setIsOverlayOpen(false);
      setProductData({
        image: [],
        status: "active",
        en_name: "",
        en_description: "",
        ar_name: "",
        ar_description: "",
        price: "",
        stock: "",
        category_ids: [],
        variants: [{ size: "", price: "", sku: "", stock: "" }],
      });
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setProductData((prev) => ({
      ...prev,
      image: [...prev.image, ...files],
    }));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
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
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-6 w-[100%]"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto w-[100%]">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 w-[100%]">
          {t("products")}
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base w-[100% - w-16]">
          {t("manage_products")}
        </p>

        <div className="w-[100%] flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_products")}
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`w-[190px] sm:w-full focus:w-full ${
                language === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 placeholder:text-gray-400`}
            />
            <span
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                language === "ar" ? "right-3" : "left-3"
              }`}
            >
              <Search size={17} className="text-gray-500" />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-auto">
            <button
              onClick={() => {
                setProductData({
                  image: [],
                  status: "active",
                  en_name: "",
                  en_description: "",
                  ar_name: "",
                  ar_description: "",
                  price: "",
                  stock: "",
                  category_ids: [],
                  variants: [{ size: "", price: "", sku: "", stock: "" }],
                });
                setIsOverlayOpen(true);
                setShowCategoryDropdown(false);
              }}
              className="w-auto px-4 py-2 bg-blue-600 text-white rounded customEffect cursor-pointer text-sm"
            >
              <span>{t("add_product")}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOverlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
              onClick={() => setIsOverlayOpen(false)}
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
                  onClick={() => setIsOverlayOpen(false)}
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
                            type="text"
                            value={productData.ar_name}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                ar_name: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
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
                            value={productData.ar_description}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                ar_description: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
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
                          {productData.image.length > 0
                            ? `${productData.image.length} image(s) selected`
                            : "No file chosen"}
                        </span>
                      </div>
                      <div className="overflow-y-auto">
                        {productData.image.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 h-80">
                            {productData.image.map((file, index) => (
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
                                      updateVariant(
                                        index,
                                        "size",
                                        e.target.value
                                      )
                                    }
                                    placeholder={t("size")}
                                    list="sizeSuggestions"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                                  />
                                  <datalist id="sizeSuggestions">
                                    <option value="small">{t("small")}</option>
                                    <option value="medium">
                                      {t("medium")}
                                    </option>
                                    <option value="large">{t("large")}</option>
                                  </datalist>
                                </td>
                                <td className="p-3">
                                  <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) =>
                                      updateVariant(
                                        index,
                                        "sku",
                                        e.target.value
                                      )
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
                                      updateVariant(
                                        index,
                                        "price",
                                        e.target.value
                                      )
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
                                      updateVariant(
                                        index,
                                        "stock",
                                        e.target.value
                                      )
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
                      onClick={() => setIsOverlayOpen(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow transition cursor-pointer"
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

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag size={48} className="text-gray-400 mb-4" />
            <p className="text-center text-gray-600 text-lg">
              {t("no_products")}
            </p>
          </div>
        ) : (
          <div className="w-[100%] overflow-x-auto">
            <table className="border-collapse bg-white rounded-lg shadow table-auto w-[100%]">
              <thead className="w-[100%] overflow-x-auto">
                <tr className="bg-gray-100 w-[100%] overflow-x-auto">
                  <th className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-700">
                    {t("id")}
                  </th>
                  <th className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-700">
                    {t("product_image")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("name")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("description")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("price")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold fluorine-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("stock")}
                  </th>
                  <th className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-700">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="w-[100%] overflow-x-auto">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 w-[100%] overflow-x-auto"
                  >
                    <td
                      className="p-2 sm:p-3 text-xs text-gray-600 text-center"
                      data-label={t("id")}
                    >
                      {product.id}.
                    </td>
                    <td
                      className="p-2 sm:p-3 flex justify-center"
                      data-label={t("product_image")}
                    >
                      <img
                        src={product.images[0].image_url}
                        alt={product.name}
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200 cursor-pointer"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/64")
                        }
                      />
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-800 whitespace-nowrap ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("name")}
                      title={product.name}
                    >
                      {product.name}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-800 max-w-[100px] sm:max-w-[200px] truncate ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("description")}
                      title={product.description}
                    >
                      {product.description}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("price")}
                    >
                      ${product.min_price}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("stock")}
                    >
                      {product.total_stock}
                    </td>
                    <td className="p-2 sm:p-3" data-label={t("actions")}>
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer text-xs"
                          title={t("delete")}
                        >
                          <Trash2 size={14} />
                          <span className="sm:inline hidden font-medium">
                            {t("delete")}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("showing_products", {
                count: products.length,
                current: currentPage,
                total: totalCount,
              })}
            </p>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm cursor-pointer hover:bg-gray-200 transition-all duration-200"
              >
                {t("previous")}
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm cursor-pointer ${
                    page === index + 1
                      ? "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-100"
                      : "hover:bg-gray-200 transition-all duration-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm cursor-pointer hover:bg-gray-200 transition-all duration-200"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
