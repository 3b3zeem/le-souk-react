import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../Auth/AuthContext";
import useCartCRUD from "../../hooks/Cart/UseCart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { token } = useAuthContext();

  let cartCRUD;
  try {
    cartCRUD = useCartCRUD();
  } catch (error) {
    console.error("Error initializing useCartCRUD:", error);
    throw new Error("Failed to initialize cart context");
  }

  const {
    itemsCount,
    fetchCart,
    loading,
    error,
  } = cartCRUD;

  useEffect(() => {
    if (error) {
      console.error("useCartCRUD error:", error);
    }
  }, [error]);

  useEffect(() => {
    setCartCount(itemsCount || 0);
    setIsCartLoading(loading);
  }, [itemsCount, loading]);

  useEffect(() => {
    fetchCart().catch((err) => {
      console.error("Failed to fetch cart on token change:", err);
    });
  }, [token, fetchCart]);

  return (
    <CartContext.Provider
      value={{ cartCount,  isCartLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
