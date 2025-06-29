import React from "react";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import useSettings from "../../hooks/Settings/useSettings";
import { useSearchParams } from "react-router-dom";
import { Layers, Search, SquarePen, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loader from "../../../layouts/Loader";

const Settings = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const {
    settings,
    loading,
    error,
    successMessage,
    search,
    page,
    totalPages,
    total,
    perPage,
    handlePageChange,
    handlePerPageChange,
    handleDelete,
  } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTranslatedField = (item, field) => {
    const translation = item.translations.find((t) => t.locale === language);
    return translation ? translation[field] : item[field];
  };

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const perPageOptions = [10, 15, 20, 50];

  const onDelete = (id, name) => {
    Swal.fire({
      title: t("settings.deleteConfirmTitle", "Confirm Deletion"),
      text:
        language === "ar"
          ? `هل أنت متأكد من حذف الإعداد "${name}"؟`
          : `Are you sure you want to delete the setting "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("settings.deleteConfirmButton", "Yes, delete it!"),
      cancelButtonText: t("settings.cancelButton", "Cancel"),
      reverseButtons: language === "ar",
      direction: language === "ar" ? "rtl" : "ltr",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
        toast.success(successMessage);
      }
    });
  };

  return (
    <div
      className={`container mx-auto p-1 ${language === "ar" ? "rtl" : "ltr"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-2xl font-bold mb-4">
        {t("settings.title", "Settings")}
      </h2>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            {t("settings.perPage", "Items per page:")}
          </label>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-300 focus:border-[#5e8db8] block px-4 py-2 transition duration-200 shadow-sm hover:border-gray-400 disabled:opacity-50 focus:outline-none cursor-pointer"
            disabled={loading}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-auto">
          <button className="w-auto px-4 py-2 bg-[#333e2c] text-white rounded customEffect cursor-pointer text-sm">
            <span>{t("settings.add")}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {t("error", "Error:")} {error}
        </div>
      ) : settings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Settings size={48} className="text-gray-400 mb-4" />
          <p className="text-center text-gray-600 text-lg">
            {t("no_data", "No settings found.")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.name", "Name")}
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.key", "Key")}
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.value", "Value")}
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.group", "Group")}
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.type", "Type")}
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.description", "Description")}
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {t("settings.actions", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr
                  key={setting.id}
                  className="border-b border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getTranslatedField(setting, "name")}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {setting.key}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getTranslatedField(setting, "value") || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {setting.group}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {setting.type}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getTranslatedField(setting, "description") || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm flex items-center gap-3">
                    <button
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs"
                      title={t("edit")}
                    >
                      <SquarePen size={14} />
                      <span className="sm:inline hidden font-medium">
                        {t("edit", "Edit")}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        onDelete(
                          setting.id,
                          getTranslatedField(setting, "name")
                        )
                      }
                      className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer text-xs"
                      title={t("delete")}
                    >
                      <Trash2 size={14} />
                      <span className="sm:inline hidden font-medium">
                        {t("delete", "Delete")}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {settings.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <p className="text-xs sm:text-sm text-gray-600">
            {language === "ar"
              ? `عرض ${(page - 1) * perPage + 1} إلى ${Math.min(
                  page * perPage,
                  total
                )} من ${total} إعدادات`
              : `Showing ${(page - 1) * perPage + 1} to ${Math.min(
                  page * perPage,
                  total
                )} of ${total} settings`}
          </p>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-2 sm:px-3 py-1 border rounded-lg disabled:opacity-50 text-xs sm:text-sm"
            >
              {language === "ar" ? ">" : "<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-2 sm:px-3 py-1 border rounded-lg text-xs sm:text-sm ${
                  page === index + 1 ? "bg-[#333e2c] text-white" : ""
                }`}
                disabled={loading}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
              className="px-2 sm:px-3 py-1 border rounded-lg disabled:opacity-50 text-xs sm:text-sm"
            >
              {language === "ar" ? "<" : ">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
