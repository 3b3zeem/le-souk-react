import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useSettingsContext } from "../../../context/Settings/SettingsContext";

const useSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const { refreshSettings } = useSettingsContext();

  const search = searchParams.get("search") || "";
  const perPage = parseInt(searchParams.get("per_page")) || 15;
  const page = parseInt(searchParams.get("page")) || 1;

  // Set up language interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Add error handling for missing token
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/admin/settings",
        {
          params: {
            search: search || undefined,
            per_page: perPage || undefined,
            page: page || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Add better error handling for response structure
      if (response.data && response.data.data) {
        setSettings(response.data.data);
        setTotal(response.data.meta?.total || 0);
        setTotalPages(response.data.meta?.last_page || 1);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);

      let errorMessage = "Failed to fetch settings";

      if (err.response?.status === 401) {
        errorMessage = "Unauthorized access. Please check your authentication.";
      } else if (err.response?.status === 403) {
        errorMessage =
          "Access forbidden. You don't have permission to view settings.";
      } else if (err.response?.status === 404) {
        errorMessage = "Settings endpoint not found.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have a token
    if (token) {
      fetchSettings();
    } else {
      setError("Authentication token is missing");
    }
  }, [search, perPage, page, token, language]);

  const editSetting = async (setting_key, formData) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/settings/${setting_key}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSettings((prev) =>
        prev.map((setting) =>
          setting.key === setting_key ? response.data.data : setting
        )
      );
      toast.success(response.data.message || "Setting updated successfully");
      await refreshSettings();
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error(
        "Error updating setting:",
        err.response?.data || err.message
      );
      let errorMessage = "Failed to update setting";
      if (err.response?.data?.errors) {
        console.log("Errors:", err.response.data.errors);
        errorMessage = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && !loading) {
      const params = new URLSearchParams();
      params.set("page", newPage.toString());
      params.set("per_page", perPage.toString());
      if (search) params.set("search", search);
      setSearchParams(params);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    const params = new URLSearchParams();
    params.set("per_page", newPerPage.toString());
    params.set("page", "1");
    if (search) params.set("search", search);
    setSearchParams(params);
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
    editSetting,
  };
};

export default useSettings;
