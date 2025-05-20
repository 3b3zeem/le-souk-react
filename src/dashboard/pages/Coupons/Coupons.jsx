import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import useCoupons from "../../hooks/Coupons/useCoupons";
import { Search, SquarePen, Trash2 } from "lucide-react";
import Loader from "../../../layouts/Loader";
import { ring } from "ldrs";
import Swal from "sweetalert2";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import CouponFormOverlay from "./CouponFormOverlay";
ring.register();

const Coupons = () => {
  const {
    coupons,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
    addCoupon,
    updateCoupon,
    fetchCoupons,
    deleteCoupon,
  } = useCoupons();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { token } = useAuthContext();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.search) params.search = newParams.search;
    if (newParams.page) params.page = newParams.page.toString();
    if (newParams.per_page) params.per_page = newParams.per_page.toString();
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
  };

  const handleDelete = async (couponId) => {
    const result = await Swal.fire({
      title: t("areYouSureToDelete"),
      text: t("thisActionCannotBeUndone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("yesDeleteIt"),
      cancelButtonText: t("cancel"),
    });

    if (result.isConfirmed) {
      try {
        await deleteCoupon(couponId);
        Swal.fire(t("deletedSuccessfully"), t("itemHasBeenDeleted"), "success");
      } catch (err) {
        Swal.fire(t("error"), err.message, "error");
      }
    }
  };

  const handleEdit = (couponId) => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (coupon) {
      setSelectedCoupon(coupon);
      setEditCouponId(couponId);
      setIsOverlayOpen(true);
    }
  };

  const handleOverlaySuccess = () => {
    fetchCoupons();
    setIsOverlayOpen(false);
    setEditCouponId(null);
    setSelectedCoupon(null);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 sm:p-8 w-full"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {t("coupons")}
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          {t("manage_coupons")}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_coupons")}
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`w-full ${
                language === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"
              } py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder:text-gray-400 text-sm`}
            />
            <span
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                language === "ar" ? "right-4" : "left-4"
              }`}
            >
              <Search size={18} className="text-gray-500" />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-auto">
            <button
              onClick={() => setIsOverlayOpen(true)}
              className="w-auto px-4 py-2 bg-blue-600 text-white rounded customEffect cursor-pointer text-sm"
            >
              <span>{t("add_coupon")}</span>
            </button>
          </div>
        </div>

        {isOverlayOpen && (
          <CouponFormOverlay
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
            couponData={selectedCoupon}
            onSuccess={handleOverlaySuccess}
            isEdit={!!editCouponId}
            couponId={editCouponId}
            addCoupon={addCoupon}
            updateCoupon={updateCoupon}
            fetchCoupons={fetchCoupons}
          />
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-center text-gray-600 text-lg font-medium">
              {t("no_coupons")}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl shadow-lg">
            <table className="border-collapse bg-white rounded-xl w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-4 text-center text-sm font-semibold uppercase tracking-wide">
                    {t("id")}
                  </th>
                  <th
                    className={`p-4 text-sm font-semibold uppercase tracking-wide ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("code")}
                  </th>
                  <th
                    className={`p-4 text-sm font-semibold uppercase tracking-wide ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("name")}
                  </th>
                  <th
                    className={`p-4 text-sm font-semibold uppercase tracking-wide ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("description")}
                  </th>
                  <th
                    className={`p-4 text-sm font-semibold uppercase tracking-wide ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("value")}
                  </th>
                  <th
                    className={`p-4 text-sm font-semibold uppercase tracking-wide ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("status")}
                  </th>
                  <th
                    className={`p-4 text-sm font-semibold uppercase tracking-wide ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("date_range")}
                  </th>
                  <th className="p-4 text-center text-sm font-semibold uppercase tracking-wide">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b hover:bg-gray-50 transition-all duration-200"
                  >
                    <td
                      className="p-4 text-center text-sm text-gray-700"
                      data-label={t("id")}
                    >
                      {coupon.id}
                    </td>
                    <td
                      className={`p-4 text-sm font-medium text-gray-800 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("code")}
                    >
                      {coupon.code}
                    </td>
                    <td
                      className={`p-4 text-sm font-medium text-gray-800 truncate max-w-[150px] ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("name")}
                      title={coupon.name}
                    >
                      {coupon.name}
                    </td>
                    <td
                      className={`p-4 text-sm text-gray-600 truncate max-w-[200px] ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("description")}
                      title={coupon.description}
                    >
                      {coupon.description}
                    </td>
                    <td
                      className={`p-4 text-sm text-gray-600 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("value")}
                    >
                      {coupon.formatted_value}
                    </td>
                    <td
                      className={`p-4 text-sm font-medium ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("status")}
                    >
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          coupon.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-sm text-gray-600 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      data-label={t("date_range")}
                    >
                      {coupon.formatted_date_range}
                    </td>
                    <td className="p-4" data-label={t("actions")}>
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEdit(coupon.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium cursor-pointer"
                          title={t("edit")}
                        >
                          <SquarePen size={16} />
                          <span className="sm:inline hidden">{t("edit")}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium cursor-pointer"
                          title={t("delete")}
                        >
                          <Trash2 size={16} />
                          <span className="sm:inline hidden">
                            {t("delete")}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {coupons.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <p className="text-sm text-gray-600">
              {t("showing_coupons", {
                count: coupons.length,
                current: currentPage,
                total: totalCount,
              })}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200"
              >
                {t("previous")}
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    } transition-all duration-200`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
