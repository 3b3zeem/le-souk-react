import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const logoutInProgress = useRef(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedProfile = localStorage.getItem("profile");
        const storedToken = localStorage.getItem("token");

        if (storedProfile && storedToken) {
          const parsedProfile = JSON.parse(storedProfile);
          const expiry = new Date(parsedProfile.expires_at);

          if (!parsedProfile.expires_at || expiry > new Date()) {
            setProfile(parsedProfile);
            setToken(storedToken);
          } else {
            localStorage.removeItem("profile");
            localStorage.removeItem("token");
          }
        }
      } catch (e) {
        console.error("Error initializing auth:", e);
        localStorage.removeItem("profile");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;

    setProfile(null);
    setToken(null);
    localStorage.removeItem("profile");
    localStorage.removeItem("token");

    try {
      if (token) {
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
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data?.message || "Logout failed");
    } finally {
      logoutInProgress.current = false;
    }
  }, [token]);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    if (profile && token) {
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("profile");
      localStorage.removeItem("token");
    }
  }, [profile, token, isInitialized]);

  // Global 401 error handler using Axios interceptor
  useEffect(() => {
    if (!isInitialized) return;

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isUnauthorized = error.response?.status === 401;
        const errorMessage = error.response?.data?.message;

        if (
          isUnauthorized &&
          !logoutInProgress.current &&
          token &&
          errorMessage !== "You are not an admin" &&
          profile?.role !== "admin"
        ) {
          console.warn("401 Unauthorized – clearing auth state");
          logout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, isInitialized, token, profile]);

  // Custom setter functions
  const setUser = useCallback((user) => {
    setProfile(user);
  }, []);

  const setAuthToken = useCallback((authToken) => {
    setToken(authToken);
  }, []);

  const contextValue = {
    profile,
    setUser,
    token,
    setToken: setAuthToken,
    logout,
    isLoading,
    isAuthenticated: !!(profile && token)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
