import { useState } from "react";
import useUsers from "../../hooks/User/useUsers";
import { useSearchParams } from "react-router-dom";
import { Edit, Search, Trash2, SquareChartGantt, X, User, Mail, Calendar, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

import Meta from "../../../components/Meta/Meta";

const Users = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const { users, toggleAdminStatus, loading, error, totalPages, search, page, status, deleteUser, getUserById } = useUsers();

  const updateSearchParams = (newParams) => {
    const params = {};
    if (newParams.page) params.page = newParams.page.toString();
    if (newParams.search) params.search = newParams.search;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    updateSearchParams({ search: e.target.value, page: 1, status });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ search, page: newPage, status });
  };

  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await toggleAdminStatus(userId);
    } catch (error) {
      console.error("Error toggling admin status:", error);
    }
  };

  const getUserdetails = async (userId) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setSelectedUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Modal Component
  const UserModal = () => (
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
                {t("User Details") }
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {modalLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#333e2c]"></div>
                  <span className="ml-2 text-sm text-[#333e2c]">{t("loading") || "Loading..."}</span>
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
                      <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-500">ID: #{selectedUser.id}</p>
                    </div>
                  </div>

                  {/* User Info Grid */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-[#333e2c]">{t("email") || "Email"}</span>
                      <span className="text-sm font-medium">{selectedUser.email}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{t("phone") || "Phone"}</span>
                      <span className="text-sm font-medium">{selectedUser.phone || "-"}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{t("email_verification") || "Email Status"}</span>
                      <span className={`  font-medium px-2 py-1 rounded text-xs ${
                        selectedUser.email_verification_status === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.email_verification_status || "unverified"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{t("admin_status") || "Admin Status"}</span>
                      <span className={` font-medium px-2 py-1 rounded text-xs ${
                        selectedUser.admin_status_text === 'admin' || selectedUser.admin_status_text === 'super_admin'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.admin_status_text || "user"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">{t("orders_count") || "Orders"}</span>
                      <span className="text-sm font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded">
                        {selectedUser.orders_count || 0} {t("orders") || "orders"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-[#333e2c]">{t("no_user_data") || "No user data available"}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 p-4 border-t">
              <button
                onClick={closeModal}
                className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                {t("close") || "Close"}
              </button>
              {selectedUser && (
                <button
                  onClick={() => handleEdit(selectedUser.id)}
                  className="flex-1 px-3 py-2 text-md bg-[#333e2c] text-white rounded hover:bg-[#2a3325] transition-colors"
                >
                  {t("edit") || "Edit"}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className="min-h-screen bg-gray-50 p-1 sm:p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Meta
        title="Users Management"
        description="Manage your users effectively with our dashboard."
      />
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {t("users")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          {t("manage_users")}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_users")}
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`w-[190px] sm:w-full focus:w-full ${
                language === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 placeholder:text-gray-400`}
            />
            <span
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                language === "ar" ? "right-3" : "left-3"
              }`}
            >
              <Search size={17} className="text-gray-500" />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-auto">
            <button className="w-auto px-4 py-2 bg-[#333e2c] text-white rounded customEffect cursor-pointer text-sm">
              <span>{t("add_user")}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">{t("loading")}</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users?.length === 0 ? (
          <p className="text-center text-gray-600">{t("no_users")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    {t("id")}
                  </th>
                  <th className="p-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    {t("name")}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("admin_status") || "Admin Status"}
                  </th>
                    <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("change_status") || "Admin Status"}
                  </th>
                  <th className="p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs sm:text-sm text-gray-600">
                      {user.id}.
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={user?.image}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        onError={(e) => (e.target.src = "/user.png")}
                      />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-800">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center">
                    
                        <span className={`ml-2 text-xs font-medium px-2 py-1 rounded ${
                          user?.admin_status_text === "Admin" || user?.admin_status_text === 'super_admin'
                            ? 'bg-[#e8e4dd] text-[#333e2c]'
                            : 'bg-gray-100 text-[gray-800]'
                        }`}>
                          {user?.admin_status_text || "user"}
                        </span>

                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center items-center">
                              <button
                      onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333c2e] ${
                        user.is_admin ? "bg-[#333e2c]" : "bg-gray-300"
                      }`}
                      title={`${t("toggle_admin_status") || "Toggle Admin Status"}: ${user.is_admin ? "Admin" : "User"}`}
                      >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
                          user.is_admin ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                      </button>


                      </div>
                  
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(user?.id)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                          title={t("edit")}
                        >
                          <Edit size={14} />
                          <span className="hidden sm:inline font-medium">
                            {t("edit")}
                          </span>
                        </button>

                        <button
                          onClick={() => getUserdetails(user?.id)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                          title={t("view")}
                        >
                          <SquareChartGantt size={14} />
                          <span className="hidden sm:inline font-medium">
                            {t("view")}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(user?.id)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
                          title={t("delete")}
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline font-medium">
                            {t("delete")}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 text-sm">
            <p className="text-gray-600 text-center sm:text-left">
              {t("showing_users", {
                start: (page - 1) * 5 + 1,
                end: Math.min(page * 5, users.length + (page - 1) * 5),
                total: users.length + (page - 1) * 5,
              })}
            </p>
            <div className="flex gap-1 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 border rounded-lg ${
                    page === index + 1 ? "bg-[#333e2c] text-white" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal />
    </div>
  );
};

export default Users;