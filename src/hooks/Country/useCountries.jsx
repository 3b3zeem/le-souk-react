import { useEffect, useState } from "react";
import axios from "axios";

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return { countries, loading };
};

export default useCountries;
