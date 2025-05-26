import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useHome from "../../../hooks/HomeComponents/useHome";
import { useNavigate } from "react-router-dom";
import Loader from "../../../layouts/Loader";
import { useLanguage } from "../../../context/Language/LanguageContext";
import useCartCRUD from "../../../hooks/Cart/UseCart";
import useWishlistCRUD from "../../../hooks/WishList/useWishlist";
import { useWishlist } from "../../../context/WishList/WishlistContext";
import { Heart, ShoppingCart } from "lucide-react";

const HomePackages = () => {
  const { packages, loading, error } = useHome(5);
  const [productsToShow, setProductsToShow] = useState(4);
  const { language } = useLanguage();

  const { addToCart } = useCartCRUD();
  const { toggleWishlist, fetchWishlist } = useWishlistCRUD();
  const { wishlistItems, fetchWishlistItems, fetchWishlistCount } =
    useWishlist();
  const [loadingStates, setLoadingStates] = useState({
    cart: {},
    wishlist: {},
  });

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

  const colors = {
    primary: "#1e70d0",
    categoryTitle: "#808080",
    categoryName: "#6b7280",
    borderLight: "#e5e7eb",
    lineBg: "#d1d5db",
  };

  const handleAddToCart = async (productId, quantity) => {
    setLoadingStates((prev) => ({
      ...prev,
      cart: { ...prev.cart, [productId]: true },
    }));
    try {
      await addToCart(productId, quantity);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        cart: { ...prev.cart, [productId]: false },
      }));
    }
  };

  const handleToggleWishlist = async (productId) => {
    setLoadingStates((prev) => ({
      ...prev,
      wishlist: { ...prev.wishlist, [productId]: true },
    }));

    try {
      await toggleWishlist(productId);
      await fetchWishlistItems();
      await fetchWishlistCount();
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        wishlist: { ...prev.wishlist, [productId]: false },
      }));
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!packages?.length) return <div>No packages available</div>;

  return (
    <div className="relative w-full py-16">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                    {pkg.packageProducts
                      .slice(0, productsToShow)
                      .map((product) => (
                        <div
                          className="flex flex-col md:flex-row bg-white/90 p-4 items-start justify-between gap-4"
                          key={product.id}
                        >
                          <div className="flex flex-col sm:flex-row  gap-4">
                            <img
                              src={product.product.primary_image_url}
                              alt={product.product.name}
                              className="w-28 h-28 object-contain rounded"
                              onError={(e) =>
                                (e.target.src = "/default_product.jpg")
                              }
                            />
                            <div className="flex flex-col items-center sm:items-start gap-2">
                              <p className="text-sm font-semibold text-gray-800">
                                {product.product.name.slice(0, 20)}...
                              </p>
                              <p className="text-md font-bold text-gray-900">
                                {product.product.max_price}{" "}
                                {language === "ar" ? "ج.م" : "LE"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col items-center gap-3">
                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleWishlist(product.id);
                              }}
                              disabled={loadingStates.wishlist[product.id]}
                              className={`z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
                                ${
                                  loadingStates.wishlist[product.id]
                                    ? "opacity-50 cursor-not-allowed"
                                    : isProductInWishlist(product.id)
                                    ? "bg-red-100 hover:bg-red-200"
                                    : "hover:bg-blue-100"
                                }`}
                              style={{ borderColor: colors.borderLight }}
                            >
                              <Heart
                                size={22}
                                className={`transition ${
                                  loadingStates.wishlist[product.id]
                                    ? "text-gray-400"
                                    : isProductInWishlist(product.id)
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                                fill={
                                  isProductInWishlist(product.id)
                                    ? "red"
                                    : "none"
                                }
                              />
                            </button>

                            {/* Cart Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product.id, 1);
                              }}
                              disabled={loadingStates.cart[product.id]}
                              className={`z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
                                ${
                                  loadingStates.cart[product.id]
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-100"
                                }`}
                              style={{ borderColor: colors.borderLight }}
                            >
                              <ShoppingCart
                                size={22}
                                className="text-gray-500"
                              />
                            </button>
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
