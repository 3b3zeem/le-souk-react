import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import useProducts from "../../hooks/Products/useProductData";
import Loader from "../../layouts/Loader";
import { renderStars } from "../../utils/ratingUtils";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [perPage, setPerPage] = useState(5);
  const navigate = useNavigate();

  const {
    products,
    categories,
    loading,
    loadMoreLoading,
    error,
    totalProducts,
  } = useProducts(searchQuery, selectedCategory, minPrice, maxPrice, perPage);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  }, [searchQuery, setSearchParams, selectedCategory, setSelectedCategory]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPerPage(5);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPerPage(5);
  };

  const handlePriceChange = () => {
    setMinPrice(Number(document.getElementById("minPrice").value));
    setMaxPrice(Number(document.getElementById("maxPrice").value));
    setPerPage(5);
  };

  const handleLoadMore = () => {
    setPerPage((prevPerPage) => prevPerPage + 5);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 h-[100%] border border-gray-200 rounded-md shadow-md p-3">
          <div className="mb-8">
            <h3
              className="relative inline-block font-bold text-2xl"
              style={{ color: colors.productName }}
            >
              Categories
              <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
            </h3>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center mb-4">
                <input
                  type="radio"
                  id={`category-${category.id}`}
                  name="category"
                  value={category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="mr-2"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="flex items-center text-sm"
                  style={{ color: colors.text }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-6 h-6 object-cover rounded-full mr-2"
                  />
                  {category.name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <h3
              className="relative inline-block font-bold text-2xl"
              style={{ color: colors.productName }}
            >
              Price
              <div className="w-[50px] h-[3px] bg-[#1A76D1] mb-5 mt-1"></div>
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                id="minPrice"
                type="number"
                placeholder="0 LE"
                defaultValue={0}
                className="w-1/2 p-2 border rounded-md text-sm"
                style={{ borderColor: colors.borderLight }}
              />
              <span className="text-sm" style={{ color: colors.text }}>
                TO
              </span>
              <input
                id="maxPrice"
                type="number"
                placeholder="100 LE"
                defaultValue={100}
                className="w-1/2 p-2 border rounded-md text-sm"
                style={{ borderColor: colors.borderLight }}
              />
            </div>
            <button
              onClick={handlePriceChange}
              className="w-[100px] py-2 text-sm font-medium rounded-md cursor-pointer customEffect"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              <span>Apply</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-[200px] focus-within:w-[300px] transition-all duration-200">
              <input
                type="text"
                placeholder="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-4 px-2 pl-4 border text-sm focus:outline-none shadow-sm"
                style={{ borderColor: colors.borderLight }}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </span>
            </div>
            <div className="relative">
              <select
                className="p-2 border rounded-md text-sm appearance-none"
                style={{ borderColor: colors.borderLight }}
              >
                <option>Features: ALL</option>
              </select>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </span>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border overflow-hidden bg-gray-50 shadow-sm cursor-pointer"
                    style={{ borderColor: colors.borderLight }}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    <div className="flex justify-center items-center h-48 bg-white">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain p-4 hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3
                        className="text-base font-bold"
                        style={{ color: colors.text }}
                      >
                        {product.name}
                      </h3>
                      <h3
                        className="text-base font-semibold truncate my-3"
                        style={{ color: colors.productName }}
                      >
                        {product.description}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          {renderStars(product.rating)}
                          <span
                            className="ml-1 text-sm"
                            style={{ color: colors.text }}
                          >
                            {product.reviews.length} reviews
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-2">
                        <p
                          className="text-sm font-semibold mt-2"
                          style={{ color: colors.primary }}
                        >
                          {product.price} LE
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="p-3 rounded-full border group hover:bg-[#569be1] hover:text-white transition duration-200 cursor-pointer"
                            style={{ borderColor: colors.borderLight }}
                          >
                            <ShoppingCart
                              size={20}
                              className="text-gray-500 group-hover:text-white transition duration-200"
                            />
                          </button>
                          <button
                            className="p-3 rounded-full border group hover:bg-[#569be1] hover:text-white transition duration-200 cursor-pointer"
                            style={{ borderColor: colors.borderLight }}
                          >
                            <Heart
                              size={20}
                              className="text-gray-500 group-hover:text-white transition duration-200"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {products.length < totalProducts && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadMoreLoading}
                    className={`px-6 py-2 border rounded-md text-sm font-medium transition duration-200 flex items-center gap-2 ${
                      loadMoreLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.lightText,
                      borderColor: colors.borderLight,
                    }}
                  >
                    {loadMoreLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
