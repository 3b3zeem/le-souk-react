import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import loginImg from "../../../assets/Sign_in.svg";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/Auth/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import Meta from "../../../components/Meta/Meta";

import { motion, AnimatePresence } from "framer-motion";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, forgotPassword, loading, error } = useAuth();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Color variables
  const colors = {
    primary: "#333e2c",
    secondary: "#e8e3de",
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
        if (result.data.user.is_admin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } else {
      toast.error(error || "Login failed. Please try again.", {
        duration: 1000,
        position: "top-right",
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email.");
      return;
    }

    const result = await forgotPassword(forgotEmail);

    console.log(result);

    if (result) {
      toast.success(result.message || "Reset link sent to your email.", {
        duration: 1500,
        position: "top-right",
      });
      setShowForgotModal(false);
      setForgotEmail("");
    } else {
      toast.error(error || "Failed to send reset link.", {
        duration: 1500,
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
      <Meta
        title="Login"
        description="Sign in to your account to access exclusive features and content."
      />
      {/* Left Panel - Dark blue with illustration */}
      <div
        className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center "
        style={{ backgroundColor: colors.secondary }}
      >
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6 font-serif ">
            <span className="text-[#353535]">{t("stayConnected")}</span>
            <span style={{ color: colors.primary }}> {t("always")}</span>
          </h1>

          <p className="text-[#353535] text-md mb-0 leading-relaxed">
            {t("loginDescription")}
          </p>

          {/* Phone Illustration */}
          <div className="relative flex justify-center mt-0">
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

          <h2 className="text-3xl font-bold text-center mb-8 font-serif text-[#333e2c]">
            {t("signIn")}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-6">
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:[#e8e4dd ] transition-all duration-200 ease-in-out"
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
                      ? "text-xs text-[#353535] -top-2 bg-white px-1"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:[#e8e4dd ] transition-all duration-200 ease-in-out pr-10"
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
                      ? "text-xs text-[#353535] -top-2 bg-white px-1"
                      : "text-gray-400 top-3"
                  }
                `}
              >
                {t("password")}
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500  transition-all duration-200 ease-in-out cursor-pointer ${
                  language === "ar" ? "left-3" : "right-3"
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-sm font-semibold text-[#333e2c] hover:text-gray-600 transition duration-200 hover:underline"
            >
              {language === "ar" ? "هل نسيت كلمة المرور؟" : "Forget Password?"}
            </button>

            <AnimatePresence>
              {showForgotModal && (
                <motion.div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] h-[100vh]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-center text-[#333e2c]">
                      Forgot Password
                    </h3>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#333e2c]"
                      placeholder="Enter your email"
                    />
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                      >
                        {language === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className={`px-4 py-2 bg-[#333e2c] text-white rounded-md hover:bg-[#2b3425] transition ${
                          loading ? "cursor-not-allowed opacity-35" : ""
                        }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <DotSpinner size="20" speed="0.9" color="#fff" />
                        ) : language === "ar" ? (
                          "إرسال الإيميل"
                        ) : (
                          "Send Email"
                        )}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              onClick={handleSubmit}
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
                <Link
                  to={"/register"}
                  className="text-[#333e2c] font-serif  ml-1 h4 text-decoration-underline font-medium hover:underline"
                >
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
