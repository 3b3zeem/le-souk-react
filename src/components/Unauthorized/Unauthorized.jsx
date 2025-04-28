import React from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldOff } from "lucide-react";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

export default function Unauthorized() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center space-y-6">
        <ShieldOff className="w-16 h-16 text-red-500" />
        <h1 className="text-4xl font-bold text-gray-800">{t("unauthorized")}</h1>
        <p className="text-gray-600 text-center max-w-md">
        {t("noPermission")}
        </p>
        <Link
          to={"/"}
          className="px-4 py-2 bg-blue-600 text-white rounded customEffect"
        >
          <span className="inline-flex items-center gap-2">
            <Lock className="w-5 h-5 mr-2" />
            {t("backToHome")}
          </span>
        </Link>
      </div>
    </div>
  );
}
