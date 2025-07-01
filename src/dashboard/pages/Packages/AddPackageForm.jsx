import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

const AddPackageForm = ({
  packageData,
  onClose,
  onSubmit,
  products,
  loading,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEditMode = !!packageData;
  const [activeTab, setActiveTab] = useState("basic-info");
  const [formData, setFormData] = useState({
    status: "active",
    type: "percentage",
    value: "",
    image: null,
    usage_limit: "",
    user_usage_limit: "",
    starts_at: "",
    expires_at: "",
    en_name: "",
    en_description: "",
    en_short_description: "",
    ar_name: "",
    ar_description: "",
    ar_short_description: "",
    selectedProducts: [],
  });

  useEffect(() => {
    if (packageData) {
      const arTranslation = packageData.translations.find(
        (translation) => translation.locale === "ar"
      );
      const enTranslation = packageData.translations.find(
        (translation) => translation.locale === "en"
      );

      setFormData({
        status: packageData.status || "active",
        type: packageData.type || "percentage",
        value: packageData.value || "",
        image: null,
        usage_limit: packageData.usage_limit || "",
        user_usage_limit: packageData.user_usage_limit || "",
        starts_at: packageData.starts_at
          ? packageData.starts_at.split("T")[0]
          : "",
        expires_at: packageData.expires_at
          ? packageData.expires_at.replace("Z", "")
          : "",
        en_name: enTranslation?.name || "",
        en_description: enTranslation?.description || "",
        en_short_description: enTranslation?.short_description || "",
        ar_name: arTranslation?.name || "",
        ar_description: arTranslation?.description || "",
        ar_short_description: arTranslation?.short_description || "",
        selectedProducts: [],
      });
    }
  }, [packageData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    if (!productId) return;

    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return;

    const isAlreadySelected = formData.selectedProducts.some(
      (p) => p.product_id === productId
    );
    if (isAlreadySelected) return;

    setFormData({
      ...formData,
      selectedProducts: [
        ...formData.selectedProducts,
        {
          product_id: productId,
          quantity: 1,
          name: product.name,
          image_url: product.image_url,
        },
      ],
    });
  };

  const handleQuantityChange = (productId, delta) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.map((p) =>
        p.product_id === productId
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      ),
    });
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.filter(
        (p) => p.product_id !== productId
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("status", formData.status);
    formDataToSubmit.append("type", formData.type);
    formDataToSubmit.append("value", formData.value);
    if (formData.image) formDataToSubmit.append("image", formData.image);
    if (formData.usage_limit)
      formDataToSubmit.append("usage_limit", formData.usage_limit);
    if (formData.user_usage_limit)
      formDataToSubmit.append("user_usage_limit", formData.user_usage_limit);
    if (formData.starts_at)
      formDataToSubmit.append("starts_at", formData.starts_at);
    if (formData.expires_at)
      formDataToSubmit.append("expires_at", formData.expires_at);
    formDataToSubmit.append("en[name]", formData.en_name || "");
    formDataToSubmit.append("en[description]", formData.en_description || "");
    formDataToSubmit.append(
      "en[short_description]",
      formData.en_short_description || ""
    );
    formDataToSubmit.append("ar[name]", formData.ar_name || "");
    formDataToSubmit.append("ar[description]", formData.ar_description || "");
    formDataToSubmit.append(
      "ar[short_description]",
      formData.ar_short_description || ""
    );

    if (!isEditMode) {
      formData.selectedProducts.forEach((product, index) => {
        formDataToSubmit.append(
          `products[${index}][product_id]`,
          product.product_id
        );
        formDataToSubmit.append(
          `products[${index}][quantity]`,
          product.quantity
        );
      });
    }

    onSubmit(formDataToSubmit, isEditMode ? packageData.id : null);
  };

  return (
    <div
      className="relative bg-white shadow-xl w-full mx-auto p-0 overflow-y-auto"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded p-2 transition cursor-pointer shadow"
        aria-label={t("close")}
      >
        <X size={22} className="text-gray-500" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-xl px-8 py-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-1">
          {t(isEditMode ? "edit_package" : "add_package")}
        </h2>
        <p className="text-blue-100 text-sm">
          {t(isEditMode ? "edit_package_details" : "fill_package_details")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 px-8 pt-4">
        {!isEditMode && (
          <>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200 cursor-pointer ${
                activeTab === "basic-info"
                  ? "bg-white border-b-2 border-blue-600 text-blue-600 shadow"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("basic-info")}
            >
              {t("basic_info")}
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200 ml-2 cursor-pointer ${
                activeTab === "products"
                  ? "bg-white border-b-2 border-blue-600 text-blue-600 shadow"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("products")}
            >
              {t("products")}
            </button>
          </>
        )}
        {isEditMode && (
          <button
            className="px-4 py-2 text-sm font-semibold rounded-t-lg bg-white border-b-2 border-blue-600 text-blue-600 shadow"
            onClick={() => setActiveTab("basic-info")}
          >
            {t("basic_info")}
          </button>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 py-8"
      >
        {activeTab === "basic-info" && (
          <>
            {/* Package Image */}
            <div className="col-span-1 sm:col-span-2 flex flex-col items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("package_image")}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg, image/jpg, image/webp,"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:transition-all duration-200 file:cursor-pointer"
                />
                {formData.image && (
                  <span className="text-xs text-gray-600 border border-gray-200 rounded p-2">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="preview"
                      className="w-32 h-auto rounded mt-2"
                    />
                  </span>
                )}
                {!formData.image && packageData?.image_url && (
                  <span className="text-xs text-gray-600 border border-gray-200 rounded p-2">
                    <img
                      src={packageData.image_url}
                      alt="current"
                      className="w-32 h-auto rounded mt-2"
                    />
                  </span>
                )}
              </div>
            </div>

            {/* Basic Info Fields */}
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("status")}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
            </div>
            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("type")}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="percentage">{t("percentage")}</option>
                <option value="fixed_amount">{t("fixed_amount")}</option>
              </select>
            </div>
            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("value")}
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder={t("enter_value")}
              />
            </div>
            {/* usage_limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("usage_limit")}
              </label>
              <input
                type="number"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder={t("enter_usage_limit")}
              />
            </div>
            {/* user_usage_limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("user_usage_limit")}
              </label>
              <input
                type="number"
                name="user_usage_limit"
                value={formData.user_usage_limit}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder={t("enter_user_usage_limit")}
              />
            </div>
            {/* starts_at */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("starts_at")}
              </label>
              <input
                type="datetime-local"
                name="starts_at"
                value={formData.starts_at}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* expires_at */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("expires_at")}
              </label>
              <input
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* En & Ar (Name & Description) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("package_name")} (English)
              </label>
              <input
                type="text"
                name="en_name"
                value={formData.en_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder={t("enter_package_name")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("description")} (English)
              </label>
              <textarea
                name="en_description"
                value={formData.en_description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows="3"
                placeholder={t("enter_description")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("short_description")} (English)
              </label>
              <textarea
                name="en_short_description"
                value={formData.en_short_description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows="2"
                placeholder={t("enter_short_description")}
              />
            </div>
            {/* Ar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("package_name")} (Arabic)
              </label>
              <input
                type="text"
                name="ar_name"
                value={formData.ar_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder={t("enter_package_name_ar")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("description")} (Arabic)
              </label>
              <textarea
                name="ar_description"
                value={formData.ar_description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows="3"
                placeholder={t("enter_description_ar")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("short_description")} (Arabic)
              </label>
              <textarea
                name="ar_short_description"
                value={formData.ar_short_description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows="2"
                placeholder={t("enter_short_description_ar")}
              />
            </div>
          </>
        )}

        {activeTab === "products" && !isEditMode && (
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("select_product")}
            </label>
            <select
              onChange={handleProductSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value=""
            >
              <option value="">{t("select_product")}</option>
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={formData.selectedProducts.some(
                    (p) => String(p.product_id) === String(product.id)
                  )}
                >
                  {product.name}
                </option>
              ))}
            </select>
            <div className="mt-6 space-y-4">
              {formData.selectedProducts.length === 0 && (
                <div className="text-gray-400 text-center text-sm py-8 border rounded-lg">
                  {t("no_products_selected")}
                </div>
              )}
              {formData.selectedProducts.map((product) => {
                const originalProduct = products.find(
                  (p) => String(p.id) === String(product.product_id)
                );
                const imageUrl =
                  product.primary_image_url ||
                  product.image_url ||
                  (originalProduct &&
                    (originalProduct.primary_image_url ||
                      originalProduct.image_url)) ||
                  "/default_product.jpg";
                return (
                  <div
                    key={product.product_id}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm  overflow-x-auto"
                  >
                    <div className="flex sm:flex-row flex-col items-start sm:items-center gap-4 flex-1">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        onError={(e) => (e.target.src = "/default_product.jpg")}
                      />
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-800">
                          {product.name.slice(0, 20)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-row flex-col items-end sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product.product_id, -1)
                          }
                          className="p-2 border border-gray-300 hover:bg-gray-200 rounded transition duration-200 cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base">{product.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product.product_id, 1)
                          }
                          className="p-2 border border-gray-300 hover:bg-gray-200 rounded transition duration-200 cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.product_id)}
                        className="text-red-600 hover:text-red-800 transition duration-200 cursor-pointer"
                        title={t("remove")}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={`col-span-1 sm:col-span-2 flex ${language === 'ar' ? 'justify-start' : 'justify-end'}  gap-3 pt-6 border-t mt-8`}>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer font-medium"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="p-2 bg-[#333e2c] hover:bg-[#333e2c] transition-all duration-200 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <DotSpinner size="20" speed="0.9" color="white" />
            ) : (
              <>{isEditMode ? t("edit_package") : t("add_package")}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackageForm;
