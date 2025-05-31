import React, { useState } from "react";
import useProducts from "../../../hooks/Products/useProduct";
import Loader from "../../../layouts/Loader";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CornerDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const RelatedProducts = ({ productId, language, category }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mainCategoryId = Array.isArray(category)
    ? category.length > 0
      ? category[0].id
      : null
    : category?.id;

  const { products, loading, error } = useProducts(
    "",
    mainCategoryId,
    null,
    null,
    1000,
    1,
    "id",
    "desc"
  );

  const related = products.filter((p) => p.id !== Number(productId));

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
    infinite: related.length > 1,
    speed: 500,
    slidesToShow: Math.min(related.length, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: products.length > 1 ? <NextArrow /> : null,
    prevArrow: products.length > 1 ? <PrevArrow /> : null,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const colors = {
    primary: "#1e70d0",
    borderLight: "#e5e7eb",
    productTitle: "#22223b",
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!related.length) return null;

  return (
    <div
      className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 border-b border-gray-300"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2
        className="text-2xl sm:text-3xl font-normal mb-6 uppercase text-gray-500"
      >
        {t("Related_Products")}
      </h2>
      <Slider {...settings}>
        {related.map((product, idx) => {
          const primaryImage =
            product.images?.[0]?.image_url || product.primary_image_url;
          const secondImage =
            product.images && product.images.length > 1
              ? product.images[1].image_url
              : primaryImage;

          return (
            <div key={product.id} className="px-2">
              <div
                className="relative group border rounded-md overflow-hidden bg-white hover:shadow-sm transition-shadow duration-300 cursor-pointer flex flex-col"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  borderColor: colors.borderLight,
                  
                }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="relative flex justify-center items-center bg-gray-50 h-100">
                  <img
                    src={hoveredIndex === idx ? secondImage : primaryImage}
                    alt={product.name}
                    className="h-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                    style={{ maxWidth: "80%" }}
                  />
                  {product.discount_percentage && (
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
                      -{product.discount_percentage}%{" "}
                      {language === "ar" ? "خصم" : "OFF"}
                    </span>
                  )}
                </div>
                <div className="p-4 text-left flex flex-col" dir={language === "ar" ? "rtl" : "ltr"}>
                  <h3
                    className="text-base font-bold mt-1 mb-1 truncate cursor-pointer"
                    style={{ color: colors.productTitle, minHeight: 24 }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-end gap-2 mb-2">
                    {product.min_sale_price &&
                    product.min_sale_price !== product.min_price ? (
                      <div className="flex flex-col">
                        <span className="line-through text-gray-400 text-xs font-normal">
                          {product.min_price} {language === "ar" ? "ج.م" : "LE"}
                        </span>
                        <div className="flex items-center gap-2">
                          <CornerDownRight
                            size={20}
                            style={{ color: colors.primary }}
                          />
                          <span
                            className="text-lg font-bold"
                            style={{ color: colors.primary }}
                          >
                            {product.min_sale_price}{" "}
                            {language === "ar" ? "ج.م" : "LE"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span
                        className="text-lg font-bold"
                        style={{ color: colors.primary }}
                      >
                        {product.min_price} {language === "ar" ? "ج.م" : "LE"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default RelatedProducts;
