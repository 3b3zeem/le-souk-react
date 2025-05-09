import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = useAuthContext();
  const { language } = useLanguage();

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const perPage = parseInt(searchParams.get("per_page")) || 10;

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
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("per_page", perPage);
        params.append("page", page);
        params.append("with", "images,category,variants");

        const response = await axios.get(
          `https://le-souk.dinamo-app.com/api/admin/products?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(response.data.data);
        setTotalPages(response.data.meta.last_page || 1);
        setTotalCount(response.data.meta.total)
        setCurrentPage(response.data.meta.current_page)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch products";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language, searchParams]);

  const addProduct = async (formData) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/admin/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) => [...prev, response.data.data]);
      toast.success("Product added successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add product";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    products,
    addProduct,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
    page,
  };
};

export default useProducts;