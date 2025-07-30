import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAdminPackages from "../../dashboard/hooks/Packages/useAdminPackages";
import PackagesCard from "./PackagesCard";
import Pagination from "./Pagination";
import { FolderX } from "lucide-react";
import { useLanguage } from "../../context/Language/LanguageContext";
import SkeletonLoader from "../../layouts/SkeletonLoader";
import Meta from "../../components/Meta/Meta";

import { useSettingsContext } from "../../context/Settings/SettingsContext";

const Packages = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { packages, loading, error, totalPages, currentPage, meta } =
    useAdminPackages(page);

  // * Fetch Settings to show the Banner Image
  const { settings } = useSettingsContext();
  const banner = settings.find(
    (setting) => setting.key === "packages_banner_image"
  );
  const bannerUrl = banner?.value;

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  if (loading) return <SkeletonLoader />;
  if (packages.length === 0 && !loading)
    return (
      <div className="flex flex-col items-center justify-center pb-16 text-gray-500 text-center">
      <div className="relative w-full h-100 overflow-hidden shadow-md">
        <img
          src={bannerUrl}
          alt="Packages Banner"
          className="w-full h-full object-cover"
        />
      </div>
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
    <div className="@container mx-auto" dir={language === "ar" ? "rtl" : "ltr"}>
      <Meta
        title={t("Explore_Packages")}
        keywords="packages, explore packages, shop packages"
        description="Discover a variety of packages to explore and shop from."
      />
      {/* Package Banner */}
      <div className="relative w-full h-100 overflow-hidden shadow-md">
        <img
          src={bannerUrl}
          alt="Packages Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col py-10 px-8">
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
    </div>
  );
};

export default Packages;
