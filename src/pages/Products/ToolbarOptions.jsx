import React from "react";
import {
  Search,
  ChevronDown,
  AlignJustify,
  Table,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ToolbarOptions = (props) => {
  return (
    <React.Fragment>
      {/* Search */}
      <form
        onSubmit={props.handleSearchSubmit}
        className="relative w-[200px] focus-within:w-[300px] transition-all duration-200"
      >
        <input
          type="text"
          placeholder={props.t("search")}
          value={props.searchQuery}
          onChange={props.handleSearchChange}
          className="w-full py-3 px-4 pr-7 border text-sm focus:outline-none shadow-sm"
          style={{ borderColor: props.colors.borderLight }}
        />
        <span
          className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer ${
            props.language === "ar" ? "left-3" : "right-3"
          }`}
          onClick={props.handleSearchSubmit}
        >
          <Search
            size={15}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          />
        </span>
      </form>

      {/* Show Per Page Selector */}
      <div className="flex items-center gap-2 text-base select-none">
        <span className="text-gray-700 font-semibold">
          {props.language === "ar" ? "عرض" : "Show"} :
        </span>
        {[9, 12, 18, 24].map((num, idx, arr) => (
          <React.Fragment key={num}>
            <span
              onClick={() => {
                props.setPerPage(num);
                props.setPage(1);
              }}
              className={
                props.perPage === num
                  ? "font-bold text-[#333e2c] cursor-pointer"
                  : "text-gray-400 cursor-pointer hover:text-black transition-all duration-200"
              }
              style={{ userSelect: "none" }}
            >
              {num}
            </span>
            {idx < arr.length - 1 && <span className="text-gray-300">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 ml-4">
        {/* List Icon */}
        <button
          onClick={() => props.setViewMode("list")}
          className={`p-1 rounded ${
            props.viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="List view"
        >
          <AlignJustify
            size={22}
            className={
              props.viewMode === "list"
                ? "text-[#333e2c] cursor-pointer"
                : "text-gray-400 cursor-pointer"
            }
          />
        </button>
        {/* Grid Icon */}
        <button
          onClick={() => props.setViewMode("grid")}
          className={`p-1 rounded ${
            props.viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Grid view"
        >
          <Table
            size={22}
            className={
              props.viewMode === "grid"
                ? "text-[#333e2c] cursor-pointer"
                : "text-gray-400 cursor-pointer"
            }
          />
        </button>
      </div>

      {/* Sort */}
      <div className="relative w-48" ref={props.sortDropdownRef}>
        <button
          type="button"
          className="flex justify-between items-center w-full py-3 px-4 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white border-gray-200 text-gray-700 appearance-none cursor-pointer"
          style={{ borderColor: props.colors.borderLight }}
          onClick={() => props.setSortDropdownOpen((open) => !open)}
        >
          {
            props.sortOptions.find(
              (opt) => opt.value === `${props.sortBy}_${props.sortDirection}`
            )?.label
          }
          <ChevronDown
            className={`w-5 h-5 text-blue-500 absolute ${
              props.language === "ar" ? "left-3" : "right-3"
            } pointer-events-none ${props.sortDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {props.sortDropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {props.sortOptions.map((option) => (
                <li
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition ${
                    `${props.sortBy}_${props.sortDirection}` === option.value
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : ""
                  }`}
                  onClick={() => {
                    props.setSortDropdownOpen(false);
                    props.handleSortChange({
                      target: { value: option.value },
                    });
                  }}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </React.Fragment>
  );
};

export default ToolbarOptions;
