import React, { useState } from "react";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import useSettings from "../../hooks/Settings/useSettings";
import { useSearchParams } from "react-router-dom";
import {
  Layers,
  Search,
  SquarePen,
  Trash2,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loader from "../../../layouts/Loader";
import Meta from "../../../components/Meta/Meta";

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
    addSetting,
    editSetting,
  } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSettingId, setEditSettingId] = useState(null);
  const [settingData, setSettingData] = useState({
    group: "",
    type: "string",
    status: "active",
    is_public: true,
    en_name: "",
    ar_name: "",
    en_value: "",
    ar_value: "",
    en_description: "",
    ar_description: "",
  });

  // Function to generate a unique key
  const generateUniqueKey = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `setting_${timestamp}_${randomNum}`;
  };

  const getTranslatedField = (item, field) => {
    const translation = item.translations?.find((t) => t.locale === language);
    return translation ? translation[field] : item[field];
  };

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    if (newParams.page) params.page = newParams.page;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const handleEdit = (setting) => {
    setIsEditMode(true);
    setEditSettingId(setting.id);

    // Get English translation (default values)
    const enTranslation = setting.translations?.find((t) => t.locale === "en");
    // Get Arabic translation
    const arTranslation = setting.translations?.find((t) => t.locale === "ar");

    setSettingData({
      group: setting.group || "site",
      type: setting.type || "text",
      status: setting.status || "active",
      is_public: setting.is_public !== undefined ? setting.is_public : true,
      en_name: enTranslation?.name || setting.name || "",
      ar_name: arTranslation?.name || "",
      en_value: enTranslation?.value || setting.value || "",
      ar_value: arTranslation?.value || "",
      en_description: enTranslation?.description || setting.description || "",
      ar_description: arTranslation?.description || "",
    });

    setIsOverlayOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!settingData.en_name) {
      toast.error(t("settings.nameRequired", "Name is required"));
      return;
    }

    const formData = {
      key: isEditMode ? undefined : generateUniqueKey(), // Generate key only for new settings
      group: settingData.group,
      type: settingData.type,
      status: settingData.status,
      is_public: settingData.is_public,
      en: {
        name: settingData.en_name,
        value: settingData.en_value,
        description: settingData.en_description,
      },
      ar: {
        name: settingData.ar_name,
        value: settingData.ar_value,
        description: settingData.ar_description,
      },
    };

    let success;
    if (isEditMode) {
      success = await editSetting(editSettingId, formData);
    } else {
      success = await addSetting(formData);
    }

    if (success) {
      setIsOverlayOpen(false);
      setSettingData({
        group: "site",
        type: "text",
        status: "active",
        is_public: true,
        en_name: "",
        ar_name: "",
        en_value: "",
        ar_value: "",
        en_description: "",
        ar_description: "",
      });
      setIsEditMode(false);
      setEditSettingId(null);
    }
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
      }
    });
  };

  // Add error handling for missing contexts
  if (!language || !t) {
    return <div>Loading language context...</div>;
  }

  const settingTypes = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "text", label: "Text" },
    { value: "json", label: "JSON" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div
      className={`container mx-auto p-1 ${language === "ar" ? "rtl" : "ltr"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="Settings Management"
        description="Manage your settings effectively with our dashboard."
      />
      <h2 className="text-2xl font-bold mb-4">
        {t("settings.title", "Settings")}
      </h2>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder={t("search_products", "Search settings...")}
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
          <button
            className="w-auto px-4 py-2 bg-[#333e2c] text-white rounded customEffect cursor-pointer text-sm hover:bg-[#2a3225] transition-colors"
            onClick={() => {
              setIsEditMode(false);
              setSettingData({
                group: "site",
                type: "text",
                status: "active",
                is_public: true,
                en_name: "",
                ar_name: "",
                en_value: "",
                ar_value: "",
                en_description: "",
                ar_description: "",
              });
              setIsOverlayOpen(true);
            }}
          >
            <span>{t("settings.add", "Add Setting")}</span>
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
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto mt-6"
            onClick={() => setIsOverlayOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 overflow-y-auto z-index-50 mt-6"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: "90vh" }}
            >
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded p-2 transition cursor-pointer"
              >
                <X size={22} className="text-gray-500" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {isEditMode
                  ? t("settings.edit", "Edit Setting")
                  : t("settings.add", "Add Setting")}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
              >
                {/* English Name and Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.name", "Name")} (English) *
                  </label>
                  <input
                    type="text"
                    value={settingData.en_name}
                    onChange={(e) =>
                      setSettingData({
                        ...settingData,
                        en_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={t("settings.enterName", "Enter setting name")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.value", "Value")} (English)
                  </label>
                  <input
                    type="text"
                    value={settingData.en_value}
                    onChange={(e) =>
                      setSettingData({
                        ...settingData,
                        en_value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={t(
                      "settings.enterValue",
                      "Enter setting value"
                    )}
                  />
                </div>

                {/* Arabic Name and Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.name", "Name")} (Arabic)
                  </label>
                  <input
                    type="text"
                    value={settingData.ar_name}
                    onChange={(e) =>
                      setSettingData({
                        ...settingData,
                        ar_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={t(
                      "settings.enterNameAr",
                      "Enter setting name in Arabic"
                    )}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.value", "Value")} (Arabic)
                  </label>
                  <input
                    type="text"
                    value={settingData.ar_value}
                    onChange={(e) =>
                      setSettingData({
                        ...settingData,
                        ar_value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={t(
                      "settings.enterValueAr",
                      "Enter setting value in Arabic"
                    )}
                    dir="rtl"
                  />
                </div>

                {/* English Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.description", "Description")} (English)
                  </label>
                  <textarea
                    value={settingData.en_description}
                    onChange={(e) =>
                      setSettingData({
                        ...settingData,
                        en_description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    rows="3"
                    placeholder={t(
                      "settings.enterDescription",
                      "Enter description"
                    )}
                  />
                </div>

                {/* Arabic Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.description", "Description")} (Arabic)
                  </label>
                  <textarea
                    value={settingData.ar_description}
                    onChange={(e) =>
                      setSettingData({
                        ...settingData,
                        ar_description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    rows="3"
                    placeholder={t(
                      "settings.enterDescriptionAr",
                      "Enter description in Arabic"
                    )}
                    dir="rtl"
                  />
                </div>

                {/* Buttons */}
                <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOverlayOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer font-medium"
                  >
                    {t("cancel", "Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#333e2c] text-white rounded-lg hover:bg-[#2a3225] transition-all duration-200 text-sm cursor-pointer font-medium shadow"
                  >
                    {isEditMode ? t("update", "Update") : t("add", "Add")}
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
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {t("error", "Error:")} {error}
        </div>
      ) : !settings || settings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <SettingsIcon size={48} className="text-gray-400 mb-4" />
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
                    <div className="max-w-xs overflow-hidden">
                      {getTranslatedField(setting, "description") || "-"}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(setting)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        title={t("edit", "Edit")}
                      >
                        <SquarePen size={14} />
                      </button>
                      <button
                        onClick={() =>
                          onDelete(
                            setting.id,
                            getTranslatedField(setting, "name")
                          )
                        }
                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        title={t("delete", "Delete")}
                      >
                        <Trash2 size={14} />
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
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            {t("pagination.showing", "Showing")} {(page - 1) * perPage + 1}{" "}
            {t("pagination.to", "to")} {Math.min(page * perPage, total)}{" "}
            {t("pagination.of", "of")} {total}{" "}
            {t("pagination.results", "results")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t("pagination.previous", "Previous")}
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 text-sm rounded ${
                      page === pageNum
                        ? "bg-[#333e2c] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t("pagination.next", "Next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
