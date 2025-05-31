import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import Pagination from "./Pagination";
import useCategories from "../../hooks/Categories/useCategories";
import Loader from "../../layouts/Loader";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/Language/LanguageContext";

const Categories = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { categories, meta, loading, error } = useCategories(10, page);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div
      className="container mx-auto py-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 relative">
        {t("Explore_Categories")}
        <span class="block w-16 h-1 bg-[#1e70d0] rounded-full mx-auto mt-2"></span>
      </h2>
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center">
          <FolderX size={60} className="mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">
            {t("noCategoriesTitle")}
          </h2>
          <p className="text-md text-gray-400">{t("noCategoriesSubtitle")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
};

export default Categories;
