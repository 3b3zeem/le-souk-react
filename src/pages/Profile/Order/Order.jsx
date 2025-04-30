import React, { useEffect, useState } from "react";
import { useOrder } from "../../../hooks/Order/useOrder";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Order = () => {
  const { fetchOrders, cancelOrder } = useOrder();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
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
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    setCancelLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await cancelOrder(orderId);
      const updatedOrders = await fetchOrders();
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
    } catch (err) {
      toast.error(err);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [orderId]: false }));
    }
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
                    {order.total_price} {language === "ar" ? "ج.م" : "LE"}
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
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelLoading[order.id]}
                        className={`py-2 px-4 rounded customEffect text-white cursor-pointer ${
                          cancelLoading[order.id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        style={{
                          backgroundColor: "#d01e1e",
                        }}
                      >
                        {cancelLoading[order.id] ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t("cancelling")}
                          </span>
                        ) : (
                          <span>{t("cancelOrder")}</span>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="text-sm py-2 px-4 text-light bg-[#1e70d0] flex items-center gap-1 customEffect cursor-pointer rounded"
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
          {/* <AnimatePresence>
              {showItemsModal && (
                <motion.div
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-bold mb-4 text-gray-700">
                      {t("orderItems")}
                    </h3>
                    <ul className="list-decimal list-inside space-y-1 text-gray-800">
                      {selectedItems.map((item, index) => (
                        <li key={index}>
                          {item.product.name} ( x{item.quantity} )
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setShowItemsModal(false)}
                      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                      {t("close")}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence> */}
        </div>
      )}
    </div>
  );
};

export default Order;
