import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const fetchWishlistData = async () => {
    if (!token) {
      return { items: [] };
    }
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
    return { items };
  };

  const {
    data: wishlistData = { items: [] },
    refetch: fetchWishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    error: wishlistError,
  } = useQuery({
    queryKey: ["wishlist", token, language],
    queryFn: fetchWishlistData,
    enabled: !!token,
    retry: 3,
    retryDelay: 1000,
    onSuccess: (data) => {
      setWishlistItems(data.items);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
    },
  });

  useEffect(() => {
    setLoading(isWishlistLoading);
    if (isWishlistError) {
      setError(wishlistError?.response?.data?.message || "Failed to fetch wishlist");
    } else {
      setError(null);
    }
  }, [isWishlistLoading, isWishlistError, wishlistError]);

  const addToWishlist = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to add items to your wishlist.");
        throw new Error("User not authenticated");
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
      } else {
        toast.success(response.data.message);
      }

      setSuccess(response.data.message);
      await fetchWishlist();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to wishlist");
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
        toast.error("Please log in to remove items from your wishlist.");
        throw new Error("User not authenticated");
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
      toast.success(response.data.message);
      await fetchWishlist();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from wishlist");
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
        throw new Error("User not authenticated");
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
      toast.success(response.data.message);

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

      await fetchWishlist();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle wishlist");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!token) {
        toast.error("Please log in to clear your wishlist.");
        throw new Error("User not authenticated");
      }

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
      toast.success(response.data.message);
      await fetchWishlist();
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
    wishlistItems: wishlistData.items,
    loading: loading || isWishlistLoading,
    error,
    success,
  };
};

export default useWishlistCRUD;