import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateLanguage } from '../../store/slices/userSlice';
import { Globe } from 'phosphor-react';

export default function LanguageDropdown() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const languages = [
    { code: 'fr', name: t('settings.language.french'), flag: '🇫🇷' },
    { code: 'ar', name: t('settings.language.arabic'), flag: 'AR' }
  ];

  const initialLang = languages.some(lang => lang.code === i18n.language)
    ? i18n.language
    : languages[0].code;

  const [currentLang, setCurrentLang] = useState(initialLang);
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    dispatch(updateLanguage(langCode));
    setIsOpen(false);
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center mb-4">
        <Globe size={24} className="text-blue-600 mr-2 sm:mr-3" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">{t('settings.language.title')}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 flex items-center justify-between bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="mr-2">{selectedLanguage.flag}</span>
            <span>{selectedLanguage.name}</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
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
  );
}
