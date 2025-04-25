import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useCart } from "../../context/Cart/CartContext";
import toast from "react-hot-toast";

const useCartCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { addItemToCart, removeItemFromCart } = useCart();
  const { token } = useAuthContext();

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
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
      await addItemToCart();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to remove items to your cart.");
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
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from cart");
      await removeItemFromCart();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, removeFromCart, loading, error, success };
};

export default useCartCRUD;
