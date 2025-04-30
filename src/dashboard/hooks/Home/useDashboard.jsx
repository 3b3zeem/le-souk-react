import { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import axios from "axios";

const useDashboard = () => {
  const [stats, setStats] = useState({
    total_sales: "0",
    users_count: 0,
    products_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        if (!token) {
            throw new Error('No authentication token found');
          }

        const response = await axios.get(
          "https://ecommerce.ershaad.net/api/admin/dashboard/statistics",
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

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useDashboard;
