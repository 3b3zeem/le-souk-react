import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useLanguage } from "../../context/Language/LanguageContext";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://le-souk.dinamo-app.com/api/addresses";

const useAddresses = () => {
  const [loadingAddr, setLoading] = useState(false);
  const [errorAddr, setError] = useState(null);
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

  const {
    data: addresses = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["addresses", token, language],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data || [];
    },
    enabled: !!token, // Only fetch if token exists
    onError: (err) => {
      const message =
        err.response?.data?.message || "Failed to fetch addresses";
      toast.error(message);
    },
  });
  // Memoized fetchAddresses for compatibility
  const fetchAddresses = useCallback(async () => {
    // This is now handled by useQuery, but we keep the function for compatibility
    return addresses;
  }, [addresses, token]);

  const addAddress = async (payload) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(BASE_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data?.message || "Address added");
      await refetch();
      return res.data?.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add address";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId, payload) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${BASE_URL}/${addressId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data?.message || "Address updated");
      await refetch();
      return res.data?.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update address";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`${BASE_URL}/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data?.message || "Address deleted");
      await refetch();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete address";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    loadingAddr,
    error,
    errorAddr,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};

export default useAddresses;
