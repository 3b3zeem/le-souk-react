import React, { useEffect, useState } from "react";
import useCartCRUD from "../../hooks/Cart/UseCart";
import toast from "react-hot-toast";
import { ChevronRight, House, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    fetchCart,
    setCartQuantity,
    clearCart,
    error,
    success,
  } = useCartCRUD();
  const [loadingStates, setLoadingStates] = useState({
    remove: {},
    quantity: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  }, [error, success]);

  const calculateSubtotal = () =>
    cartItems.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );

  const handleRemove = async (productId) => {
    setLoadingStates((prev) => ({
      ...prev,
      remove: { ...prev.remove, [productId]: true },
    }));

    try {
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item from cart.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        remove: { ...prev.remove, [productId]: false },
      }));
    }
  };

  const handleQuantityChange = async (productId, type, currentQuantity) => {
    const newQuantity =
      type === "inc" ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;

    setLoadingStates((prev) => ({
      ...prev,
      quantity: { ...prev.quantity, [productId]: true },
    }));

    try {
      await setCartQuantity(productId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        quantity: { ...prev.quantity, [productId]: false },
      }));
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  return (
    <React.Fragment>
      <div className="bg-gray-200 p-10 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.productTitle }}
          >
            MY SHOPPING BAG
          </h1>
          <div className="flex items-center text-gray-600 gap-1">
            <House
              onClick={() => navigate("/")}
              size={20}
              className="cursor-pointer"
            />
            <ChevronRight size={20} />
            <span className="text-[17px]">Cart</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart
              size={64}
              className="mb-4"
              style={{ color: colors.productName, opacity: 0.3 }}
            />
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.productTitle }}
            >
              Your Cart is Empty
            </h2>
            <p
              className="text-sm mb-6 max-w-md"
              style={{ color: colors.productName }}
            >
              Looks like you haven't added any items to your cart yet. Start
              shopping to find your favorite products!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="py-3 px-6 rounded-md customEffect cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="border-b-1 border-gray-300">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 mb-5  text-white rounded-md customEffect cursor-pointer"
              >
                <span>Clear Cart</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => {
                  const isRemoving =
                    loadingStates.remove[item.product.id] || false;
                  const isUpdatingQuantity =
                    loadingStates.quantity[item.product.id] || false;

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 border-b pb-6"
                      style={{ borderColor: colors.borderLight }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1">
                        <h2
                          className="font-semibold"
                          style={{ color: colors.productName }}
                        >
                          {item.product.name}
                        </h2>
                        <p
                          className="text-sm"
                          style={{ color: colors.productName }}
                        >
                          ITEM NO: {item.product.id}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.productName }}
                        >
                          SIZE: OS
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.productName }}
                        >
                          COLOR: Unknown
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                "dec",
                                item.quantity
                              )
                            }
                            disabled={
                              isRemoving ||
                              isUpdatingQuantity ||
                              item.quantity <= 1
                            }
                            className="px-2 border disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                            style={{ borderColor: colors.borderLight }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                "inc",
                                item.quantity
                              )
                            }
                            disabled={isRemoving || isUpdatingQuantity}
                            className="px-2 border disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                            style={{ borderColor: colors.borderLight }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <p
                          className="text-lg font-semibold"
                          style={{ color: colors.primary }}
                        >
                          $
                          {(Number(item.product.price) * item.quantity).toFixed(
                            2
                          )}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          disabled={isRemoving || isUpdatingQuantity}
                          className={`bg-[#d01e1e] text-white font-bold py-2 px-4 rounded cursor-pointer customEffect ${
                            isRemoving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <span>
                            {isRemoving ? "Removing..." : <Trash2 size={18} />}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Section */}
              <div
                className="border p-6 space-y-6 h-fit"
                style={{ borderColor: colors.borderLight }}
              >
                <h2
                  className="text-lg font-bold border-b pb-4"
                  style={{
                    borderColor: colors.lineBg,
                    color: colors.productTitle,
                  }}
                >
                  SUMMARY
                </h2>

                {/* <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: colors.productName }}
                >
                  Do you have a promo code?
                </p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="border border-gray-300 p-2 flex-1"
                  />
                  <button
                    className="px-4"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.lightText,
                    }}
                  >
                    APPLY
                  </button>
                </div>
              </div> */}

                <div className="flex justify-between text-sm">
                  <p style={{ color: colors.productName }}>Subtotal</p>
                  <p style={{ color: colors.productName }}>
                    ${calculateSubtotal().toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <p style={{ color: colors.productName }}>Shipping</p>
                  <p style={{ color: colors.productName }}>TBD</p>
                </div>

                <div className="flex justify-between text-sm">
                  <p style={{ color: colors.productName }}>
                    Sales Tax <span className="text-gray-400 text-xs">(i)</span>
                  </p>
                  <p style={{ color: colors.productName }}>TBD</p>
                </div>

                <div
                  className="border-t pt-4 flex justify-between font-semibold"
                  style={{ borderColor: colors.lineBg }}
                >
                  <p style={{ color: colors.productTitle }}>Estimated Total</p>
                  <p style={{ color: colors.productTitle }}>
                    ${calculateSubtotal().toFixed(2)}
                  </p>
                </div>

                <button
                  className="w-full py-3 mt-4 customEffect cursor-pointer"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.lightText,
                  }}
                >
                  <span>CHECKOUT</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Cart;
