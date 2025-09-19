import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import usePaymentManagement from "../../hooks/Payment/usePaymentManagement";
import { Edit } from "lucide-react";
import Loader from "../../../layouts/Loader";

const PaymentSettings = () => {
  const { t } = useTranslation();
  const { paymentSettings, loading, updatePaymentSettings } =
    usePaymentManagement();
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [settingValue, setSettingValue] = useState("");

  const handleOpenOverlay = (setting) => {
    setSelectedSetting(setting);
    setSettingValue(setting.value);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedSetting(null);
    setSettingValue("");
  };

  const handleSettingUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePaymentSettings([
        {
          key: selectedSetting.key,
          value: settingValue,
        },
      ]);
      handleCloseOverlay();
    } catch (err) {
      console.error("Error updating setting:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{t("payment_settings")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-start text-xs sm:text-sm font-semibold text-gray-700">
                {t("key")}
              </th>
              <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 text-center">
                {t("value")}
              </th>
              <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                {t("type")}
              </th>
              <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 text-center">
                {t("description")}
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
              (paymentSettings || []).map((setting) => (
                <tr key={setting.key} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs sm:text-sm text-gray-600 text-start">
                    {setting.key}
                  </td>
                  <td className="p-3 text-xs sm:text-sm font-medium text-gray-800 text-center">
                    {setting.type === "password" ? "••••••••" : setting.value}
                  </td>
                  <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                    {setting.type}
                  </td>
                  <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                    {setting.description}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleOpenOverlay(setting)}
                      title={t("edit")}
                      className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-xs sm:text-sm cursor-pointer"
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

      {isOverlayOpen && selectedSetting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[500]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
              {t("edit_setting")}
              <span className="text-[#333e2c]">{selectedSetting.key}</span>
            </h2>

            <form onSubmit={handleSettingUpdate} className="space-y-5">
              {/* Value Input / Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("value")}
                </label>
                {selectedSetting.type === "password" ? (
                  <textarea
                    rows="4"
                    value={settingValue}
                    onChange={(e) => setSettingValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#333e2c] focus:ring focus:ring-emerald-900 transition"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    value={settingValue}
                    onChange={(e) => setSettingValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#333e2c] focus:ring focus:ring-emerald-900 transition"
                    required
                  />
                )}
              </div>

              {/* Description */}
              <div className="cursor-not-allowed">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t("description")}
                </label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">
                  {selectedSetting.description}
                </p>
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
                  className="px-5 py-2.5 bg-[#333e2c] text-white rounded-lg shadow hover:bg-[#222e1b] transition cursor-pointer"
                  disabled={loading}
                >
                  {loading ? t("saving...") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;
