import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useOrders = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [details, setDetails] = useState([]);
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
    const fetchOrders = async () => {
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
          `https://le-souk.dinamo-app.com/api/admin/orders?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data, meta } = response.data;

        setOrders(data);
        setTotalPages(meta?.last_page || 1);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch orders";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchParams, token, language, page, search]);

  const fetchOrderDetails = async (order_id ,language) => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(
          `https://le-souk.dinamo-app.com/api/admin/orders/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": language,
            },
          }
        );

        const data = response.data.data;

        setDetails(data);

        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch orders";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  const confirmOrder = async (orderId) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status !== "pending") {
        throw new Error("Only pending orders can be confirmed");
      }

      const response = await axios.patch(
        `https://le-souk.dinamo-app.com/api/admin/orders/${orderId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "confirmed" } : order
        )
      );
      toast.success("Order confirmed successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to confirm order";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (orderId) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status !== "pending") {
        throw new Error("Only pending orders can be rejected");
      }

      const response = await axios.patch(
        `https://le-souk.dinamo-app.com/api/admin/orders/${orderId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "rejected" } : order
        )
      );
      toast.success(response.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reject order";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, data) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/orders/${orderId}/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: response.data.data.new_status }
            : order
        )
      );

      toast.success(response.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update order status";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderNotes = async (orderId, data) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/orders/${orderId}/notes`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...response.data } : order
        )
      );

      toast.success(response.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update order notes";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    details,
    fetchOrderDetails,
    confirmOrder,
    rejectOrder,
    updateOrderStatus,
    updateOrderNotes,
    loading,
    error,
    totalPages,
    search,
    page,
  };
};

export default useOrders;
