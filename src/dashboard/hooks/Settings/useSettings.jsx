import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import axios from "axios";

const useSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const { token } = useAuthContext();

  const search = searchParams.get("search") || "";
  const perPage = parseInt(searchParams.get("per_page")) || 15;
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/admin/settings",
        {
          params: {
            search: search || undefined,
            per_page: perPage || undefined,
            page: page || undefined,
          },
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      setSettings(response.data.data);
      setTotal(response.data.meta.total);
      setTotalPages(response.data.meta.last_page);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch settings";
      setError(errorMessage);
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, [search, perPage, page, token]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/settings/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      setSuccessMessage(response.data.message);
      console.log(response.data.message);
      
      await fetchSettings();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete setting";
      setError(errorMessage);
      console.error("Error deleting setting:", err);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && !loading) {
      setSearchParams({
        per_page: perPage.toString(),
        page: newPage.toString(),
        ...(search && { search }),
      });
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setSearchParams({
      per_page: newPerPage.toString(),
      page: "1",
      ...(search && { search }),
    });
  };

  return {
    settings,
    loading,
    error,
    successMessage,
    search,
    page,
    totalPages,
    total,
    perPage,
    handlePageChange,
    handlePerPageChange,
    handleDelete,
  };
};

export default useSettings;
