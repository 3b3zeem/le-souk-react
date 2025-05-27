import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import toast from "react-hot-toast";

const useAdminPackages = (page, packageId) => {
  const [searchParams] = useSearchParams();
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [meta, setMeta] = useState({
    links: [],
    current_page: page,
    last_page: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState(null);

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

  const fetchPackages = async (pageNum) => {
    setLoading(true);
    setError(null);

    try {
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
            page: pageNum || currentPage,
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
      setCurrentPage(pageNum);
      setSearch(searchQuery);
      setMeta({
        links: response.data.meta?.links || [],
        current_page: response.data.meta?.current_page || 1,
        last_page: response.data.meta?.last_page || 1,
        total: response.data.meta?.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const packageDetails = async (packageId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/packages/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetails(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch package details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPackages(page);
  }, [language, searchParams, page]);

  const addOrUpdatePackage = async (formData, packageId) => {
    setLoading(true);
    try {
      const url = packageId
        ? `https://le-souk.dinamo-app.com/api/admin/packages/${packageId}`
        : `https://le-souk.dinamo-app.com/api/admin/packages`;

      if (packageId) {
        formData.append("_method", "PUT");
      }

      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        packageId
          ? "Package updated successfully"
          : "Package added successfully"
      );
      await fetchPackages(currentPage);
      if (packageId) {
        await packageDetails(packageId);
      }
      return true;
    } catch (err) {
      console.log(err.response);
      if (err.response?.data?.errors) {
        console.log("Validation errors:", err.response.data.errors);
        toast.error(Object.values(err.response.data.errors).flat().join(" - "));
      } else {
        toast.error(
          err.response?.data?.message || "Failed to add/update package"
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addProductToPackage = async (packageId, productData) => {
    setLoading(true);
    try {
      const url = `https://le-souk.dinamo-app.com/api/admin/packages/${packageId}/products`;

      await axios.post(url, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Product added to package successfully");
      await fetchPackages();
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add product to package"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePackageProductQuantity = async (
    packageId,
    packageProductId,
    quantity
  ) => {
    setLoading(true);
    try {
      await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/packages/${packageId}/products/${packageProductId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Quantity updated successfully");
      await fetchPackages();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeProductFromPackage = async (packageId, productId) => {
    setLoading(true);
    try {
      await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/packages/${packageId}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product removed from package successfully");
      await fetchPackages();
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to remove product from package"
      );
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
      await fetchPackages(currentPage);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete package");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    packages,
    fetchProducts,
    packageDetails,
    details,
    products,
    addOrUpdatePackage,
    addProductToPackage,
    updatePackageProductQuantity,
    removeProductFromPackage,
    deletePackage,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
    meta,
  };
};

export default useAdminPackages;
