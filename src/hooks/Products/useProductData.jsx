import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = (
  searchQuery = "",
  categoryId = null,
  minPrice = 0,
  maxPrice = 1000,
  perPage = 5
) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (perPage === 5) {
          setLoading(true);
        } else {
          setLoadMoreLoading(true);
        }

        const categoriesResponse = await axios.get(
          "https://ecommerce.ershaad.net/api/categories"
        );
        setCategories(categoriesResponse.data.data);

        let url = "https://ecommerce.ershaad.net/api/products";
        const params = new URLSearchParams();

        if (searchQuery) params.append("search", searchQuery);
        if (categoryId) params.append("category_id", categoryId);
        if (minPrice !== null) params.append("min_price", minPrice);
        if (maxPrice !== null) params.append("max_price", maxPrice);
        params.append("per_page", perPage);

        url += `?${params.toString()}`;

        const productsResponse = await axios.get(url);
        setProducts(productsResponse.data.data);
        setTotalProducts(productsResponse.data.meta.total);

        setLoading(false);
        setLoadMoreLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setLoading(false);
        setLoadMoreLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, categoryId, minPrice, maxPrice, perPage]);

  return { products, categories, loading, loadMoreLoading, error, totalProducts };
};

export default useProducts;
