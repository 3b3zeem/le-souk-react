import React from "react";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, getTranslatedText }) => {
  const { language } = useLanguage();
  const id = product.id;
  const name = getTranslatedText(product.translations, "name");
  const description = getTranslatedText(product.translations, "description");
  const imageUrl = product.primary_image_url;

  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${id}`)}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start max-w-lg group overflow-hidden hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
    >
      <div className="w-full h-56 rounded-md mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
      <div className="mt-2 text-[#333e2c] font-semibold">
        {product.on_sale === true &&
        product.min_sale_price &&
        product.min_sale_price !== product.min_price ? (
          <div className="flex gap-2">
            <span className="line-through text-gray-400 text-base font-normal">
              {product.min_price} {language === "ar" ? "د.ك" : "KWD"}
            </span>
            <span>
              {product.min_sale_price} {language === "ar" ? "د.ك" : "KWD"}
            </span>
            {product.discount_percentage && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                {t("discount")}-{product.discount_percentage}%
              </span>
            )}
          </div>
        ) : (
          <span>
            {product.min_price} {language === "ar" ? "د.ك" : "KWD"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
