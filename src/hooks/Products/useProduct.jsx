import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [meta, setMeta] = useState(null);
  const [links, setLinks] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (perPage === 5 && page === 1) {
          setLoading(true);
        } else {
          setLoadMoreLoading(true);
        }

        const categoriesResponse = await axios.get(
          BASE_URL + "categories"
        );
        setCategories(categoriesResponse.data.data);

        let url = BASE_URL + "products";
        const params = new URLSearchParams();

        // Pagination & sorting
        params.append("per_page", perPage);
        params.append("page", page);
        params.append("sort_by", sortBy);
        params.append("sort_direction", sortDirection);

        // Filters
        if (searchQuery) params.append("search", searchQuery);
        if (categoryId) params.append("category_id", categoryId);
        if (minPrice !== null) params.append("min_price", minPrice);
        if (maxPrice !== null) params.append("max_price", maxPrice);
        if (inStock !== null) params.append("in_stock", inStock);

        params.append("with", "images,categories,variants");

        url += `?${params.toString()}`;

        const productsResponse = await axios.get(url);
        const newProducts = productsResponse.data.data;
        setProducts(newProducts);
        setTotalProducts(productsResponse.data.meta?.total || 0);
        setMeta(productsResponse.data.meta || null);
        setLinks(productsResponse.data.links || null);

        setLoading(false);
        setLoadMoreLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setLoading(false);
        setLoadMoreLoading(false);
      }
    };

    fetchData();
  }, [language, searchQuery, categoryId, minPrice, maxPrice, perPage, page, sortBy, sortDirection, inStock]);

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
    products,
    categories,
    loading,
    loadMoreLoading,
    error,
    totalProducts,
    meta,
    links,
    productDetails,
    productDetailsLoading,
    productDetailsError,
    fetchProductDetails,
  };
};

export default useProducts;
