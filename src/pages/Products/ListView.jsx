import React from "react";
import {
  ShoppingCart,
  Heart,
  CornerDownRight,
} from "lucide-react";

const ListView = ({
  product,
  setHoveredIndex,
  idx,
  handleProductClick,
  hoveredIndex,
  secondImage,
  primaryImage,
  language,
  t,
  colors,
  handleToggleWishlist,
  loadingStates,
  isProductInWishlist,
  handleAddToCart,
}) => {
  return (
    <div
      key={product.id}
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="flex flex-col md:flex-row bg-white shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
      style={{ minHeight: 240 }}
      onClick={() => handleProductClick(product.id)}
    >
      {/* Discount badge */}
      {product.discount_percentage && (
        <span
          className="absolute"
          style={{
            top: 18,
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
          -{product.discount_percentage}% {t("offer")}
        </span>
      )}

      {/* Image */}
      <div
        className="flex-shrink-0 flex items-center justify-center bg-gray-50 p-6 md:w-1/2 relative h-100"
        style={{ minHeight: 220 }}
      >
        <img
          src={hoveredIndex === idx ? secondImage : primaryImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-6 gap-2 justify-center relative">
        {/* Name */}
        <h3
          className="text-2xl font-semibold mb-1 text-gray-800 cursor-pointer"
          onClick={() => handleProductClick(product.id)}
        >
          {product.name}
        </h3>

        {/* Categories */}
        <div className="text-gray-400 text-sm mb-1">
          {product.categories && product.categories.length > 0
            ? product.categories.map((cat) => cat.name).join(", ")
            : ""}
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-2">
          {product.on_sale === true &&
          product.discount_value > 0 &&
          product.min_sale_price &&
          product.min_sale_price !== product.min_price ? (
            <div className="flex flex-col">
              <span className="line-through text-gray-400 text-xs font-normal">
                {product.min_price} {language === "ar" ? "د.ك" : "KWD"}
              </span>
              <div className="flex items-center gap-2">
                <CornerDownRight size={20} style={{ color: colors.primary }} />
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {product.min_sale_price} {language === "ar" ? "د.ك" : "KWD"}
                </span>
              </div>
            </div>
          ) : (
            <span
              className="text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              {product.min_price} {language === "ar" ? "د.ك" : "KWD"}
            </span>
          )}
        </div>

        {/* Discount duration */}
        {product.on_sale === true &&
          product.discount_value > 0 &&
          product.sale_starts_at &&
          product.sale_ends_at &&
          (() => {
            const start = new Date(product.sale_starts_at);
            const end = new Date(product.sale_ends_at);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            return (
              <div className="mb-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {diffMonths > 0
                    ? t("discount_for_months", {
                        count: diffMonths,
                      })
                    : t("discount_for_days", {
                        count: diffDays,
                      })}
                </span>
              </div>
            );
          })()}

        {/* Description */}
        <div className="text-gray-500 text-base mb-4 line-clamp-2">
          {product.description}
        </div>

        {/* Stock */}
        {product.total_stock === 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{t("outOfStock")}:</span>
            <span className="text-xs font-semibold text-red-600">
              {t("soldOut")}
            </span>
          </div>
        )}

        {/* wishLis & Cart */}
        <div className="flex justify-start items-center gap-4">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist(product.id);
            }}
            disabled={loadingStates.wishlist[product.id]}
            className={`bg-white border border-gray-300 p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
                                ${
                                  loadingStates.wishlist[product.id]
                                    ? "opacity-50 cursor-not-allowed"
                                    : isProductInWishlist(product.id)
                                    ? "bg-red-100 hover:bg-red-200"
                                    : "hover:bg-blue-100"
                                }
                              `}
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
              fill={isProductInWishlist(product.id) ? "red" : "none"}
            />
            <span className="ml-2 text-sm text-gray-700 font-medium hidden sm:inline">
              {language === "ar" ? "أضف إلى المفضلة" : "Add to Wishlist"}
            </span>
          </button>
          {/* Cart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product.id, 1);
            }}
            disabled={loadingStates.cart[product.id]}
            className={`bg-white border border-gray-300 p-2 rounded flex items-center justify-center transition duration-200 cursor-pointer
                                  ${
                                    loadingStates.cart[product.id]
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-blue-100"
                                  }`}
            style={{ borderColor: colors.borderLight }}
          >
            <ShoppingCart size={22} className="text-gray-500" />
            <span className="ml-2 text-sm text-gray-700 font-medium hidden sm:inline">
              {language === "ar" ? "أضف إلى السلة" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListView;
