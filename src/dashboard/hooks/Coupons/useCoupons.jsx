import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import toast from "react-hot-toast";

const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const { token } = useAuthContext();
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

  const BASE_URL = "https://le-souk.dinamo-app.com/api/admin/coupons";

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = searchParams.get("page") || 1;
      const perPage = searchParams.get("per_page") || 15;
      const searchQuery = searchParams.get("search") || "";
      const sortBy = searchParams.get("sort_by") || "created_at";
      const sortDirection = searchParams.get("sort_direction") || "desc";

      const response = await axios.get(
        `${BASE_URL}?per_page=${perPage}&page=${page}&sort_by=${sortBy}&sort_direction=${sortDirection}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data, meta } = response.data;
      setCoupons(data || []);
      setTotalPages(meta.last_page || 1);
      setTotalCount(meta.total || 0);
      setCurrentPage(meta.current_page || 1);
      setSearch(searchQuery);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const addCoupon = async (formData) => {
    try {
      const response = await axios.post(BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchCoupons();
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add coupon");
    }
  };

  const updateCoupon = async (couponId, formData) => {
    try {
        console.log("Updating coupon with ID:", couponId);
        
      formData.append("_method", "PUT");
      const response = await axios.post(`${BASE_URL}/${couponId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchCoupons();
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update coupon");
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      await axios.delete(`${BASE_URL}/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCoupons();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCoupons();
    }
  }, [language, token, searchParams]);

  return {
    coupons,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
    fetchCoupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
  };
};

export default useCoupons;
