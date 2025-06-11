import React, { useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../../assets/1.jpg";
import img2 from "../../../assets/2.jpg";
import img3 from "../../../assets/3.jpg";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const sliderData = [
  {
    title: {
      en: "Jacquard Embroidered Bedding Set",
      ar: "طقم مفروشات جاكار مطرز",
    },
    description: {
      en: "JACQUARD bedding set designed in harmonious colors and featuring a distinctive embroidered pattern.",
      ar: "طقم مفروشات جاكار مصمم بألوان متناغمة ونقشة تطريز مميزة.",
    },
    buttonText: {
      en: "Shop Now",
      ar: "تسوق الآن",
    },
    buttonLink: "/products",
    image: img1,
  },
  {
    title: {
      en: "Modernly Embroidered Premium Bedding Set",
      ar: "طقم مفروشات فاخر مطرز بتصميم عصري",
    },
    description: {
      en: "A beautifully designed, modernly embroidered 6-piece bed sheet set made from high-quality materials.",
      ar: "طقم مفروشات مكون من 6 قطع بتصميم مطرز عصري، مصنوع من خامات عالية الجودة.",
    },
    buttonText: {
      en: "Shop Now",
      ar: "تسوق الآن",
    },
    buttonLink: "/products",
    image: img2,
  },
  {
    title: {
      en: "6-Piece Designer Bedding Set",
      ar: "طقم مفروشات أنيق مكون من 6 قطع",
    },
    description: {
      en: "A bedding set with an attractive design in complementary colors, made from high-quality materials, consisting of 6 pieces.",
      ar: "طقم مفروشات بتصميم جذاب وألوان متناسقة، مصنوع من خامات عالية الجودة، مكون من 6 قطع.",
    },
    buttonText: {
      en: "Shop Now",
      ar: "تسوق الآن",
    },
    buttonLink: "/products",
    image: img3,
  },
];

const colors = {
  primary: "#1e70d0",
  secondary: "#475569",
  accent: "#6366f1",
  text: "#333333",
  lightText: "#ffffff",
};

const HeroSection = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/4 lg:top-1/2 right-4 sm:right-6 md:right-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded p-2 z-10 cursor-pointer hidden md:block ${
        isHovered 
          ? "translate-x-0 opacity-100 rotate-0" 
          : "translate-x-8 opacity-0 rotate-12"
      }`}
      style={{
        backgroundColor: "transparent",
        border: `1px solid ${colors.primary}`,
        color: colors.primary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.primary;
        e.currentTarget.style.color = colors.lightText;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = colors.primary;
      }}
    >
      <ChevronRight size={30} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/4 lg:top-1/2 left-4 sm:left-6 md:left-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded p-2 z-10 cursor-pointer hidden md:block ${
        isHovered 
          ? "translate-x-0 opacity-100 rotate-0" 
          : "-translate-x-8 opacity-0 -rotate-12"
      }`}
      style={{
        backgroundColor: "transparent",
        border: `1px solid ${colors.primary}`,
        color: colors.primary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.primary;
        e.currentTarget.style.color = colors.lightText;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = colors.primary;
      }}
    >
      <ChevronLeft size={30} />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i) => (
      <div className="w-4 h-4 rounded-full border-2 box-border flex items-center justify-center transition-all duration-300" style={{ borderColor: '#bbb', backgroundColor: 'transparent' }}>
        <div className="inner-dot w-2 h-2 rounded-full" />
      </div>
    ),
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[80vh] max-h-[600px] p-2 sm:p-10 ">
      <div 
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Slider {...settings}>
          {sliderData.map((slide, index) => (
            <div
              key={index}
              className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[80vh] max-h-[700px] flex items-center justify-center"
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <section
                className={`relative h-full flex items-center ${
                  language === "ar" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`z-10 flex px-4 sm:px-6 md:px-10 ${language === "ar" ? "lg:me-30" : "lg:ms-30"}`}>
                  <div className={language === "ar" ? "text-right" : "text-left"}>
                    <h2
                      className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 w-[90%]"
                      style={{ color: colors.primary }}
                    >
                      {slide.title[language]}
                    </h2>
                    <p
                      className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 mt-2 sm:mt-4 md:mt-6 w-[90%]"
                      style={{ color: colors.lightText }}
                    >
                      {slide.description[language]}
                    </p>
                    <Link
                      to={slide.buttonLink}
                      className="inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base customEffect font-medium"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <span>
                        {slide.buttonText[language]}
                      </span>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          ))}
        </Slider>
      </div>
      {/* Dots */}
      <style>
        {`
          .slick-dots {
            bottom: 20px;
            z-index: 10;
          }
          .slick-dots li {
            margin: 0 4px;
          }
          .slick-dots li div {
            border-color: #bbb !important;
            background: transparent !important;
            position: relative;
          }
          .slick-dots li .inner-dot {
            background: transparent;
            transition: background 0.3s;
          }
          .slick-dots li.slick-active div {
            border-color: ${colors.primary} !important;
            background: transparent !important;
          }
          .slick-dots li.slick-active .inner-dot {
            background: ${colors.primary} !important;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;
