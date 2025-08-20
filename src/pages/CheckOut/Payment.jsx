import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../../hooks/Order/useOrder";
import Meta from "../../components/Meta/Meta";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/Auth/AuthContext";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { executePayment, fetchOrderById, loading: orderLoading } = useOrder();
  const { token, isLoading } = useAuthContext();
  const { t } = useTranslation();

  const [order, setOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      navigate("/login");
    } else if (orderId) {
      loadOrderDetails();
    }
    // eslint-disable-next-line
  }, [orderId, token, isLoading]);

  const loadOrderDetails = async () => {
    try {
      const orderData = await fetchOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      toast.error(err.response.data.message || t("failedToLoadOrderDetails"));
      navigate("/profile");
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error(t("pleaseSelectPaymentMethod"));
      return;
    }

    setProcessing(true);
    try {
      const paymentData = await executePayment(orderId, {
        payment_method_id: selectedPaymentMethod,
        ...(customerName && { customer_name: customerName }),
        ...(customerEmail && { customer_email: customerEmail }),
        ...(customerPhone && { customer_phone: customerPhone }),
      });

      const paymentUrl = paymentData?.payment_url;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error(t("failedToGetPaymentUrl"));
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || t("paymentFailed")
      );
    } finally {
      setProcessing(false);
    }
  };

  if (orderLoading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#333e2c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loadingOrderDetails")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <Meta
        title={`Payment-${order.id}`}
        description="Securely complete your payment using multiple payment methods on our checkout system."
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("completePayment")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("orderId")} #{order.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t("customerInformation")}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c]"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t("enterYourName")}
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c]"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={t("enterYourEmail")}
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c]"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t("enterYourPhone")}
                    maxLength={11}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("maximum11Characters")}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t("paymentMethod")}
              </h2>

              <div className="space-y-4">
                {/* Knet */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={1}
                    checked={selectedPaymentMethod === 1}
                    onChange={(e) =>
                      setSelectedPaymentMethod(Number(e.target.value))
                    }
                    className="w-4 h-4 text-[#333e2c] focus:ring-[#333e2c]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {t("knet")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("directBankTransfer")}
                        </p>
                      </div>
                      <div className="w-16 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {t("knet")}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={2}
                    checked={selectedPaymentMethod === 2}
                    onChange={(e) =>
                      setSelectedPaymentMethod(Number(e.target.value))
                    }
                    className="w-4 h-4 text-[#333e2c] focus:ring-[#333e2c]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {t("creditDebitCard")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("visaMastercardAmex")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-5 bg-blue-600 rounded"></div>
                        <div className="w-8 h-5 bg-red-600 rounded"></div>
                        <div className="w-8 h-5 bg-yellow-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors cursor-pointer transition-all duration-300 ${
                  processing
                    ? "bg-[#333e2c] opacity-70 cursor-not-allowed"
                    : "bg-[#333e2c] hover:bg-[#586450]"
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("processingPayment")}
                  </div>
                ) : (
                  `${t("payNow")} ${order.total_price} KWD`
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {t("orderSummary")}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("orderId")}:</span>
                <span className="font-medium">#{order.id}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("status")}:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("date")}:</span>
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t("total")}:</span>
                  <span>{order.total_price} KWD</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  {t("items")}
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                    >
                      <img
                        src={item.product?.primary_image_url}
                        alt={item.product?.name || "Product"}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.product?.name || "Unknown Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("quantity")}: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/profile")}
            className="text-[#333e2c] hover:text-[#586450] font-medium"
          >
            {t("backToOrders")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
