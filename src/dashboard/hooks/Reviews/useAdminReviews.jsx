import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useAdminReviews = () => {
  const [searchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
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

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);

        const response = await axios.get(
          `https://le-souk.dinamo-app.com/api/admin/reviews?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Ensure reviews is always an array
        setReviews(Array.isArray(response.data.data) ? response.data.data : []);
        setTotalPages(response.data.last_page || 1);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch reviews";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [searchParams, token, language]);

  const deleteReview = async (reviewId) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      toast.success("Review deleted successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete review";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    deleteReview,
    loading,
    error,
    totalPages,
    search,
    page,
  };
};

export default useAdminReviews;
