import React, { useEffect, useState } from "react";
import { useOrder } from "../../../hooks/Order/useOrder";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useParams } from "react-router-dom";

const OrderId = () => {
  const { orderId } = useParams();
  const { fetchOrderById } = useOrder();
  const [order, setOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { token } = useAuthContext();

  useEffect(() => {
    const loadOrder = async () => {
      setOrdersLoading(true);
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load order details.");
        setOrder(null);
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
  }, [token]);

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Failed to load order details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Order Summary Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order #{order.id || "N/A"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p
                className={`text-lg capitalize ${
                  order.status === "canceled" ? "text-red-600" : "text-green-600"
                }`}
              >
                {order.status || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Price</p>
              <p className="text-lg font-semibold">${order.total_price || "0.00"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="text-lg">
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Order Items
          </h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  {/* Product Image */}
                  <img
                    src={item?.product?.image || "https://via.placeholder.com/150"}
                    alt={item?.product?.name || "Product"}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback image
                  />
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {item?.product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item?.product?.description || "No description available."}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-gray-700">
                        <span className="font-medium">Price:</span> $
                        {item?.price || "0.00"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity:</span>{" "}
                        {item?.quantity || 0}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Stock:</span>{" "}
                        {item?.product?.stock_quantity || 0}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-gray-700">
                        <span className="font-medium">In Cart:</span>{" "}
                        {item?.product?.is_in_cart ? "Yes" : "No"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">In Wishlist:</span>{" "}
                        {item?.product?.is_in_wishlist ? "Yes" : "No"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Reviewed:</span>{" "}
                        {item?.product?.is_reviewed ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No items found in this order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderId;