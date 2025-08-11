import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useState } from "react";

const perPage = 15;

const fetchHeros = async ({ queryKey }) => {
  const [_key, { token, language, page, search }] = queryKey;
  const params = new URLSearchParams();
  params.append("per_page", perPage);
  params.append("page", page);
  if (search) params.append("search", search);

  const response = await axios.get(
    `https://le-souk.dinamo-app.com/api/admin/sliders?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": language,
      },
    }
  );

  return {
    heros: Array.isArray(response.data.data)
      ? response.data.data.map((hero) => ({
          ...hero,
          images: hero.images || { en: {}, ar: {} },
        }))
      : [],
    totalPages: response.data.meta?.last_page || 1,
    totalCount: response.data.meta?.total || 0,
    currentPage: response.data.meta?.current_page || 1,
  };
};

const useAdminHero = () => {
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {data,isLoading,isError,error,refetch} = useQuery({
    queryKey: ["adminHeros", { token, language, page, search }],
    queryFn: fetchHeros,
    enabled: !!token,  
  });

  
  const addHeroMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/sliders`,
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
      toast.success(data.message);
      queryClient.invalidateQueries(["adminHeros"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add slider hero");
    },
  });

  const updateHeroMutation = useMutation({
    mutationFn: async ({ sliderId, formData }) => {
      formData.append("_method", "PUT");
      const res = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/sliders/${sliderId}`,
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
      toast.success(data.message || "Slider hero updated successfully!");
      queryClient.invalidateQueries(["adminHeros"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update slider hero");
    },
  });


  const deleteHeroMutation = useMutation({
    mutationFn: async (sliderId) => {
      await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/sliders/${sliderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Slider hero deleted successfully!");
      queryClient.invalidateQueries(["adminHeros"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete slider hero");
    },
  });

  return {
    heros: data?.heros || [],
    totalPages: data?.totalPages || 1,
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    loading: isLoading,
    error: isError ? error.message : null,
    page,
    setPage,
    search,
    setSearch,
    refetch,
    addHero: addHeroMutation.mutate,
    updateHero: (sliderId, formData) =>
      updateHeroMutation.mutate({ sliderId, formData }),
    deleteHero: deleteHeroMutation.mutate,
  };
};

export default useAdminHero;
