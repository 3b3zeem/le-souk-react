import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  if (!meta.links) return null;

  return (
    <div className="flex justify-center mt-4 gap-2">
      {meta.links
        .filter((link) => !isNaN(parseInt(link.label)))
        .map((link, index) => (
          <button
            key={index}
            onClick={() => link.url && onPageChange(parseInt(link.label))}
            className={`px-3 py-1 rounded ${
              link.active
                ? "bg-[#333e2c] text-white cursor-pointer hover:opacity-85 transition-all duration-200"
                : "bg-gray-200 text-gray-700 cursor-pointer hover:opacity-85 transition-all duration-200"
            }`}
            disabled={!link.url}
          >
            {link.label}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
