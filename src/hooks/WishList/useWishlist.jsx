import { useState } from "react";
import axios from "axios";
import { useWishlist } from "../../context/WishList/WishlistContext";
import { useAuthContext } from "../../context/Auth/AuthContext";
import toast from "react-hot-toast";

const useWishlistCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { token } = useAuthContext();
  const { addItemToWishlist, removeItemFromWishlist } = useWishlist();

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://ecommerce.ershaad.net/api/wishlist/view",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = response.data.data;
      console.log(items);
      
      setWishlistItems(items);
      return items;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to add items to your wishlist.");
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "https://ecommerce.ershaad.net/api/wishlist/add",
        { product_id: productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const message = response.data.message;

      if (message.toLowerCase().includes("already")) {
        toast.error("This product is already in your wishlist.");
      }

      setSuccess(response.data.message);
      await addItemToWishlist();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to wishlist");
      await addItemToWishlist();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to add items to your wishlist.");
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "https://ecommerce.ershaad.net/api/wishlist/remove",
        { product_id: productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      await removeItemFromWishlist();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from wishlist");
      await removeItemFromWishlist();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    wishlistItems,
    loading,
    error,
    success,
  };
};

export default useWishlistCRUD;
