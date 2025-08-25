import React from "react";
import Slider from "react-slick";
import useHome from "../../../hooks/HomeComponents/useHome";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import CategoriesSkeleton from "./CategoriesSkeleton";

const Categories = () => {
  const { categories, loading, error } = useHome();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-4 -translate-y-1/2 bg-[#333e2c] hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
      title="Arrow Right"
    >
      <ChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-4 -translate-y-1/2 bg-[#333e2c] hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
      title="Arrow Left"
    >
      <ChevronLeft size={20} />
    </button>
  );

  const settings = {
    dots: false,
    infinite: categories.length > 1,
    speed: 500,
    slidesToShow: Math.min(categories.length, 3),
    slidesToScroll: 1,
    nextArrow: categories.length > 1 ? <NextArrow /> : null,
    prevArrow: categories.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <CategoriesSkeleton length={3} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-10 py-16 rounded-md shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold mb-2 ">
            {t("Something went wrong!")}
          </h2>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const colors = {
    primary: "#333e2c",
    categoryTitle: "#808080",
    categoryName: "#6b7271",
    borderLight: "#e5e7eb",
    lineBg: "#d1d5db",
  };

  return (
    <div
      className="max-w-7xl mx-auto py-30 px-4 sm:px-6 lg:px-8 border-b border-gray-300"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-wrap justify-between mt-8 mb-6">
        <h2
          className="text-2xl sm:text-3xl font-normal uppercase font-serif "
          style={{ color: colors.categoryTitle }}
        >
          {t("categories")}
        </h2>
        <div className="flex justify-center">
          <Link
            to={"/categories"}
            className="px-6 py-2 text-md font-medium bg-[#333e2c] transition duration-200 customEffect"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <span>{t("seeMore")}</span>
          </Link>
        </div>
      </div>

      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <div
              className="border rounded-md overflow-hidden group cursor-pointer"
              style={{ borderColor: colors.borderLight }}
              onClick={() => navigate(`/products?category=${category.id}`)}
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full lg:h-48 h-full lg:object-cover object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default_category.jpg";
                }}
              />
              <div className="p-4 text-center">
                <h3
                  className="text-sm font-medium uppercase transition-colors duration-300"
                  style={{ color: colors.categoryName }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.categoryName)
                  }
                >
                  {category.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Categories;
