import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const UserDetails = ({
  isModalOpen,
  closeModal,
  language,
  t,
  modalLoading,
  selectedUser,
  handleEdit,
}) => (
  <AnimatePresence>
    {isModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 overflow-y-auto bg-opacity-50 z-500 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white  rounded-2xl shadow-2xl w-full max-w-2xl p-8 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-2xl font-semibold text-[#333e2c]">
              {t("User Details")}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4">
            {modalLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#333e2c]"></div>
                <span className="ml-2 text-sm text-[#333e2c]">
                  {t("loading") || "Loading..."}
                </span>
              </div>
            ) : selectedUser ? (
              <div className="space-y-4">
                {/* User Avatar and Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => (e.target.src = "/user.png")}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("ID")}: {selectedUser.id}
                    </p>
                  </div>
                </div>

                {/* User Info Grid */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-[#333e2c]">
                      {t("email") || "Email"}
                    </span>
                    <span className="text-sm font-medium">
                      {selectedUser.email}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      {t("phone") || "Phone"}
                    </span>
                    <span className="text-sm font-medium">
                      {selectedUser.phone || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      {t("email_verification") || "Email Status"}
                    </span>
                    <span
                      className={`  font-medium px-2 py-1 rounded text-xs ${
                        selectedUser.email_verification_status != "Verified" &&
                        selectedUser.email_verification_status != "مؤكد"
                          ? "bg-red-100 text-red-800"
                          : " bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedUser.email_verification_status || "Not Verified"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      {t("admin_status") || "Admin Status"}
                    </span>
                    <span
                      className={` font-medium px-2 py-1 rounded text-xs ${
                        selectedUser.admin_status_text === "Admin" ||
                        selectedUser.admin_status_text === "مدير"
                          ? "bg-[#e8e4dd] text-[#333e2c]"
                          : "bg-gray-100 text-[gray-800]"
                      }`}
                    >
                      {selectedUser.admin_status_text || "user"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      {t("orders_count") || "Orders"}
                    </span>
                    <span className="text-sm font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded">
                      {selectedUser.orders_count || 0} {t("orders") || "orders"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-[#333e2c]">
                  {t("no_user_data") || "No user data available"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default UserDetails;
