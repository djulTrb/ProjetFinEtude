import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const TableauDeBord = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalAccounts: 0,
    totalAnnouncements: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const { count: appointmentsCount, error: appointmentsError } = await supabase
          .from('rendez_vous')
          .select('*', { count: 'exact', head: true });

        if (appointmentsError) throw appointmentsError;

        const { count: accountsCount, error: accountsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (accountsError) throw accountsError;

        const { count: announcementsCount, error: announcementsError } = await supabase
          .from('annonces')
          .select('*', { count: 'exact', head: true });

        if (announcementsError) throw announcementsError;

        setStats({
          totalAppointments: appointmentsCount || 0,
          totalAccounts: accountsCount || 0,
          totalAnnouncements: announcementsCount || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">{t('tableauDeBord.dashboard')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">{t('tableauDeBord.dashboard')}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">{t('tableauDeBord.dashboard')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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