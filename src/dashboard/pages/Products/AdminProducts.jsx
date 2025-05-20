import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Eye, Search, ShoppingBag, SquarePen, Trash2 } from "lucide-react";
import AddProductForm from "./AddProductForm";
import Loader from "../../../layouts/Loader";
import { ring } from "ldrs";
import EditProductForm from "./EditProductForm";
import useProducts from "./../../../hooks/Products/useProduct";
import useAdminProducts from "../../hooks/Products/useAdminProducts";
import SetPrimaryImageForm from "./SetPrimaryImageForm";
import Swal from "sweetalert2";
ring.register();

const AdminProducts = () => {
  const {
    products,
    addProduct,
    updateProduct,
    updateProductImages,
    setPrimaryImage,
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

  return (
    <div
      className="min-h-screen bg-gray-50 p-1 sm:p-6 w-[100%]"
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
                resetProductData();
                setIsOverlayOpen(true);
              }}
              className="w-auto px-4 py-2 bg-blue-600 text-white rounded customEffect cursor-pointer text-sm"
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
                    className={`p-2 sm:p-3 text-xs font-semibold text-gray-700 ${
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
                        src={product.primary_image_url}
                        alt={product.name}
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setIsPrimaryOverlayOpen(true);
                        }}
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
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200 cursor-pointer text-xs"
                          title={t("view")}
                        >
                          <Eye size={14} />
                          <span className="sm:inline hidden font-medium">
                            {t("view")}
                          </span>
                        </button>
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs"
                          title={t("edit")}
                        >
                          <SquarePen size={14} />
                          <span className="sm:inline hidden font-medium">
                            {t("edit")}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(() => deleteProduct(product.id), t)
                          }
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

        {/* Pagination */}
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
