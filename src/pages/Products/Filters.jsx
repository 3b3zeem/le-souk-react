import React, { useCallback } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Filters = ({
  t,
  language,
  colors,
  categories,
  selectedCategory,
  setSelectedCategory,
  inStock,
  setInStock,
  sliderPrice,
  setSliderPrice,
  setMinPrice,
  setMaxPrice,
  setPage,
  showFilters,
  setShowFilters,
}) => {
  const handleCategoryClick = useCallback(
    (categoryId) => {
      setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
      setPage(1);
      setShowFilters(false);
    },
    [selectedCategory, setSelectedCategory, setPage]
  );

  const handleApplyPrice = useCallback(() => {
    setMinPrice(sliderPrice[0]);
    setMaxPrice(sliderPrice[1]);
    setPage(1);
    setShowFilters(false);
  }, [sliderPrice, setMinPrice, setMaxPrice, setPage]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowFilters(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const filterVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <div
      className="w-full lg:w-1/3 h-full border border-gray-200 rounded-md shadow-md p-3"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <button
        onClick={() => setShowFilters(true)}
        className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label={t("showFilters")}
      >
        {t("showFilters")}
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 z-400"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleOverlayClick}
          >
            <motion.div
              className="bg-white w-full max-h-[80vh] overflow-y-auto shadow-xl p-4"
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filters-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="filters-title" className="text-xl font-bold">
                  {t("filters")}
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 text-lg font-bold hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                  aria-label={t("closeFilters")}
                >
                  <X />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3
                    className="relative inline-block font-bold text-2xl mb-6"
                    style={{ color: colors.productName }}
                  >
                    {t("categories")}
                    <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                      const isSelected = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryClick(category.id)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg border transition cursor-pointer
                            ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 shadow-md"
                                : "border-gray-200 bg-white"
                            }
                            hover:border-blue-400 hover:bg-blue-100
                            focus:outline-none focus:ring-2 focus:ring-blue-300
                          `}
                          style={{ minWidth: 120 }}
                          aria-pressed={isSelected}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition
                              ${
                                isSelected
                                  ? "border-blue-600 ring-2 ring-blue-200"
                                  : "border-gray-300"
                              }
                              bg-white overflow-hidden`}
                          >
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-7 h-7 object-cover rounded-full"
                              loading="lazy"
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isSelected ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {category.name}
                          </span>
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-blue-600 ml-1"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between">
                  <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                    <span
                      className="font-medium"
                      style={{ color: colors.productName }}
                    >
                      {t("inStock")}
                    </span>
                    <span className="relative inline-block w-10 h-6">
                      <input
                        type="checkbox"
                        checked={inStock === 1}
                        onChange={() => {
                          setInStock(inStock === 1 ? null : 1);
                          setShowFilters(false);
                        }}
                        className="opacity-0 w-0 h-0 peer"
                        aria-label={t("inStock")}
                      />
                      <span
                        className={`absolute left-0 top-0 w-10 h-6 rounded-full transition ${
                          inStock === 1 ? "bg-blue-500" : "bg-gray-300"
                        } peer-focus:ring-2 peer-focus:ring-blue-300`}
                      ></span>
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition ${
                          inStock === 1 ? "translate-x-4" : ""
                        }`}
                      ></span>
                    </span>
                  </label>
                </div>

                <div>
                  <h3
                    className="relative inline-block font-bold text-2xl mb-6"
                    style={{ color: colors.productName }}
                  >
                    {t("price")}
                    <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
                  </h3>
                  <div className="flex flex-col gap-4">
                    <Slider
                      range
                      min={0}
                      max={100000}
                      value={sliderPrice}
                      onChange={setSliderPrice}
                      allowCross={false}
                      step={100}
                      trackStyle={[{ backgroundColor: colors.primary }]}
                      handleStyle={[
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary,
                        },
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary,
                        },
                      ]}
                      ariaLabelGroupForHandles={[
                        "Minimum price",
                        "Maximum price",
                      ]}
                    />
                    <div className="flex justify-between text-sm">
                      <span>
                        {t("Minimum")}: {sliderPrice[0]}{" "}
                        {language === "ar" ? "ج.م" : "LE"}
                      </span>
                      <span>
                        {t("Maximum")}: {sliderPrice[1]}{" "}
                        {language === "ar" ? "ج.م" : "LE"}
                      </span>
                    </div>
                    <button
                      onClick={handleApplyPrice}
                      className="w-[100px] py-2 text-sm font-medium rounded-md hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer customEffect"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.lightText,
                      }}
                    >
                      <span>{t("apply")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:block space-y-6">
        <div>
          <h3
            className="relative inline-block font-bold text-2xl mb-6"
            style={{ color: colors.productName }}
          >
            {t("categories")}
            <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition cursor-pointer
                    ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white"
                    }
                    hover:border-blue-400 hover:bg-blue-100
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                  `}
                  style={{ minWidth: 120 }}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition
                      ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-300"
                      }
                      bg-white overflow-hidden`}
                  >
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-7 h-7 object-cover rounded-full"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src = "/default_category.jpg")
                      }
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-blue-600 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
            <span className="font-medium" style={{ color: colors.productName }}>
              {t("inStock")}
            </span>
            <span className="relative inline-block w-10 h-6">
              <input
                type="checkbox"
                checked={inStock === 1}
                onChange={() => setInStock(inStock === 1 ? null : 1)}
                className="opacity-0 w-0 h-0 peer"
                aria-label={t("inStock")}
              />
              <span
                className={`absolute left-0 top-0 w-10 h-6 rounded-full transition ${
                  inStock === 1 ? "bg-blue-500" : "bg-gray-300"
                } peer-focus:ring-2 peer-focus:ring-blue-300`}
              ></span>
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition ${
                  inStock === 1 ? "translate-x-4" : ""
                }`}
              ></span>
            </span>
          </label>
        </div>

        <div>
          <h3
            className="relative inline-block font-bold text-2xl mb-6"
            style={{ color: colors.productName }}
          >
            {t("price")}
            <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
          </h3>
          <div className="flex flex-col gap-4">
            <Slider
              range
              min={0}
              max={100000}
              value={sliderPrice}
              onChange={setSliderPrice}
              allowCross={false}
              step={100}
              trackStyle={[{ backgroundColor: colors.primary }]}
              handleStyle={[
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary,
                },
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary,
                },
              ]}
              ariaLabelGroupForHandles={["Minimum price", "Maximum price"]}
            />
            <div className="flex justify-between text-sm">
              <span>
                {t("Minimum")}: {sliderPrice[0]}{" "}
                {language === "ar" ? "ج.م" : "LE"}
              </span>
              <span>
                {t("Maximum")}: {sliderPrice[1]}{" "}
                {language === "ar" ? "ج.م" : "LE"}
              </span>
            </div>
            <button
              onClick={handleApplyPrice}
              className="w-[100px] py-2 text-sm font-medium rounded-md hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer customEffect"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              <span>{t("apply")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
