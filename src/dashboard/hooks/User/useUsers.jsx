import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuthContext();
  const { language } = useLanguage();

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);

        const response = await axios.get(
          `https://le-souk.dinamo-app.com/api/admin/users?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.data.data);
        // console.log(response.data);
        // console.log(response.data.data);
        
        
        // console.log(users);
        
        setTotalPages(response.data.last_page || 1);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch users";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, search, page, language]);


  const deleteUser = async (userId)=>{

    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User deleted successfully");
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete user";
      setError(errorMessage);
      toast.error(errorMessage);
    }



  }

  const getUserById = async (userId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );  
      
      setUser( response?.data?.data)
      console.log(response.data.data);

      return response.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch user details";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }

 const toggleAdminStatus = async (userId, isAdmin) => {
  try {
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.post(
      `https://le-souk.dinamo-app.com/api/admin/users/${userId}/toggle-admin`,
      { is_admin: isAdmin },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedStatus = response.data.data.is_admin;

setUsers((prevUsers) =>
  prevUsers.map((user) =>
    user.id === userId
      ? {
          ...user,
          is_admin: updatedStatus,
          admin_status_text: updatedStatus ? "Admin" : "Customer", 
        }
      : user
  )
);
;


    toast.success(
      `User has been ${updatedStatus ? "granted" : "revoked"} admin access successfully.`
    );
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to update user admin status";
    setError(errorMessage);
    toast.error(errorMessage);
  }
};

  return { users,user, loading, error, totalPages , toggleAdminStatus ,deleteUser,getUserById};
};

export default useUsers;
