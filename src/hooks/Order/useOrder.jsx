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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
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

  const checkoutOrder = async ({
    shipping_address_id,
    billing_address_id,
    shipping_method_id = 1,
    coupon_code = "",
    notes = "",
  }) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/orders/checkout`,
        {
          shipping_address_id,
          billing_address_id,
          shipping_method_id,
          ...(coupon_code ? { coupon_code } : {}),
          ...(notes ? { notes } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to checkout order.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const executePayment = async (orderId, {
    payment_method_id = 2,
    customer_name,
    customer_email,
    customer_phone,
  } = {}) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/orders/${orderId}/payment/execute`,
        {
          payment_method_id,
          ...(customer_name ? { customer_name } : {}),
          ...(customer_email ? { customer_email } : {}),
          ...(customer_phone ? { customer_phone } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data?.data);
      return response.data?.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to execute payment."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchOrders,
    fetchOrderById,
    checkoutOrder,
    executePayment,
    loading,
  };
};
