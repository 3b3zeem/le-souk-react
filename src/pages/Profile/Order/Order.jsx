import React, { useEffect, useState } from "react";
import { useOrder } from "../../../hooks/Order/useOrder";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Order = () => {
  const { fetchOrders } = useOrder();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { token } = useAuthContext();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        toast.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
    // eslint-disable-next-line
  }, [token]);

  const handleCompletePayment = async (orderId) => {
    window.location.href = `/payment/${orderId}`;
  };

  return (
    <div className="w-full mx-auto bg-white p-8 shadow-md mt-6 border-t border-gray-200">
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: colors.productTitle }}
      >
        {t("myOrders")}
      </h2>
      {ordersLoading ? (
        <div className="text-center py-6">
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-600">{t("noOrdersFound")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: colors.borderLight }}
              >
                <th
                  className="py-3 px-4 font-semibold"
                  style={{ color: colors.productTitle }}
                >
                  {t("orderId")}
                </th>
                <th
                  className="py-3 px-4 font-semibold"
                  style={{ color: colors.productTitle }}
                >
                  {t("status")}
                </th>
                <th
                  className="py-3 px-4 font-semibold"
                  style={{ color: colors.productTitle }}
                >
                  {t("totalPrice")}
                </th>
                <th
                  className="py-3 px-4 font-semibold"
                  style={{ color: colors.productTitle }}
                >
                  {t("createdAt")}
                </th>
                <th
                  className="py-3 px-4 font-semibold"
                  style={{ color: colors.productTitle }}
                >
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                  style={{ borderColor: colors.borderLight }}
                >
                  <td
                    className="py-3 px-4"
                    style={{ color: colors.productName }}
                  >
                    {order.id}
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: colors.productName }}
                  >
                    {order.status}
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: colors.productName }}
                  >
                    {order.total_price || "0.00"}{" "}
                    {language === "ar" ? "د.ك" : "KWD"}
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: colors.productName }}
                  >
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 flex items-center gap-3">
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCompletePayment(order.id)}
                        className={`text-sm py-2 px-4 text-white flex items-center gap-1 customEffect cursor-pointer rounded
                          bg-green-600 hover:bg-green-700
                        `}
                      >
                        <span className="flex items-center gap-1">
                          {t("completePayment") || "Complete Payment"}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="text-sm py-2 px-4 text-light bg-[#333e2c] flex items-center gap-1 customEffect cursor-pointer rounded"
                    >
                      <span className="flex items-center gap-1">
                        {t("moreDetails")}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;
