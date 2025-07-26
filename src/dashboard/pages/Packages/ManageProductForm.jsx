import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const ManageProductForm = ({
  loading,
  packageId,
  products,
  details,
  onSubmit,
  onClose,
  updatePackageProductQuantity,
  removeProductFromPackage,
}) => {
  const [formData, setFormData] = useState({
    selectedProducts: [],
  });
  const [removingId, setRemovingId] = useState(null);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (details?.packageProducts) {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: details.packageProducts.map((p) => ({
          product_id: p.product_id,
          quantity: p.quantity,
          name: p.product.name,
          primary_image_url: p.product.primary_image_url,
        })),
      }));
    }
  }, [details]);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    if (
      productId &&
      !formData.selectedProducts.some(
        (p) => String(p.product_id) === String(productId)
      )
    ) {
      const selectedProduct = products.find(
        (p) => String(p.id) === String(productId)
      );
      setFormData((prev) => ({
        ...prev,
        selectedProducts: [
          ...prev.selectedProducts,
          {
            product_id: productId,
            quantity: 1,
            name: selectedProduct.name,
            primary_image_url:
              selectedProduct.primary_image_url || selectedProduct.image_url,
          },
        ],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productsToAdd = formData.selectedProducts.filter(
      (p) =>
        !details?.packageProducts.some(
          (dp) => String(dp.product_id) === String(p.product_id)
        )
    );
    onSubmit(
      productsToAdd.map((p) => ({
        product_id: p.product_id,
        product_variant_id: p.product_variant_id || null,
        quantity: p.quantity,
      }))
    );
    onClose();
  };

  const handleQuantityChange = async (productId, change) => {
    const productInState = formData.selectedProducts.find(
      (p) => String(p.product_id) === String(productId)
    );
    if (!productInState) return;

    const newQuantity = Math.max(1, productInState.quantity + change);

    const productInDetails = details?.packageProducts?.find(
      (p) => String(p.product_id) === String(productId)
    );

    if (productInDetails) {
      const success = await updatePackageProductQuantity(
        packageId,
        productInDetails.id,
        newQuantity
      );
      if (success) {
        setFormData((prev) => ({
          ...prev,
          selectedProducts: prev.selectedProducts.map((p) =>
            String(p.product_id) === String(productId)
              ? { ...p, quantity: newQuantity }
              : p
          ),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: prev.selectedProducts.map((p) =>
          String(p.product_id) === String(productId)
            ? { ...p, quantity: newQuantity }
            : p
        ),
      }));
    }
  };

  const handleRemoveProduct = async (productId) => {
    setRemovingId(productId);
    const success = await removeProductFromPackage(packageId, productId);
    if (success) {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(
          (p) => String(p.product_id) !== String(productId)
        ),
      }));
    }
    setRemovingId(null);
  };

  return (
    <div
      className="bg-white p-6 rounded-lg w-full relative"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <button
        onClick={onClose}
        className={`absolute top-4 ${
          language === "ar" ? "left-4" : "right-4"
        } bg-gray-100 hover:bg-gray-200 rounded p-2 transition cursor-pointer shadow`}
      >
        <X size={22} className="text-gray-500" />
      </button>
      <h2 className="text-xl font-bold mb-4">
        {t("addProductsTitle", { id: packageId })}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("selectProduct")}
          </label>
          <select
            onChange={handleProductSelect}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#333e2c] transition duration-200"
            value=""
          >
            <option value="">{t("selectAProduct")}</option>
            {products.map((product) => {
              const isDisabled =
                formData.selectedProducts.some(
                  (p) => String(p.product_id) === String(product.id)
                ) ||
                (details?.packageProducts &&
                  details.packageProducts.some(
                    (p) => String(p.product_id) === String(product.id)
                  ));
              return (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={isDisabled}
                >
                  <img
                    src={product.primary_image_url}
                    width={50}
                    alt={product.name}
                  />{" "}
                  {product.name}
                </option>
              );
            })}
          </select>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.selectedProducts.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-gray-400 text-center text-sm py-8 border rounded-lg">
                {t("noProductsSelected")}
              </div>
            ) : (
              formData.selectedProducts.map((product) => {
                const originalProduct = products.find(
                  (p) => String(p.id) === String(product.product_id)
                );
                const imageUrl =
                  product.primary_image_url ||
                  originalProduct?.primary_image_url ||
                  originalProduct?.image_url ||
                  "/default_product.jpg";

                return (
                  <motion.div
                    key={product.product_id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 flex flex-col gap-3"
                  >
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-100 object-cover rounded-md border border-gray-200"
                      onError={(e) => (e.target.src = "/default_product.jpg")}
                    />

                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product.product_id, -1)
                          }
                          className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition duration-200 cursor-pointer"
                          disabled={product.quantity <= 1}
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                          {product.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product.product_id, 1)
                          }
                          className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition duration-200 cursor-pointer"
                        >
                          <Plus size={14} className="text-gray-600" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.product_id)}
                        className="text-red-600 hover:text-red-800 transition duration-200 cursor-pointer flex items-center"
                        disabled={removingId === product.product_id}
                      >
                        {removingId === product.product_id ? (
                          <DotSpinner size={18} speed="0.9" color="red" />
                        ) : (
                          <X size={16} className="text-red-600" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        <div
          className={`flex ${
            language === "ar" ? "justify-start" : "justify-end"
          } space-x-2`}
        >
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
              t("saveProducts")
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageProductForm;
