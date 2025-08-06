import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://le-souk.dinamo-app.com/api/";

const useProducts = (
  searchQuery = "",
  categoryId = null,
  minPrice = 0,
  maxPrice = 1000,
  perPage = 5,
  page = 1,
  sortBy = "id",
  sortDirection = "desc",
  inStock = null,
  productId
) => {
  const [productDetails, setProductDetails] = useState(null);
  const [productDetailsLoading, setProductDetailsLoading] = useState(false);
  const [productDetailsError, setProductDetailsError] = useState(null);

  const { language } = useLanguage();

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  // * Fetch categories and products
  const fetchCategories = async (language) => {
    const { data } = await axios.get(`${BASE_URL}categories`, {
      headers: {
        "Accept-Language": language,
      },
    });
    return data.data;
  };

  const fetchProducts = async ({
    language,
    searchQuery,
    categoryId,
    minPrice,
    maxPrice,
    perPage,
    page,
    sortBy,
    sortDirection,
    inStock,
    productId,
  }) => {
    const params = new URLSearchParams();
    params.append("per_page", perPage);
    params.append("page", page);
    params.append("sort_by", sortBy);
    params.append("sort_direction", sortDirection);
    if (productId) params.append("pagination", 0);
    if (searchQuery) params.append("search", searchQuery);
    if (categoryId) params.append("category_id", categoryId);
    if (minPrice !== null) params.append("min_price", minPrice);
    if (maxPrice !== null) params.append("max_price", maxPrice);
    if (inStock !== null) params.append("in_stock", inStock);
    params.append("with", "images,categories,variants");

    const url = `${BASE_URL}products?${params.toString()}`;

    const { data } = await axios.get(url, {
      headers: {
        "Accept-Language": language,
      },
    });

    return {
      products: data.data,
      meta: data.meta || null,
      links: data.links || null,
      total: data.meta?.total || 0,
    };
  };

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories", language],
    queryFn: () => fetchCategories(language),
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: [
      "products",
      language,
      searchQuery,
      categoryId,
      minPrice,
      maxPrice,
      perPage,
      page,
      sortBy,
      sortDirection,
      inStock,
      productId,
    ],
    queryFn: () =>
      fetchProducts({
        language,
        searchQuery,
        categoryId,
        minPrice,
        maxPrice,
        perPage,
        page,
        sortBy,
        sortDirection,
        inStock,
        productId,
      }),
    keepPreviousData: true,
  });

  const fetchProductDetails = async (id) => {
    if (!id) return;

    setProductDetailsLoading(true);
    setProductDetailsError(null);
    setProductDetails(null);

    try {
      const response = await axios.get(
        `${BASE_URL}products/${id}?with=images,categories,variants`
      );
      setProductDetails(response.data.data);
    } catch (err) {
      setProductDetailsError(
        err.response?.data?.message || "Failed to fetch product details"
      );
    } finally {
      setProductDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId, language]);

  return {
    products: productsData?.products || [],
    categories,
    loading: productsLoading || categoriesLoading,
    error: productsError || categoriesError,
    totalProducts: productsData?.total || 0,
    meta: productsData?.meta || null,
    links: productsData?.links || null,
    fetchProductDetails,
    productDetails,
    productDetailsLoading,
    productDetailsError,
  };
};

export default useProducts;
