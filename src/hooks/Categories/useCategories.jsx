import { useState, useEffect } from "react";
import { useLanguage } from "../../context/Language/LanguageContext";
import axios from "axios";

const API_URL = "https://le-souk.dinamo-app.com/api/categories";

const useCategories = (perPage, page, categoryId) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}`;

        let response;

        if (categoryId) {
          url = `${API_URL}/${categoryId}?with=parent,children,products`;
          response = await axios.get(url);
          setCategory(response.data.data);
        } else {
          url = `${API_URL}?per_page=${perPage}&page=${page}&with=products,parent`;
          response = await axios.get(url);
          setCategories(response.data.data || []);
          setMeta(response.data.meta || {});
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, perPage, page, categoryId]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= meta.last_page) {
      console.log(`Changing to page ${newPage}`);
    }
  };

  const getTranslatedText = (translations, field) => {
    const translation = translations.find((t) => t.locale === language);
    return translation
      ? translation[field]
      : translations.find((t) => t.locale === "en")[field];
  };

  return {
    categories,
    category,
    meta,
    loading,
    error,
    handlePageChange,
    getTranslatedText,
  };
};

export default useCategories;
