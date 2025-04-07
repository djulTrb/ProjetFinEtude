import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Calendar, CaretLeft, CaretRight, Clock, Check, X, Plus, Lock, LockOpen } from 'phosphor-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isSameHour, setHours, getHours, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { blockDay, unblockDay, blockHour, unblockHour } from '../store/slices/appointmentsSlice';

// Mock data for appointments - in a real app, this would come from an API
const mockAppointments = [
  {
    id: 1,
    patientId: 101,
    patientName: 'Jean Dupont',
    date: '2023-06-15T10:00:00',
    status: 'pending', // pending, accepted, declined
    type: 'consultation'
  },
  {
    id: 2,
    patientId: 102,
    patientName: 'Marie Martin',
    date: '2023-06-15T14:30:00',
    status: 'accepted',
    type: 'follow-up'
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Pierre Durand',
    date: '2023-06-20T09:15:00',
    status: 'declined',
    type: 'consultation'
  }
];

// Generate hourly slots from 8 AM to 6 PM
const generateHourlySlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(hour);
  }
  return slots;
};

export default function Agenda() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { blockedTimes } = useSelector((state) => state.appointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const hourlySlots = generateHourlySlots();
  const minAppointmentDate = addDays(new Date(), 2); // Minimum date is 2 days from now

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate calendar days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get appointments for the selected date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(appointment => 
      isSameDay(parseISO(appointment.date), date) && 
      appointment.status !== 'declined'
    );
  };

  // Get appointments for a specific hour on the selected date
  const getAppointmentsForHour = (date, hour) => {
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      return isSameDay(appointmentDate, date) && 
             isSameHour(appointmentDate, setHours(date, hour)) && 
             appointment.status !== 'declined';
    });
  };

  // Navigate to previous month/day
  const goToPrevious = () => {
    if (selectedDate) {
      setSelectedDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 1);
        return newDate;
      });
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  // Navigate to next month/day
  const goToNext = () => {
    // Limit to 3 months in the future
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      if (nextDay <= maxDate) {
        setSelectedDate(nextDay);
      }
    } else {
      const nextMonth = addMonths(currentDate, 1);
      if (nextMonth <= maxDate) {
        setCurrentDate(nextMonth);
      }
    }
  };

  // Handle date selection
  const handleDateClick = (date) => {
    // Only allow selecting dates from today to 3 months in the future
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    if (date >= today && date <= maxDate) {
      setSelectedDate(date);
    }
  };

  // Format time for display
  const formatAppointmentTime = (dateString) => {
    return format(parseISO(dateString), 'HH:mm');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get day name in current language with mobile optimization
  const getDayName = (date, isMobile = false) => {
    const dayIndex = date.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = t(`agenda.days.${days[dayIndex]}`);
    
    // Remove "ال" prefix for Arabic on mobile
    if (isMobile && i18n.language === 'ar') {
      return dayName.replace('ال', '');
    }
    return dayName;
  };

  // Get month name in current language
  const getMonthName = (date) => {
    const monthIndex = date.getMonth();
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    return t(`agenda.months.${months[monthIndex]}`);
  };

  // Get status text in current language
  const getStatusText = (status) => {
    return t(`agenda.status.${status}`);
  };

  // Check if a day is blocked
  const isDayBlocked = (date) => {
    return blockedTimes.days.includes(format(date, 'yyyy-MM-dd'));
  };

  // Check if an hour is blocked
  const isHourBlocked = (date, hour) => {
    return blockedTimes.hours.some(
      block => block.date === format(date, 'yyyy-MM-dd') && block.hour === hour
    );
  };

  // Handle blocking/unblocking a day
  const handleDayBlock = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (isDayBlocked(date)) {
      dispatch(unblockDay(formattedDate));
    } else {
      dispatch(blockDay(formattedDate));
    }
  };

  // Handle blocking/unblocking an hour
  const handleHourBlock = (date, hour) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (isHourBlocked(date, hour)) {
      dispatch(unblockHour({ date: formattedDate, hour }));
    } else {
      dispatch(blockHour({ date: formattedDate, hour }));
    }
  };

  // Render the month view
  const renderMonthView = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const firstDayOfMonth = startOfMonth(currentDate);
    const firstDayIndex = firstDayOfMonth.getDay();
    
    return (
      <div className="grid grid-cols-7 gap-1 overflow-x-auto">
        {/* Day headers */}
        {days.map((day, index) => (
          <div key={day} className="text-center font-medium text-gray-600 py-2 text-xs sm:text-sm">
            {isMobile ? getDayName(new Date(firstDayOfMonth.getTime() + index * 24 * 60 * 60 * 1000), true) : t(`agenda.days.${day}`)}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isPast = day < minAppointmentDate;
          const isFuture = day > new Date(new Date().setMonth(new Date().getMonth() + 3));
          const isBlocked = isDayBlocked(day);
          
          return (
            <div 
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg relative
                ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
                ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                ${isFuture ? 'opacity-50 cursor-not-allowed' : ''}
                ${isBlocked ? 'bg-red-50' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`font-medium text-xs sm:text-sm ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                {user.role.toLowerCase() === 'doctor' && !isPast && !isFuture && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayBlock(day);
                    }}
                    className={`p-1 rounded-full ${isBlocked ? 'text-red-600 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    {isBlocked ? <Lock size={14} /> : <LockOpen size={14} />}
                  </button>
                )}
              </div>
              
              {/* Appointments for this day */}
              <div className="mt-1 sm:mt-2 space-y-1">
                {dayAppointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className={`text-xs p-1 rounded ${getStatusColor(appointment.status)}`}
                  >
                    <div className="flex items-center">
                      <Clock size={10} className="mr-1" />
                      <span className="text-[10px] sm:text-xs">{formatAppointmentTime(appointment.date)}</span>
                    </div>
                    <div className="truncate text-[10px] sm:text-xs">{appointment.patientName}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Block Modal
  const renderBlockModal = () => {
    if (!selectedDate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Manage Time Blocks</h3>
          
          <div className="space-y-4">
            {hourlySlots.map(hour => {
              const isBlocked = isHourBlocked(selectedDate, hour);
              return (
                <div key={hour} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    {`${hour}:00 - ${hour + 1}:00`}
                  </span>
                  <button
                    onClick={() => handleHourBlock(selectedDate, hour)}
                    className={`p-2 rounded-full ${
                      isBlocked ? 'text-red-600 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {isBlocked ? <Lock size={18} /> : <LockOpen size={18} />}
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setShowBlockModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 bg-white border-b">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">{t('agenda.title')}</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={goToPrevious}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
          >
            <CaretLeft size={20} />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            {getMonthName(currentDate)}
          </h2>
          <button 
            onClick={goToNext}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
          >
            <CaretRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar content */}
      <div className="flex-1 p-2 sm:p-4 overflow-auto">
        {renderMonthView()}
      </div>

      {/* Block Modal */}
      {showBlockModal && renderBlockModal()}

      {/* Appointment Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t('agenda.appointmentDetails')}</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('agenda.patient')}</p>
                <p className="font-medium text-sm sm:text-base">{selectedAppointment.patientName}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('agenda.date')}</p>
                <p className="font-medium text-sm sm:text-base">
                  {`${getDayName(parseISO(selectedAppointment.date))} ${format(parseISO(selectedAppointment.date), 'd')} ${getMonthName(parseISO(selectedAppointment.date))} ${format(parseISO(selectedAppointment.date), 'yyyy')}`}
                </p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('agenda.time')}</p>
                <p className="font-medium text-sm sm:text-base">{formatAppointmentTime(selectedAppointment.date)}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('agenda.type')}</p>
                <p className="font-medium text-sm sm:text-base capitalize">{t(`agenda.appointmentTypes.${selectedAppointment.type}`)}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('agenda.status')}</p>
                <p className={`font-medium text-sm sm:text-base capitalize ${getStatusColor(selectedAppointment.status)} inline-block px-2 py-1 rounded`}>
                  {getStatusText(selectedAppointment.status)}
                </p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 flex justify-end">
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs sm:text-sm"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 