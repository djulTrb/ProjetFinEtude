import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateProfile } from '../../store/slices/userSlice';
import { User, Camera, UserCircle, X } from 'phosphor-react';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';

export default function ProfileSection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [profileData, setProfileData] = useState({
    name: user.name,
    avatar: user.avatar,
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // Max file size 1MB
      maxWidthOrHeight: 500, // Max width/height 500px
      useWebWorker: true, // Use web worker for better performance
      fileType: 'image/jpeg', // Convert to JPEG for better compression
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error(t('validation.compressionError'));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({
          ...errors,
          avatar: t('validation.fileTooLarge'),
        });
        return;
      }
      
      setIsCompressing(true);
      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Convert compressed file to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setProfileData({
            ...profileData,
            avatar: base64String,
          });
          setAvatarPreview(base64String);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setErrors({
          ...errors,
          avatar: error.message || t('validation.compressionError'),
        });
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveAvatar = () => {
    setProfileData({
      ...profileData,
      avatar: null,
    });
    setAvatarPreview(null);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('No user found');
      }

      // Update user info in infoUtilisateur table
      const { error: updateError } = await supabase
        .from('infoUtilisateur')
        .update({
          full_name: profileData.name,
          avatar: profileData.avatar
        })
        .eq('idUser', currentUser.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error('Failed to update profile information');
      }

      // Update Redux store
      dispatch(updateProfile({
        name: profileData.name,
        email: user.email,
        avatar: profileData.avatar,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({
        submit: error.message || t('settings.profile.updateError'),
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3 sm:mr-4">
                {avatarPreview ? (
                  <>
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <UserCircle size={32} className="text-gray-400" />
                )}
              </div>
              <label className={`cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Camera size={16} className="mr-2" />
                <span className="text-xs sm:text-sm">
                  {isCompressing ? t('settings.profile.compressing') : t('settings.profile.change')}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden"
                  disabled={isCompressing}
                />
              </label>
            </div>
            {errors.avatar && (
              <p className="mt-1 text-xs text-red-500">{errors.avatar}</p>
            )}
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
              className={`w-full p-2 text-sm border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          
          {errors.submit && (
            <p className="mb-4 text-xs text-red-500">{errors.submit}</p>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('common.saving') : t('settings.profile.save')}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting || isCompressing}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors w-full sm:w-auto"
          >
            {t('settings.profile.edit')}
          </button>
        </div>
      )}
    </div>
  );
} 