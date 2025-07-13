import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCategories from "../../../hooks/Categories/useCategories";
import ProductCard from "./ProductCard";
import Loader from "../../../layouts/Loader";
import { PackageX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import Meta from "../../../components/Meta/Meta";

const CategoryId = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { category, loading, error, getTranslatedText } = useCategories(
    null,
    null,
    categoryId
  );
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (category?.name) {
      const slug = encodeURIComponent(category.name.replace(/\s+/g, "-"));
      if (!window.location.pathname.includes(`/${slug}`)) {
        navigate(`/categories/${categoryId}/${slug}`, { replace: true });
      }
    }
    console.log(category);
  }, [category?.name, categoryId, navigate]);
  

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-4 text-red-600">خطأ: {error}</div>;
  if (!category) return <div className="text-center py-4">لا توجد بيانات</div>;

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <Meta
        title={category.name}
        description={`Explore products in the ${category.name} category.`}
        image={category.image_url}
      />
      <div
        className="bg-[#e8e4dd] text-[#333e2c] text-center py-25 mb-6"
        //       style={{
        //   background: category.image_url
        //     ? `url(${category.image_url}) center/cover no-repeat`
        //     : '#e8e4dd',
        // }}
      >
        <h2 className="text-4xl font-bold font-serif ">{category.name}</h2>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {category.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center">
            <PackageX size={60} className="mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">
              {t("noProductsTitle")}
            </h2>
            <p className="text-md text-gray-400">{t("noProductsSubtitle")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-12">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getTranslatedText={getTranslatedText}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryId;
