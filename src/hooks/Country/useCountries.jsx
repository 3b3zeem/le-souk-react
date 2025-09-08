import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
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


  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/countries"
      );
      setCountries(response.data.data);
    } catch (error) {
      console.error("Error fetching user country:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [language]);

  return { countries, loading };
};

export default useCountries;
