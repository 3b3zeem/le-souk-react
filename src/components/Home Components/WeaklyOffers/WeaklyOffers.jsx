import React, { useEffect, useState } from "react";
import useHome from "../../../hooks/HomeComponents/useHome";
import Loader from "../../../layouts/Loader";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const OfferItem = ({ product }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const end = new Date(product.sale_ends_at);

  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div
      className="flex flex-col lg:flex-row items-center bg-white lg:h-[550px] overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Left side - Product Image */}
      <div
        onClick={() => navigate(`products/${product.id}`)}
        className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex items-center justify-center"
      >
        <img
          src={product.primary_image_url}
          alt={product.name}
          className="w-full max-h-64 lg:max-h-full object-contain  cursor-pointer"
        />
      </div>

      {/* Right side - Product Details */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
        {/* Deal Tag */}
        <div className="flex items-center mb-6">
          <Star className="w-5 h-5 text-orange-600 mr-3" fill="orange" />
          <span className="text-orange-600 font-medium text-sm tracking-wide uppercase">
            {t("deal_of_the_week")}
          </span>
        </div>

        {/* Product Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          {product.name}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
          {product.description}
        </p>

        {/* Timer */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-4 bg-gray-100 p-3 sm:p-4 rounded-lg text-xs sm:text-base">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {timeLeft.days}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                D
              </div>
            </div>
            <div className="text-3xl text-gray-400 font-bold">:</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                H
              </div>
            </div>
            <div className="text-3xl text-gray-400 font-bold">:</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                M
              </div>
            </div>
            <div className="text-3xl text-gray-400 font-bold">:</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                S
              </div>
            </div>
          </div>
        </div>

        {/* Limited Offer Notice */}
        <div
          className={`flex items-center bg-red-50 border border-red-200 rounded-lg p-4 gap-2`}
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">{t("limited_time_offer")}</span>{" "}
            {t("the_deal_will_expire")} {end.toLocaleDateString(language)}{" "}
            <span className="font-bold text-red-600">{t("hurry_up")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeaklyOffers = () => {
  const { offers, loading, error } = useHome();

  const weeklyOffers = offers.filter((product) => {
    if (!product.sale_starts_at || !product.sale_ends_at) return false;
    const start = new Date(product.sale_starts_at);
    const end = new Date(product.sale_ends_at);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
  });

  const settings = {
    dots: false,
    infinite: weeklyOffers.length > 1,
    speed: 500,
    slidesToShow: Math.min(weeklyOffers.length, 1),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 w-full overflow-x-hidden">
      <Slider {...settings}>
        {weeklyOffers.map((product) => (
          <OfferItem key={product.id} product={product} />
        ))}
      </Slider>
    </div>
  );
};

export default WeaklyOffers;
