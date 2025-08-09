import React from "react";

const FooterSkeleton = () => {
  return (
    <footer className="w-full p-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-300 pb-6 mb-8">
        {/* Top row skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="p-4 rounded-full border border-dotted border-gray-300">
                <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
              </div>
              <div>
                <div className="h-4 bg-gray-300 animate-pulse rounded w-20 mb-2" />
                <div className="h-4 bg-gray-300 animate-pulse rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="flex justify-center items-center sm:items-start">
            <div className="w-40 h-20 bg-gray-300 animate-pulse rounded" />
          </div>

          {/* Opening hours */}
          <div>
            <div className="h-6 bg-gray-300 animate-pulse rounded w-32 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 animate-pulse rounded w-40" />
              <div className="h-4 bg-gray-300 animate-pulse rounded w-28" />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="h-6 bg-gray-300 animate-pulse rounded w-28 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 animate-pulse rounded w-32" />
              ))}
            </div>
          </div>

          {/* Social links */}
          <div>
            <div className="h-6 bg-gray-300 animate-pulse rounded w-28 mb-4" />
            <div className="flex space-x-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-300 animate-pulse rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-gray-300 text-center">
        <div className="h-4 bg-gray-300 animate-pulse rounded w-40 mx-auto" />
      </div>
    </footer>
  );
};

export default FooterSkeleton;
