import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PaymentMethod from "./PaymentMethod";
import PaymentSettings from "./PaymentSettings";
import Meta from "./../../../components/Meta/Meta";

const PaymentManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("methods");

  return (
    <div className="container mx-auto p-4">
      <Meta title="Payment Management" />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        {t("payment_management")}
      </h1>
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "methods"
                ? "border-b-2 border-[#333e2c] text-[#333e2c]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("methods")}
          >
            {t("payment_methods")}
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "settings"
                ? "border-b-2 border-[#333e2c] text-[#333e2c]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            {t("payment_settings")}
          </button>
        </div>
      </div>

      {activeTab === "methods" ? <PaymentMethod /> : <PaymentSettings />}
    </div>
  );
};

export default PaymentManagement;
