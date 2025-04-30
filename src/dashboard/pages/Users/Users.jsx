import { useState } from "react";
import useUsers from "../../hooks/User/useUsers";
import { useSearchParams } from "react-router-dom";
import { Edit, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/Language/LanguageContext";

const Users = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, loading, error, totalPages, search, page, status } =
    useUsers();

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

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("users")}</h1>
        <p className="text-gray-600 mb-6">{t("manage_users")}</p>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={t("search_users")}
              className="w-[190px] focus:w-full pl-10 pr-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 placeholder:text-gray-400"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={17} className="text-gray-500" />
            </span>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded customEffect cursor-pointer">
              <span>{t("add_user")}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">{t("loading")}</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">{t("no_users")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    {t("id")}
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    {t("name")}
                  </th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">
                      {user.id}.
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/32")
                        }
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                          title={t("edit")}
                        >
                          <Edit size={16} />
                          <span className="text-xs font-medium">
                            {t("edit")}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all duration-200 cursor-pointer"
                          title={t("delete")}
                        >
                          <Trash2 size={16} />
                          <span className="text-xs font-medium">
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

        {/* الباجينيشن */}
        {users.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              {t("showing_users", {
                start: (page - 1) * 5 + 1,
                end: Math.min(page * 5, users.length + (page - 1) * 5),
                total: users.length + (page - 1) * 5,
              })}
            </p>
            <div className="flex gap-2">
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
                    page === index + 1 ? "bg-blue-600 text-white" : ""
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
    </div>
  );
};

export default Users;
