import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';

export default function AnnouncementCard({ announcement, onDelete }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const dayIndex = date.getDay();
    const monthIndex = date.getMonth();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    
    return `${t(`agenda.days.${days[dayIndex]}`)} ${format(date, 'd')} ${t(`agenda.months.${months[monthIndex]}`)} ${format(date, 'yyyy')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {announcement.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={announcement.image}
            alt={announcement.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800 mb-1.5">
                {announcement.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {announcement.content}
              </p>
            </div>
            <button
              onClick={() => onDelete(announcement.id)}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium shrink-0"
            >
              {t('announcements.card.delete')}
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{formatDate(announcement.date)}</span>
            <span>•</span>
            <span>{announcement.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 