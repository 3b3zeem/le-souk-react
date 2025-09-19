import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import usePaymentManagement from "../../hooks/Payment/usePaymentManagement";
import { Edit } from "lucide-react";
import Loader from "../../../layouts/Loader";
import { useLanguage } from "../../../context/Language/LanguageContext";

const PaymentMethod = () => {
  const { t } = useTranslation();
  const language = useLanguage();
  const { paymentMethods, loading, updatePaymentMethodFees } =
    usePaymentManagement();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [feeData, setFeeData] = useState({
    fee_type: "",
    fee_value: "",
    minimum_fee: "",
    maximum_fee: "",
  });

  const handleOpenOverlay = (method) => {
    setSelectedMethod(method);
    setFeeData({
      fee_type: method.fees[0]?.fee_type || "",
      fee_value: method.fees[0]?.fee_value || "",
      minimum_fee: method.fees[0]?.minimum_fee || "",
      maximum_fee: method.fees[0]?.maximum_fee || "",
    });
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedMethod(null);
  };

  const handleFeeUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePaymentMethodFees(selectedMethod.id, feeData);
      handleCloseOverlay();
    } catch (err) {
      console.error("Error updating fees:", err);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("id")}
              </th>
              <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 text-center">
                {t("name")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("code")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("status")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("total_fees")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Loader />
            ) : (
              paymentMethods.map((method) => (
                <tr key={method.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                    {method.id}
                  </td>
                  <td className="p-3 text-xs sm:text-sm font-medium text-gray-800 text-center">
                    {method.name}
                  </td>
                  <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                    {method.code}
                  </td>
                  <td className="p-3 text-xs sm:text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        method.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t(method.status)}
                    </span>
                  </td>
                  <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                    {method.total_fees_example.toFixed(2)}{" "}
                    {language === "ar" ? "د.ك." : "KWD"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleOpenOverlay(method)}
                      title={t("edit")}
                      className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs sm:text-sm cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOverlayOpen && selectedMethod && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[500]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
              {t("edit_fees")}
              <span className="text-[#333e2c] text-lg">
                {selectedMethod.name}
              </span>
            </h2>

            <form onSubmit={handleFeeUpdate} className="space-y-5">
              {/* Fee Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("fee_type")}
                </label>
                <select
                  value={feeData.fee_type}
                  onChange={(e) =>
                    setFeeData({ ...feeData, fee_type: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#333e2c] focus:ring focus:ring-[#5b6a52] focus:ring-opacity-50 transition"
                >
                  <option value="">{t("select_fee_type")}</option>
                  <option value="fixed">{t("fixed")}</option>
                  <option value="percentage">{t("percentage")}</option>
                </select>
              </div>

              {/* Fee Value */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("fee_value")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={feeData.fee_value}
                  onChange={(e) =>
                    setFeeData({ ...feeData, fee_value: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#333e2c] focus:ring focus:ring-[#5b6a52]transition"
                  required
                />
              </div>

              {/* Minimum Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("minimum_fee")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={feeData.minimum_fee}
                  onChange={(e) =>
                    setFeeData({ ...feeData, minimum_fee: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#333e2c] focus:ring focus:ring-[#5b6a52] transition"
                />
              </div>

              {/* Maximum Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("maximum_fee")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={feeData.maximum_fee}
                  onChange={(e) =>
                    setFeeData({ ...feeData, maximum_fee: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#333e2c] focus:ring focus:ring-[#5b6a52] transition"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseOverlay}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#333e2c] text-white rounded-lg shadow hover:bg-[#1b2714] transition cursor-pointer"
                  disabled={loading}
                >
                  {loading ? t("saving") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
