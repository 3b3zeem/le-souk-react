import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../Auth/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { token } = useAuthContext();

  const fetchCartCount = async () => {
    try {
      if (!token) {
        setCartCount(0);
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
      const cartItems = response.data.data;
      const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalItems);
    } catch (err) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

  const addItemToCart = async () => {
    await fetchCartCount();
  };

  const removeItemFromCart = async () => {
    await fetchCartCount();
  };

  return (
    <CartContext.Provider
      value={{ cartCount, addItemToCart, removeItemFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
