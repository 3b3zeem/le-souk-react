import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import useWishlistCRUD from "../../hooks/WishList/useWishlist";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const { token } = useAuthContext();

  let wishlistCRUD;
  try {
    wishlistCRUD = useWishlistCRUD();
  } catch (error) {
    console.error("Error initializing useWishlistCRUD:", error);
    throw new Error("Failed to initialize wishlist context");
  }

  const {
    wishlistItems,
    fetchWishlist,
    loading,
    error,
    toggleWishlist,
    clearWishlist,
  } = wishlistCRUD;

  useEffect(() => {
    if (error) {
      console.error("useWishlistCRUD error:", error);
    }
  }, [error]);

  useEffect(() => {
    setWishlistCount(wishlistItems.length || 0);
    setIsWishlistLoading(loading);
  }, [wishlistItems, loading]);

  useEffect(() => {
    fetchWishlist().catch((err) => {
      console.error("Failed to fetch wishlist on token change:", err);
    });
  }, [token, fetchWishlist]);

  const fetchWishlistItems = async () => {
    try {
      await fetchWishlist();
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        wishlistItems,
        isWishlistLoading,
        fetchWishlistItems,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
