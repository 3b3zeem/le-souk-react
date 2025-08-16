import React from "react";
import {
  ShoppingCart,
  Heart,
  CornerDownRight,
} from "lucide-react"; 

const GridView = ({
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
  navigate
}) => {
  return (
    <div
      key={product.id}
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative group border overflow-hidden bg-white shadow-md hover:shadow-sm transition-shadow duration-300 cursor-pointer flex flex-col rounded"
      style={{
        borderColor: colors.borderLight,
      }}
    >
      <div
        className="relative flex justify-center items-center h-65 cursor-pointer"
        onClick={() => handleProductClick(product.id)}
      >
        <img
          src={hoveredIndex === idx ? secondImage : primaryImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full lg:object-cover object-contain transition-transform duration-200 group-hover:scale-105"
        />
        {/* WishList */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleWishlist(product.id);
          }}
          disabled={loadingStates.wishlist[product.id]}
          className={`absolute top-3 ${
            language === "ar" ? "left-3" : "right-3"
          } z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center
            opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-300 delay-50 cursor-pointer
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
            fill={isProductInWishlist(product.id) ? "red" : "none"}
          />
        </button>
        {/* Cart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product.id, 1);
          }}
          disabled={loadingStates.cart[product.id]}
          className={`absolute bottom-3 ${
            language === "ar" ? "left-3" : "right-3"
          } z-10 bg-white border border-gray-300 shadow-lg p-2 rounded flex items-center justify-center
            opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-300 delay-150 cursor-pointer
        ${
            loadingStates.cart[product.id]
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-100"
        }`}
          style={{ borderColor: colors.borderLight }}
        >
          <ShoppingCart size={22} className="text-gray-500" />
        </button>
        {/* Discount badge */}
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
            -{product.discount_percentage}% {t("offer")}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="text-base font-bold mb-1 truncate"
          style={{
            color: colors.productTitle,
            minHeight: 24,
          }}
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </h3>
        <p
          className="text-sm text-gray-500 mb-2 truncate"
          style={{ minHeight: 20 }}
        >
          {product.description}
        </p>

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
                  className="text-lg font-bold"
                  style={{ color: colors.primary }}
                >
                  {product.min_sale_price} {language === "ar" ? "د.ك" : "KWD"}
                </span>
              </div>
            </div>
          ) : (
            <span
              className="text-lg font-bold"
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

        {/* Stock*/}
        {product.total_stock === 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{t("outOfStock")}:</span>
            <span className="text-xs font-semibold text-red-600">
              {t("soldOut")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridView;
