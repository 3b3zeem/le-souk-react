import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta/Meta";
import useCartCRUD from "../../hooks/Cart/UseCart";
import usePayment from "../../hooks/CheckOut/useCheckOut";

const CheckOut = () => {
  const { sendPayment } = usePayment();
  const { cartItems, fetchCart, finalTotal, subtotal } = useCartCRUD();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [townCity, setTownCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("US");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleBuyNow = async () => {
    setLoading(true);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !streetAddress ||
      !townCity ||
      !zipCode ||
      !country ||
      !state
    ) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    try {
      const data = await sendPayment({
        name: fullName,
        email,
        phone,
        cartItems,
        subtotal,
        streetAddress,
        townCity,
        zipCode,
        country,
        state,
      });

      if (data.IsSuccess) {
        window.location.href = data.Data.InvoiceURL;
      } else {
        alert("Payment error: " + data.Message);
      }
    } catch (err) {
      alert("Unexpected error occurred.", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Meta title="Checkout" />
      <div className="max-w-7xl mx-auto bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Form Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-[#333e2c] pb-2">
              Checkout
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ahmed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mostafa"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={townCity}
                    onChange={(e) => setTownCity(e.target.value)}
                    placeholder="Cairo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Cairo"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="KW">Kuwait (KW)</option>
                    <option value="EG">Egypt (EG)</option>
                    <option value="SA">Saudi Arabia (SA)</option>
                    <option value="AE">United Arab Emirates (AE)</option>
                    <option value="QA">Qatar (QA)</option>
                    <option value="BH">Bahrain (BH)</option>
                    <option value="OM">Oman (OM)</option>
                    <option value="JO">Jordan (JO)</option>
                    <option value="LB">Lebanon (LB)</option>
                    <option value="SY">Syria (SY)</option>
                    <option value="IQ">Iraq (IQ)</option>
                    <option value="PS">Palestine (PS)</option>
                    <option value="YE">Yemen (YE)</option>
                    <option value="SD">Sudan (SD)</option>
                    <option value="MA">Morocco (MA)</option>
                    <option value="DZ">Algeria (DZ)</option>
                    <option value="TN">Tunisia (TN)</option>
                    <option value="LY">Libya (LY)</option>
                    <option value="MR">Mauritania (MR)</option>
                    <option value="DJ">Djibouti (DJ)</option>
                    <option value="SO">Somalia (SO)</option>
                    <option value="KM">Comoros (KM)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#333e2c] focus:border-[#333e2c] focus-within:outline-none transition duration-300"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="50000000"
                  required
                />
              </div>
              <button
                disabled={loading}
                onClick={handleBuyNow}
                className={`w-full ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-[#333e2c] hover:bg-[#333e2c]"
                } text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 mt-4`}
              >
                {loading ? (
                  <span className="ml-2 spinner-border spinner-border-sm"></span>
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="bg-gray-100 p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#333e2c] pb-2">
              Cart Summary
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
                        src={
                          item.product.primary_image_url
                        }
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Unit Price: {item.unit_price} KWD
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          Total: {item.unit_price * item.quantity} KWD
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 text-right space-y-2 text-gray-700">
                  <div className="text-lg">Subtotal: {subtotal} KWD</div>
                  <div className="text-xl font-bold">
                    Total: {finalTotal} KWD
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Cart is empty.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
