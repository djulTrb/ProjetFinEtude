import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'phosphor-react';

export default function PasswordSection() {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      setError(t('validation.passwordLength'));
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('validation.passwordMismatch'));
      return;
    }
    // Here you would typically dispatch an action to update the password
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <Lock size={24} className="text-blue-600 mr-2 sm:mr-3" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">{t('settings.password.title')}</h2>
      </div>
      
      {isChangingPassword ? (
        <form onSubmit={handlePasswordUpdate} className="ml-7 sm:ml-9">
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t('settings.password.current')}
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t('settings.password.new')}
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t('settings.password.confirm')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700"
            >
              {t('settings.password.change')}
            </button>
            <button
              type="button"
              onClick={() => setIsChangingPassword(false)}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-gray-300"
            >
              {t('settings.password.cancel')}
            </button>
          </div>
        </form>
      ) : (
        <div className="ml-7 sm:ml-9">
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            {t('settings.password.description')}
          </p>
          <button
            onClick={() => setIsChangingPassword(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700"
          >
            {t('settings.password.change')}
          </button>
        </div>
      )}
    </div>
  );
} 