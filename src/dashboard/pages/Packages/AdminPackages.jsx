import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAdminPackages from "../../hooks/Packages/useAdminPackages";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Edit, Trash2, MoreVertical, Plus, Search, Layers } from "lucide-react";
import Loader from "../../../layouts/Loader";
import { motion, AnimatePresence } from "framer-motion";
import AddPackageForm from "./AddPackageForm";
import ManageProductForm from "./ManageProductForm";
import DropdownActions from "./DropdownActions";
import Meta from "../../../components/Meta/Meta";

const AdminPackages = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    packages,
    products,
    packageDetails,
    addOrUpdatePackage,
    addProductToPackage,
    updatePackageProductQuantity,
    removeProductFromPackage,
    deletePackage,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
  } = useAdminPackages(page);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    if (newParams.page) params.page = newParams.page.toString();
    if (newParams.per_page) params.per_page = newParams.per_page.toString();
    if (newParams.sort_by) params.sort_by = newParams.sort_by;
    if (newParams.sort_direction)
      params.sort_direction = newParams.sort_direction;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
    setPage(newPage);
  };

  const handleAddOrUpdatePackage = async (formData, packageId) => {
    const success = await addOrUpdatePackage(formData, packageId);
    if (success) {
      setIsOverlayOpen(false);
      setSelectedPackage(null);
    }
  };

  const handleOpenAdd = () => {
    setSelectedPackage(null);
    setIsOverlayOpen(true);
  };

  const handleOpenEdit = (packageId) => {
    const packageToEdit = packages.find((pkg) => pkg.id === packageId);
    setSelectedPackage(packageToEdit);
    setIsOverlayOpen(true);
  };

  const handleAddProduct = (packageId) => {
    const pkg = packages.find((p) => p.id === packageId);
    setSelectedPackage(pkg);
    setShowAddProductForm(true);
  };

  const handleAddProductSubmit = async (productsData) => {
    for (const product of productsData) {
      const success = await addProductToPackage(selectedPackage.id, product);
      if (!success) break;
    }
  };

  const handleDeletePackage = async (packageId) => {
    await deletePackage(packageId);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-1 sm:p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="Packages Management"
        description="Manage your packages effectively with our dashboard."
      />
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {t("packages")}
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {t("manage_packages")}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_packages")}
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

          <div
            onClick={handleOpenAdd}
            className="flex flex-col sm:flex-row gap-3 w-auto"
          >
            <button className="w-auto px-4 py-2 bg-[#333e2c] text-white rounded customEffect cursor-pointer text-sm">
              <span>{t("add_package")}</span>
            </button>
          </div>
        </div>

        {/* Add & Edit Package */}
        <AnimatePresence>
          {isOverlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-500 overflow-y-auto"
              onClick={() => setIsOverlayOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white w-full max-w-5xl p-8 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: "90vh" }}
              >
                <AddPackageForm
                  packageData={selectedPackage}
                  onClose={() => setIsOverlayOpen(false)}
                  onSubmit={handleAddOrUpdatePackage}
                  products={products}
                  loading={loading}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Package Product */}
        <AnimatePresence>
          {showAddProductForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-500 overflow-y-auto"
              onClick={() => setShowAddProductForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white w-full max-w-7xl p-8 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: "95vh" }}
              >
                <ManageProductForm
                  packageId={selectedPackage?.id}
                  products={products}
                  details={selectedPackage}
                  onSubmit={handleAddProductSubmit}
                  removeProductFromPackage={removeProductFromPackage}
                  updatePackageProductQuantity={updatePackageProductQuantity}
                  packageDetails={packageDetails}
                  loading={loading}
                  onClose={() => {
                    setShowAddProductForm(false);
                    setSelectedPackage(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Layers size={48} className="text-gray-400 mb-4" />
            <p className="text-center text-gray-600 text-lg">
              {t("no_packages")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("package_image")}
                  </th>
                  <th
                    className={`p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("name")}
                  </th>
                  <th
                    className={`p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("description")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("discount_percentage")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("original_price")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("discounted_price")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("products")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("duration")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex justify-center">
                      <img
                        src={pkg.image_url}
                        alt={pkg.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200 cursor-pointer"
                        onError={(e) => (e.target.src = "/default_package.jpg")}
                      />
                    </td>
                    <td
                      className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {pkg.name}
                    </td>
                    <td
                      className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {pkg.description}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center text-green-700 font-bold">
                      {pkg.discount_percentage}%
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center text-gray-700">
                      {Number(pkg.original_price).toLocaleString()}{" "}
                      {language === "ar" ? "د.ك" : "KWD"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center text-blue-700 font-bold">
                      {Number(pkg.discounted_price).toLocaleString()}{" "}
                      {language === "ar" ? "د.ك" : "KWD"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center text-green-700 font-bold">
                      {pkg.packageProducts.length || 0} {t("products")}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center text-gray-700">
                      {pkg.starts_at && pkg.expires_at
                        ? `${new Date(
                            pkg.starts_at
                          ).toLocaleDateString()} - ${new Date(
                            pkg.expires_at
                          ).toLocaleDateString()}`
                        : t("not_determined", "not determined")}
                    </td>
                    <td className="p-3 text-center">
                      <DropdownActions
                        pkg={pkg}
                        t={t}
                        loading={loading}
                        onView={() => navigate(`/packages/${pkg.id}`)}
                        handleOpenEdit={handleOpenEdit}
                        handleAddProduct={handleAddProduct}
                        handleDeletePackage={handleDeletePackage}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {packages.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("showing_packages", {
                count: packages.length,
                current: currentPage,
                total: totalCount,
              })}
            </p>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm cursor-pointer hover:bg-gray-200 transition-all duration-200"
              >
                {t("previous")}
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm cursor-pointer ${
                    currentPage === index + 1
                      ? "bg-[#333e2c] text-white hover:bg-[#333e2c] transition-all duration-100"
                      : "hover:bg-gray-200 transition-all duration-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default AdminPackages;
