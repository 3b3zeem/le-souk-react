// import { useState, useEffect } from "react";
// import { useLanguage } from "../../context/Language/LanguageContext";
// import axios from "axios";

// const API_URL = "https://le-souk.dinamo-app.com/api/categories";

// const useCategories = (perPage, page, categoryId) => {
//   const [categories, setCategories] = useState([]);
//   const [category, setCategory] = useState(null);
//   const [meta, setMeta] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { language } = useLanguage();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         let url = `${API_URL}`;

//         let response;

//         if (categoryId) {
//           url = `${API_URL}/${categoryId}?with=parent,children,products`;
//           response = await axios.get(url);
//           setCategory(response.data.data);
//         } else {
//           url = `${API_URL}?per_page=${perPage}&page=${page}&with=products,parent`;
//           response = await axios.get(url);
//           setCategories(response.data.data || []);
//           setMeta(response.data.meta || {});
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [language, perPage, page, categoryId]);

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= meta.last_page) {
//       console.log(`Changing to page ${newPage}`);
//     }
//   };

//   const getTranslatedText = (translations, field) => {
//     const translation = translations.find((t) => t.locale === language);
//     return translation
//       ? translation[field]
//       : translations.find((t) => t.locale === "en")[field];
//   };

//   return {
//     categories,
//     category,
//     meta,
//     loading,
//     error,
//     handlePageChange,
//     getTranslatedText,
//   };
// };

// export default useCategories;

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";

const API_URL = "https://le-souk.dinamo-app.com/api/categories";

const fetchCategories = async ({ queryKey }) => {
  const [_key, { perPage, page, language }] = queryKey;
  const url = `${API_URL}?per_page=${perPage}&page=${page}&with=products,parent`;

  const response = await axios.get(url, {
    headers: {
      "Accept-Language": language,
    },
  });

  return {
    categories: response.data.data || [],
    meta: response.data.meta || {},
  };
};

const fetchCategoryById = async ({ queryKey }) => {
  const [_key, { categoryId, language }] = queryKey;
  const url = `${API_URL}/${categoryId}?with=parent,children,products`;

  const response = await axios.get(url, {
    headers: {
      "Accept-Language": language,
    },
  });

  return response.data.data;
};

const useCategories = (perPage, page, categoryId) => {
  const { language } = useLanguage();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories", { perPage, page, language }],
    queryFn: fetchCategories,
    enabled: !categoryId,
    keepPreviousData: true,
  });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", { categoryId, language }],
    queryFn: fetchCategoryById,
    enabled: !!categoryId,
  });

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (categoriesData?.meta?.last_page || 1)) {
      console.log(`Changing to page ${newPage}`);
    }
  };

  const getTranslatedText = (translations, field) => {
    const translation = translations.find((t) => t.locale === language);
    return translation
      ? translation[field]
      : translations.find((t) => t.locale === "en")?.[field] || "";
  };

  return {
    categories: categoriesData?.categories || [],
    meta: categoriesData?.meta || {},
    category: categoryData || null,
    loading: isCategoriesLoading || isCategoryLoading,
    error: categoriesError || categoryError,
    handlePageChange,
    getTranslatedText,
  };
};

export default useCategories;
