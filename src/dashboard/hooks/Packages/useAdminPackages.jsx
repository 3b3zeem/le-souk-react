import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import toast from "react-hot-toast";

const useAdminPackages = () => {
  const [searchParams] = useSearchParams();
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/products?with=images,variants&pagination=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data.data || []);
      return;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);

    try {
      const page = searchParams.get("page") || "1";
      const perPage = searchParams.get("per_page") || "10";
      const sortBy = searchParams.get("sort_by") || "id";
      const sortDirection = searchParams.get("sort_direction") || "asc";
      const searchQuery = searchParams.get("search") || "";

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/packages`,
        {
          params: {
            per_page: perPage,
            page: page,
            sort_by: sortBy,
            sort_direction: sortDirection,
            search: searchQuery,
            with: "packageProducts.product,usages",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPackages(response.data.data || []);
      setTotalPages(response.data.meta.last_page || 1);
      setTotalCount(response.data.meta.total || 0);
      setCurrentPage(parseInt(page));
      setSearch(searchQuery);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (formData) => {
    setLoading(true);
    try {
      await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/packages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Package added successfully");
      await fetchPackages();
      return true;
    } catch (err) {
      console.log(err.response);
      if (err.response?.data?.errors) {
        console.log("Validation errors:", err.response.data.errors);
        toast.error(Object.values(err.response.data.errors).flat().join(" - "));
      } else {
        toast.error(err.response?.data?.message || "Failed to add package");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (packageId) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/packages/${packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || "Package deleted successfully");
      await fetchPackages();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete package");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPackages();
  }, [searchParams]);

  return {
    packages,
    fetchProducts,
    products,
    addPackage,
    deletePackage,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
  };
};

export default useAdminPackages;
