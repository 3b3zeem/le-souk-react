import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useHome from "../../../hooks/HomeComponents/useHome";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import Loader from "./../../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const ProductCard = ({ product }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const discount = product.discount_percentage || 0;
  const price = product.min_price / 100;
  const salePrice = product.min_sale_price / 100;

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`products/${product.id}`)}
      className="relative p-4 flex flex-col items-center border border-gray-400 rounded-lg hover:shadow-md transition bg-white cursor-pointer"
    >
      {discount > 0 && (
        <span
          className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
          style={{ zIndex: 2, letterSpacing: "1px" }}
        >
          -{discount}% {language === "ar" ? "خصم" : t("offer", "Offer")}
        </span>
      )}
      <img
        src={product.primary_image_url}
        alt={product.name}
        className="w-32 h-32 object-contain mb-3"
        style={{ borderRadius: "0.5rem", background: "#f9fafb" }}
      />
      <h3
        className="text-base font-semibold mb-1 text-center truncate"
        style={{ color: colors.productName, minHeight: 24, maxWidth: 120 }}
        title={product.name}
      >
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg font-bold" style={{ color: colors.primary }}>
          {language === "ar" ? "ج.م" : "$"}
          {salePrice.toFixed(2)}
        </span>
        {discount > 0 && (
          <span
            className="text-sm line-through"
            style={{ color: colors.productName }}
          >
            {language === "ar" ? "ج.م" : "$"}
            {price.toFixed(2)}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-500 mt-1">
        {product.total_stock} {t("inStock", "in stock")}
      </span>
    </div>
  );
};

const ProductCountdown = ({ saleEndsAt }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(saleEndsAt);
      const diff = endDate - now;

      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndsAt]);

  return (
    <div className="mt-4">
      <p className="text-lg font-bold" style={{ color: colors.primary }}>
        {language === "ar"
          ? "سارع! العرض ينتهي خلال:"
          : t("HURRY_UP_OFFERS_ENDS_IN", "HURRY UP! OFFERS ENDS IN:")}
      </p>
      <div className="flex space-x-2 mt-2">
        <span
          className="px-4 py-2 border rounded"
          style={{ borderColor: colors.borderLight }}
        >
          {timeLeft.days}
        </span>
        <span
          className="px-4 py-2 border rounded"
          style={{ borderColor: colors.borderLight }}
        >
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span
          className="px-4 py-2 border rounded"
          style={{ borderColor: colors.borderLight }}
        >
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span
          className="px-4 py-2 border rounded"
          style={{ borderColor: colors.borderLight }}
        >
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const SwiperSection = ({ products }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const navigate = useNavigate();

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute -top-16 right-0 bg-white shadow-md transition-all duration-200 text-gray-700 rounded p-2 z-10 cursor-pointer"
    >
      <ChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute -top-16 right-12 bg-white shadow-md transition-all duration-200 text-gray-700 rounded p-2 z-10 cursor-pointer"
    >
      <ChevronLeft size={20} />
    </button>
  );

  const settings = {
    dots: false,
    infinite: products.length > 1,
    speed: 400,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: Math.min(products.length, 1),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: products.length > 1 ? <NextArrow /> : null,
    prevArrow: products.length > 1 ? <PrevArrow /> : null,
  };

  return (
    <div className="w-full md:w-1/3 h-full p-6 rounded-lg bg-white overflow-x-auto">
      <h2
        className="text-xl font-bold mb-6 text-left"
        style={{ color: colors.primary }}
      >
        {language === "ar" ? "عروض" : t("Deals")}
      </h2>

      {products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-lg shadow-md bg-gray-50 h-full cursor-pointer"
            >
              <img
                src={product.primary_image_url}
                alt={product.name}
                className="w-full h-52 object-contain rounded mb-3"
                onClick={() => navigate(`products/${product.id}`)}
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                {product.name}
              </h3>
              <p
                className="text-center text-lg font-bold mb-2"
                style={{ color: colors.primary }}
              >
                {language === "ar" ? "ج.م" : "$"}
                {product.min_sale_price} - {language === "ar" ? "ج.م" : "$"}
                {product.max_sale_price}
              </p>
              <p className="text-sm text-center text-gray-600">
                {language === "ar"
                  ? `تم بيع: 0 | متوفر: ${product.total_stock}`
                  : `Sold: 0 | In Stock: ${product.total_stock}`}
              </p>
              <div className="mt-3 text-center">
                <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-green-600 text-white">
                  {product.discount_percentage}%{" "}
                  {language === "ar" ? "خصم" : t("offer", "Offer")}
                </span>
              </div>

              {product.sale_ends_at && (
                <div className="mt-4">
                  <ProductCountdown saleEndsAt={product.sale_ends_at} />
                </div>
              )}
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          {language === "ar"
            ? "لا توجد منتجات ذات خصم مرتفع متاحة."
            : t(
              "no_high_discount_products",
              "No high-discount products available."
            )}
        </p>
      )}
    </div>
  );
};

const TabsSection = ({ products, productsPerPage = 6 }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("1-10");
  const [page, setPage] = useState({ "1-10": 1, "11-30": 1, "31-50": 1 });

  const filterProducts = (range, products) => {
    if (range === "1-10") {
      return products.filter(
        (p) => p.discount_percentage >= 1 && p.discount_percentage <= 10
      );
    } else if (range === "11-30") {
      return products.filter(
        (p) => p.discount_percentage >= 11 && p.discount_percentage <= 30
      );
    } else {
      return products.filter(
        (p) => p.discount_percentage >= 31 && p.discount_percentage <= 50
      );
    }
  };

  const paginateProducts = (products, page, productsPerPage) => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const getTotalPages = (products, productsPerPage) => {
    return Math.ceil(products.length / productsPerPage);
  };

  const filteredProducts = filterProducts(activeTab, products);
  const paginatedProducts = paginateProducts(
    filteredProducts,
    page[activeTab],
    productsPerPage
  );
  const totalPages = getTotalPages(filteredProducts, productsPerPage);

  return (
    <div className="w-full md:w-2/3 p-4">
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: colors.productTitle }}
      >
        {language === "ar"
          ? "عروض اليوم! احصل على أفضل الأسعار."
          : t("Daily_Deals", "Daily Deals! Get our best prices.")}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === "1-10" ? "text-white" : ""
            }`}
          style={{
            backgroundColor:
              activeTab === "1-10" ? colors.primary : colors.lineBg,
            color: activeTab === "1-10" ? colors.lightText : colors.productName,
          }}
          onClick={() => setActiveTab("1-10")}
        >
          {language === "ar" ? "خصم 1-10%" : "1-10% Offer"}
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === "11-30" ? "text-white" : ""
            }`}
          style={{
            backgroundColor:
              activeTab === "11-30" ? colors.primary : colors.lineBg,
            color:
              activeTab === "11-30" ? colors.lightText : colors.productName,
          }}
          onClick={() => setActiveTab("11-30")}
        >
          {language === "ar" ? "خصم 11-30%" : "11-30% Offer"}
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === "31-50" ? "text-white" : ""
            }`}
          style={{
            backgroundColor:
              activeTab === "31-50" ? colors.primary : colors.lineBg,
            color:
              activeTab === "31-50" ? colors.lightText : colors.productName,
          }}
          onClick={() => setActiveTab("31-50")}
        >
          {language === "ar" ? "خصم 31-50%" : "31-50% Offer"}
        </button>
      </div>

      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 w-full">
              <button
                disabled={page[activeTab] === 1}
                onClick={() =>
                  setPage({ ...page, [activeTab]: page[activeTab] - 1 })
                }
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                {language === "ar" ? "السابق" : "Previous"}
              </button>
              <span className="mx-2 font-bold">
                {language === "ar"
                  ? `صفحة ${page[activeTab]} من ${totalPages}`
                  : `Page ${page[activeTab]} of ${totalPages}`}
              </span>
              <button
                disabled={page[activeTab] === totalPages}
                onClick={() =>
                  setPage({ ...page, [activeTab]: page[activeTab] + 1 })
                }
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                {language === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">
          {language === "ar"
            ? "لا توجد منتجات في هذا النطاق."
            : t(
              "No products available in this discount range."
            )}
        </p>
      )}
    </div>
  );
};

const Offers = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const { offers, loading, error } = useHome();

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!offers || offers.length === 0)
    return (
      <div className="text-center text-gray-500">
        {language === "ar"
          ? "لا توجد منتجات متاحة حالياً. جرب تغيير الفلاتر أو الصفحة."
          : t(
            "noProductsTitle",
            "No products available at the moment. Try adjusting the filters or page."
          )}
      </div>
    );

  const highDiscountProducts = offers.filter(
    (product) => product.discount_percentage > 50
  );

  const tabProducts = offers.filter(
    (product) =>
      product.discount_percentage >= 1 && product.discount_percentage <= 50
  );

  return (
    <div className="p-5 bg-gray-100 w-full">
      <div className="bg-white flex flex-col md:flex-row">
        <SwiperSection products={highDiscountProducts} />
        <TabsSection products={tabProducts} productsPerPage={6} />
      </div>
    </div>
  );
};

export default Offers;
