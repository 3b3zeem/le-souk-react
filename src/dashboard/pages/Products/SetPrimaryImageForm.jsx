import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const SetPrimaryImageForm = ({
  isOpen,
  setIsOpen,
  productId,
  products,
  setPrimaryImage,
  language,
  t,
}) => {
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (product && product.images && product.primary_image_url) {
      const primaryImage = product.images.find(
        (img) => img.image_url === product.primary_image_url
      );
      if (primaryImage) {
        setSelectedImageId(primaryImage.id);
      }
    }
  }, [product]);

  const handleSetPrimary = async () => {
    if (!selectedImageId) {
      toast.error(t("select_image"));
      return;
    }
    setIsLoading(true);
    const success = await setPrimaryImage(productId, selectedImageId);
    setIsLoading(false);
    if (success) {
      setIsOpen(false);
      setSelectedImageId(null);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-500 px-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className={`absolute top-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition cursor-pointer ${
                language === "ar" ? "left-4" : "right-4"
              }`}
            >
              <X size={22} className="text-gray-500" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t("set_primary_image")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
              {product.images.length > 0 ? (
                product.images.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedImageId(image.id)}
                    className={`relative rounded-xl border-4 cursor-pointer transition-all duration-200 overflow-hidden ${
                      selectedImageId === image.id
                        ? "border-[#333e2c]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Image ${image.id}`}
                      className="w-full h-40 object-cover"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                    {image.image_url === product.primary_image_url && (
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {t("current_primary")}
                      </div>
                    )}
                    {selectedImageId === image.id && (
                      <div className="absolute inset-0 ring-4 ring-[#333e2c] transition duration-200 rounded-xl pointer-events-none"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center col-span-full">
                  {t("no_images")}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSetPrimary}
                className="px-4 py-2 bg-[#333e2c] text-white rounded-lg hover:opacity-85 flex items-center justify-center transition-all duration-200 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <l-ring
                    size="20"
                    stroke="3"
                    bg-opacity="0.1"
                    speed="2"
                    color="white"
                  ></l-ring>
                ) : (
                  t("update")
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetPrimaryImageForm;
