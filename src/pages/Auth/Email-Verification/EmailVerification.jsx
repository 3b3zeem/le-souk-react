import { useEffect } from "react";
import confetti from "canvas-confetti";

import verify from "../../../assets/Verified-rafiki.svg";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { Link, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const { language } = useLanguage();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const messageFromQuery = queryParams.get("message");

  const isSuccess = status === "success";

  useEffect(() => {
    if (!isSuccess) return;

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const title = isSuccess
    ? language === "ar"
      ? "تم تأكيد الإيميل!"
      : "Email Verified!"
    : language === "ar"
    ? "فشل في تأكيد الإيميل"
    : "Email Verification Failed";
  const message = messageFromQuery
    ? decodeURIComponent(messageFromQuery.replace(/\+/g, " "))
    : isSuccess
    ? language === "ar"
      ? "شكرًا لتأكيد بريدك الإلكتروني، يمكنك الآن تسجيل الدخول."
      : "Thanks for verifying your email. You can now log in."
    : language === "ar"
    ? "حدث خطأ أثناء تأكيد بريدك الإلكتروني. يرجى المحاولة لاحقًا."
    : "Something went wrong while verifying your email. Please try again later.";
  const buttonText = language === "ar" ? "الذهاب للصفحة الرئيسية" : "Go to Home";
  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-center px-4 py-10"
      dir={direction}
    >
      <div className="bg-white p-5 rounded-xl shadow-xl max-w-lg w-full">
        {isSuccess && (
          <div className="flex items-center justify-center">
            <img src={verify} alt="verify" width={350} />
          </div>
        )}
        <h1 className="text-3xl font-bold text-[#333e2c] mb-4">{title}</h1>
        <p className="text-gray-700 text-lg mb-6">{message}</p>
        <Link
          to={"/"}
          className="inline-block px-6 py-3 bg-[#333e2c] text-white rounded text-lg hover:bg-[#2b3425] transition duration-200"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;
