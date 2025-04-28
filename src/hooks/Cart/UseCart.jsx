import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useCart } from "../../context/Cart/CartContext";
import toast from "react-hot-toast";

const useCartCRUD = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { addItemToCart, removeItemFromCart } = useCart();
  const { token } = useAuthContext();

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        setCartItems([]);
        return;
      }

      const response = await axios.get(
        "https://ecommerce.ershaad.net/api/cart/view",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart data");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to add items to your cart.");
      }

      const response = await axios.post(
        "https://ecommerce.ershaad.net/api/cart/add",
        {
          product_id: productId,
          quantity: quantity,
        },
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
        "https://ecommerce.ershaad.net/api/cart/remove",
        {
          product_id: productId,
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
      formData.append(`products[0][product_id]`, productId);
      formData.append(`products[0][quantity]`, newQuantity);
  
      await axios.post(
        "https://ecommerce.ershaad.net/api/cart/sync",
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
        "https://ecommerce.ershaad.net/api/cart/clear",
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

  return {
    cartItems,
    addToCart,
    removeFromCart,
    fetchCart,
    setCartQuantity,
    clearCart,
    loading,
    error,
    success,
  };
};

export default useCartCRUD;