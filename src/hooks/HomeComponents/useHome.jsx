import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";

const useHome = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  const BaseURL = "https://le-souk.dinamo-app.com/api";
  const categoriesURL = `${BaseURL}/categories?per_page=4&page=1`;
  const productsURL = `${BaseURL}/products?per_page=5&with=images,categories,variants`;

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await axios.get(categoriesURL);
        const categoriesData = categoriesResponse.data.data || [];
        setCategories(categoriesData);

        // Fetch products
        const productsResponse = await axios.get(productsURL);
        const rawProducts = productsResponse.data.data || [];

        // Filter and normalize products
        // const filteredProducts = rawProducts.map((product) => ({
        //   id: product.id,
        //   name: product.name,
        //   description: product.description,
        //   primary_image_url: product.primary_image_url,
        //   images: Array.isArray(product.images) ? product.images : [],
        //   categories: Array.isArray(product.categories)
        //     ? product.categories
        //     : [],
        //   variants: Array.isArray(product.variants) ? product.variants : [],
        //   min_price: product.min_price,
        //   max_price: product.max_price,
        //   on_sale: product.on_sale,
        //   discount_type: product.discount_type,
        //   discount_value: product.discount_value,
        //   discount_percentage: product.discount_percentage,
        //   min_sale_price: product.min_sale_price,
        //   max_sale_price: product.max_sale_price,
        //   sale_starts_at: product.sale_starts_at,
        //   sale_ends_at: product.sale_ends_at,
        //   total_stock: product.total_stock,
        // }));

        setProducts(rawProducts);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  return { categories, products, loading, error };
};

export default useHome;
