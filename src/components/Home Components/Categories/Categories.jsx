import React from "react";
import Slider from "react-slick";
import Loader from "../../../layouts/Loader";
import useHomeData from "../../../hooks/HomeComponents/useHomeData";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Categories = () => {
  const { categories, loading, error } = useHomeData();

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
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  const colors = {
    primary: "#1e70d0",
    categoryTitle: "#808080",
    categoryName: "#6b7271",
    borderLight: "#e5e7eb",
    lineBg: "#d1d5db",
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-300">
      <h2
        className="text-2xl sm:text-3xl font-normal mb-6"
        style={{ color: colors.categoryTitle }}
      >
        CATEGORIES
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
