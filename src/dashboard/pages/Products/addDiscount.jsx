import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ring } from "ldrs";
ring.register();

const AddDiscount = ({ isOpen, onClose, onSubmit, t, loading }) => {
  const [form, setForm] = useState({
    on_sale: true,
    discount_type: "percentage",
    discount_value: "",
    sale_starts_at: "",
    sale_ends_at: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(
      Object.entries(form).filter(([k, v]) => v !== "")
    );
    onSubmit(data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-600">
                {t("add_discount")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors rounded-full p-2 focus:outline-none hover:bg-gray-100 cursor-pointer"
                disabled={loading}
                aria-label={t("cancel")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {/* On Sale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("on_sale")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="on_sale"
                    checked={form.on_sale}
                    onChange={handleChange}
                    className="accent-blue-600 w-5 h-5 rounded border-gray-300"
                    id="on_sale"
                  />
                  <label
                    htmlFor="on_sale"
                    className="text-gray-600 text-sm"
                  >{`${t("on_sale")}`}</label>
                </div>
              </div>

              {/* discount_type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("discount_type")}
                </label>
                <select
                  name="discount_type"
                  value={form.discount_type}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                >
                  <option value="percentage">{t("percentage")}</option>
                  <option value="fixed_amount">{t("fixed_amount")}</option>
                </select>
              </div>

              {/* discount_value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("discount_value")}
                </label>
                <input
                  type="number"
                  name="discount_value"
                  value={form.discount_value}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                  min={0}
                  required
                  placeholder={t("discount_value")}
                />
              </div>

              {/* sale_starts_at and sale_ends_at */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sale_starts_at")}
                </label>
                <input
                  type="date"
                  name="sale_starts_at"
                  value={form.sale_starts_at}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sale_ends_at")}
                </label>
                <input
                  type="date"
                  name="sale_ends_at"
                  value={form.sale_ends_at}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                />
              </div>
            </div>
            
            {/* Submit and Cancel buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all font-medium shadow-sm"
                disabled={loading}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-[#333e2c] rounded-lg hover:bg-[#4e5a47] transition-all font-medium shadow-sm flex items-center gap-2 cursor-pointer"
                disabled={loading}
              >
                {loading && (
                  <l-ring
                    size="20"
                    stroke="3"
                    bg-opacity="0"
                    speed="2"
                    color="#fff"
                  ></l-ring>
                )}
                {loading ? t("loading") : t("save")}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddDiscount;
