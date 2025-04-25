import { useState, useEffect } from "react";
import axios from "axios";

const useHomeData = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BaseURL = "https://ecommerce.ershaad.net/api";
  const categoriesURL = `${BaseURL}/categories`;
  const productsURL = `${BaseURL}/products?per_page=5`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoriesResponse = await axios.get(`${categoriesURL}`);
        setCategories(categoriesResponse.data.data);

        const productsResponse = await axios.get(`${productsURL}`);
        setProducts(productsResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, products, loading, error };
};

export default useHomeData;
