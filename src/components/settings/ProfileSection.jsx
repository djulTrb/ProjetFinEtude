import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateProfile } from '../../store/slices/userSlice';
import { User, Camera, UserCircle } from 'phosphor-react';

export default function ProfileSection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        avatar: file,
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile({
      name: profileData.name,
      email: profileData.email,
      avatar: avatarPreview,
    }));
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center mb-4">
        <User size={24} className="text-blue-600 mr-2 sm:mr-3" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">{t('settings.profile.title')}</h2>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleProfileUpdate} className="ml-7 sm:ml-9">
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t('settings.profile.photo')}
            </label>
            <div className="flex items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3 sm:mr-4">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle size={32} className="text-gray-400" />
                )}
              </div>
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center">
                <Camera size={16} className="mr-2" />
                <span className="text-xs sm:text-sm">{t('settings.profile.change')}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t('settings.profile.name')}
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t('settings.profile.email')}
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700"
            >
              {t('settings.profile.save')}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-gray-300"
            >
              {t('settings.profile.cancel')}
            </button>
          </div>
        </form>
      ) : (
        <div className="ml-7 sm:ml-9">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3 sm:mr-4">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle size={32} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-800">{profileData.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{profileData.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700"
          >
            {t('settings.profile.edit')}
          </button>
        </div>
      )}
    </div>
  );
} 