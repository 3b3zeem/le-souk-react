import React, { useCallback } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, X } from "lucide-react";

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
    const maxAllowed = 1000;

    const cappedMin = Math.min(sliderPrice[0], maxAllowed);
    const cappedMax = Math.min(sliderPrice[1], maxAllowed);

    setMinPrice(cappedMin);
    setMaxPrice(cappedMax);
    setPage(1);
    setShowFilters(false);
    setSliderPrice([cappedMin, cappedMax]);
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
        className="lg:hidden bg-[#333e2c] text-white px-4 py-2 shadow-md focus:outline-none focus:ring-2 cursor-pointer customEffect"
        aria-label={t("showFilters")}
      >
        <span>{t("showFilters")}</span>
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
              <div className="flex justify-end mb-4">
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
                    className="relative inline-block font-bold text-2xl uppercase"
                    style={{ color: colors.productName }}
                  >
                    {t("filter_by_price")}
                    <div className="w-[50px] h-[3px] bg-[#333e2c] mb-5 mt-1"></div>
                  </h3>
                  <div className="flex flex-col gap-4">
                    <Slider
                      range
                      min={0}
                      max={500}
                      value={sliderPrice}
                      onChange={setSliderPrice}
                      allowCross={false}
                      step={10}
                      trackStyle={[
                        { backgroundColor: colors.primary, cursor: "e-resize" },
                      ]}
                      handleStyle={[
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary,
                          cursor: "e-resize",
                        },
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary,
                          cursor: "e-resize",
                        },
                      ]}
                      ariaLabelGroupForHandles={[
                        "Minimum price",
                        "Maximum price",
                      ]}
                    />
                    <div className="flex justify-between text-sm">
                      <div className="flex text-gray-950 font-semibold">
                        <span>
                          <span className="text-gray-600">{t("price")}:</span>{" "}
                          {sliderPrice[0]} {language === "ar" ? "د.ك" : "KWD"}
                        </span>
                        <span>
                          <Minus />
                        </span>
                        <span>
                          {sliderPrice[1]} {language === "ar" ? "د.ك" : "KWD"}
                        </span>
                      </div>
                      <button
                        onClick={handleApplyPrice}
                        className="w-[100px] py-2 text-sm font-medium hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer customEffect uppercase tracking-widest"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.lightText,
                        }}
                      >
                        <span>{t("filter")}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    className="relative inline-block font-bold text-2xl mt-6 uppercase"
                    style={{ color: colors.productName }}
                  >
                    {t("categories")}
                    <div className="w-[50px] h-[3px] bg-[#333e2c] mb-5 mt-1"></div>
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
                                ? "border-[#333e2c] bg-[#e7ede2] shadow-md"
                                : "border-gray-200 bg-white"
                            }
                            hover:border-[#333e2c] hover:bg-[#f0f4eb]
                            focus:outline-none focus:ring-2 focus:ring-[#333e2c]
                          `}
                          style={{ minWidth: 120 }}
                          aria-pressed={isSelected}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition
                            ${
                              isSelected ? "border-gray-100 ring-2 ring-[#cbd5c0]" : "border-gray-300"
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
                              isSelected ? "text-[#333e2c]" : "text-gray-700"
                            }`}
                          >
                            {category.name}
                          </span>
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-[#333e2c] ml-1"
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

                <div>
                  <h3
                    className="relative inline-block font-bold text-2xl mt-6 uppercase"
                    style={{ color: colors.productName }}
                  >
                    {t("product_status")}
                    <div className="w-[50px] h-[3px] bg-[#333e2c] mb-5 mt-1"></div>
                  </h3>
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
                          onChange={() => setInStock(inStock === 1 ? null : 1)}
                          className="opacity-0 w-0 h-0 peer"
                          aria-label={t("inStock")}
                        />
                        <span
                          className={`absolute left-0 top-0 w-10 h-6 rounded-full transition ${
                            inStock === 1 ? "bg-[#333e2c]" : "bg-gray-300"
                          } peer-focus:ring-2 peer-focus:ring-[#333e2c]`}
                        ></span>
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition ${
                            inStock === 1 ? "translate-x-4" : ""
                          }`}
                        ></span>
                      </span>
                    </label>
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
            className="relative inline-block font-bold text-2xl uppercase"
            style={{ color: colors.productName }}
          >
            {t("filter_by_price")}
            <div className="w-[50px] h-[3px] bg-[#333e2c] mb-5 mt-1"></div>
          </h3>
          <div className="flex flex-col gap-4 px-3">
            <Slider
              range
              min={0}
              max={500}
              value={sliderPrice}
              onChange={setSliderPrice}
              allowCross={false}
              step={10}
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
              <div className="flex text-gray-950 font-semibold">
                <span>
                  <span className="text-gray-600">{t("price")}:</span>{" "}
                  {sliderPrice[0]} {language === "ar" ? "د.ك" : "KWD"}
                </span>
                <span>
                  <Minus />
                </span>
                <span>
                  {sliderPrice[1]} {language === "ar" ? "د.ك" : "KWD"}
                </span>
              </div>
              <button
                onClick={handleApplyPrice}
                className="w-[100px] py-2 text-sm font-medium hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#333e2c] cursor-pointer customEffect uppercase tracking-widest"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.lightText,
                }}
              >
                <span>{t("filter")}</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3
            className="relative inline-block font-bold text-2xl mt-6 uppercase"
            style={{ color: colors.productName }}
          >
            {t("categories")}
            <div className="w-[50px] h-[3px] bg-[#333e2c] mb-5 mt-1"></div>
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
                        ? "border-[#333e2c] bg-[#e7ede2] shadow-md"
                        : "border-gray-200 bg-white"
                    }
                    hover:border-[#333e2c] hover:bg-[#f0f4eb]
                    focus:outline-none focus:ring-2 focus:ring-[#333e2c]
                  `}
                  style={{ minWidth: 120 }}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition
                    ${
                      isSelected
                        ? "border-gray-100 ring-2 ring-[#cbd5c0]"
                        : "border-gray-300"
                    }
                    bg-white overflow-hidden`}
                  >
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-7 h-7 object-cover rounded-full"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/default_category.jpg")}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-[#333e2c]" : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-[#333e2c] ml-1"
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

        <div>
          <h3
            className="relative inline-block font-bold text-2xl mt-6 uppercase"
            style={{ color: colors.productName }}
          >
            {t("product_status")}
            <div className="w-[50px] h-[3px] bg-[#333e2c] mb-5 mt-1"></div>
          </h3>
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
                  onChange={() => setInStock(inStock === 1 ? null : 1)}
                  className="opacity-0 w-0 h-0 peer"
                  aria-label={t("inStock")}
                />
                <span
                  className={`absolute left-0 top-0 w-10 h-6 rounded-full transition ${
                    inStock === 1 ? "bg-[#333e2c]" : "bg-gray-300"
                  } peer-focus:ring-2 peer-focus:ring-[#333e2c]`}
                ></span>
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition ${
                    inStock === 1 ? "translate-x-4" : ""
                  }`}
                ></span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
