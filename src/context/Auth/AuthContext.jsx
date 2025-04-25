// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // logout endpoint and clear user
  const logout = async () => {
    try {
      await axios.post(
        "https://ecommerce.ershaad.net/api/logout",
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(null);
      setToken(null);
      localStorage.clear();
    } catch (err) {
      console.error("Logout error:", err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to read context
export const useAuthContext = () => useContext(AuthContext);
