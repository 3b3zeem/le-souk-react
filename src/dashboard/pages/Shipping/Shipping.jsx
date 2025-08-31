import React, { useState } from "react";
import useShipping from "../../hooks/Shipping/useShipping";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import Meta from "../../../components/Meta/Meta";
import Loader from "../../../layouts/Loader";
import { SquarePen } from "lucide-react";
import ShippingRatesModal from "./ShippingRatesModal";

const Shipping = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const {
    shippingMethods,
    supportedCountries,
    updateShippingRates,
    loading,
    error,
  } = useShipping();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);

  const handleOpenModal = (method, rate = null) => {
    setSelectedMethod(method);
    setSelectedRate(rate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMethod(null);
    setSelectedRate(null);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-1 sm:p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="Shipping Methods"
        description="Manage your shipping methods and rates"
      />
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {t("shipping")}
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {t("manage_shipping_methods")}
        </p>

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : shippingMethods.length === 0 ? (
          <p className="text-center text-gray-600">{t("no_orders")}</p>
        ) : (
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
                    {t("code")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("status")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("price")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("rates")}
                  </th>
                  {/* <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("actions")}
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {shippingMethods.map((ship) => (
                  <tr key={ship.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      {ship.id}
                    </td>
                    <td
                      className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {ship.name || "N/A"}
                    </td>
                    <td
                      className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {ship.description.toString().slice(0, 40) || "N/A"}
                      {ship.description?.length > 20 ? "..." : ""}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      {ship.code || "N/A"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ship.status === "active"
                            ? "bg-green-100 text-green-600"
                            : ship.status === "inactive"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {ship.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      {ship.price} {language === "ar" ? "د.ك." : "KWD"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-start">
                      {ship.rates?.length > 0 ? (
                        <ul className="list-none">
                          {ship.rates.map((rate) => (
                            <li
                              key={rate.id}
                              className="mb-1 flex items-start justify-between gap-2"
                            >
                              <span>
                                {rate.country.name}: {rate.rate}{" "}
                                {language === "ar" ? "د.ك." : "KWD"} (
                                {t("free_above")} {rate.free_shipping_threshold})
                              </span>
                              <button
                                onClick={() => handleOpenModal(ship, rate)}
                                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                title={t("edit_rate")}
                              >
                                <SquarePen size={12} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <button
                          onClick={() => handleOpenModal(ship)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          {t("add_rate")}
                        </button>
                      )}
                    </td>
                    {/* <td className="p-3">
                      <div className="flex items-center flex-col gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(ship)}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center gap-2 cursor-pointer"
                            title={t("edit", "Edit")}
                          >
                            <SquarePen size={14} />
                            {t("edit")}
                          </button>
                        </div>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ShippingRatesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          shippingMethod={selectedMethod}
          selectedRate={selectedRate}
          supportedCountries={supportedCountries}
          updateShippingRates={updateShippingRates}
        />
      </div>
    </div>
  );
};

export default Shipping;
