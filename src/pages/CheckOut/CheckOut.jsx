import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta/Meta";
import useCartCRUD from "../../hooks/Cart/UseCart";
import useAddresses from "../../hooks/Addresses/useAddresses";
import { useOrder } from "../../hooks/Order/useOrder";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AddressModal from "./AddressModal";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const { cartItems, fetchCart, subtotal } = useCartCRUD();
  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    loading: addressesLoading,
  } = useAddresses();
  const { checkoutOrder, loading: orderLoading } = useOrder();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [notes, setNotes] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    type: "both",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "EG",
    phone: "",
    is_default_shipping: false,
    is_default_billing: false,
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultShipping = addresses.find((a) => a.is_default_shipping);
      setSelectedAddressId((defaultShipping || addresses[0])?.id || null);
    } else {
      setSelectedAddressId(null);
    }
  }, [addresses]);

  const openAddAddress = () => {
    setIsEditing(false);
    setEditingId(null);
    setAddressForm({
      name: "",
      type: "both",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "EG",
      phone: "",
      is_default_shipping: false,
      is_default_billing: false,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (address) => {
    setIsEditing(true);
    setEditingId(address.id);
    setAddressForm({
      name: address.name || "",
      type: address.type || "both",
      address_line_1: address.address_line_1 || "",
      address_line_2: address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "EG",
      phone: address.phone || "",
      is_default_shipping: !!address.is_default_shipping,
      is_default_billing: !!address.is_default_billing,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      setSavingAddress(true);
      const payload = { ...addressForm };
      if (isEditing && editingId) {
        await updateAddress(editingId, payload);
      } else {
        await addAddress(payload);
      }
      setIsAddressModalOpen(false);
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.message || t("failedToSaveAddress")
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.message || t("failedToDeleteAddress")
      );
    }
  };

  const handleBuyNow = async () => {
    if (!selectedAddressId) {
      toast.error(t("pleaseSelectAddress"));
      return;
    }

    try {
      const checkoutData = await checkoutOrder({
        shipping_address_id: selectedAddressId,
        billing_address_id: selectedAddressId,
        shipping_method_id: 1,
        coupon_code: coupon?.trim() || "",
        notes: notes?.trim() || "",
      });

      const orderData = checkoutData?.data || checkoutData;
      const orderId = orderData?.id;

      if (!orderId) {
        throw new Error("Invalid checkout response - missing order ID");
      }

      toast.success(orderData?.message || t("orderCreatedSuccessfully"));

      window.location.href = `/payment/${orderId}`;
    } catch (err) {
      console.error("Checkout error:", err);
      alert(
        err?.response?.data?.message || err?.message || t("checkoutFailed")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Meta title="Checkout" description="Complete your purchase securely on our checkout page." />
      <div className="max-w-7xl mx-auto bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Addresses, Coupon, Notes Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-[#333e2c] pb-2">
              {t("checkout")}
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("addresses")}
                </h3>
                <button
                  onClick={openAddAddress}
                  className="bg-[#333e2c] text-white px-4 py-2 hover:bg-[#586450] cursor-pointer transition-all duration-300"
                >
                  {t("addAddress")}
                </button>
              </div>

              {addressesLoading ? (
                <p className="text-gray-500">{t("loadingAddresses")}</p>
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`border -lg p-4 flex items-start gap-4 ${
                        selectedAddressId === addr.id
                          ? "border-[#333e2c]"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        className="mt-1"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{addr.name}</span>
                          {addr.is_default_shipping && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 ">
                              {t("defaultShipping")}
                            </span>
                          )}
                          {addr.is_default_billing && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 ">
                              {t("defaultBilling")}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          <div>
                            {addr.address_line_1}
                            {addr.address_line_2
                              ? `, ${addr.address_line_2}`
                              : ""}
                          </div>
                          <div>
                            {addr.city}
                            {addr.state ? `, ${addr.state}` : ""}{" "}
                            {addr.postal_code}
                          </div>
                          <div>{addr.country}</div>
                          <div>{addr.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditAddress(addr)}
                          className="text-[#333e2c] hover:underline cursor-pointer transition-all duration-300"
                        >
                          {t("edit")}
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-600 hover:underline cursor-pointer transition-all duration-300"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`bg-yellow-50 border border-yellow-200 p-4 flex flex-col items-start`}
                >
                  <p className="text-yellow-800 mb-2">
                    {t("noAddressesFound")}
                  </p>
                  <button
                    onClick={openAddAddress}
                    className="bg-[#333e2c] text-white px-4 py-2  hover:bg-[#586450] cursor-pointer transition-all duration-300"
                  >
                    {t("addYourFirstAddress")}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("coupon")}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 -lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t("enterCouponCode")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("notes")}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 -lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("orderInstructions")}
                  />
                </div>
              </div>

              <button
                disabled={orderLoading}
                onClick={handleBuyNow}
                className={`${
                  orderLoading
                    ? "bg-[#333e2c] cursor-not-allowed"
                    : "bg-[#333e2c] hover:bg-[#586450] cursor-pointer"
                } text-white font-bold py-3 px-8 transition duration-300 transform hover:scale-105 mt-2 flex items-center justify-center gap-2`}
              >
                {orderLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent -full animate-spin"></div>
                ) : (
                  t("checkout")
                )}
              </button>
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="bg-gray-100 p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#333e2c] pb-2">
              {t("summary")}
            </h3>
            {cartItems && cartItems.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-4 border-b pb-4"
                    >
                      <img
                        src={item.product.primary_image_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover -md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {t("quantity")}: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("price")}: {item.unit_price} KWD
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {t("total")}: {item.unit_price * item.quantity} KWD
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 text-right space-y-2 text-gray-700">
                  <div className="text-lg">
                    {t("total")}: {subtotal} KWD
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">{t("yourCartIsEmpty")}</p>
            )}
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        isEditing={isEditing}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        onSave={handleSaveAddress}
        savingAddress={savingAddress}
      />
    </div>
  );
};

export default CheckOut;
