import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "../store/slices/sidebarSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  Megaphone,
  ChatCircle,
  Calendar,
  Gear,
  CaretLeft,
  CaretRight,
  X,
  User,
  Bell,
} from "phosphor-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  // Check if screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { 
      path: "/", 
      icon: House, 
      label: t('tableauDeBord.dashboard'),
      roles: ['doctor']
    },
    { 
      path: "/annonces", 
      icon: Megaphone, 
      label: t('nav.announcements'),
      roles: ['doctor', 'patient']
    },
    { 
      path: "/messagerie", 
      icon: ChatCircle, 
      label: t('nav.messages'),
      roles: ['doctor', 'patient']
    },
    { 
      path: "/agenda", 
      icon: Calendar, 
      label: t('nav.calendar'),
      roles: ['doctor', 'patient']
    },
    { 
      path: "/demandes-rdv", 
      icon: Bell, 
      label: t('appointmentRequests.title'),
      roles: ['doctor']
    },
    { 
      path: "/parametres", 
      icon: Gear, 
      label: t('settings.title'),
      roles: ['doctor', 'patient']
    },
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role.toLowerCase())
  );

  // For mobile, render a full overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => dispatch(setSidebarOpen(false))}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50"
            >
              {/* User profile section for mobile */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center overflow-hidden">
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
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t('common.greeting')}, {user.name}</p>
                    <p className="text-xs text-gray-600">{t(`roles.${user.role.toLowerCase()}`)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end p-2">
                <button
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X weight="bold" className="text-gray-600" />
                </button>
              </div>
              
              <div className="flex flex-col h-full">
                <div className="flex-1 py-2">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => dispatch(setSidebarOpen(false))}
                        className={`flex items-center px-4 py-3 mb-1 transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div 
                          className={`p-1.5 rounded-lg relative left-0.5 ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
                        >
                          <Icon
                            weight={isActive ? "fill" : "regular"}
                            className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
                          />
                        </div>
                        <span className="ml-3 whitespace-nowrap font-medium">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // For desktop, render the normal sidebar
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? "240px" : "70px" }}
      className="h-full bg-white shadow-lg border-r border-gray-200 relative"
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => dispatch(setSidebarOpen(!isOpen))}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md z-10 border border-gray-200 hover:bg-gray-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <CaretLeft size={14} className="text-gray-600" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <CaretRight size={14} className="text-gray-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex flex-col h-full">
        <div className="flex-1 py-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
          <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 mb-1 transition-colors overflow-hidden
                  ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}
                `}
              >
                <div 
                  className={`
                    flex-shrink-0 p-1.5 rounded-lg relative left-0.5
                    ${isActive ? "bg-blue-100" : "bg-gray-100"}
                  `}
                >
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
              />
            </div>
                {isOpen && (
                  <span className="ml-3 text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
          </Link>
            );
          })}
        </div>
            </div>
    </motion.div>
  );
}