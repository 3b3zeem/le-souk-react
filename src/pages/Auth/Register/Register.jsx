import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import RegImg from "../../../assets/sign_up.svg";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/Auth/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading, error } = useAuth();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const colors = {
    primary: "#1e70d0",
    secondary: "#475569",
    text: "#333333",
    lightText: "#ffffff",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(username, email, password, confirmPassword);
    if (result) {
      toast.success("Registration successful! Welcome aboard!", {
        duration: 1000,
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      toast.error(error || "Registration failed. Please try again.", {
        duration: 1000,
        position: "top-right",
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div
      className="flex flex-col md:flex-row w-full min-h-screen"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Left Panel - Dark blue with illustration */}
      <div
        className="w-full md:w-1/2 flex p-5 flex-col items-center justify-center"
        style={{ backgroundColor: colors.secondary }}
      >
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-white">{t("joinUsIn")} </span>
            <span className="text-gray-300">Le-Sock</span>
            {/* {t("leSock")} */}
          </h1>

          <p className="text-white text-lg mb-6 leading-relaxed">
            {t("signUpDescription")}
          </p>

          <p className="text-white mt-6">
            {t("alreadyHaveAccount")}
            <Link
              to={"/login"}
              className="text-white font-medium hover:underline ms-2"
            >
              {t("signIn")}
            </Link>
          </p>

          {/* Laptop Illustration */}
          <div className="relative flex justify-center mt-12">
            <img src={RegImg} alt={t("signUp")} />
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full md:w-1/2 p-5 flex items-center justify-center md:min-h-screen">
        <div className="w-full max-w-md pb-16 md:pb-0">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500 rounded-lg">
              <Lock size={24} color="white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8">{t("signUp")}</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out`}
                placeholder=" "
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="username"
                className={`
                  absolute transition-all duration-200
                  ${
                    language === "ar"
                      ? "right-3 text-right"
                      : "left-3 text-left"
                  }
                  ${
                    focusedField === "username" || username
                      ? "text-xs text-blue-500 -top-2 bg-white px-1"
                      : "text-gray-400 top-3"
                  }
                `}
              >
                {t("userName")}
              </label>
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
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

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                placeholder=" "
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                htmlFor="confirmPassword"
                className={`
                  absolute transition-all duration-200
                  ${
                    language === "ar"
                      ? "right-3 text-right"
                      : "left-3 text-left"
                  }
                  ${
                    focusedField === "confirmPassword" || confirmPassword
                      ? "text-xs text-blue-500 -top-2 bg-white px-1"
                      : "text-gray-400 top-3"
                  }
                `}
              >
                {t("confirmPassword")}
              </label>
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer ${
                  language === "ar" ? "left-3" : "right-3"
                }`}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-medium bg-[var(--primary)] hover:bg-blue-600 transition duration-200 customEffect cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: colors.primary }}
            >
              <span>{loading ? t("signingUp") : t("signUp")}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
