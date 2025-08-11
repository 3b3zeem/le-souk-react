import { useAuthContext } from "../../../context/Auth/AuthContext";
import axios from "axios";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useQuery } from '@tanstack/react-query';

const fetchStats = async (token,language) => {
  const response = await axios.get(
  "https://le-souk.dinamo-app.com/api/admin/dashboard/statistics",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
          'Accept-Language': language,
    },
  }
);
return(response.data)  
};
const fetchUserStats = async (token,language) => {
    const response = await axios.get(
      "https://le-souk.dinamo-app.com/api/admin/users/statistics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept-Language": `${language}`,
        },
      }
    );
    return response.data.data
};

const useDashboard = () => {
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const {data:stats,isLoading:statsLoading,error:statsError}=useQuery({
    queryKey:['dashboardStats', language],
    queryFn:()=>fetchStats(token,language),
    enabled:!! token
  })
  const {data:userStats,isLoading:userStatsLoading,error:userStatsError}=useQuery({
    queryKey:['userStats', language],
    queryFn:()=>fetchUserStats(token,language),
    enabled:!! token
  })
  return { 
      stats: stats || {
      total_sales: '0',
      users_count: 0,
      products_count: 0,
    }, userStats, loading: statsLoading || userStatsLoading, error: statsError?.message || userStatsError?.messag };
};

export default useDashboard;
