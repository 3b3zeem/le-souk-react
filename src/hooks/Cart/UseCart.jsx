import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useCartCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const [couponValue, setCouponValue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponData, setCouponData] = useState(null);

  const { token } = useAuthContext();
  const { language } = useLanguage();
  const guestId = localStorage.getItem("guest_id");

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const fetchCartData = async (token, language) => {
    const response = await axios.get(
      "https://le-souk.dinamo-app.com/api/cart",
      {
        headers: {
          ...(guestId && { "X-Guest-ID": guestId }),
          ...(token && { Authorization: `Bearer ${token}` }),
          "Accept-Language": language,
        },
      }
    );

    return {
      items: response.data.data.items,
      subtotal: response.data.data.subtotal,
      items_count: response.data.data.items_count || 0,
    };
  };

  const {
    data: cartData = { items: [], subtotal: 0, items_count: 0 },
    refetch: fetchCart,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["cart", token, language],
    queryFn: () => fetchCartData(token, language),
    enabled: !!token || !!guestId,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (isError) {
      setError(
        queryError?.response?.data?.message || "Failed to fetch cart data"
      );
    } else {
      setError(null);
    }
  }, [isError, queryError]);

  const cartItems = cartData.items;
  const subtotal = cartData.subtotal;
  const itemsCount = cartData.items_count;

  const addToCart = async (productId, quantity, productVariantId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        product_id: productId,
        quantity: quantity,
      };
      if (productVariantId) {
        payload.product_variant_id = productVariantId;
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/cart/add",
        payload,
        {
          headers: {
            ...(guestId && { "X-Guest-ID": guestId }),
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setSuccess(response.data.message);
      toast.success(response.data.message);
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/cart/remove",
        {
          cart_item_id: productId,
        },
        {
          headers: {
            ...(guestId && { "X-Guest-ID": guestId }),
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setSuccess(response.data.message);
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from cart");
    } finally {
      setLoading(false);
    }
  };

  const setCartQuantity = async (productId, newQuantity) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append(`cart_item_id`, productId);
      formData.append(`quantity`, newQuantity);

      await axios.post(
        "https://le-souk.dinamo-app.com/api/cart/update",
        formData,
        {
          headers: {
            ...(guestId && { "X-Guest-ID": guestId }),
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.log("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/cart/clear",
        {},
        {
          headers: {
            ...(guestId && { "X-Guest-ID": guestId }),
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      toast.success(response.data.message);
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear Cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (couponCode) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/coupons/validate",
        {
          code: couponCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      setSuccess(response.data.message);
      setFinalTotal(response.data.data.final_total);
      setCouponData(response.data.data.coupon);
      setDiscount(response.data.data.discount);
      setCouponValue(response.data.data.coupon.formatted_value);
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to validate coupon");
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    fetchCart,
    setCartQuantity,
    clearCart,
    validateCoupon,
    finalTotal,
    couponData,
    discount,
    couponValue,
    subtotal,
    itemsCount,
    loading: loading || isLoading,
    error,
    success,
  };
};

export default useCartCRUD;
