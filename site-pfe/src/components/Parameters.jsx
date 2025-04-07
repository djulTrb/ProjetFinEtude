import { useTranslation } from 'react-i18next';
import LanguageDropdown from './settings/LanguageDropdown';
import ProfileSection from './settings/ProfileSection';
import PasswordSection from './settings/PasswordSection';
import DisconnectSection from './settings/DisconnectSection';

export default function Parameters() {
  const { t } = useTranslation();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">{t('settings.title')}</h1>
      
      <LanguageDropdown />
      <ProfileSection />
      <PasswordSection />
      <DisconnectSection />
    </div>
  );
} 