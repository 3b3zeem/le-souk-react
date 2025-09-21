import React, { useState, useEffect } from "react";
import { useCountry } from "../../hooks/Country/useCountry";
import CountryModal from "./CountryModal";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import Loader from "../../../layouts/Loader";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import Meta from "../../../components/Meta/Meta";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sort_order: "",
    en: { name: "" },
    ar: { name: "" },
  });
  const [editingId, setEditingId] = useState(null);
  // createCountry,
  const { getCountries, updateCountry, toggleActive, loading } =
    useCountry();
  const language = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCountries();
  }, [page, perPage]);

  const fetchCountries = async () => {
    try {
      const data = await getCountries(page, perPage);
      setCountries(data.data);
      setTotalPages(Math.ceil(data.data.length / perPage));
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCountry(editingId, formData);
      } 
      // else {
      //   await createCountry(formData);
      // }
      setFormData({
        sort_order: "",
        en: { name: "" },
        ar: { name: "" },
      });
      setEditingId(null);
      setIsModalOpen(false);
      fetchCountries();
    } catch (err) {
      console.error("Error saving country:", err);
    }
  };

  const handleEdit = (country) => {
    setFormData({
      code: country.code,
      sort_order: country.sort_order,
      en: { name: country.translations.en.name },
      ar: { name: country.translations.ar.name },
    });
    setEditingId(country.id);
    setIsModalOpen(true);
  };

  const handleToggle = async (id) => {
    try {
      await toggleActive(id);
      fetchCountries();
    } catch (err) {
      console.error("Error deleting country:", err);
    }
  };

  // const openAddModal = () => {
  //   setFormData({
  //     sort_order: "",
  //     en: { name: "" },
  //     ar: { name: "" },
  //   });
  //   setEditingId(null);
  //   setIsModalOpen(true);
  // };

  return (
    <div className="container mx-auto p-4">
      <Meta
        title="Country Management"
        description="Manage countries in the admin dashboard"
      />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">{t("Country Management")}</h1>

        {/* <button
          onClick={openAddModal}
          className="bg-[#333e2c] text-white px-4 py-2 mb-4 customEffect cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Plus />
            {t("Add Country")}
          </span>
        </button> */}
      </div>

      <CountryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingId={editingId}
        loading={loading}
      />

      {/* {loading ? (
        <Loader />
      ) : ( */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("id")}
              </th>
              <th
                className={`p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("code")}
              </th>
              <th
                className={`p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("english_name")}
              </th>
              <th
                className={`p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("arabic_name")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("status")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("created_at")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                  {country.id}
                </td>
                <td
                  className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {country.code}
                </td>
                <td
                  className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {country.translations.en.name}
                </td>
                <td
                  className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {country.translations.ar.name}
                </td>
                <td className="p-3 text-xs sm:text-sm text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      country.is_active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t(country.is_active ? "active" : "inactive")}
                  </span>
                </td>
                <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                  {new Date(country.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(country)}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                      title={t("edit")}
                      disabled={loading}
                    >
                      <CheckCircle size={14} />
                      <span className="hidden sm:inline font-medium">
                        {t("edit")}
                      </span>
                    </button>
                    <button
                      onClick={() => handleToggle(country.id)}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#333e2c] text-white rounded-lg hover:opacity-80 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                      title={t("ChangeActive")}
                      disabled={loading}
                    >
                      <span className="hidden sm:inline font-medium">
                        {t("ChangeActive")}
                      </span>
                      {country.is_active ? (
                        <XCircle size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* )} */}

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          {t("Previous")}
        </button>
        <span>
          {t("Page")} {page} {t("of")} {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages || loading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
};

export default Country;
