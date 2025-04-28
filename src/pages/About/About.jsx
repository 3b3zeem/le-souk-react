import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/Language/LanguageContext";

const About = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className="relative w-full h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{t("aboutYourCompany")}</h1>
            <p className="text-lg">{t("awesomeTemplate")}</p>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section - Image */}
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1556741533-411cf82e4e2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={t("aboutUs")}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Right Section - Text and Social Icons */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">{t("aboutUsAndSkills")}</h2>
            <p className="text-gray-600 mb-4">{t("aboutParagraph1")}</p>
            <p className="text-gray-600 mb-4">{t("aboutParagraph2")}</p>
            <p className="text-gray-600 mb-6">{t("aboutParagraph3")}</p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6 text-blue-600 hover:text-blue-800 transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-6 h-6 text-blue-400 hover:text-blue-600 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6 text-blue-700 hover:text-blue-900 transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6 text-pink-500 hover:text-pink-700 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              {t("ourService")}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {t("ourServiceDescription")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={t("wideProductRange")}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("wideProductRange")}
              </h3>
              <p className="text-gray-600">
                {t("wideProductRangeDescription")}
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://plus.unsplash.com/premium_photo-1661550011562-537183c5670c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fEZhc3QlMjAlMjYlMjBTZWN1cmUlMjBTaGlwcGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                alt={t("fastSecureShipping")}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("fastSecureShipping")}
              </h3>
              <p className="text-gray-600">
                {t("fastSecureShippingDescription")}
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={t("exceptionalSupport")}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("exceptionalSupport")}
              </h3>
              <p className="text-gray-600">
                {t("exceptionalSupportDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
