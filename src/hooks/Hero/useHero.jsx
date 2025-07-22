import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://le-souk.dinamo-app.com/api";

const fetchHeroSliders = async ({ pageParam = 1 }) => {
  const response = await axios.get(`${BASE_URL}/sliders`, {
    params: { page: pageParam }
  });
  return response.data.data;
};

export const useHero = () => {
  return useQuery({
    queryKey: ["heroSliders"],
    queryFn: fetchHeroSliders,
  });
};