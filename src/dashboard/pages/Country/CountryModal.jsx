import React from "react";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

const CountryModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  editingId,
  loading,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [lang, field] = name.split(".");
      setFormData({
        ...formData,
        [lang]: { ...formData[lang], [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">
          {editingId ? "Edit Country" : "Add Country"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="border border-gray-200 p-2 w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block">English Name</label>
            <input
              type="text"
              name="en.name"
              value={formData.en.name}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block">Arabic Name</label>
            <input
              type="text"
              name="ar.name"
              value={formData.ar.name}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            {loading ? (
              <button
                type="submit"
                className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                <Ring
                  size="20"
                  stroke="3"
                  bgOpacity="0"
                  speed="2"
                  color="white"
                />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {editingId ? "Update" : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountryModal;
