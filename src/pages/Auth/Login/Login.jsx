import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import loginImg from "../../../assets/home-art.svg";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/Auth/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Color variables
  const colors = {
    primary: "#333e2c",
    secondary: "#475569",
    accent: "#6366f1",
    text: "#333333",
    lightText: "#ffffff",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result) {
      toast.success("Login successful! Welcome back!", {
        duration: 1000,
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(error || "Login failed. Please try again.", {
        duration: 1000,
        position: "top-right",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="flex flex-col md:flex-row w-full min-h-screen"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Left Panel - Dark blue with illustration */}
      <div
        className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: colors.secondary }}
      >
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-white">{t("stayConnected")}</span>
            <span style={{ color: colors.primary }}> {t("always")}</span>
          </h1>

          <p className="text-white text-lg mb-10 leading-relaxed">
            {t("loginDescription")}
          </p>

          {/* Phone Illustration */}
          <div className="relative flex justify-center mt-8">
            <img src={loginImg} alt={t("signIn")} />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center md:min-h-screen">
        <div className="w-full max-w-md pb-16 md:pb-0">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#333e2c] rounded-lg">
              <Lock size={24} color="white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8">{t("signIn")}</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                placeholder=" "
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="email"
                className={`
                  absolute transition-all duration-200
                  ${
                    language === "ar"
                      ? "right-3 text-right"
                      : "left-3 text-left"
                  }
                  ${
                    focusedField === "email" || email
                      ? "text-xs text-blue-500 -top-2 bg-white px-1"
                      : "text-gray-400 top-3"
                  }
                `}
              >
                {t("email")}
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out pr-10"
                placeholder=" "
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="password"
                className={`
                  absolute transition-all duration-200
                  ${
                    language === "ar"
                      ? "right-3 text-right"
                      : "left-3 text-left"
                  }
                  ${
                    focusedField === "password" || password
                      ? "text-xs text-blue-500 -top-2 bg-white px-1"
                      : "text-gray-400 top-3"
                  }
                `}
              >
                {t("password")}
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer ${
                  language === "ar" ? "left-3" : "right-3"
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white font-medium cursor-pointer customEffect ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: colors.primary }}
            >
              <span>{loading ? t("signingIn") : t("signIn")}</span>
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-700">
                {t("noAccount")}
                <Link to={"/register"} className="text-blue-500 ml-1">
                  {t("signUp")}
                </Link>
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-200"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
