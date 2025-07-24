import React, { useState, useEffect } from "react";
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
import { DotSpinner } from "ldrs/react";
import StarterKit from "@tiptap/starter-kit";
import "ldrs/react/DotSpinner.css";
import RichTextField from "./RichTextField";

const Settings = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const {
    settings,
    loading,
    error,
    search,
    page,
    totalPages,
    total,
    perPage,
    handlePageChange,
    handlePerPageChange,
    editSetting,
  } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [editSettingKey, setEditSettingKey] = useState(null);
  const [settingData, setSettingData] = useState({
    key: "",
    group: "",
    type: "string",
    status: "active",
    is_public: true,
    en_name: "",
    ar_name: "",
    en_value: null,
    ar_value: null,
    en_description: "",
    ar_description: "",
  });
  const [previewUrls, setPreviewUrls] = useState({
    en_value: null,
    ar_value: null,
  });

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
    setEditSettingKey(setting.key);

    const enTranslation = setting.translations?.find((t) => t.locale === "en");
    const arTranslation = setting.translations?.find((t) => t.locale === "ar");

    const baseUrl = "https://le-souk.dinamo-app.com/storage/";
    const currentEnValue = enTranslation?.value || setting.value || null;
    const currentArValue = arTranslation?.value || setting.value || null;

    setSettingData({
      key: setting.key,
      group: setting.group || "site",
      type: setting.type || "text",
      status: setting.status || "active",
      is_public: setting.is_public !== undefined ? setting.is_public : true,
      en_name: enTranslation?.name || setting.name || "",
      ar_name: arTranslation?.name || "",
      en_value: currentEnValue,
      ar_value: currentArValue,
      en_description: enTranslation?.description || setting.description || "",
      ar_description: arTranslation?.description || "",
    });

    setPreviewUrls({
      en_value:
        currentEnValue && typeof currentEnValue === "string"
          ? `${baseUrl}${currentEnValue}`
          : null,
      ar_value:
        currentArValue && typeof currentArValue === "string"
          ? `${baseUrl}${currentArValue}`
          : null,
    });

    setIsOverlayOpen(true);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must not exceed 5MB.");
        return;
      }
      setSettingData((prev) => ({
        ...prev,
        [field]: file,
      }));
      setPreviewUrls((prev) => ({
        ...prev,
        [field]: URL.createObjectURL(file),
      }));
    }
  };

  const handleValueChange = (field, value) => {
    setSettingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!settingData.en_name) {
      toast.error(t("settings.nameRequired", "Name is required"));
      return;
    }

    const baseFormData = new FormData();
    baseFormData.append("_method", "PUT");
    baseFormData.append("status", settingData.status);
    baseFormData.append("is_public", settingData.is_public ? "1" : "0");
    baseFormData.append("en[name]", settingData.en_name);
    baseFormData.append("ar[name]", settingData.ar_name);
    baseFormData.append("en[description]", settingData.en_description);
    baseFormData.append("ar[description]", settingData.ar_description);

    let success = true;

    if (settingData.en_value instanceof File) {
      const enFormData = new FormData();
      enFormData.append("_method", "PUT");
      enFormData.append("status", settingData.status);
      enFormData.append("is_public", settingData.is_public ? "1" : "0");
      enFormData.append("en[name]", settingData.en_name);
      enFormData.append("ar[name]", settingData.ar_name);
      enFormData.append("en[description]", settingData.en_description);
      enFormData.append("ar[description]", settingData.ar_description);
      enFormData.append("en[value]", settingData.en_value);
      success = (await editSetting(editSettingKey, enFormData)) && success;
    } else if (typeof settingData.en_value === "string") {
      baseFormData.append("en[value]", settingData.en_value);
    }

    if (settingData.ar_value instanceof File) {
      const arFormData = new FormData();
      arFormData.append("_method", "PUT");
      arFormData.append("status", settingData.status);
      arFormData.append("is_public", settingData.is_public ? "1" : "0");
      arFormData.append("en[name]", settingData.en_name);
      arFormData.append("ar[name]", settingData.ar_name);
      arFormData.append("en[description]", settingData.en_description);
      arFormData.append("ar[description]", settingData.ar_description);
      arFormData.append("ar[value]", settingData.ar_value);
      success = (await editSetting(editSettingKey, arFormData)) && success;
    } else if (typeof settingData.ar_value === "string") {
      baseFormData.append("ar[value]", settingData.ar_value);
    }

    if (
      !(settingData.en_value instanceof File) &&
      !(settingData.ar_value instanceof File)
    ) {
      success = (await editSetting(editSettingKey, baseFormData)) && success;
    }

    if (success) {
      setIsOverlayOpen(false);
      setSettingData({
        key: "",
        group: "site",
        type: "text",
        status: "active",
        is_public: true,
        en_name: "",
        ar_name: "",
        en_value: null,
        ar_value: null,
        en_description: "",
        ar_description: "",
      });
      setPreviewUrls({
        en_value: null,
        ar_value: null,
      });
      setEditSettingKey(null);
    }
  };

  const perPageOptions = [10, 15, 20, 50];

  return (
    <div
      className={`max-w-7xl mx-auto py-10 p-1 bg-gray-50`}
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
      </div>

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
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 overflow-y-auto z-50 mt-6"
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
                {t("settings.edit", "Edit Setting")}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
              >
                {/* En Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.name", "Name")} (English)
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

                {/* Ar Name */}
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

                {/* En Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.value", "Value")} (English)
                  </label>
                  {settingData.type === "image" ? (
                    <div className="flex flex-col gap-2 border border-dashed border-gray-300 rounded-lg p-2">
                      <label htmlFor="file-en_value" className="cursor-pointer">
                        {(previewUrls.en_value ||
                          (settingData.en_value &&
                            typeof settingData.en_value === "string")) && (
                          <img
                            src={previewUrls.en_value || settingData.en_value}
                            alt="Current/Selected English Value"
                            className="w-full h-50 object-cover mb-2 rounded"
                          />
                        )}
                      </label>
                      <input
                        id="file-en_value"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "en_value")}
                        className="hidden"
                      />
                    </div>
                  ) : settingData.type === "richtext" ? (
                    <div
                      style={{ height: "200px" }}
                    >
                      <RichTextField
                        value={settingData.en_value}
                        onChange={(value) =>
                          handleValueChange("en_value", value)
                        }
                        dir="ltr"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={settingData.en_value || ""}
                      onChange={(e) =>
                        setSettingData({
                          ...settingData,
                          en_value: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      rows="3"
                      placeholder={t(
                        "settings.enterValue",
                        "Enter setting value"
                      )}
                    />
                  )}
                </div>

                {/* Ar Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("settings.value", "Value")} (Arabic)
                  </label>
                  {settingData.type === "image" ? (
                    <div className="flex flex-col gap-2 border border-dashed border-gray-300 rounded-lg p-2">
                      <label htmlFor="file-ar_value" className="cursor-pointer">
                        {(previewUrls.ar_value ||
                          (settingData.ar_value &&
                            typeof settingData.ar_value === "string")) && (
                          <img
                            src={previewUrls.ar_value || settingData.ar_value}
                            alt="Current/Selected Arabic Value"
                            className="w-full h-50 object-cover mb-2 rounded"
                          />
                        )}
                      </label>
                      <input
                        id="file-ar_value"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "ar_value")}
                        className="hidden"
                      />
                    </div>
                  ) : settingData.type === "richtext" ? (
                    <div
                      className="focus:outline-none"
                      style={{ height: "200px" }}
                    >
                      <RichTextField
                        value={settingData.ar_value}
                        onChange={(value) =>
                          handleValueChange("ar_value", value)
                        }
                        dir="rtl"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={settingData.ar_value || ""}
                      onChange={(e) =>
                        setSettingData({
                          ...settingData,
                          ar_value: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      rows="3"
                      placeholder={t(
                        "settings.enterValue",
                        "Enter setting value"
                      )}
                      dir="rtl"
                    />
                  )}
                </div>

                {/* En Description */}
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

                {/* Ar Description */}
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
                    className={`px-4 py-2 bg-[#333e2c] text-white rounded-lg hover:bg-[#2a3225] transition-all duration-200 text-sm cursor-pointer font-medium shadow ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <DotSpinner size="17" speed="0.9" color="white" />
                    ) : (
                      t("update", "Update")
                    )}
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
                  {t("settings.type", "type")}
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
                    {setting.type.charAt(0).toUpperCase() +
                      setting.type.slice(1)}
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
                        className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center gap-2 cursor-pointer"
                        title={t("edit", "Edit")}
                      >
                        <SquarePen size={14} />
                        <span>Edit</span>
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
