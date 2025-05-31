import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useEffect } from "react";

const useHome = (perPage) => {
  const { language } = useLanguage();
  const { token } = useAuthContext();

  const BaseURL = "https://le-souk.dinamo-app.com/api";

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  // Fetch Categories
  const categoriesQuery = useQuery({
    queryKey: ["categories", language],
    queryFn: async () => {
      const response = await axios.get(
        `${BaseURL}/categories?per_page=4&page=1`
      );
      return response.data.data || [];
    },
  });

  // Fetch Products
  const productsQuery = useQuery({
    queryKey: ["products", perPage, language],
    queryFn: async () => {
      const response = await axios.get(
        `${BaseURL}/products?per_page=${perPage}&with=images,categories,variants`
      );
      return response.data.data || [];
    },
  });

  // Fetch Offers
  const offersQuery = useQuery({
    queryKey: ["offers", language],
    queryFn: async () => {
      const response = await axios.get(
        `${BaseURL}/products?on_sale=1&pagination=0&with=images`
      );
      return response.data.data || [];
    },
  });

  // Fetch Packages (Protected with token)
  const packagesQuery = useQuery({
    queryKey: ["packages", perPage, language],
    queryFn: async () => {
      const response = await axios.get(
        `${BaseURL}/admin/packages?per_page=${perPage}&with=packageProducts.product,usages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data || [];
    },
    enabled: !!token,
  });

  const loading =
    categoriesQuery.isLoading ||
    productsQuery.isLoading ||
    offersQuery.isLoading ||
    packagesQuery.isLoading;
  const error =
    categoriesQuery.error ||
    productsQuery.error ||
    offersQuery.error ||
    packagesQuery.error;

  return {
    categories: categoriesQuery.data || [],
    products: productsQuery.data || [],
    offers: offersQuery.data || [],
    packages: packagesQuery.data || [],
    loading,
    error,
  };
};

export default useHome;
