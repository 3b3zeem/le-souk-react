import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Save, X, Upload, Key, User } from 'lucide-react';
import toast from 'react-hot-toast';
import useUsers from "../../hooks/User/useUsers";
import ResetUserPassword from './ResetUserPassword';

function UserEdit({
  isModalOpen,
  closeModal,
  language,
  t,
  selectedUser,
  onUserUpdate
}) {
  const { updateUser } = useUsers();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    image: null,
    is_admin: false,
    email_verification_status: 'unverified'
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || '',
        image: null,
        is_admin: selectedUser.is_admin || false,
        email_verification_status: selectedUser.email_verification_status || 'unverified'
      });
      
      setImagePreview(selectedUser.image || null);
      setErrors({});
      setActiveTab('profile');
    }
  }, [selectedUser]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        image: null,
        is_admin: false,
        email_verification_status: 'unverified'
      });
      setImagePreview(null);
      setErrors({});
      setActiveTab('profile');
    }
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t('invalid_image_format') || 'Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('image_too_large') || 'Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(selectedUser?.image || null);
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('name_required') || 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('email_required') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalid_email') || 'Invalid email format';
    }
    
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t('invalid_phone') || 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!selectedUser?.id) {
      toast.error(t('user_not_selected') || 'No user selected');
      return;
    }
    
    setSaving(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        is_admin: formData.is_admin,
        email_verification_status: formData.email_verification_status
      };

      if (formData.image instanceof File) {
        submitData.image = formData.image;
      }

      const updatedUser = await updateUser(selectedUser.id, submitData);
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
      
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
      }
      
      if (!error.response?.data?.message) {
        toast.error(t('error_updating_user') || 'Error updating user');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordResetSuccess = () => {
    // Switch back to profile tab after successful password reset
    setActiveTab('profile');
  };

  const handleClose = () => {
    if (!saving) {
      closeModal();
      setErrors({});
    }
  };

  if (!selectedUser) {
    return null;
  }

  const tabs = [
    {
      id: 'profile',
      label: t('profile_information') || 'Profile Information',
      icon: User
    },
    {
      id: 'password',
      label: t('reset_password') || 'Reset Password',
      icon: Key
    }
  ];

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 overflow-y-auto bg-opacity-50 z-550 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {/* Tabs */}
            <div className="">
              <nav className="flex space-x-8 px-6 items-center justify-between p-6 ticky top-0 rounded-t-2xl" aria-label="Tabs">
                <div className='flex gap-2 items-center border-b border-gray-200'>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        disabled={saving}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          activeTab === tab.id
                            ? 'border-[#333e2c] text-[#333e2c]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img
                            src={imagePreview || '/user.png'}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = '/user.png';
                            }}
                          />
                          {formData.image && (
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors">
                            <Upload size={18} />
                            <span>{t('upload_image') || 'Upload New Image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={saving}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">          
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('name') || 'Name'} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={saving}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333e2c]/20 focus:border-[#333e2c] transition-colors disabled:bg-gray-100 ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('enter_name') || 'Enter name'}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                              {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('email') || 'Email'} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={saving}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333e2c]/20 focus:border-[#333e2c] transition-colors disabled:bg-gray-100 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('enter_email') || 'Enter email'}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                              {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('phone') || 'Phone'}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={saving}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333e2c]/20 focus:border-[#333e2c] transition-colors disabled:bg-gray-100 ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('enter_phone') || 'Enter phone number'}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('email_verification') || 'Email Verification'}
                          </label>
                          <select
                            name="email_verification_status"
                            value={formData.email_verification_status}
                            onChange={handleInputChange}
                            disabled={saving}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333e2c]/20 focus:border-[#333e2c] transition-colors disabled:bg-gray-100"
                          >
                            <option value="verified">{t('verified') || 'Verified'}</option>
                            <option value="unverified">{t('unverified') || 'Unverified'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-800">
                        {t('permissions') || 'Permissions'}
                      </h3>
                      
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="is_admin"
                            checked={formData.is_admin}
                            onChange={handleInputChange}
                            disabled={saving}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#333e2c]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#333e2c] peer-disabled:opacity-50"></div>
                        </label>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {t('admin_access') || 'Admin Access'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Submit Button */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={saving}
                      className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('cancel') || 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-[#333e2c] text-white rounded-lg hover:bg-[#2a3325] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>
                        {saving 
                          ? (t('saving') || 'Saving...') 
                          : (t('save_changes') || 'Save Changes')
                        }
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <ResetUserPassword
                  selectedUser={selectedUser}
                  t={t}
                  onSuccess={handlePasswordResetSuccess}
                  onCancel={handleClose}
                  disabled={saving}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserEdit;