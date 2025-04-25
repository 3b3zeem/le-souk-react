import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../../assets/Images/swiper1.jpg";
import img2 from "../../../assets/Images/swiper2.jpg";
import img3 from "../../../assets/Images/swiper3.jpg";

const sliderData = [
  {
    title: "Sunglasses Collection",
    description:
      "A perfect blend of fashion and function, our sunglasses offer UV protection with modern designs.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    image: img1,
  },
  {
    title: "Eyewear Collection",
    description:
      "Explore our latest eyewear collection designed for style and comfort.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    image: img2,
  },
  {
    title: "Summer Collection",
    description:
      "Get ready for summer with our trendy and protective sunglasses.",
    buttonText: "Shop Now",
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
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/4 lg:top-1/2 right-4 sm:right-6 md:right-10 -translate-y-1/2 transition-all duration-200 rounded p-2 z-10 cursor-pointer"
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
      className="absolute top-1/4 lg:top-1/2 left-4 sm:left-6 md:left-10 -translate-y-1/2 transition-all duration-200 rounded p-2 z-10 cursor-pointer"
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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] max-h-[600px]">
      <Slider {...settings}>
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] max-h-[600px] flex items-center justify-center"
          >
            <div className="absolute inset-0 w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            <section className="relative h-full flex items-center justify-start">
              <div className="z-10 flex px-4 sm:px-6 md:px-10 lg:ms-30">
                <div className="text-left">
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold mb-2 sm:mb-4"
                    style={{ color: colors.primary }}
                  >
                    {slide.title}
                  </span>
                  <p
                    className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-sm md:max-w-md mb-4 sm:mb-6 mt-2 sm:mt-4 md:mt-6"
                    style={{ color: colors.lightText }}
                  >
                    {slide.description}
                  </p>
                  <a
                    href={slide.buttonLink}
                    className="inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-white font-medium transition duration-200"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </section>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
