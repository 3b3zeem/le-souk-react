import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import Pagination from "./Pagination";
import useCategories from "../../hooks/Categories/useCategories";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/Language/LanguageContext";
import SkeletonLoader from "../../layouts/SkeletonLoader";
import Meta from "../../components/Meta/Meta";
import { useSettingsContext } from "../../context/Settings/SettingsContext";

const Categories = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { categories, meta, loading, error } = useCategories(10, page);

  // * Fetch Settings to show the Banner Image
  const { settings } = useSettingsContext();
  const banner = settings.find(
    (setting) => setting.key === "categories_banner_image"
  );
  const bannerUrl = banner?.value;

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  if (loading) return <SkeletonLoader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <React.Fragment>
      {/* Category Banner */}
      <div className="relative w-full h-100 overflow-hidden shadow-md">
        <img
          src={bannerUrl}
          alt="Category Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="@container mx-auto py-6 px-4 sm:px-6 lg:px-8"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <Meta
          title="Explore Categories"
          description="Discover a variety of categories to explore and shop from."
          image="/default_category.jpg"
          url
        />
        {/* Section Heading */}
        <h2 className="text-4xl font-bold text-[#333e2c] font-serif mt-6  text-center mb-12 relative">
          {t("Explore_Categories")}
          <span className="block w-16 h-1 bg-[#333e2c] rounded-full mx-auto mt-2"></span>
        </h2>

        {/* If no categories */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center">
            <FolderX size={60} className="mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">
              {t("noCategoriesTitle")}
            </h2>
            <p className="text-md text-gray-400">{t("noCategoriesSubtitle")}</p>
          </div>
        ) : (
          // Grid of categories
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Pagination component */}
        <div className="mt-10">
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Categories;
