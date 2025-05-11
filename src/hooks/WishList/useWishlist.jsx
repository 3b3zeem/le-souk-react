import { useEffect, useState } from "react";
import axios from "axios";
import { useWishlist } from "../../context/WishList/WishlistContext";
import { useAuthContext } from "../../context/Auth/AuthContext";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/Language/LanguageContext";

const useWishlistCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const { addItemToWishlist, removeItemFromWishlist, fetchWishlistCount, fetchWishlistItems } = useWishlist();

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/wishlist",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = Array.isArray(response.data.data?.items)
        ? response.data.data.items
        : [];

      setWishlistItems(items);
      return items;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [language, token]);

  const addToWishlist = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to add items to your wishlist.");
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/wishlist/add",
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
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/wishlist/remove",
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

  const toggleWishlist = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to manage your wishlist.");
        return;
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/wishlist/toggle",
        { product_ids: [productId] },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      toast.success(response.data.message)

      const addedItems = response.data.added || [];
      const removedItems = response.data.removed || [];

      if (addedItems.includes(productId)) {
        setWishlistItems((prevItems) => [...prevItems, { id: productId }]);
        toast.success("Product added to wishlist!");
      } else if (removedItems.includes(productId)) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
        toast.success("Product removed from wishlist!");
      }

      await fetchWishlistCount();
      await fetchWishlistItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle wishlist");
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/wishlist/clear",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistItems([]);
      await removeItemFromWishlist();
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
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistItems,
    loading,
    error,
    success,
  };
};

export default useWishlistCRUD;
