import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState(null);
  const { token } = useAuthContext();
  const { language } = useLanguage();

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (search) params.append("search", search);

      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.data.data);
      setTotalPages(response.data.data.meta.last_page || 1);
      setMeta(response.data.data.meta);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch users";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [token, search, page, language]);

  const deleteUser = async (userId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      await fetchUsers();
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete user";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getUserById = async (userId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response?.data?.data);
      return response.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch user details";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const toggleAdminStatus = async (userId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}/toggle-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedStatus = response.data.data.is_admin;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_admin: updatedStatus,
                admin_status_text: updatedStatus ? "Admin" : "Customer",
              }
            : user
        )
      );

      toast.success(
        `User has been ${
          updatedStatus ? "granted" : "revoked"
        } admin access successfully.`
      );
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update user admin status";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const verifyEmail = async (userId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}/verify-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, email_verification_status: "verified" }
            : user
        )
      );
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to verify email";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetPassword = async (userId, passwordData) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      if (!passwordData.password || passwordData.password.length <= 6) {
        const errorMessage = "Password must be more than 6 characters";
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (passwordData.password !== passwordData.password_confirmation) {
        const errorMessage = "Passwords do not match";
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}/reset-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      await fetchUsers();
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset user password";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Enhanced updateUser function with proper file upload support
  const updateUser = async (userId, userData) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = response.data.data;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      toast.success(response.data.message);
      await fetchUsers();
      return updatedUser;
    } catch (err) {
      console.error("Update user error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update user information";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    users,
    user,
    loading,
    error,
    totalPages,
    meta,
    fetchUsers,
    toggleAdminStatus,
    deleteUser,
    updateUser,
    getUserById,
    verifyEmail,
    resetPassword,
  };
};

export default useUsers;
