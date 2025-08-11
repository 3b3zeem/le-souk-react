// WeeklyOfferSkeleton.jsx
import React from "react";

const WeeklyOfferSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center bg-white lg:h-[550px] overflow-hidden">
      <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-h-64 lg:max-h-full bg-gray-200 rounded-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        <div className="h-5 w-32 bg-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>

        <div className="h-8 w-3/4 bg-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-5/6 bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 w-16 bg-gray-200 rounded-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            </div>
          ))}
        </div>

        <div className="h-12 w-full bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default WeeklyOfferSkeleton;
