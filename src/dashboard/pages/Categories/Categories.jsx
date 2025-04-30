import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import useCategories from "../../hooks/Categories/useCategories";
import { Edit, Search, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Categories = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    loading,
    error,
    totalPages,
    search,
    page,
  } = useCategories();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({ name: "", image: null });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    if (newParams.page) params.page = newParams.page.toString();
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ search, page: newPage });
  };

  const handleEdit = (category) => {
    setIsEditMode(true);
    setEditCategoryId(category.id);
    setCategoryData({ name: category.name, image: null });
    setIsOverlayOpen(true);
  };

  const handleDelete = async (categoryId) => {
    await deleteCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryData.name) {
      toast.error(t("category_name_required"));
      return;
    }

    let success;
    if (isEditMode) {
      success = await editCategory(editCategoryId, categoryData);
    } else {
      success = await addCategory(categoryData);
    }

    if (success) {
      setIsOverlayOpen(false);
      setCategoryData({ name: "", image: null });
      setIsEditMode(false);
      setEditCategoryId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {t("categories")}
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {t("manage_categories")}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_categories")}
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
                setIsEditMode(false);
                setCategoryData({ name: "", image: null });
                setIsOverlayOpen(true);
              }}
              className="w-auto px-4 py-2 bg-blue-600 text-white rounded customEffect cursor-pointer text-sm"
            >
              <span>{t("add_category")}</span>
            </button>
          </div>
        </div>

        {/* Add Overlay Submit */}
        <AnimatePresence>
          {isOverlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-100"
              onClick={() => setIsOverlayOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOverlayOpen(false)}
                  className="text-gray-500 hover:bg-gray-200 p-1 mb-5 cursor-pointer transition-all duration-200"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {isEditMode ? t("edit_category") : t("add_category")}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("category_name")}
                    </label>
                    <input
                      type="text"
                      value={categoryData.name}
                      onChange={(e) =>
                        setCategoryData({
                          ...categoryData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-all duration-200"
                      placeholder={t("enter_category_name")}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("category_image")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setCategoryData({
                          ...categoryData,
                          image: e.target.files[0],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:transition-all duration-200 file:cursor-pointer"
                    />
                    {categoryData.image && (
                      <p className="mt-2 text-xs text-gray-600">
                        {categoryData.image.name}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOverlayOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm cursor-pointer"
                    >
                      {isEditMode ? t("update") : t("add")}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <p className="text-center text-gray-600">{t("loading")}</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-600">{t("no_categories")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("id")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("image")}
                  </th>
                  <th
                    className={`p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("name")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      {category.id}.
                    </td>
                    <td className="p-3 flex justify-center">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/64")
                        }
                      />
                    </td>
                    <td
                      className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {category.name}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                          title={t("edit")}
                        >
                          <Edit size={14} />
                          <span className="hidden sm:inline font-medium">
                            {t("edit")}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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

        {categories.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("showing_categories", {
                start: (page - 1) * 5 + 1,
                end: Math.min(page * 5, categories.length + (page - 1) * 5),
                total: categories.length + (page - 1) * 5,
              })}
            </p>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-2 sm:px-3 py-1 border rounded-lg disabled:opacity-50 text-xs sm:text-sm"
              >
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 sm:px-3 py-1 border rounded-lg text-xs sm:text-sm ${
                    page === index + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-2 sm:px-3 py-1 border rounded-lg disabled:opacity-50 text-xs sm:text-sm"
              >
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
