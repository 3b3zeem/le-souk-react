import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useAuthContext } from "../../context/Auth/AuthContext";

const useHome = (perPage) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const { token } = useAuthContext()

  const BaseURL = "https://le-souk.dinamo-app.com/api";
  const categoriesURL = `${BaseURL}/categories?per_page=4&page=1`;
  const productsURL = `${BaseURL}/products?per_page=${perPage}&with=images,categories,variants`;
  const offersURL = `${BaseURL}/products?on_sale=1&pagination=0&with=images`;
  const packagesURL = `${BaseURL}/admin/packages?per_page=${perPage}&with=packageProducts.product,usages`;

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
        setProducts(rawProducts);

        // Fetch offers
        const offersResponse = await axios.get(offersURL);
        const rawOffers = offersResponse.data.data || [];
        setOffers(rawOffers);

        // Fetch Packages
        const packagesResponse = await axios.get(packagesURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rawPackages = packagesResponse.data.data || [];
        setPackages(rawPackages);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [language, perPage]);

  return { categories, products, offers, packages, loading, error };
};

export default useHome;
