import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAdminPackages from "../../hooks/Packages/useAdminPackages";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Edit, Layers, Search, Trash2 } from "lucide-react";
import Loader from "../../../layouts/Loader";
import { motion, AnimatePresence } from "framer-motion";
import AddPackageForm from "./AddPackageForm";

const AdminPackages = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    packages,
    products,
    addPackage,
    deletePackage,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
  } = useAdminPackages();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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
  };

  const handleAddPackage = async (formData) => {
    const success = await addPackage(formData);
    if (success) {
      setIsOverlayOpen(false);
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
            onClick={() => setIsOverlayOpen(true)}
            className="flex flex-col sm:flex-row gap-3 w-auto"
          >
            <button className="w-auto px-4 py-2 bg-blue-600 text-white rounded customEffect cursor-pointer text-sm">
              <span>{t("add_package")}</span>
            </button>
          </div>
        </div>

        {/* Add Package */}
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
                  onClose={() => setIsOverlayOpen(false)}
                  onSubmit={handleAddPackage}
                  products={products}
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
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
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
                      {language === "ar" ? "ج.م" : "LE"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center text-blue-700 font-bold">
                      {Number(pkg.discounted_price).toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "LE"}
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
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                          title={t("edit")}
                        >
                          <Edit size={14} />
                          <span className="hidden sm:inline font-medium">
                            {t("edit")}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                          title={t("delete")}
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline font-medium">
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
                      ? "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-100"
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
