import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateLanguage } from '../../store/slices/userSlice';
import { Globe } from 'phosphor-react';

export default function LanguageDropdown() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: t('settings.language.french'), flag: '🇫🇷' },
    { code: 'ar', name: t('settings.language.arabic'), flag: '🇸🇦' }
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    dispatch(updateLanguage(langCode));
    setIsOpen(false);
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Globe size={24} className="text-blue-600 mr-3" />
        <h2 className="text-lg font-semibold text-gray-800">{t('settings.language.title')}</h2>
      </div>
      <div className="ml-9">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="mr-2">{selectedLanguage.flag}</span>
              <span>{selectedLanguage.name}</span>
            </div>
            <svg 
              className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full md:w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full p-3 flex items-center hover:bg-gray-50 ${
                    currentLang === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {t('settings.language.description')}
        </p>
      </div>
    </div>
  );
} 