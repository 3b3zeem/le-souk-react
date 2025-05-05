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
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }

  //   if (token) {
  //     localStorage.setItem("token", token);
  //   } else {
  //     localStorage.removeItem("token");
  //   }
  // }, [user, token]);

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

      setUser(null);
      setToken(null);
      localStorage.clear();
    } catch (err) {
      console.error(
        "Logout error:",
        err.response?.data?.message || "Logout failed"
      );
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
