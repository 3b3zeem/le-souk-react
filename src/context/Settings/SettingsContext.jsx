import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../Language/LanguageContext";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://le-souk.dinamo-app.com/api/settings",
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      setSettings(response.data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [language]);

  const getTranslatedText = (translations, field) => {
    if (!translations || !Array.isArray(translations)) return "";
    const translation = translations.find((t) => t.locale === language);
    return translation
      ? translation[field]
      : translations.find((t) => t.locale === "en")?.[field] || "";
  };

  const getSettingValueByName = (name) => {
    const setting = settings.find((s) =>
      s.translations?.some(
        (t) => t.locale === language && t.name === name
      )
    );
    return setting
      ? getTranslatedText(setting.translations, "value") || setting.value
      : "";
  };

    const getSettingByEitherName = (nameEn, nameAr) => {
    if (!settings || !Array.isArray(settings)) return null;

    const setting = settings.find((setting) => {
      if (!setting.translations) return false;

      const enTranslation = setting.translations.find((t) => t.locale === "en");
      const arTranslation = setting.translations.find((t) => t.locale === "ar");

      return (
        (enTranslation && enTranslation.name === nameEn) ||
        (arTranslation && arTranslation.name === nameAr)
      );
    });

    return setting;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        getTranslatedText,
        getSettingValueByName,
        getSettingByEitherName,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
