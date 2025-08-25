import React from "react";
import { Phone, Mail, Clock, MapPin, Send, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/Language/LanguageContext";
import logo from "../../assets/Images/3x/navbar.png";
import ReadOnlyRichText from "./ReadOnlyRichText";
import { useSettingsContext } from "../../context/Settings/SettingsContext";
import FooterSkeleton from "./FooterSkeleton";

const colors = {
  primary: "#333e2c",
  secondary: "#475569",
  footerBg: "#e8e4dd",
  textSecondary: "black",
  inputBg: "transparent",
};

const Footer = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const {
    getSettingValueByName,
    getSettingByEitherName,
    getTranslatedText,
    loading,
    error,
  } = useSettingsContext();

  // Get contact information from settings using translated names
  const phoneNumber =
    getSettingValueByName("Phone Number") ||
    getSettingValueByName("رقم الهاتف");
  const email =
    getSettingValueByName("Email Address") ||
    getSettingValueByName("عنوان البريد الإلكتروني");
  const location =
    getSettingValueByName("Location") || getSettingValueByName("الموقع");
  const siteName =
    getSettingValueByName("Site Name") || getSettingValueByName("اسم الموقع");

  // Get business hours using getSettingByEitherName
  const WorkingHoursSetting = getSettingByEitherName(
    "Working Hours",
    "ساعات العمل"
  );

  // Helper function to get names from setting
  const getSettingNames = (setting) => {
    if (!setting || !setting.translations)
      return { nameEn: "", nameAr: "", value: "" };

    const enTranslation = setting.translations.find((t) => t.locale === "en");
    const arTranslation = setting.translations.find((t) => t.locale === "ar");

    return {
      nameEn: enTranslation?.name || "",
      nameAr: arTranslation?.name || "",
      value:
        getTranslatedText(setting.translations, "value") || setting.value || "",
    };
  };

  const WorkingHoursData = getSettingNames(WorkingHoursSetting);

  if (loading) {
    return <FooterSkeleton />;
  }

  if (error) {
    console.error("Error loading settings:", error);
  }

  return (
    <footer
      className="w-full p-12"
      style={{ backgroundColor: colors.footerBg }}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-700 pb-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Call Us */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Phone size={25} className="text-[#353535]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#353535]">
                {t("callUs")}{" "}
              </h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {phoneNumber || "66511123"}
              </p>
            </div>
          </div>

          {/* Make a Quote */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <Mail size={25} className="text-[#353535]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#353535]">
                {t("makeQuote")}
              </h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {email || "example@gmail.com"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full border border-dotted border-gray-600">
              <MapPin size={25} className="text-[#353535]" />
            </div>
            <a
              href="https://maps.app.goo.gl/DV95vcWCubMko3v68"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col"
            >
              <h4 className="text-sm font-medium text-[#353535]">
                {t("location")}
              </h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {location || "Street 2, 70073, Kuwait."}
              </p>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex justify-center items-center sm:items-start">
            <img
              src={logo}
              alt={`${siteName}`}
              width={250}
              height={250}
              draggable={false}
            />
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="relative inline-block text-[#353535] font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              {language === "ar"
                ? WorkingHoursData.nameAr
                : WorkingHoursData.nameEn}
              <div className="w-[30px] h-[2px] bg-[#333e2c] mb-5 mt-1"></div>
            </h3>
            <div>
              <div
                className="text-md whitespace-pre-line"
                style={{ color: colors.textSecondary }}
              >
                {WorkingHoursData.value && (
                  <div className="mb-2">
                    <ReadOnlyRichText
                      value={WorkingHoursData.value}
                      dir={language === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="relative mb-1 inline-block text-[#353535] font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:left-[45px] after:w-[60px] after:h-[2px] after:bg-white/80">
              {t("quickLinks")}
              <div className="w-[30px] h-[2px] bg-[#333e2c] mb-5 mt-1"></div>
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to={"/"}
                  className="text-sm mb-1 flex items-center hover:translate-x-1.5 transition-all duration-200"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.textSecondary)
                  }
                >
                  {" "}
                  <span className="mr-2">&gt;</span> {t("home")}
                </Link>
                <Link
                  to={"/categories"}
                  className="text-sm flex items-center mb-1 hover:translate-x-1.5 transition-all duration-200"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.textSecondary)
                  }
                >
                  {" "}
                  <span className="mr-2">&gt;</span> {t("categories")}
                </Link>
                <Link
                  to={"/products"}
                  className="text-sm mb-1 flex items-center hover:translate-x-1.5 transition-all duration-200"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.textSecondary)
                  }
                >
                  {" "}
                  <span className="mr-2">&gt;</span> {t("products")}
                </Link>
                <Link
                  to={"/packages"}
                  className="text-sm mb-1 flex items-center hover:translate-x-1.5 transition-all duration-200"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.textSecondary)
                  }
                >
                  {" "}
                  <span className="mr-2">&gt;</span> {t("packages")}
                </Link>
                <Link
                  to={"/contact"}
                  className="text-sm flex items-center hover:translate-x-1.5 transition-all duration-200"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.textSecondary)
                  }
                >
                  {" "}
                  <span className="mr-2">&gt;</span> {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className={`relative mb-1 inline-block text-[#353535] font-bold text-2xl after:content-[''] after:absolute after:top-[36px] after:w-[60px] after:h-[2px] after:bg-white/80 ${
                language === "ar" ? "after:-left-[45px]" : "after:left-[45px]"
              }`}
            >
              {t("followUs")}
              <div className="w-[30px] h-[2px] bg-[#333e2c] mb-5 mt-1"></div>
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/lesoukkuwait/"
                target="_blank"
                className="px-2 py-3 border border-[#333e2c] hover:bg-white transition duration-200"
                aria-label={t("instagramLabel")}
              >
                <Instagram size={25} className="text-[#333e2c]" />
                <span className="sr-only">{t("instagramLabel")}</span>
              </a>
              <a
                href="https://www.tiktok.com/@lesoukkuwaitt?_t=ZS-8xIuzd6zmE5&_r=1"
                target="_blank"
                className="px-2 py-3 border border-[#333e2c] hover:bg-white transition duration-200"
                aria-label={t("tiktokLabel")}
              >
                <FaTiktok size={25} className="text-[#333e2c]" />
                <span className="sr-only">{t("tiktokLabel")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-gray-700 text-center">
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {t("copyright")} {siteName && `- ${siteName}`}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
