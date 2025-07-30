import { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import axios from "axios";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useDashboard = () => {
  const [stats, setStats] = useState({
    total_sales: "0",
    users_count: 0,
    products_count: 0,
  });
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        if (!token) {
            throw new Error('No authentication token found');
          }

        const response = await axios.get(
          "https://le-souk.dinamo-app.com/api/admin/dashboard/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        setStats(response.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setError('Unauthorized: Invalid or expired token');
          } else {
            setError('Failed to fetch dashboard statistics');
          }
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStats = async () => {
      try {
        setLoading(true);

        if (!token) {
            throw new Error('No authentication token found');
          }

        const response = await axios.get(
          "https://le-souk.dinamo-app.com/api/admin/users/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept-Language": `${language}`,
            },
          }
        );
        console.log(response.data.data);
        
        setUserStats(response.data.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setError('Unauthorized: Invalid or expired token');
          } else {
            setError('Failed to fetch User statistics');
          }
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchUserStats();
  }, [token, language]);

  return { stats, userStats, loading, error };
};

export default useDashboard;
