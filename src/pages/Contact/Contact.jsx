import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/Language/LanguageContext";

const Contact = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header Section */}
      <div
        className="relative w-full h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{t("contactUs")}</h1>
            <p className="text-lg">{t("contactUsDescription")}</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section - Contact Form */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("sayHello")}
            </h2>
            <p className="text-gray-600 mb-6">{t("sayHelloDescription")}</p>
            <div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("name")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("email")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 ${language === "ar" ? "text-right" : "text-left"}`}
                    placeholder={t("enterPhoneNumber")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("subject")}
                  </label>
                  <textarea
                    id="subject"
                    rows="4"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("subject")}
                  ></textarea>
                </div>
                <button className="w-[200px] bg-[#333e2c] text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  {t("sendMessage")}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Map and Info */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12829.559166403684!2d47.9201499!3d29.3057355!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9ba2ae78ef57%3A0xf5f2a6b63d01f498!2sLe%20Souk!5e1!3m2!1sen!2seg!4v1750797660017!5m2!1sen!2seg"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
