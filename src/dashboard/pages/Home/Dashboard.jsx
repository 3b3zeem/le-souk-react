import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/Home/useDashboard";
import { DollarSign, Users, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import Loader from "../../../layouts/Loader";

const Dashboard = () => {
  const { stats, loading, error } = useDashboard();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (
      error &&
      (error.includes("Unauthorized") ||
        error.includes("No authentication token"))
    ) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (loading)
    return <Loader />;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div
      className="min-h-screen bg-gray-100 font-sans"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("dashboard")}
        </h1>
        <p className="text-gray-600 mb-6">{t("welcome_message")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Template */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-gray-500 uppercase text-sm tracking-wide">
                  {t("total_sales")}
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  ${stats.total_sales}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-gray-500 uppercase text-sm tracking-wide">
                  {t("total_users")}
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.users_count}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-gray-500 uppercase text-sm tracking-wide">
                  {t("total_products")}
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.products_count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
