import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useAdminHero = () => {
  const [heros, setHeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 15;
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

  const fetchHeros = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", page);
      if (search) params.append("search", search);
      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/sliders?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHeros(
      Array.isArray(response.data.data)
        ? response.data.data.map((hero) => ({
            ...hero,
            images: hero.images || { en: {}, ar: {} },
          }))
        : []
    );
      setTotalPages(response.data.meta?.last_page || 1);
      setTotalCount(response.data.meta?.total || 0);
      setCurrentPage(response.data.meta?.current_page || 1);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch slider heros";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addHero = async (formData) => {
    setLoading(true);
    try {
      if (!token) throw new Error("No token found. Please log in.");
      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/sliders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      fetchHeros();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add slider hero";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateHero = async (sliderId, formData) => {
    setLoading(true);
    try {
      if (!token) throw new Error("No token found. Please log in.");
      formData.append("_method", "PUT");
      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/sliders/${sliderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Slider hero updated successfully!");
      fetchHeros();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update slider hero";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteHero = async (sliderId) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/sliders/${sliderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHeros((prev) => prev.filter((hero) => hero.id !== sliderId));
      toast.success("Slider hero deleted successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete slider hero";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeros();
    // eslint-disable-next-line
  }, [token, language, page, search]);

  return {
    heros,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    page,
    setPage,
    search,
    setSearch,
    refetch: fetchHeros,
    addHero,
    updateHero,
    deleteHero,
  };
};

export default useAdminHero;
