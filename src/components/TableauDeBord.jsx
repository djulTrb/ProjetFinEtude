import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const TableauDeBord = () => {
  const { t } = useTranslation();

  // Mock data - Replace with real data from your backend
  const stats = {
    totalAppointments: 324,
    upcomingAppointments: 45,
    totalAccounts: 1245,
    totalAnnouncements: 56,
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">{t('tableauDeBord.dashboard')}</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('tableauDeBord.totalAppointments')}</h3>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-1 sm:mt-2">{stats.totalAppointments}</p>
          <div className="flex items-center mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm text-blue-500">{t('tableauDeBord.allAppointments')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('tableauDeBord.upcomingAppointments')}</h3>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-1 sm:mt-2">{stats.upcomingAppointments}</p>
          <div className="flex items-center mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm text-green-500">{t('tableauDeBord.upcoming')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('tableauDeBord.totalAccounts')}</h3>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-1 sm:mt-2">{stats.totalAccounts}</p>
          <div className="flex items-center mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm text-purple-500">{t('tableauDeBord.createdAccounts')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('tableauDeBord.totalAnnouncements')}</h3>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-1 sm:mt-2">{stats.totalAnnouncements}</p>
          <div className="flex items-center mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm text-rose-500">{t('tableauDeBord.publishedAnnouncements')}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TableauDeBord; 