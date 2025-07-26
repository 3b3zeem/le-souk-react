import { MoveLeft, MoveRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/Language/LanguageContext";

const PackagesCard = ({ packages }) => {
  const [bgImage, setBgImage] = useState(packages?.image_url);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const productCount = packages.packageProducts?.length || 0;

  return (
    <div className="relative bg-white rounded-lg overflow-hidden group h-70 transition-all duration-300">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105 cursor-pointer"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#e5e7eb",
        }}
        onClick={() => navigate(`/packages/${packages.id}`)}
      >
        <img
          src={packages.image_url}
          alt="check image"
          hidden
          onError={() => setBgImage("/default_category.jpg")}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300"></div>

        {/* packages name that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h2 className="text-white text-2xl font-bold text-center font-serif px-4">
            {packages.name.slice(0, 20)}
          </h2>
          <div className="absolute inset-0 flex flex-col gap-5 justify-end items-start p-7 transition-all duration-300">
            <span className="text-sm text-white mt-1 rounded-md px-3 py-1 bg-[#333e2c] hover:text-white transition-colors duration-300">
              {productCount} {productCount === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesCard;
