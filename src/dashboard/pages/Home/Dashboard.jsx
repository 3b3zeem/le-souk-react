import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/Home/useDashboard";
import { DollarSign, Users, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import Loader from "../../../layouts/Loader";
import Meta from "../../../components/Meta/Meta";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div
      className="min-h-screen bg-gray-100 font-sans"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="Dashboard Statistics"
        description="View your dashboard statistics and insights."
      />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("dashboard")}
        </h1>
        <p className="text-gray-600 mb-6">{t("welcome_message")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sales */}
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

          {/* Users */}
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

          {/* Products */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {t("basic_distribution")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={[
                    { name: t("users"), value: stats.users_count },
                    { name: t("products"), value: stats.products_count },
                    { name: t("sales"), value: stats.total_sales },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#34D399" />
                  <Cell fill="#60A5FA" />
                  <Cell fill="#F87171" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {t("basic_bar_chart")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: t("users"), value: stats.users_count },
                  { name: t("products"), value: stats.products_count },
                  { name: t("sales"), value: stats.total_sales },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#333e2c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
