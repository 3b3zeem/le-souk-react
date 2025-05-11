import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../Auth/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthContext();

  const fetchWishlistCount = async () => {
    setLoading(true);
    try {
      if (!token) {
        setWishlistCount(0);
        return;
      }

      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const wishlistItems = response.data.data.items;
      const totalItems = wishlistItems.length;
      setWishlistCount(totalItems);
    } catch (err) {
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistItems = async () => {
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = response.data.data.items;
      console.log("Fetched items", items);
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist items", error);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
    fetchWishlistItems()
  }, [token]);

  const addItemToWishlist = async () => {
    setWishlistCount((prevCount) => prevCount + 1);
  };

  const removeItemFromWishlist = async () => {
    setWishlistCount((prevCount) => Math.max(prevCount - 1, 0));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        wishlistItems,
        addItemToWishlist,
        removeItemFromWishlist,
        fetchWishlistCount,
        fetchWishlistItems,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
