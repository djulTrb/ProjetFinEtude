import { User, Bell, List } from "phosphor-react";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setSidebarOpen } from '../store/slices/sidebarSlice';

export default function Header({ onShowNotifications }) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const isDoctor = user.role?.toLowerCase() === 'doctor';

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!isSidebarOpen));
  };

  return (
    <header className="bg-white border-b border-gray-200 z-40">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Mobile menu button - only visible below 800px */}
          <button
            onClick={toggleSidebar}
            className="min-[800px]:hidden p-2 hover:bg-gray-100/60 rounded-full"
          >
            <List weight="bold" className="text-gray-600 text-xl" />
          </button>
          
          {/* User profile - only visible above 800px */}
          <div className="hidden min-[800px]:flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User weight="duotone" className="text-white text-xl" />
              )}
            </div>
            <div className="text-right">
              {isDoctor ? (
                <p className="text-sm font-medium text-gray-800">Médecin</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-800">{t('common.greeting')}, {user.name}</p>
                  <p className="text-xs text-gray-600">{t(`roles.${user.role?.toLowerCase()}`)}</p>
                </>
              )}
            </div>
          </div>

          {/* Notification bell - only visible for doctors */}
          {isDoctor && (
            <button
              onClick={onShowNotifications}
              className="p-2 hover:bg-gray-100/60 rounded-full relative"
            >
              <Bell weight="bold" className="text-gray-600 text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
