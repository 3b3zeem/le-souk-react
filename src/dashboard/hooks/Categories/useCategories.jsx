import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useCategories = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuthContext();
  const { language } = useLanguage();

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const perPage = parseInt(searchParams.get("per_page")) || 6;

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
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page);
        params.append("per_page", perPage);
        params.append("with", "parent,children,products");

        const response = await axios.get(
          `https://le-souk.dinamo-app.com/api/categories?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setCategories(response.data.data);
        setTotalPages(response.data.meta.last_page || 1);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch categories";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language, searchParams]);

  const addCategory = async (formData) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/admin/categories",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCategories((prev) => [...prev, response.data.data]);
      toast.success("Category added successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add category";
      toast.error(errorMessage);
      return false;
    }
  };

  const editCategory = async (categoryId, formData) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      formData.append("_method", "PUT");

      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/categories/${categoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId ? response.data.data : category
        )
      );
      toast.success("Category updated successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update category";
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/categories/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );
      toast.success("Category deleted successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    loading,
    error,
    totalPages,
    search,
    page,
  };
};

export default useCategories;
