import { useState, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/Language/LanguageContext";

const baseUrl = "https://le-souk.dinamo-app.com/api/";

export const useCountry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const { language } = useLanguage();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Accept-Language": language,
  };

  const getCountries = useCallback(
    async (page = 1, perPage = 10) => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}admin/countries`, {
          params: { per_page: perPage, page },
          headers,
        });
        return response.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, language]
  );

  // const createCountry = useCallback(
  //   async (data) => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.post(`${baseUrl}admin/countries`, data, {
  //         headers,
  //       });
  //       toast.success(response.data.message || "Country created successfully!");
  //       return response.data;
  //     } catch (err) {
  //       toast.error(err.response?.data?.message || "Failed to create country");
  //       setError(err.message);
  //       throw err;
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [token]
  // );

  const updateCountry = useCallback(
    async (id, data) => {
      setLoading(true);
      try {
        const response = await axios.put(
          `${baseUrl}admin/countries/${id}`,
          data,
          {
            headers,
          }
        );
        toast.success(response.data.message || "Country updated successfully!");
        return response.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update country");
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const toggleActive = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await axios.put(
          `${baseUrl}admin/countries/${id}/status`,
          {},
          { headers }
        );
        toast.success(
          response.data.message || "Country Active Changes successfully!"
        );
        return response.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to change activity");
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    getCountries,
    // createCountry,
    updateCountry,
    toggleActive,
    loading,
    error,
  };
};
