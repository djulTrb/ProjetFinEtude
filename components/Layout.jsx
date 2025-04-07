import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationsModal from "./NotificationsModal";
import { List, House, Megaphone, ChatCircle, Calendar, Gear } from "phosphor-react";

export default function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nouvelle demande de rendez-vous", time: "Il y a 2 heures" },
    { id: 2, message: "Réponse du médecin reçue", time: "Il y a 5 heures" },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      if (window.innerWidth < 800) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-quicksand">
      {/* Header */}
      <Header onShowNotifications={() => setShowNotifications(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <List weight="bold" className="w-6 h-6 text-gray-600" />
          </button>
        )}

        {/* Sidebar Navigation */}
        <div className={`${isMobile ? 'fixed inset-0 z-40' : 'relative'} ${!isOpen && isMobile ? 'hidden' : ''}`}>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Overlay for mobile */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 ${isOpen ? 'ml-0' : 'ml-0'}`}>
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