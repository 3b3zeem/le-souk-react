import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useLanguage } from "../../context/Language/LanguageContext";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [language]);

  const fetchOrderById = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch order.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (items) => {
    setLoading(true);
    try {
      const formData = new FormData();
      items.forEach((item, index) => {
        formData.append(`items[${index}][product_id]`, item.product_id);
        formData.append(`items[${index}][quantity]`, item.quantity);
      });

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/orders/place",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Order placed successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const proceedOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/orders/proceed",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Order proceeded successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to proceed order.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Order cancelled successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel order.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchOrders,
    fetchOrderById,
    placeOrder,
    proceedOrder,
    cancelOrder,
    loading,
  };
};
