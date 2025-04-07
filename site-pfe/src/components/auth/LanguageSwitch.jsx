import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateLanguage, updateUser } from '../../store/slices/userSlice';
import { Globe } from 'phosphor-react';

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
    dispatch(updateLanguage(newLang));
    
    // Update user role translation
    const currentRole = localStorage.getItem('userRole');
    if (currentRole) {
      dispatch(updateUser({ 
        role: t(`roles.${currentRole}`)
      }));
    }
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      <Globe size={20} />
      <span className="font-medium">{i18n.language === 'fr' ? 'AR' : 'FR'}</span>
    </button>
  );
};

export default LanguageSwitch; 