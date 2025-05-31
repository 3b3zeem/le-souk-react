import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useCart } from "../../context/Cart/CartContext";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useQuery } from "@tanstack/react-query";

const useCartCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);

  const { addItemToCart, removeItemFromCart } = useCart();
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

  const fetchCartData = async (token, language) => {
    if (!token) return { items: [], subtotal: 0 };

    const response = await axios.get(
      "https://le-souk.dinamo-app.com/api/cart",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      }
    );

    return {
      items: response.data.data.items,
      subtotal: response.data.data.subtotal,
    };
  };
  const {
    data: cartData = { items: [], subtotal: 0 },
    refetch: fetchCart,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["cart", token, language],
    queryFn: () => fetchCartData(token, language),
    enabled: !!token,
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

  const addToCart = async (productId, quantity, productVariantId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      await addItemToCart();
      toast.success(response.data.message);
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
      await addItemToCart();
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
      if (!token) {
        toast.error("Please log in to remove items to your cart.");
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/cart/remove",
        {
          cart_item_id: productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      await removeItemFromCart();
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from cart");
      await removeItemFromCart();
    } finally {
      setLoading(false);
    }
  };

  const setCartQuantity = async (productId, newQuantity) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to update your cart.");
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append(`cart_item_id`, productId);
      formData.append(`quantity`, newQuantity);

      await axios.post(
        "https://le-souk.dinamo-app.com/api/cart/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([]);
      await removeItemFromCart();
      toast.success(response.data.message);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear wishlist");
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      setFinalTotal(response.data.data.final_total);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to validate coupon");
      throw err;
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
    subtotal,
    loading: loading || isLoading,
    error,
    success,
  };
};

export default useCartCRUD;
