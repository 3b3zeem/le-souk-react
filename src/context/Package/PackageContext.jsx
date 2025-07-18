import { createContext, useContext, useState } from "react";

const PackageContext = createContext(null);

export const PackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  return (
    <PackageContext.Provider value={{ packages, setPackages }}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackageContext = () => useContext(PackageContext);