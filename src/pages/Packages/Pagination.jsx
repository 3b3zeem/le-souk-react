import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({ currentPage, totalPages, onPageChange, links = [] }) => {
  const { t } = useTranslation();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageRange = () => {
    const delta = 2;
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    if (end - start < 2 * delta) {
      if (start === 1) end = Math.min(1 + 2 * delta, totalPages);
      else if (end === totalPages) start = Math.max(totalPages - 2 * delta, 1);
    }

    return { start, end };
  };

  const { start, end } = getPageRange();

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } border border-gray-300`}
        >
          {t("Previous")}
        </button>

        {/* Page Numbers */}
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
          (pageNumber) => {
            const link = links.find(
              (l) => parseInt(l.label, 10) === pageNumber
            ) || { active: false };
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${
                  isActive
                    ? "bg-[#333e2c] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } border border-gray-300`}
        >
          {t("Next")}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
