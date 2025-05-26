import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useAdminPackages from "../../dashboard/hooks/Packages/useAdminPackages";
import PackagesCard from "./PackagesCard";
import Loader from "../../layouts/Loader";
import Pagination from "./Pagination";
import { FolderX } from "lucide-react";

const Packages = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const {
    packages,
    loading,
    error,
    totalPages,
    currentPage,
    meta,
  } = useAdminPackages(page);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 relative">
        {t("Explore_Packages")}
        <span class="block w-16 h-1 bg-[#1e70d0] rounded-full mx-auto mt-2"></span>
      </h2>
      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center">
          <FolderX size={60} className="mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">
            {t("noPackagesTitle")}
          </h2>
          <p className="text-md text-gray-400">{t("noPackagesSubtitle")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackagesCard key={pkg.id} packages={pkg} />
          ))}
        </div>
      )}
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
