import React from "react";
import "./SkeletonPackages.css";

const PackagesSkeleton = () => {
  const fakeProducts = Array(4).fill(null);

  return (
    <div className="relative w-full py-16">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="skeleton-line h-8 w-32 rounded"></div>
        <div className="skeleton-line h-10 w-40 rounded"></div>
      </div>

      {/* Slider Skeleton */}
      <div className="relative overflow-hidden flex flex-col items-center justify-end bg-gray-200 h-[85vh] rounded">
        <div className="absolute inset-0 skeleton-bg"></div>

        <div className="relative z-10 p-6 w-full h-full flex flex-col justify-between items-start">
          <div className="w-full flex flex-col md:flex-row gap-3 justify-between items-start">
            <div className="skeleton-line h-12 w-1/2 rounded"></div>
            <div className="skeleton-line h-10 w-32 rounded"></div>
          </div>

          <div className="flex flex-col justify-end gap-4 w-full h-full items-start">
            <div className="skeleton-line h-8 w-1/3 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {fakeProducts.map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row bg-white/80 p-4 gap-4 rounded">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="skeleton-bg w-28 h-28 rounded"></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="skeleton-line h-4 w-3/4 rounded"></div>
                      <div className="skeleton-line h-4 w-1/2 rounded"></div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center gap-3">
                    <div className="skeleton-bg w-10 h-10 rounded"></div>
                    <div className="skeleton-bg w-10 h-10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PackagesSkeleton;
