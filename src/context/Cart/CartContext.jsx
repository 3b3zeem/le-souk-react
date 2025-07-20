import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../Auth/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { token } = useAuthContext();

  const fetchCartCount = async () => {
    try {
      const guestId = localStorage.getItem("guest_id");
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/cart",
        {
          headers: {
            ...(guestId && { 'X-Guest-ID': guestId }),
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const cartItems = response.data.data.items;
      const totalItems = response.data.data.items_count;
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
