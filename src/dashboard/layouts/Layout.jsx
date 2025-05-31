import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useEffect } from "react";

export default function AdminLayout() {
  const { language } = useLanguage();
  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <div className="flex min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      <Sidebar />
      <div className="w-[82%] md:w-full">
        <Outlet />
      </div>
    </div>
  );
}
