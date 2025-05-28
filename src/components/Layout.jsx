import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../store/slices/sidebarSlice';
import { useTranslation } from 'react-i18next';
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const userRole = useSelector((state) => state.user.role);
  const { t, i18n } = useTranslation();

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
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
