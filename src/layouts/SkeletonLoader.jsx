import React from "react";

const SkeletonLoader = ({ viewMode = "grid" }) => {
  const skeletonCards = Array(9).fill(null);

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-6">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden"
            style={{ minHeight: 240 }}
          >
            {/* Image skeleton */}
            <div className="flex-shrink-0 flex items-center justify-center bg-gray-50 p-6 md:w-1/3 relative">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-md" />
            </div>

            {/* Content skeleton */}
            <div className="flex flex-col flex-1 p-6 gap-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6" />
              </div>
              <div className="flex gap-4 mt-auto">
                <div className="h-10 bg-gray-200 animate-pulse rounded w-32" />
                <div className="h-10 bg-gray-200 animate-pulse rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="relative group rounded-md overflow-hidden bg-white shadow-md flex flex-col"
          style={{ minHeight: 420 }}
        >
          {/* Image skeleton */}
          <div className="relative flex justify-center items-center h-56 bg-gray-50">
            <div className="w-4/5 h-48 bg-gray-200 animate-pulse rounded-md" />
          </div>

          {/* Content skeleton */}
          <div className="flex flex-col flex-1 p-4 gap-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader; 