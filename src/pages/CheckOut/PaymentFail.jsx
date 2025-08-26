import failVideo from "../../assets/payment-failed.mp4";
import Meta from "../../components/Meta/Meta";
import { useLanguage } from "../../context/Language/LanguageContext";

const PaymentFailed = () => {
  const { language } = useLanguage();

  const title = language === "ar" ? "فشل الدفع" : "Payment Failed";
  const message =
    language === "ar"
      ? "حدث خطأ أثناء الدفع. يرجى المحاولة لاحقًا."
      : "Something went wrong with the payment. Please try again later.";

  const buttonText = language === "ar" ? "العودة للطلبات" : "Back to Orders";
  const redirectUrl = `http://localhost:5173/order`;
  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 text-center px-4 py-10"
      dir={direction}
    >
      <Meta title="Payment Failed" />
      <div className="bg-white p-5 rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-center">
          <video
            src={failVideo}
            autoPlay
            loop
            muted
            width={350}
            style={{ maxWidth: "100%" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">{title}</h1>
        <p className="text-gray-700 text-lg mb-6">{message}</p>
        <a
          href={redirectUrl}
          className="inline-block px-6 py-3 bg-red-600 text-white rounded text-lg customEffect"
        >
          <span>{buttonText}</span>
        </a>
      </div>
    </div>
  );
};

export default PaymentFailed;
