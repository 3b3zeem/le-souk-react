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
        toast.error("Please log in to view your cart.");
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
        throw new Error("No authentication token found");
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
      throw err;
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
  
      if (newQuantity <= 0) {
        await removeFromCart(productId);
      } else {
        const currentItem = cartItems.find((item) => item.product.id === productId);
        if (currentItem && currentItem.quantity !== newQuantity) {
          await removeFromCart(productId);
          await addToCart(productId, newQuantity);
        }
      }
  
      await fetchCart();
    } catch (err) {
      console.log("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to update quantity");
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
    loading,
    error,
    success,
  };
};

export default useCartCRUD;