import React, { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/Language/LanguageContext";

const CategoryCard = ({ category }) => {
  const [bgImage, setBgImage] = useState(category.image_url);
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  return (
    <div className="relative bg-white rounded-lg overflow-hidden group h-55 transition-all duration-300 hover:shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-transform duration-300 group-hover: cursor-pointer"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#e5e7eb",
        }}
        onClick={() => navigate(`/categories/${category.id}`)}
      >
        <img
          className=" "
          src={category.image_url}
          alt="check image"
          hidden
          onError={() => setBgImage("/default_category.jpg")}
        />
        
        {/* Dark overlay that appears on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300"></div>
        
        {/* Category name that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h2 className="text-white text-2xl font-bold text-center font-serif px-4">
               {category.name.slice(0, 20)}
          </h2>
            <div className="absolute inset-0 flex flex-col gap-5 justify-end items-start p-7 transition-all duration-300">

          <span className="text-sm text-white mt-1 rounded-md px-3 py-1 bg-[#333e2c] hover:text-white transition-colors duration-300">
            {category.products.length}{" "}
            {category.products.length === 1 ? "Product" : "Products"}
          </span>
        </div>
        </div>
        
        {/* <div className="absolute inset-0 flex flex-col gap-5 justify-end items-start p-7 transition-all duration-300">
          <h3 className="flex gap-2 items-center text-xl font-semibold font-serif text-white group-hover:text-white transition duration-300 truncate">
            {category.name.slice(0, 20)}
            {language === "ar" ? (
              <MoveLeft className="text-white group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            ) : (
              <MoveRight className="text-white group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </h3>
          <span className="text-sm text-white mt-1 bg-gray-300/50 rounded-md px-3 py-1 hover:bg-[#333e2c] hover:text-white transition-colors duration-300">
            {category.products.length}{" "}
            {category.products.length === 1 ? "Product" : "Products"}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default CategoryCard;