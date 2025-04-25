import React from "react";
import Slider from "react-slick";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import useHomeData from "../../../hooks/HomeComponents/useHomeData";
import Loader from "../../../layouts/Loader";
import { Link } from "react-router-dom";
import { renderStars } from "../../../utils/ratingUtils";

const Products = () => {
  const { products, loading, error } = useHomeData();

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
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: Math.min(products.length, 4),
    slidesToScroll: 1,
    nextArrow: products.length > 1 ? <NextArrow /> : null,
    prevArrow: products.length > 1 ? <PrevArrow /> : null,
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

  const colors = {
    primary: "#1e70d0",
    categoryTitle: "#808080",
    categoryName: "#6b7280",
    borderLight: "#e5e7eb",
    lineBg: "#d1d5db",
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <h2
        className="text-2xl sm:text-3xl font-normal mb-6"
        style={{ color: colors.categoryTitle }}
      >
        PRODUCTS
      </h2>

      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <div className="border border-gray-300 rounded-lg group transition-all duration-300 overflow-hidden bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain p-4 group-hover:rotate-10 transition-transform duration-300"
              />
              <div className="p-4 text-left">
                <p className="text-xs uppercase text-gray-500">
                  {product.category.name}
                </p>
                <h3
                  className="text-sm font-medium mt-1"
                  style={{ color: colors.text }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: colors.categoryName }}
                >
                  {product.description}
                </p>
                <div className="flex mt-2">
                  {renderStars(product.rating)}
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-gray-300">
                  <p
                    className="text-lg font-semibold mt-2"
                    style={{ color: colors.primary }}
                  >
                    {product.price}$
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer"
                      style={{ borderColor: colors.borderLight }}
                    >
                      <ShoppingCart size={20} className="text-gray-500" />
                    </button>
                    <button
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer"
                      style={{ borderColor: colors.borderLight }}
                    >
                      <Heart size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="flex justify-center mt-8">
        <Link
          to={"/products"}
          className="px-6 py-2 border rounded-md text-md font-medium bg-[#1e70d0] transition duration-200 customEffect"
          style={{ borderColor: colors.primary, color: colors.primary }}
        >
          <span>See More</span>
        </Link>
      </div>
    </div>
  );
};

export default Products;
