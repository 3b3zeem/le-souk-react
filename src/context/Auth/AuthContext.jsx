import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setUser] = useState(() => {
    const storedUser = localStorage.getItem("profile");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("profile");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      const expiry = new Date(userData.expires_at);
      if (expiry < new Date()) {
        logout();
      } else {
        setUser(userData);
        setToken(storedToken);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem("profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("profile");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [profile, token]);

  // logout function
  const logout = async () => {
    try {
      await axios.post(
        "https://le-souk.dinamo-app.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error(
        "Logout error:",
        err.response?.data?.message || "Logout failed"
      );
    } finally {
      setUser(null);
      setToken(null);
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{ profile, setUser, token, setToken, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
