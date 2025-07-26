import React, { useRef, useEffect, useState } from "react";
import useAdminHero from "../../hooks/Hero/useAdminHero";
import Loader from "../../../layouts/Loader";
import { Edit, Images, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import AddEditSliderForm from "./AddEditSliderForm";

const AdminHero = () => {
  const {
    heros,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    page,
    setPage,
    search,
    setSearch,
    deleteHero,
    refetch,
    addHero,
    updateHero,
  } = useAdminHero();
  const searchInputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Initialize state from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlPage = parseInt(searchParams.get("page")) || 1;
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlPage !== page) setPage(urlPage);
    // eslint-disable-next-line
  }, []);

  // Sync search/page to URL
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (page && page !== 1) params.page = page;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line
  }, [search, page]);

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Search handler
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Delete handler
  const handleDelete = async (sliderId) => {
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
      try {
        const ok = await deleteHero(sliderId);
        if (ok) {
          Swal.fire(
            t("deletedSuccessfully"),
            t("itemHasBeenDeleted"),
            "success"
          );
          refetch();
        }
      } catch (err) {
        Swal.fire(
          t("error"),
          err.message || t("failedToDeleteSliderHero"),
          "error"
        );
      }
    }
  };

  // Edit handler
  const handleEdit = (hero) => {
    setSelectedHero(hero);
    setIsFormOpen(true);
  };

  // Add new hero handler
  const handleAddNew = () => {
    setSelectedHero(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedHero) {
        const ok = await updateHero(selectedHero.id, formData);
        if (ok) {
          refetch();
          return true;
        }
      } else {
        const ok = await addHero(formData);
        if (ok) {
          refetch();
          return true;
        }
      }
      return false;
    } catch (err) {
      Swal.fire(
        t("error"),
        err.message || t("failedToSaveSliderHero"),
        "error"
      );
      return false;
    }
  };

  return (
    <React.Fragment>
      <div
        className="min-h-screen bg-gray-50 p-1 sm:p-6 w-[100%]"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="container mx-auto w-[100%]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 w-[100%]">
              {t("sliderHeros")}
            </h1>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base w-[100% - w-16]">
              {t("manageSliderHeros")}
            </p>
          </div>

          {/* Search Input */}
          <div className="w-[100%] flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder={t("searchSliderHeros")}
                ref={searchInputRef}
                className={`w-[190px] sm:w-full focus:w-full  py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#333e2c] transition-all duration-200 placeholder:text-gray-400 ${
                  language === "ar" ? "pr-10 pl-4" : "pr-4 pl-10"
                }`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              <span
                className={`absolute top-1/2 transform -translate-y-1/2 ${
                  language === "ar" ? "right-3" : "left-3"
                }`}
              >
                <Images size={17} className="text-gray-500" />
              </span>
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-[#333e2c] text-white text-sm sm:text-base cursor-pointer customEffect"
            >
              <span className="flex items-center gap-2">
                <Plus size={18} />
                {t("addSliderHero")}
              </span>
            </button>
          </div>

          {/* Add/Edit Form */}
          <AddEditSliderForm
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            initialData={selectedHero}
            onSubmit={handleFormSubmit}
            loading={loading}
            t={t}
            language={language}
          />

          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : heros.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-4xl mb-4">
                <Images size={40} />
              </span>
              <p className="text-center text-gray-600 text-lg">
                {t("noSliderHerosFound")}
              </p>
            </div>
          ) : (
            <div className="w-[100%] overflow-x-auto">
              <table className="border-collapse bg-white rounded-lg shadow table-auto w-[100%]">
                <thead className="w-[100%] overflow-x-auto">
                  <tr className="bg-gray-100 w-[100%] overflow-x-auto">
                    <th className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-700">
                      {t("image")}
                    </th>
                    <th className="p-2 sm:p-3 text-xs font-semibold text-gray-700 text-left">
                      {t("isActive")}
                    </th>
                    <th className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-700">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="w-[100%] overflow-x-auto">
                  {heros.map((hero) => (
                    <tr
                      key={hero.id}
                      className="border-b hover:bg-gray-50 w-[100%] overflow-x-auto"
                    >
                      <td
                        className="p-2 sm:p-3 flex justify-center"
                        data-label={t("image")}
                      >
                        <img
                          src={hero.image_url || "/default_product.jpg"}
                          alt={hero.title || "slider"}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200"
                          onError={(e) =>
                            (e.target.src = "/default_product.jpg")
                          }
                        />
                      </td>
                      <td
                        className="p-2 sm:p-3 text-xs font-medium text-gray-800 max-w-[200px] truncate text-left"
                        data-label={t("isActive")}
                      >
                        {hero.is_active ? t("active") : t("inactive")}
                      </td>
                      <td
                        className="p-2 sm:p-3 text-center"
                        data-label={t("actions")}
                      >
                        <div className="flex justify-center items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleEdit(hero)}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                            title={t("edit")}
                          >
                            <Edit size={14} />
                            <span className="hidden sm:inline font-medium">
                              {t("edit")}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(hero.id)}
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
          {heros.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
              <p className="text-xs sm:text-sm text-gray-600">
                {t("showingSliderHeros", {
                  count: heros.length,
                  current: currentPage,
                  total: totalCount,
                  totalPages: totalPages,
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
                        ? "bg-[#333e2c] text-white hover:bg-[#333e2c] transition-all duration-100"
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
    </React.Fragment>
  );
};

export default AdminHero;
