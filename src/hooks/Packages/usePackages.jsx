import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const API_URL = "https://le-souk.dinamo-app.com/api/packages";

export const usePackages = ({ language, product_id, page }) => {
  const [searchParams] = useSearchParams();
  const [meta, setMeta] = useState({});

  // * Fetch Packages
  const {
    data: packagesData,
    isLoading: loadingPackages,
    error: errorPackages,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ["packages", page, searchParams.toString(), language, product_id],
    queryFn: async () => {
      const perPage = searchParams.get("per_page") || "10";

      const params = {
        per_page: perPage,
        page: page || 1,
        with: "packageProducts.product,usages",
      };

      if (product_id) {
        params.product_id = product_id;
        params.pagination = 0;
      }

      const response = await axios.get(API_URL, { params });

      const { meta: paginationMeta, data } = response.data;

      setMeta({
        links: paginationMeta?.links || [],
        current_page: paginationMeta?.current_page || 1,
        last_page: paginationMeta?.last_page || 1,
        total: paginationMeta?.total || 0,
      });

      return {
        data,
        totalPages: paginationMeta?.last_page || 1,
        totalCount: paginationMeta?.total || 0,
        currentPage: paginationMeta?.current_page || 1,
      };
    },
    keepPreviousData: true,
  });

  // * Package Details
  const {
    data: details,
    isLoading: loadingDetails,
    error: errorDetails,
  } = useQuery({
    queryKey: ["packageDetails", product_id, language],
    queryFn: async () => {
      if (!product_id) return null;
      const res = await axios.get(`${API_URL}/${product_id}`);
      return res.data.data;
    },
    enabled: !!product_id,
  });

  return {
    packages: packagesData?.data || [],
    details,
    loading: loadingPackages || loadingDetails,
    error: errorPackages || errorDetails,
    totalPages: packagesData?.totalPages || 1,
    totalCount: packagesData?.totalCount || 0,
    currentPage: packagesData?.currentPage || 1,
    meta,
    refetchPackages,
  };
};
