import React from "react";

const CategoriesSkeleton = () => {
  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="max-w-7xl mx-auto py-30 px-4 sm:px-6 lg:px-8 border-b border-gray-300">
      <div className="flex flex-wrap justify-between mt-8 mb-6">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-40" />
        <div className="h-8 bg-gray-200 animate-pulse rounded w-24" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="relative group rounded-md overflow-hidden bg-white shadow-md flex flex-col"
            style={{ minHeight: 300 }}
          >
            <div className="relative flex justify-center items-center h-48 bg-gray-50">
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            </div>

            <div className="flex flex-col flex-1 p-4 gap-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSkeleton;
