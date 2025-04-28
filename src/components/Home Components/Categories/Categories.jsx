import React from "react";
import Slider from "react-slick";
import Loader from "../../../layouts/Loader";
import useHome from "../../../hooks/HomeComponents/useHome";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";

const Categories = () => {
  const { categories, loading, error } = useHome();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-4 -translate-y-1/2 bg-blue-600 hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
    >
      <ChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-4 -translate-y-1/2 bg-blue-600 hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
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
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14">
        <div className="bg-red-100 border border-red-400 text-red-700 px-10 py-16 rounded-md shadow-md max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">{t("Something went wrong!")}</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const colors = {
    primary: "#1e70d0",
    categoryTitle: "#808080",
    categoryName: "#6b7271",
    borderLight: "#e5e7eb",
    lineBg: "#d1d5db",
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-300" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2
        className="text-2xl sm:text-3xl font-normal mb-6 uppercase"
        style={{ color: colors.categoryTitle }}
      >
        {t("categories")}
      </h2>

      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <div
              className="border rounded-lg overflow-hidden group transition-all duration-300"
              style={{ borderColor: colors.borderLight }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
