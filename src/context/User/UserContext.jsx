import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../Auth/AuthContext";

const UserContext = createContext({
    userData: null,
    setUserData: () => {},
  });

export const UserProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState(user);


  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
