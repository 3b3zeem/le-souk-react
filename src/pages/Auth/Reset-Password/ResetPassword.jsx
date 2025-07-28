import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/Auth/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import resetImg from "../../../assets/Reset password-cuate.svg";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();

  const isArabic = language === "ar";

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenUrl = query.get("token");
    const emailUrl = query.get("email");

    if (emailUrl) setEmail(emailUrl);
    if (tokenUrl) setToken(tokenUrl);
  }, [searchParams]);

  const handleReset = async () => {
    if (!email || !token || !password || !confirmPassword) {
      toast.error(
        isArabic ? "يرجى ملء جميع الحقول" : "Please fill in all fields"
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        isArabic
          ? "يجب أن تكون كلمة المرور أكثر من 6 أحرف"
          : "Passwords must be more than 6"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        isArabic ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"
      );
      return;
    }

    const result = await resetPassword(email, token, password, confirmPassword);
    console.log("Reset Result:", result);

    if (result && result.status === "success") {
      toast.success(result.message);
      navigate("/login");
    } else {
      toast.error(
      result?.message ||
        (isArabic
          ? "فشل في إعادة تعيين كلمة المرور"
          : "Failed to reset password")
    );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = (id, label, type, value, setValue, readOnly) => {
    const isPasswordField = type === "password";

    return (
      <div className="relative">
        <input
          type={isPasswordField && showPassword ? "text" : type}
          id={id}
          value={value}
          readOnly={readOnly}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#333e2c] transition-all duration-200 ease-in-out ${
            readOnly ? "cursor-not-allowed bg-gray-200 text-gray-500" : ""
          }`}
          placeholder=" "
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          dir={isArabic ? "rtl" : "ltr"}
        />
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 bg-white px-1 ${
            focusedField === id || value
              ? "text-xs text-[#353535] -top-2 start-3"
              : "text-gray-400 top-3 start-3"
          } ${isArabic ? "right-3" : "left-3"} `}
        >
          {label}
        </label>

        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out cursor-pointer ${
              language === "ar" ? "left-3" : "right-3"
            }`}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-100 py-12"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-lg p-6 w-full max-w-md md:max-w-7xl">
        <div className="flex justify-center md:w-1/2">
          <img
            src={resetImg}
            alt="Reset Password"
            className="w-40 h-40 md:w-full md:h-full"
          />
        </div>

        <div className="flex flex-col gap-7 md:w-2/3 w-full">
          <h2 className="text-2xl font-bold text-center text-[#333e2c]">
            {isArabic ? "إعادة تعيين كلمة المرور" : "Reset Your Password"}
          </h2>

          {renderInput(
            "email",
            isArabic ? "البريد الإلكتروني" : "Email",
            "email",
            email,
            setEmail,
            true
          )}
          {renderInput(
            "password",
            isArabic ? "كلمة المرور الجديدة" : "New Password",
            "password",
            password,
            setPassword,
            false
          )}
          {renderInput(
            "confirmPassword",
            isArabic ? "تأكيد كلمة المرور" : "Confirm New Password",
            "password",
            confirmPassword,
            setConfirmPassword,
            false
          )}

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition customEffect cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#333e2c] hover:bg-[#2b3425]"
            }`}
          >
            <span>
              {loading ? (
                <DotSpinner size="20" speed="0.9" color="#fff" />
              ) : isArabic ? (
                "تغيير كلمة المرور"
              ) : (
                "Reset Password"
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
