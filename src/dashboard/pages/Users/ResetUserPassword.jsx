import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react'; 
import toast from 'react-hot-toast';
import useUsers from "../../hooks/User/useUsers";

function ResetUserPassword({ 
  selectedUser, 
  t, 
  onSuccess,
  onCancel,
  disabled = false 
}) {
  const { resetPassword } = useUsers();
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  useEffect(() => {
    if (selectedUser) {
      setPasswordData({ password: '', confirmPassword: '' });
      setPasswordErrors({});
    }
  }, [selectedUser]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.password.trim()) {
      newErrors.password = t('password_required') || 'Password is required';
    } else if (passwordData.password.length <= 6) {
      newErrors.password = t('password_min_length') || 'Password must be more than 6 characters';
    }
    
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('confirm_password_required') || 'Please confirm the password';
    } else if (passwordData.password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t('passwords_not_match') || 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    if (!selectedUser?.id) {
      toast.error(t('user_not_selected') || 'No user selected');
      return;
    }

    setResettingPassword(true);
    try {
      await resetPassword(selectedUser.id, {
        password: passwordData.password,
        password_confirmation: passwordData.confirmPassword
      });

      toast.success(t('password_reset_success') || 'Password reset successfully');
      setPasswordData({ password: '', confirmPassword: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error resetting password:', error);

      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
      }

      if (!error.response?.data?.message) {
        toast.error(t('error_resetting_password') || 'Error resetting password');
      }
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <form onSubmit={handlePasswordReset}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#e8e4dd] rounded-full">
              <Key size={20} className="text-[#333E2C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t('reset_password') || 'Reset User Password'}
              </h3>
            </div>
          </div>
          
          <div className="max-w-md space-y-4">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('new_password') || 'New Password'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  disabled={resettingPassword || disabled}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333e2c]/20 focus:border-[#333e2c] transition-colors disabled:bg-gray-100 ${
                    passwordErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enter_password') || 'Enter new password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {Array.isArray(passwordErrors.password) ? passwordErrors.password[0] : passwordErrors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {t('password_requirements') || 'Password must be more than 6 characters'}
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirm_password') || 'Confirm Password'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={resettingPassword || disabled}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333e2c]/20 focus:border-[#333e2c] transition-colors disabled:bg-gray-100 ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('confirm_password') || 'Confirm new password'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {Array.isArray(passwordErrors.confirmPassword) ? passwordErrors.confirmPassword[0] : passwordErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={resettingPassword || disabled}
          className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('cancel') || 'Cancel'}
        </button>
        <button
          type="submit"
          disabled={resettingPassword || disabled}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-[#333E2C] text-white rounded-lg hover:bg-[#20281c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resettingPassword ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Key size={16} />
          )}
          <span>
            {resettingPassword 
              ? (t('resetting_password') || 'Resetting...') 
              : (t('reset_password') || 'Reset Password')
            }
          </span>
        </button>
      </div>
    </form>
  );
}

export default ResetUserPassword;
