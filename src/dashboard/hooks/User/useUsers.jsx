import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
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

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);

        const response = await axios.get(
          `https://le-souk.dinamo-app.com/api/admin/users?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.data);
        setTotalPages(response.data.last_page || 1);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch users";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, search, page, language]);

  return { users, loading, error, totalPages };
};

export default useUsers;
