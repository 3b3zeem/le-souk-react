import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../Auth/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
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
        "https://le-souk.dinamo-app.com/api//wishlist/view",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const wishlistItems = response.data.data;
      const totalItems = wishlistItems.length;
      setWishlistCount(totalItems);
    } catch (err) {
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
  }, [token]);

  const addItemToWishlist = async () => {
    await fetchWishlistCount();
  };

  const removeItemFromWishlist = async () => {
    await fetchWishlistCount();
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        addItemToWishlist,
        removeItemFromWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
