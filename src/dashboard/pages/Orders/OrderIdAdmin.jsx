import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useParams } from "react-router-dom";
import Meta from "../../../components/Meta/Meta";
import useOrders from "../../hooks/Orders/useOrders";
import { useLanguage } from "../../../context/Language/LanguageContext";

const OrderIdAdmin = () => {
  const { orderId } = useParams();
  const { fetchOrderDetails } = useOrders();
  const [details, setDetails] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { token } = useAuthContext();
  const { language } = useLanguage();

  useEffect(() => {
    const loadOrder = async () => {
      setOrdersLoading(true);
      try {
        const data = await fetchOrderDetails(orderId, language);
        setDetails(data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load order details."
        );
        setDetails(null);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (token && orderId) {
      loadOrder();
    } else {
      console.warn("Token or orderId missing:", { token, orderId });
      toast.error("Missing authentication token or order ID.");
      setOrdersLoading(false);
    }
  }, [token, orderId, language]);

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading order details...
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Failed to load order details.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta title={`Order #${details.id} Details`} />
      <div className="max-w-4xl mx-auto">
        {/* Order Summary Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {language === "ar" ? "الطلب" : "Order"} #{details.id || "N/A"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "الحالة" : "Status"}
              </p>
              <p
                className={`text-lg capitalize ${
                  details.status === "canceled"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {details.status ||
                  (language === "ar" ? "غير معروف" : "Unknown")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "إجمالي السعر" : "Total Price"}
              </p>
              <p className="text-lg font-semibold">
                {details.total_price || "0.00"}{" "}
                {language === "ar" ? "د.ك." : "KWD"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "تاريخ الطلب" : "Order Date"}
              </p>
              <p className="text-lg">
                {details.created_at
                  ? new Date(details.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : language === "ar"
                  ? "غير متاح"
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {language === "ar" ? "العنوان" : "Address"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "عنوان الشحن" : "Shipping Address"}
              </p>
              <div className="text-lg space-y-1">
                <p>
                  <span className="font-medium">
                    {language === "ar" ? "الاسم:" : "Name:"}
                  </span>{" "}
                  {details.shipping_address?.name ||
                    (language === "ar" ? "غير متاح" : "N/A")}
                </p>
                <p>
                  <span className="font-medium">
                    {language === "ar" ? "العنوان:" : "Address:"}
                  </span>{" "}
                  {details.shipping_address?.full_address ||
                    (language === "ar" ? "غير متاح" : "N/A")}
                </p>
                <p>
                  <span className="font-medium">
                    {language === "ar" ? "الهاتف:" : "Phone:"}
                  </span>{" "}
                  {details.shipping_address?.phone ||
                    (language === "ar" ? "غير متاح" : "N/A")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {language === "ar" ? "تفاصيل العميل" : "Customer Details"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={details?.user?.image}
                alt={details?.user?.name}
                className="w-12 h-12 rounded-full border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user.png";
                }}
              />
              <div>
                <p className="text-lg font-semibold">
                  {details?.user?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {details?.user?.admin_status_text}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </p>
              <p className="text-lg">{details?.user?.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "رقم الهاتف" : "Phone"}
              </p>
              <p className="text-lg">{details?.user?.phone || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar" ? "عضو منذ" : "Member Since"}
              </p>
              <p className="text-lg">{details?.user?.member_since || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                {language === "ar"
                  ? "تأكيد البريد الإلكتروني"
                  : "Email Verification"}
              </p>
              <p
                className={`text-lg ${
                  details?.user?.email_verified
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {details?.user?.email_verification_status ||
                  (language === "ar" ? "غير متاح" : "N/A")}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {language === "ar" ? "عناصر الطلب" : "Order Items"}
          </h2>
          {details.items && details.items.length > 0 ? (
            <div className="space-y-6">
              {details.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  {/* Product Image */}
                  <img
                    src={item?.product?.primary_image_url}
                    alt={item?.product?.name || "Product"}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {item?.product?.name ||
                        (language === "ar"
                          ? "منتج غير معروف"
                          : "Unknown Product")}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item?.product?.description ||
                        (language === "ar"
                          ? "لا يوجد وصف متاح."
                          : "No description available.")}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {language === "ar" ? "السعر:" : "Price:"}
                        </span>{" "}
                        {item?.product?.min_price ||
                          item?.product?.max_price ||
                          "0.00"}{" "}
                        {language === "ar" ? "د.ك." : "KWD"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {language === "ar" ? "الكمية:" : "Quantity:"}
                        </span>{" "}
                        {item?.quantity || 0}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {language === "ar" ? "المخزون:" : "Stock:"}
                        </span>{" "}
                        {item?.product?.total_stock || 0}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {language === "ar" ? "في السلة:" : "In Cart:"}
                        </span>{" "}
                        {item?.product?.user?.is_in_cart
                          ? language === "ar"
                            ? "نعم"
                            : "Yes"
                          : language === "ar"
                          ? "لا"
                          : "No"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {language === "ar" ? "في المفضلة:" : "In Wishlist:"}
                        </span>{" "}
                        {item?.product?.user?.is_in_wishlist
                          ? language === "ar"
                            ? "نعم"
                            : "Yes"
                          : language === "ar"
                          ? "لا"
                          : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              {language === "ar"
                ? "لا توجد عناصر في هذا الطلب."
                : "No items found in this order."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderIdAdmin;
