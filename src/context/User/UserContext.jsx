import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../Auth/AuthContext";

const UserContext = createContext({
    userData: null,
    setUserData: () => {},
  });

export const UserProvider = ({ children }) => {
  const { profile } = useAuthContext();
  const [userData, setUserData] = useState(profile);


  useEffect(() => {
    setUserData(profile);
  }, [profile]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
