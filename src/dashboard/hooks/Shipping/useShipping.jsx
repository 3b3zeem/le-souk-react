import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const BASE_URL = "https://le-souk.dinamo-app.com/api/";

const useShipping = () => {
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  // Fetch shipping methods
  const fetchShippingMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}admin/shipping-management/methods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      setShippingMethods(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch supported countries
  const fetchSupportedCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}admin/shipping-management/countries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSupportedCountries(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingMethods();
    fetchSupportedCountries();
  }, [token, language]);

  return {
    shippingMethods,
    supportedCountries,
    loading,
    error,
    fetchShippingMethods,
    fetchSupportedCountries,
  };
};

export default useShipping;
