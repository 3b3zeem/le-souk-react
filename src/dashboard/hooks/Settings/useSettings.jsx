import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useSettingsContext } from "../../../context/Settings/SettingsContext";
import { useQuery,useMutation ,useQueryClient} from '@tanstack/react-query';

const fetchSettings = async ({token,language,perPage,search,page}) => {
  const response = await axios.get(
    "https://le-souk.dinamo-app.com/api/admin/settings",
    {
      params: { search: search || undefined, per_page: perPage || undefined, page: page || undefined },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        'Accept-Language': language,
      },
    }
  );
  return response.data;
  };

  const editSetting = async ({ token, setting_key, formData }) => {
  if (!token) throw new Error('Authentication token is missing');
  const response = await axios.post(
    `https://le-souk.dinamo-app.com/api/admin/settings/${setting_key}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};



const useSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const { refreshSettings } = useSettingsContext();
  const search = searchParams.get("search") || "";
  const perPage = parseInt(searchParams.get("per_page")) || 15;
  const page = parseInt(searchParams.get("page")) || 1;
  const queryClient = useQueryClient();

  const {data,isLoading:loading,isError:error,refetch}=useQuery({
    queryKey: ["settings", { search, perPage, page, language }],
    queryFn: () => fetchSettings({ token, language, search, perPage, page }),
    enabled: !!token, 
    keepPreviousData: true,

  })

  const mutation = useMutation({
    mutationFn: editSetting,
    onSuccess: (response, { setting_key }) => {
      queryClient.setQueryData(['settings',{ search, perPage, page, token, language}], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((setting) =>
            setting.key === setting_key ? response.data : setting
          ),
        };
      });
      toast.success(response.message || 'Setting updated successfully');
      refreshSettings();
    },
    onError: (err) => {
      let errorMessage = 'Failed to update setting';
      if (err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors).flat().join(', ');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (data?.meta?.last_page || 1) && !loading) {
      const params = new URLSearchParams();
      params.set("page", newPage.toString());
      params.set("per_page", perPage.toString());
      if (search) params.set("search", search);
      setSearchParams(params);
    }
  };
  const handlePerPageChange = (newPerPage) => {
    const params = new URLSearchParams();
    params.set("per_page", newPerPage.toString());
    params.set("page", "1");
    if (search) params.set("search", search);
    setSearchParams(params);
  };

  return {
    settings:data?.data || [],
    loading,error, search, page,
    totalPages: data?.meta?.last_page || 1,
    total: data?.meta?.total || 0,
    perPage,
    handlePageChange,
    handlePerPageChange,
    editSetting: (setting_key, formData) =>
      mutation.mutateAsync({ token, setting_key, formData }),
  };
  
};

export default useSettings;
