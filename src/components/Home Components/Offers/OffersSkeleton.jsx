import React from "react";
import "./OfferSkeleton.css";

const OffersSkeleton = () => {
  return (
    <div className="p-5 bg-gray-100 w-full">
      <div className="bg-white flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/3 h-full p-6 rounded-lg bg-white">
          <div className="skeleton-title mb-6 w-2/3 h-6"></div>
          <div className="skeleton-card h-80 w-full rounded-lg"></div>
        </div>

        <div className="w-full md:w-2/3 p-4">
          <div className="skeleton-title mb-4 w-1/2 h-6"></div>

          <div className="flex gap-4 mb-4">
            <div className="skeleton-tab w-24 h-8 rounded"></div>
            <div className="skeleton-tab w-24 h-8 rounded"></div>
            <div className="skeleton-tab w-24 h-8 rounded"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-white">
                <div className="skeleton-img w-full h-32 rounded mb-3"></div>
                <div className="skeleton-line w-3/4 h-4 mb-2"></div>
                <div className="skeleton-line w-1/2 h-4"></div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OffersSkeleton;
