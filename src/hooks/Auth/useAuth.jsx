import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";

const useAuth = () => {
  const { setUser, setToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let guestId = localStorage.getItem("guest_id");

  const register = async (username, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://le-souk.dinamo-app.com/api/register",
        {
          name: username,
          email,
          password,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            ...(guestId && { "X-Guest-ID": guestId }),
            "Content-Type": "application/json",
          },
        }
      );

      // const data = res.data;

      // setUser(data.data);
      // setToken(data.data.token);

      // localStorage.setItem("user", JSON.stringify(data.data));
      // localStorage.setItem("token", data.data.token);

      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://le-souk.dinamo-app.com/api/login",
        {
          email,
          password,
        },
        {
          headers: {
            ...(guestId && { "X-Guest-ID": guestId }),
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      setUser(data.data);
      setToken(data.data.token);

      localStorage.setItem("profile", JSON.stringify(data.data));
      localStorage.setItem("token", data.data.token);

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://le-souk.dinamo-app.com/api/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
      setLoading(false);
      return null;
    }
  };

  const resetPassword = async (
    email,
    token,
    password,
    passwordConfirmation
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://le-souk.dinamo-app.com/api/reset-password",
        {
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
      setLoading(false);
      return null;
    }
  };

  return { login, register, forgotPassword, resetPassword, loading, error };
};

export default useAuth;
