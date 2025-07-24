import React, { useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useHero } from "../../../hooks/Hero/useHero";
import Loader from "../../../layouts/Loader";

const colors = {
  primary: "#333e2c",
  secondary: "#475569",
  accent: "#6366f1",
  text: "#333333",
  lightText: "#ffffff",
};

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: heroSliders, isLoading } = useHero();

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
      <div
        className="w-4 h-4 rounded-full border-2 box-border flex items-center justify-center transition-all duration-300"
        style={{ borderColor: "#bbb", backgroundColor: "transparent" }}
      >
        <div className="inner-dot w-2 h-2 rounded-full" />
      </div>
    ),
  };

  if (isLoading) <Loader />;

  if (!heroSliders || heroSliders.length === 0) null;

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[80vh] max-h-[600px] p-2 sm:p-10 mt-2">
      <div
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Slider {...settings}>
          {(heroSliders || []).map((slide, index) => (
            <div
              key={index}
              className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[80vh] max-h-[700px] flex items-center justify-center"
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-85"
                />
              </div>

              <section
                className={`h-full flex items-end justify-start w-full`}
              >
                <div className={`z-100 lg:ms-31 ms-0 mb-25`}>
                    <Link
                      to={"/products"}
                      className="inline-block bg-transparent px-6 py-3 sm:px-6 sm:py-3 text-[#333e2c] text-sm sm:text-base font-medium rounded-full hover:bg-[#333e2c] hover:text-white transition-colors duration-300"
                      style={{ border: `1px solid ${colors.primary}` }}
                    >
                      Shop Now
                    </Link>
                </div>
              </section>
            </div>
          ))}
        </Slider>

        {/* <div
              key={index}
              className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[80vh] max-h-[700px] flex items-center justify-center"
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-85"
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
                      className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 w-[90%] font-serif "
                      style={{ color: colors.text }}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 mt-2 sm:mt-4 md:mt-6 w-[90%]"
                      style={{ color: colors.lightText }}
                    >
                      {slide.description}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base customEffect font-medium"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <span>
                        {slide.button_text}
                      </span>
                    </Link>
                  </div>
                </div>
              </section>
            </div> */}
      </div>
      {/* Dots */}
      <style>
        {`
          .slick-dots {
            bottom: -25px;
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
