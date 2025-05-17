import React from "react";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, getTranslatedText }) => {
  const { language } = useLanguage();
  const id = product.id;
  const name = getTranslatedText(product.translations, "name");
  const description = getTranslatedText(product.translations, "description");
  const price = product.min_price;
  const imageUrl = product.primary_image_url;

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${id}`)}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start max-w-xs group overflow-hidden hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
    >
      <div
        className="w-full h-48 bg-gray-200 rounded-lg mb-4"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
      <div className="mt-2 text-[#1e70d0] font-semibold">
        {language === "ar" ? "ج.م" : "LE"} {price}
      </div>
    </div>
  );
};

export default ProductCard;
