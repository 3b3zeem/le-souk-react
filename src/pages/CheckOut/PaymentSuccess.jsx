import { useEffect } from "react";
import confetti from "canvas-confetti";

import successVideo from "../../assets/payment-success.mp4";
import { useLanguage } from "../../context/Language/LanguageContext";
import Meta from "../../components/Meta/Meta";

const PaymentSuccess = () => {
  const { language } = useLanguage();

  useEffect(() => {
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

  const title = language === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!";
  const message =
    language === "ar"
      ? "شكرًا لإتمام عملية الدفع. يمكنك الآن متابعة طلبك."
      : "Thanks for completing the payment. You can now proceed with your order.";

  const buttonText = language === "ar" ? "العودة للطلبات" : "Back to Orders";
  const redirectUrl = `http://localhost:5173/order`;
  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-center px-4 py-10"
      dir={direction}
    >
      <Meta title="Payment Successful" />
      <div className="bg-white p-5 rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-center">
          <video
            src={successVideo}
            autoPlay
            loop
            muted
            width={350}
            style={{ maxWidth: "100%" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-[#333e2c] mb-4">{title}</h1>
        <p className="text-gray-700 text-lg mb-6">{message}</p>
        <a
          href={redirectUrl}
          className="inline-block px-6 py-3 bg-[#333e2c] text-white rounded text-lg customEffect"
        >
          <span>{buttonText}</span>
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
