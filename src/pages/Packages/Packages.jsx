import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAdminPackages from "../../dashboard/hooks/Packages/useAdminPackages";
import PackagesCard from "./PackagesCard";
import Pagination from "./Pagination";
import { FolderX } from "lucide-react";
import { useLanguage } from "../../context/Language/LanguageContext";
import SkeletonLoader from "../../layouts/SkeletonLoader";
import Meta from "../../components/Meta/Meta";

const Packages = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { packages, loading, error, totalPages, currentPage, meta } =
    useAdminPackages(page);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  if (loading) return <SkeletonLoader />;
  if (packages.length === 0 && !loading)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center">
        <h2 className="text-4xl font-bold text-[#333e2c] font-serif mt-6  text-center mb-12 relative">
          {t("Explore_Packages")}
          <span className="block w-16 h-1 bg-[#333e2c] rounded-full mx-auto mt-2"></span>
        </h2>
        <FolderX size={60} className="mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold mb-2">{t("noPackagesTitle")}</h2>
        <p className="text-md text-gray-400">{t("noPackagesSubtitle")}</p>
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  return (
    <div
      className="@container mx-auto py-6  px-4 "
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title={t("Explore_Packages")}
        keywords="packages, explore packages, shop packages"
        description="Discover a variety of packages to explore and shop from."
      />
      <h2 className="text-4xl font-bold text-[#333e2c] font-serif mt-6  text-center mb-12 relative">
        {t("Explore_Packages")}
        <span className="block w-16 h-1 bg-[#333e2c] rounded-full mx-auto mt-2"></span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <PackagesCard key={pkg.id} packages={pkg} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        links={meta?.links || []}
      />
    </div>
  );
};

export default Packages;
