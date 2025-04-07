import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../store/slices/sidebarSlice';
import { useTranslation } from 'react-i18next';
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationsModal from "./NotificationsModal";

export default function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const { t, i18n } = useTranslation();
  
  // Get notifications based on current language
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: i18n.language === 'fr' 
        ? "Nouvelle demande de rendez-vous" 
        : "طلب موعد جديد",
      time: i18n.language === 'fr' 
        ? "Il y a 2 heures" 
        : "قبل ساعتين",
    },
    { 
      id: 2, 
      message: i18n.language === 'fr' 
        ? "Réponse du médecin reçue" 
        : "تم استلام رد من الطبيب", 
      time: i18n.language === 'fr' 
        ? "Il y a 5 heures" 
        : "قبل 5 ساعات" 
    },
  ]);

  // Update notifications when language changes
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        message: i18n.language === 'fr' 
          ? "Nouvelle demande de rendez-vous" 
          : "طلب موعد جديد",
        time: i18n.language === 'fr' 
          ? "Il y a 2 heures" 
          : "قبل ساعتين",
      },
      { 
        id: 2, 
        message: i18n.language === 'fr' 
          ? "Réponse du médecin reçue" 
          : "تم استلام رد من الطبيب", 
        time: i18n.language === 'fr' 
          ? "Il y a 5 heures" 
          : "قبل 5 ساعات" 
      },
    ]);
  }, [i18n.language]);

  // Check if screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 800;
      setIsMobile(mobile);
      if (mobile) {
        dispatch(setSidebarOpen(false));
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-quicksand">
      {/* Header */}
      <Header onShowNotifications={() => setShowNotifications(!showNotifications)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        show={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </div>
  );
}
