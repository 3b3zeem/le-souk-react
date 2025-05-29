import React, { useState } from "react";
import useAdminPackages from "../../../dashboard/hooks/Packages/useAdminPackages";
import Loader from "../../../layouts/Loader";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { CornerDownLeft, CornerDownRight, Percent } from "lucide-react";

const colors = {
  primary: "#1e70d0",
  borderLight: "#e5e7eb",
  categoryTitle: "#22223b",
  productTitle: "#22223b",
};

const PackagesSlider = ({ product_id, language }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { packages, loading, error } = useAdminPackages(undefined, product_id);

  const settings = {
    dots: false,
    infinite: packages.length > 1,
    speed: 500,
    slidesToShow: Math.min(packages.length, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!packages.length) return null;

  return (
    <div
      className={`max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-300`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2
        className="text-2xl sm:text-3xl font-normal mb-6 uppercase text-gray-500"
      >
        {t("packages")}
      </h2>

      <Slider {...settings}>
        {packages.map((pkg, idx) => (
          <div key={pkg.id} className="px-2">
            <div
              className="relative group border rounded-md overflow-hidden bg-white shadow-md hover:shadow-sm transition-shadow duration-300 cursor-pointer flex flex-col"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                borderColor: colors.borderLight,
              }}
              onClick={() => navigate(`/packages/${pkg.id}`)}
            >
              <div className="relative flex justify-center items-center bg-gray-50 h-70">
                <img
                  src={pkg.image_url}
                  alt={pkg.name}
                  className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                  style={{ maxWidth: "90%" }}
                />
                {/* Discount badge */}
                {pkg.discount_percentage ? (
                  <span
                    className="absolute"
                    style={{
                      top: 12,
                      left: -38,
                      background: "#ef233c",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "10px 48px",
                      transform: "rotate(-35deg)",
                      zIndex: 30,
                      boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                      letterSpacing: "1px",
                      borderRadius: "6px",
                      textShadow: "0 1px 2px rgba(0,0,0,0.10)",
                      borderTopLeftRadius: "0.5rem",
                      borderTopRightRadius: "0.5rem",
                    }}
                  >
                    -{pkg.discount_percentage}%{" "}
                    {language === "ar" ? "خصم" : "OFF"}
                  </span>
                ) : null}
              </div>
              {/* Package Details */}
              <div
                className={`p-4 flex flex-col`}
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <h3
                  className="text-base font-bold mt-1 mb-1 truncate cursor-pointer"
                  style={{ color: colors.productTitle, minHeight: 24 }}
                >
                  {pkg.name}
                </h3>
                <p
                  className="text-sm text-gray-500 mb-2 truncate"
                  style={{ minHeight: 20 }}
                >
                  {pkg.short_description}
                </p>
                {/* Price */}
                <div className="flex items-end gap-2 mb-2">
                  {pkg.discounted_price &&
                  pkg.discounted_price !== pkg.original_price ? (
                    <div className="flex flex-col">
                      <span className="line-through text-gray-400 text-xs font-normal">
                        {Number(pkg.original_price).toLocaleString()}{" "}
                        {language === "ar" ? "ج.م" : "LE"}
                      </span>
                      <div className="flex items-center gap-2">
                        {language === "ar" ? (
                          <CornerDownLeft
                            size={20}
                            style={{ color: colors.primary }}
                          />
                        ) : (
                          <CornerDownRight
                            size={20}
                            style={{ color: colors.primary }}
                          />
                        )}
                        <span
                          className="text-lg font-bold"
                          style={{ color: colors.primary }}
                        >
                          {Number(pkg.discounted_price).toLocaleString()}{" "}
                          {language === "ar" ? "ج.م" : "LE"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span
                      className="text-lg font-bold"
                      style={{ color: colors.primary }}
                    >
                      {Number(pkg.original_price).toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "LE"}
                    </span>
                  )}
                </div>
                {/* Usage Limit */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-xs text-gray-400">{t("Savings")}:</span>
                  <span className="text-xs font-semibold text-green-600">
                    {pkg.savings} {language === "ar" ? "ج.م" : "LE"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="flex justify-center mt-8">
        <Link
          to={"/packages"}
          className="px-6 py-2 border rounded text-md font-medium bg-[#1e70d0] transition duration-200 customEffect"
          style={{ borderColor: colors.primary, color: colors.primary }}
        >
          <span>{t("All_Packages")}</span>
        </Link>
      </div>
    </div>
  );
};

export default PackagesSlider;
