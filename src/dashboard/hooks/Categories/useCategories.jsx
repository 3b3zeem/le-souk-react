import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const fetchCategories = async (token, language, search, page, perPage ) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page);
  params.append("per_page", perPage);
  params.append("with", "parent,children,products");

  const res = await axios.get(
    `https://le-souk.dinamo-app.com/api/categories?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": language,
      },
    }
  );

  return {
    categories: res.data.data,
    totalPages: res.data.meta?.last_page || 1,
    totalCount: res.data.meta?.total || 0,
    currentPage: res.data.meta?.current_page || 1,
  };
};

const useCategories = () => {
  const [searchParams] = useSearchParams();
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const perPage = parseInt(searchParams.get("per_page")) || 6;

  const { data,isLoading: loading,isError,error,} = useQuery({
    queryKey: ["categories", { token, language, search, page, perPage }],
    queryFn: ()=>fetchCategories(token, language, search, page, perPage),
    enabled: !!token, 
  });

  const addCategory = useMutation({
    mutationFn: async (formData) => {
      if (!token) throw new Error("No token found. Please log in.");
      const res = await axios.post(
        "https://le-souk.dinamo-app.com/api/admin/categories",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Category added successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add category");
    },
  });

  const editCategory = useMutation({
    mutationFn: async ({ categoryId, formData }) => {
      if (!token) throw new Error("No token found. Please log in.");
      formData.append("_method", "PUT");
      const res = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/categories/${categoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update category");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId) => {
      if (!token) throw new Error("No token found. Please log in.");
      await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/categories/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete category");
    },
  });

  return {
    categories: data?.categories || [],
    totalPages: data?.totalPages || 1,
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    loading,
    error: isError ? error.message : null,
    search,
    page,
    addCategory: addCategory.mutate,
    editCategory: (categoryId, formData) =>
      editCategory.mutate({ categoryId, formData }),
    deleteCategory: deleteCategory.mutate,
  };
};

export default useCategories;
