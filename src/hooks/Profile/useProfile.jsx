import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useUserContext } from "../../context/User/UserContext";
import toast from "react-hot-toast";

const useUserProfile = () => {
  const { userData, setUserData } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "https://ecommerce.ershaad.net/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUserData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch user profile");
        setLoading(false);
      }
    };

    if (token) fetchUserProfile();
  }, [token]);

  const updateUserProfile = async (updatedData) => {
    try {
      if (!token) {
        throw new Error("No token found");
      }

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", updatedData.name);
      formData.append("email", updatedData.email);
      if (updatedData.phone) formData.append("phone", updatedData.phone);
      if (updatedData.address) formData.append("address", updatedData.address);
      if (updatedData.image) formData.append("image", updatedData.image);

      const response = await axios.post(
        "https://ecommerce.ershaad.net/api/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData(response.data.data);
      toast.success("Profile updated successfully!");

      return { success: true };
    } catch (err) {
      toast.error(err);
      return {
        success: false,
        error: err.message || "Failed to update profile",
      };
    }
  };

  return { userData, loading, error, updateUserProfile };
};

export default useUserProfile;
