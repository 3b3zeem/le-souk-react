import React, { useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useHero } from "../../../hooks/Hero/useHero";
import { useLanguage } from "../../../context/Language/LanguageContext";
import HeroSkeleton from "./HeroSkeleton";

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
  const { language } = useLanguage();

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 right-4 sm:right-6 md:right-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded p-2 z-10 cursor-pointer hidden md:block ${
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
      className={`absolute top-1/2 left-4 sm:left-6 md:left-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded p-2 z-10 cursor-pointer hidden md:block ${
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
    infinite: heroSliders?.length > 1,
    speed: 500,
    slidesToShow: Math.min(heroSliders?.length, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: heroSliders?.length > 1 ? <NextArrow /> : null,
    prevArrow: heroSliders?.length > 1 ? <PrevArrow /> : null,
    customPaging: (i) => (
      <div
        className="w-4 h-4 rounded-full border-2 box-border flex items-center justify-center transition-all duration-300"
        style={{ borderColor: "#bbb", backgroundColor: "transparent" }}
      >
        <div className="inner-dot w-2 h-2 rounded-full" />
      </div>
    ),
  };

  if (isLoading) return <HeroSkeleton />;

  if (!heroSliders || heroSliders.length === 0) return null;

  return (
    <div className="relative w-full h-[25vh] sm:h-[40vh] md:h-[45vh] lg:h-[80vh] max-h-[600px] mt-7">
      <div
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Slider {...settings}>
          {(heroSliders || []).map((slide, index) => (
            <div
              key={index}
              className="relative w-full h-[25vh] sm:h-[40vh] md:h-[45vh] lg:h-[80vh] max-h-[700px] flex items-center justify-center"
            >
              <div className="w-full h-full">
                <img
                  src={slide?.images?.[language]?.image_url || slide.image_url}
                  alt={`${slide.title}`}
                  loading="lazy"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain object-center opacity-85"
                />
              </div>

              <section
                className={`absolute inset-0 h-full flex items-end justify-start w-full`}
              >
                <div
                  className={`z-100 lg:ms-43 md:ms-40 sm:ms-15 ms-7 lg:mb-30 md:mb-13 sm:mb-10 mb-10`}
                >
                  <Link
                    to={"/products"}
                    className="inline-block bg-transparent px-3 py-1 md:px-6 md:py-3 text-[#333e2c] text-[12px] md:text-base font-medium rounded-full hover:bg-[#333e2c] hover:text-white transition-colors duration-300"
                    style={{ border: `1px solid ${colors.primary}` }}
                  >
                    Shop Now
                  </Link>
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
