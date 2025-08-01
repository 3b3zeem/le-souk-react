import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import {
  Check,
  Eye,
  Plus,
  Search,
  ShoppingBag,
  SquarePen,
  Trash2,
} from "lucide-react";
import AddProductForm from "./AddProductForm";
import Loader from "../../../layouts/Loader";
import { ring } from "ldrs";
import EditProductForm from "./EditProductForm";
import useProducts from "./../../../hooks/Products/useProduct";
import useAdminProducts from "../../hooks/Products/useAdminProducts";
import SetPrimaryImageForm from "./SetPrimaryImageForm";
import Swal from "sweetalert2";
import AddDiscount from "./addDiscount";
import AssignImagesModal from "./AssignImagesModal";
import ProductDropdownActions from "./ProductDropdownActions";
import Meta from "../../../components/Meta/Meta";
ring.register();

const AdminProducts = () => {
  const {
    products,
    addProduct,
    updateProduct,
    updateProductImages,
    setPrimaryImage,
    addProductDiscount,
    assignImagesToVariant,
    IsFeaturedProduct,
    deleteProduct,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
    page,
  } = useAdminProducts();
  const [productData, setProductData] = useState({
    images: [],
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
  const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
  const [isPrimaryOverlayOpen, setIsPrimaryOverlayOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [addDiscountOpen, setAddDiscountOpen] = useState(false);
  const [discountProductId, setDiscountProductId] = useState(null);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const resetProductData = () => {
    setProductData({
      images: [],
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
  };

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const arTranslation =
        product.translations.find((t) => t.locale === "ar") || {};
      const enTranslation =
        product.translations.find((t) => t.locale === "en") || {};

      const transformedProductData = {
        images:
          product.images?.map((img) => ({ id: img.id, url: img.image_url })) ||
          [],
        status: product.status || "active",
        ar_name: arTranslation.name || product.name || "",
        ar_description: arTranslation.description || product.description || "",
        en_name: enTranslation.name || product.name || "",
        en_description: enTranslation.description || product.description || "",
        price: product.min_price || "",
        stock: product.total_stock || "",
        category_ids: product.categories?.map((cat) => cat.id) || [],
        variants:
          product.variants?.length > 0
            ? product.variants
            : [{ size: "", price: "", sku: "", stock: "" }],
      };

      setProductData(transformedProductData);
      setEditProductId(productId);
      setIsEditOverlayOpen(true);
    }
  };

  const handleDelete = async (onDelete, t) => {
    const result = await Swal.fire({
      title: t("areYouSureToDelete"),
      text: t("thisActionCannotBeUndone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("yesDeleteIt"),
      cancelButtonText: t("cancel"),
    });

    if (result.isConfirmed) {
      await onDelete();
      Swal.fire(t("deletedSuccessfully"), t("itemHasBeenDeleted"), "success");
    }
  };

  const handleAddDiscount = (productId) => {
    setDiscountProductId(productId);
    setAddDiscountOpen(true);
  };

  const handleSubmitDiscount = async (data) => {
    setLoadingDiscount(true);
    const ok = await addProductDiscount(discountProductId, data);
    setLoadingDiscount(false);
    if (ok) setAddDiscountOpen(false);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  const handleAssignImages = async ({
    productId,
    productVariantId,
    productImageIds,
  }) => {
    const success = await assignImagesToVariant(
      productId,
      productVariantId,
      productImageIds
    );
    return success;
  };

  function getPaginationPages(totalPages, currentPage) {
    const pages = new Set();

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.add(i);
      }
    } else {
      pages.add(1);

      if (currentPage > 3) pages.add("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.add(i);
      }

      if (currentPage < totalPages - 2) pages.add("...");

      pages.add(totalPages);
    }

    return Array.from(pages);
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-1 sm:p-6 w-[100%]"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="Products Management"
        description="Manage your products effectively with our dashboard."
      />
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
              className={`w-[190px] sm:w-full focus:w-full ${language === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#333e2c] transition duration-200 placeholder:text-gray-400`}
            />
            <span
              className={`absolute top-1/2 transform -translate-y-1/2 ${language === "ar" ? "right-3" : "left-3"
                }`}
            >
              <Search size={17} className="text-gray-500" />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-auto">
            <button
              onClick={() => {
                resetProductData();
                setIsOverlayOpen(true);
              }}
              className="w-auto px-4 py-2 bg-[#333e2c] text-white rounded customEffect cursor-pointer text-sm"
            >
              <span>{t("add_product")}</span>
            </button>
          </div>
        </div>

        {isOverlayOpen && (
          <AddProductForm
            isOpen={isOverlayOpen}
            setIsOpen={setIsOverlayOpen}
            productData={productData}
            setProductData={setProductData}
            addProduct={addProduct}
            categories={categories}
            language={language}
            t={t}
            imageInputRef={imageInputRef}
            resetProductData={resetProductData}
          />
        )}

        {isEditOverlayOpen && (
          <EditProductForm
            isOpen={isEditOverlayOpen}
            setIsOpen={setIsEditOverlayOpen}
            productId={editProductId}
            productData={productData}
            setProductData={setProductData}
            updateProduct={updateProduct}
            updateProductImages={updateProductImages}
            categories={categories}
            language={language}
            t={t}
            imageInputRef={imageInputRef}
          />
        )}

        {isPrimaryOverlayOpen && (
          <SetPrimaryImageForm
            isOpen={isPrimaryOverlayOpen}
            setIsOpen={setIsPrimaryOverlayOpen}
            productId={selectedProductId}
            products={products}
            setPrimaryImage={setPrimaryImage}
            language={language}
            t={t}
          />
        )}

        <AddDiscount
          isOpen={addDiscountOpen}
          onClose={() => setAddDiscountOpen(false)}
          onSubmit={handleSubmitDiscount}
          t={t}
          loading={loadingDiscount}
        />

        <AssignImagesModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          product={selectedProduct}
          onAssign={handleAssignImages}
          loading={loading}
        />

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
                    {t("product_image")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${language === "ar" ? "text-right" : "text-left"
                      }`}
                  >
                    {t("name")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${language === "ar" ? "text-right" : "text-left"
                      }`}
                  >
                    {t("description")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${language === "ar" ? "text-right" : "text-left"
                      }`}
                  >
                    {t("price")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${language === "ar" ? "text-right" : "text-left"
                      }`}
                  >
                    {t("stock")}
                  </th>
                  <th
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${language === "ar" ? "text-right" : "text-left"
                      }`}
                  >
                    {t("discount_percentage")}
                  </th>
                  <th className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-700">
                    {t("add_to_home")}
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
                      className="p-2 sm:p-3 flex justify-center"
                      data-label={t("product_image")}
                    >
                      <img
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200 cursor-pointer"
                        onError={(e) => (e.target.src = "/default_product.jpg")}
                      />
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-800 whitespace-nowrap ${language === "ar" ? "text-right" : "text-left"
                        }`}
                      data-label={t("name")}
                      title={product.name}
                    >
                      {product.name.slice(0, 30)}...
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-800 max-w-[100px] sm:max-w-[200px] truncate ${language === "ar" ? "text-right" : "text-left"
                        }`}
                      data-label={t("description")}
                      title={product.description}
                    >
                      {product.description.slice(0, 30)}...
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-500 ${language === "ar" ? "text-right" : "text-left"
                        }`}
                      data-label={t("price")}
                    >
                      {product.min_price} {language === "ar" ? "د.ك" : "KWD"}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-500 ${language === "ar" ? "text-right" : "text-left"
                        }`}
                      data-label={t("stock")}
                    >
                      {product.total_stock}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-xs font-medium text-gray-500 ${language === "ar" ? "text-right" : "text-left"
                        }`}
                      data-label={t("stock")}
                    >
                      {product.discount_value
                        ? product.discount_value + "%"
                        : t("no_discount")}
                    </td>
                    <td className="p-2 sm:p-3 text-center" data-label={t("add_to_home")}>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={!!product.is_featured}
                          onChange={() => IsFeaturedProduct(product.id)}
                          disabled={loading}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative transition-colors duration-200">
                          <span
                            className={`absolute ${product.is_featured ? "right-1" : "left-1"} top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5`}
                          ></span>
                        </div>
                      </label>
                    </td>
                    <td className="p-2 sm:p-3" data-label={t("actions")}>
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <ProductDropdownActions
                          product={product}
                          t={t}
                          loading={loading}
                          onView={() => navigate(`/products/${product.id}`)}
                          onEdit={handleEdit}
                          onDelete={(id) =>
                            handleDelete(() => deleteProduct(id), t)
                          }
                          onAddDiscount={handleAddDiscount}
                          onAssignImages={openModal}
                          onSetPrimaryImage={(id) => {
                            setSelectedProductId(id);
                            setIsPrimaryOverlayOpen(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mt-4 gap-3">
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

              {getPaginationPages(totalPages, page).map((p, index) =>
                p === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm cursor-pointer ${page === p
                      ? "bg-[#333e2c] text-white hover:bg-[#333e2c]"
                      : "hover:bg-gray-200"
                      } transition-all duration-200`}
                  >
                    {p}
                  </button>
                )
              )}

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
