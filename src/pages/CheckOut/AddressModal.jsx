import { X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const AddressModal = ({
  isOpen,
  onClose,
  isEditing,
  addressForm,
  setAddressForm,
  onSave,
  savingAddress,
  countries,
  countryLoading,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white w-full max-w-lg md:max-w-4xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-2xl font-semibold">
            {isEditing ? t("editAddress") : t("addAddress")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-200 p-2 rounded transition-all duration-300 cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("name")} *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.name}
              onChange={(e) =>
                setAddressForm({ ...addressForm, name: e.target.value })
              }
              placeholder="Home / Office"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("type")} *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.type}
              onChange={(e) =>
                setAddressForm({ ...addressForm, type: e.target.value })
              }
            >
              <option value="billing">Billing</option>
              <option value="shipping">Shipping</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Address Line 1 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("addressLine1")} *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.address_line_1}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  address_line_1: e.target.value,
                })
              }
              placeholder="123 Main Street"
            />
          </div>

          {/* Address Line 2 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("addressLine2")}
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.address_line_2}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  address_line_2: e.target.value,
                })
              }
              placeholder={t("apartmentSuite")}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("city")} *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("state")}
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("postalCode")}
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.postal_code}
              onChange={(e) =>
                setAddressForm({ ...addressForm, postal_code: e.target.value })
              }
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("country")} *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.country}
              onChange={(e) =>
                setAddressForm({ ...addressForm, country: e.target.value })
              }
            >
              {countryLoading ? (
                <option disabled>Loading...</option>
              ) : (
                <>
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("phone")} *
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              placeholder="01012345678"
            />
          </div>

          {/* Default checkboxes */}
          <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={addressForm.is_default_shipping}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    is_default_shipping: e.target.checked,
                  })
                }
              />
              <span className="text-sm">{t("useAsDefaultShipping")}</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
          <button
            className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className={`w-full md:w-auto px-4 py-2 text-white rounded-lg transition-all duration-300 ${
              savingAddress
                ? "bg-[#333e2c] opacity-80"
                : "bg-[#333e2c] hover:bg-[#586450]"
            }`}
            onClick={onSave}
            disabled={savingAddress}
          >
            {savingAddress
              ? t("saving")
              : isEditing
              ? t("updateAddress")
              : t("saveAddress")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
