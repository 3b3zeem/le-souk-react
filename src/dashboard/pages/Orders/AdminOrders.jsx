import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import useOrders from "../../hooks/Orders/useOrders";
import { CheckCircle, XCircle, Search } from "lucide-react";

const AdminOrders = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    orders,
    confirmOrder,
    rejectOrder,
    loading,
    error,
    totalPages,
    search,
    page,
  } = useOrders();

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    if (newParams.page) params.page = newParams.page.toString();
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ search, page: newPage });
  };

  const handleConfirm = async (orderId) => {
    await confirmOrder(orderId);
  };

  const handleReject = async (orderId) => {
    await rejectOrder(orderId);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {t("orders")}
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {t("manage_orders")}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_orders")}
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : orders.length === 0 ? (
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
                    {t("customer")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("total")}
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
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      {order.id}
                    </td>
                    <td
                      className={`p-3 text-xs sm:text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      ${order.total_price || "0.00"}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : order.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {t(order.status || "pending")}
                      </span>
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-gray-600 text-center">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirm(order.id)}
                              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                              title={t("confirm")}
                              disabled={loading}
                            >
                              {loading ? (
                                <svg
                                  className="animate-spin h-4 w-4 text-green-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              ) : (
                                <>
                                  <CheckCircle size={14} />
                                  <span className="hidden sm:inline font-medium">
                                    {t("confirm")}
                                  </span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(order.id)}
                              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                              title={t("reject")}
                              disabled={loading}
                            >
                              {loading ? (
                                <svg
                                  className="animate-spin h-4 w-4 text-red-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              ) : (
                                <>
                                  <XCircle size={14} />
                                  <span className="hidden sm:inline font-medium">
                                    {t("reject")}
                                  </span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              {t("showing_orders", {
                start: (page - 1) * 5 + 1,
                end: Math.min(page * 5, orders.length + (page - 1) * 5),
                total: orders.length + (page - 1) * 5,
              })}
            </p>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="px-2 sm:px-3 py-1 border rounded-lg disabled:opacity-50 text-xs sm:text-sm"
              >
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 sm:px-3 py-1 border rounded-lg text-xs sm:text-sm ${
                    page === index + 1 ? "bg-blue-600 text-white" : ""
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
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
