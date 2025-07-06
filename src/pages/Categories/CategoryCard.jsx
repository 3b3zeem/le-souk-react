import React, { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/Language/LanguageContext";

const CategoryCard = ({ category }) => {
  const [bgImage, setBgImage] = useState(category.image_url);
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="relative bg-white rounded-lg overflow-hidden group h-70 transition-all duration-300">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105 cursor-pointer"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#e5e7eb",
        }}
        onClick={() => navigate(`/categories/${category.id}`)}
      >
        <img
          src={category.image_url}
          alt="check image"
          hidden
          onError={() => setBgImage("/default_category.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col gap-5 justify-end items-start p-7 transition-all duration-300">
          {/* Category Name */}
          <h3 className="flex gap-2 items-center text-xl font-semibold text-white group-hover:text-white transition duration-300 truncate">
            {category.name.slice(0, 20)}...
            {language === "ar" ? (
              <MoveLeft className="text-white group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            ) : (
              <MoveRight className="text-white group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </h3>
          {/* Products Count */}
          <span className="text-sm text-white mt-1 bg-gray-300/50 rounded-full px-3 py-1 hover:bg-[#333e2c]  hover:text-white transition-colors duration-300">
            {category.products.length}{" "}
            {category.products.length === 1 ? "Product" : "Products"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
