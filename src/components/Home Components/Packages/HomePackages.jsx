import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useHome from "../../../hooks/HomeComponents/useHome";
import { useNavigate } from "react-router-dom";
import Loader from "../../../layouts/Loader";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const HomePackages = () => {
  const { packages, loading, error } = useHome(5);
  const [productsToShow, setProductsToShow] = useState(4);
    const { t } = useTranslation();
    const { language } = useLanguage();

  const navigate = useNavigate();

  useEffect(() => {
    const updateProductsToShow = () => {
      if (window.innerWidth < 640) setProductsToShow(1);
      else if (window.innerWidth < 1024) setProductsToShow(2);
      else setProductsToShow(4);
    };
    updateProductsToShow();
    window.addEventListener("resize", updateProductsToShow);
    return () => window.removeEventListener("resize", updateProductsToShow);
  }, []);

  const settings = {
    dots: false,
    infinite: packages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!packages?.length) return <div>No packages available</div>;

  return (
    <div className="relative w-full py-12">
      <Slider {...settings}>
        {packages.map((pkg) => (
          <div key={pkg.id} className="">
            <div
              className="relative overflow-hidden flex flex-col items-center justify-end bg-white h-[85vh]"
              style={{
                backgroundImage: `url(${pkg.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div className="relative z-10 p-6 w-full h-full flex flex-col justify-between items-start">
                <div className="w-full flex flex-col md:flex-row gap-3 justify-between items-start">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg bg-black/30 px-4 py-3 rounded-md inline-block">
                    {pkg.name}
                  </h2>
                  <div className="">
                    <button
                      className="relative z-10 px-4 py-2 bg-[#1e70d0] text-white font-medium hover:bg-[#1e6fe9f6] transition cursor-pointer"
                      onClick={() => navigate(`/packages/${pkg.id}`)}
                    >
                      View Collections
                    </button>
                  </div>
                </div>
                <div className="flex items-end justify-between w-full h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-2/3">
                    {pkg.packageProducts
                      .slice(0, productsToShow)
                      .map((product) => (
                        <div
                          key={product.id}
                          className="bg-white/90 py-4 px-10 flex flex-col sm:flex-row items-center text-center gap-4"
                        >
                          <img
                            src={product.product.primary_image_url}
                            alt={product.product.name}
                            className="w-32 h-32 object-contain rounded mb-3"
                            onError={(e) =>
                              (e.target.src = "/default_product.jpg")
                            }
                          />
                          <div className="flex flex-col items-start gap-2">
                            <p className="text-sm font-semibold text-gray-800 mb-1">
                              {product.product.name.slice(0, 20)}...
                            </p>
                            <p className="text-md font-bold text-gray-900 mb-2">
                              {product.product.max_price} {language === "ar" ? "ج.م" : "LE"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomePackages;
