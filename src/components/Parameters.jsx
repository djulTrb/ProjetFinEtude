import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import LanguageDropdown from './settings/LanguageDropdown';
import ProfileSection from './settings/ProfileSection';
import PasswordSection from './settings/PasswordSection';
import DisconnectSection from './settings/DisconnectSection';

export default function Parameters() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const isDoctor = user.role.toLowerCase() === 'doctor';

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">{t('settings.title')}</h1>
      
      <div className="space-y-8">
        {/* Language Settings */}
        
         
          <LanguageDropdown />
        

        {/* Profile and Password Settings - Only visible for patients */}
        {!isDoctor && (
          <>
            
              
              <ProfileSection />
            

            
              
              <PasswordSection />
            
          </>
        )}

        {/* Disconnect Section */}
        
          <DisconnectSection />
        
      </div>
    </div>
  );
} 