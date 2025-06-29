import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdminPackages from "../../../dashboard/hooks/Packages/useAdminPackages";
import Loader from "./../../../layouts/Loader";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Clock4 } from "lucide-react";

const PackagesId = () => {
  const navigate = useNavigate();
  const { packagesId } = useParams();
  const { details, packageDetails, loading, error } = useAdminPackages();
  const [timeLeft, setTimeLeft] = useState(null);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (details?.name) {
      const slug = encodeURIComponent(details.name.replace(/\s+/g, "-"));
      if (!window.location.pathname.includes(`/${slug}`)) {
        navigate(`/packages/${packagesId}/${slug}`, { replace: true });
      }
    }
  }, [details?.name, packagesId, navigate]);

  useEffect(() => {
    if (packagesId) {
      packageDetails(packagesId);
    }
  }, [packagesId, language]);

  useEffect(() => {
    if (details && details.starts_at && details.expires_at) {
      const updateCountdown = () => {
        const now = new Date();
        const end = new Date(details.expires_at);
        const diff = end - now;

        if (diff > 0) {
          const days = String(
            Math.floor(diff / (1000 * 60 * 60 * 24))
          ).padStart(2, "0");
          const hours = String(
            Math.floor((diff / (1000 * 60 * 60)) % 24)
          ).padStart(2, "0");
          const minutes = String(
            Math.floor((diff / (1000 * 60)) % 60)
          ).padStart(2, "0");
          const seconds = String(Math.floor((diff / 1000) % 60)).padStart(
            2,
            "0"
          );
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft(null);
        }
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [details]);

  if (loading) {
    return <Loader />;
  }

  if (!details) {
    return (
      <div className="text-center text-gray-500">
        {t("No package details found.")}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const DetailRow = ({ label, value, color = "" }) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className={`text-base ${color}`}>{value}</span>
      </div>
    );
  };

  return (
    <div
      className="max-w-7xl mx-auto py-10 px-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <div className="relative flex flex-col lg:flex-row bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 rounded-xl shadow-2xl overflow-hidden mb-12 min-h-[400px]">
        {/* Image */}
        <div className="lg:w-1/2 flex items-center justify-center bg-white/10 p-8">
          <img
            src={details?.image_url}
            alt={details?.name}
            className="w-full max-w-[400px] h-80 object-contain rounded-2xl shadow-lg border-4 border-white"
          />
        </div>
        {/* Info */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 text-white">
          <span className="inline-block bg-white/20 text-blue-100 px-4 py-1 rounded-full text-xs font-bold mb-4 tracking-widest shadow">
            {language === "ar" ? "عرض الباكدج" : "PACKAGE OFFER"}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            {details?.name}
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            {details?.description}
          </p>
          {/* Timer */}
          {details?.starts_at && details?.expires_at && timeLeft && (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/20 p-4 rounded-xl shadow-lg mb-4 w-fit">
              <div className="flex gap-2 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold">
                    {timeLeft.days}
                  </div>
                  <div className="text-xs md:text-sm">{t("Days")}</div>
                </div>
                <span className="text-2xl font-bold mx-1">:</span>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">
                    {timeLeft.hours}
                  </div>
                  <div className="text-xs md:text-sm">{t("Hours")}</div>
                </div>
                <span className="text-2xl font-bold mx-1">:</span>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-xs md:text-sm">{t("Minutes")}</div>
                </div>
                <span className="text-2xl font-bold mx-1">:</span>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-xs md:text-sm">{t("Seconds")}</div>
                </div>
              </div>
              <span className="text-sm md:text-base font-medium text-white/90">
                {language === "ar"
                  ? "متبقي حتى نهاية الباقة"
                  : "Remains until the end of the package"}
              </span>
            </div>
          )}
          {/* Price & Discount */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <span className="text-2xl md:text-3xl font-bold text-green-300">
              {details?.discounted_price} {language === "ar" ? "د.ك" : "KWD"}
            </span>
            {details?.original_price && (
              <span className="text-lg md:text-xl line-through text-red-200">
                {details?.original_price} {language === "ar" ? "د.ك" : "KWD"}
              </span>
            )}
            {details?.formatted_discount && (
              <span className="bg-green-500/80 text-white px-3 py-1 rounded font-semibold text-sm shadow">
                {details?.formatted_discount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="md:sticky md:top-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl p-8 border border-blue-100 md:h-100">
          <h2 className="text-2xl font-extrabold mb-8 text-blue-700 flex items-center gap-2">
            <Clock4 className="w-6 h-6 text-blue-500" />
            {t("Package Details")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <DetailRow
                label={t("Status")}
                value={details?.status}
                color="text-blue-700"
              />
              <DetailRow
                label={t("Type")}
                value={details?.type}
                color="text-blue-700"
              />
              <DetailRow
                label={t("Discount")}
                value={details?.formatted_discount}
                color="text-green-600"
              />
              <DetailRow
                label={t("Original Price")}
                value={`${details?.original_price} ${
                  language === "ar" ? "ج.م" : "LE"
                }`}
                color="text-red-500 line-through"
              />
              <DetailRow
                label={t("Discounted Price")}
                value={`${details?.discounted_price} ${
                  language === "ar" ? "ج.م" : "LE"
                }`}
                color="text-green-700 font-bold"
              />
              <DetailRow
                label={t("Savings")}
                value={`${details?.savings} ${
                  language === "ar" ? "ج.م" : "LE"
                }`}
                color="text-green-500"
              />
            </div>
            <div className="flex flex-col gap-4">
              <DetailRow
                label={t("Usage Limit")}
                value={details?.usage_limit}
              />
              <DetailRow
                label={t("Usage Count")}
                value={details?.usage_count}
              />
              <DetailRow
                label={t("User Usage Limit")}
                value={details?.user_usage_limit}
              />
              <DetailRow
                label={t("Starts At")}
                value={new Intl.DateTimeFormat(language, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(details?.starts_at))}
              />
              <DetailRow
                label={t("Expires At")}
                value={new Intl.DateTimeFormat(language, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(details?.expires_at))}
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            {t("Included Products")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {details?.packageProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-400 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-50 p-3"
              >
                <img
                  src={product.product.primary_image_url}
                  alt={product.product.name}
                  className="w-full h-32 object-contain bg-white"
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold truncate mb-2">
                    {product.product.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span>
                      {product.product.min_price}{" "}
                      {language === "ar" ? "د.ك" : "KWD"}
                    </span>
                  </p>
                  <button
                    className="mt-2 w-full bg-[#333e2c] text-white py-2 rounded-lg transition-colors font-semibold cursor-pointer customEffect"
                    onClick={() => navigate(`/products/${product.product.id}`)}
                  >
                    <span>{t("View Details")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesId;
