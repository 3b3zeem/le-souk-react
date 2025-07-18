import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLanguage } from "../../context/Language/LanguageContext";

const API_URL = "https://le-souk.dinamo-app.com/api/settings";

const fetchSettings = async ({ queryKey }) => {
  const [_key, { language }] = queryKey;
  const response = await axios.get(API_URL, {
    headers: {
      "Accept-Language": language,
    },
  });
  return response.data.data || [];
};

const useSettings = () => {
  const { language } = useLanguage();

  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings", { language }],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const getTranslatedText = (translations, field) => {
    if (!translations || !Array.isArray(translations)) return "";
    const translation = translations.find((t) => t.locale === language);
    return translation
      ? translation[field]
      : translations.find((t) => t.locale === "en")?.[field] || "";
  };

  const getSettingValueByName = (name) => {
    if (!settingsData || !Array.isArray(settingsData)) return "";
    const setting = settingsData.find((setting) => {
      if (!setting.translations) return false;
      const translation = setting.translations.find(
        (t) => t.locale === language
      );
      return translation && translation.name === name;
    });
    if (!setting) return "";
    const translatedValue = getTranslatedText(setting.translations, "value");
    return translatedValue || setting.value || "";
  };

  // Alternative function to get setting by either English or Arabic name
  const getSettingByEitherName = (nameEn, nameAr) => {
    if (!settingsData || !Array.isArray(settingsData)) return null;

    const setting = settingsData.find((setting) => {
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

  return {
    settings: settingsData || [],
    loading: isSettingsLoading,
    error: settingsError,
    getTranslatedText,
    getSettingValueByName,
    getSettingByEitherName,
  };
};

export default useSettings;
