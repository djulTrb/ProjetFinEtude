import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Calendar, CaretLeft, CaretRight, Clock, Check, X, Plus, Lock, LockOpen, User, Note, List } from 'phosphor-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isSameHour, setHours, getHours, addDays, getMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { blockDay, unblockDay, blockHour, unblockHour } from '../store/slices/appointmentsSlice';
import { setSidebarOpen } from '../store/slices/sidebarSlice';

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

// Generate time slots from 8 AM to 6 PM with 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push({ hour, minutes: 0 });
    if (hour !== 18) { // Don't add :30 for the last hour
      slots.push({ hour, minutes: 30 });
    }
  }
  return slots;
};

// Format time slot for display
const formatTimeSlot = (slot) => {
  return `${String(slot.hour).padStart(2, '0')}:${String(slot.minutes).padStart(2, '0')}`;
};

export default function Agenda() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { blockedTimes } = useSelector((state) => state.appointments);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinutes, setSelectedMinutes] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasActiveAppointment, setHasActiveAppointment] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isStacked, setIsStacked] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 800);
  const timeSlots = generateTimeSlots();
  const minAppointmentDate = addDays(new Date(), 2); // Minimum date is 2 days from now
  
  // Form state for appointment request
  const [formData, setFormData] = useState({
    phone: '',
    appointmentType: 'consultation',
    note: ''
  });

  // Check if a time slot is blocked
  const isTimeSlotBlocked = (date, timeSlot) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return blockedTimes.hours.some(
      block => block.date === formattedDate && 
      block.hour === timeSlot.hour && 
      block.minutes === timeSlot.minutes
    ) || blockedTimes.days.includes(formattedDate);
  };

  // Get appointments for a specific time slot
  const getAppointmentsForTimeSlot = (date, timeSlot) => {
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      return isSameDay(appointmentDate, date) && 
             getHours(appointmentDate) === timeSlot.hour &&
             getMinutes(appointmentDate) === timeSlot.minutes &&
             appointment.status !== 'declined';
    });
  };

  // Handle blocking/unblocking a time slot
  const handleTimeSlotBlock = (date, timeSlot) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (isTimeSlotBlocked(date, timeSlot)) {
      dispatch(unblockHour({ 
        date: formattedDate, 
        hour: timeSlot.hour,
        minutes: timeSlot.minutes 
      }));
    } else {
      // Don't block if there's an appointment
      const hasAppointment = getAppointmentsForTimeSlot(date, timeSlot).length > 0;
      if (!hasAppointment) {
        dispatch(blockHour({ 
          date: formattedDate, 
          hour: timeSlot.hour,
          minutes: timeSlot.minutes
        }));
      }
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsStacked(window.innerWidth < 640);
      setIsLargeScreen(window.innerWidth >= 800);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
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
      
      // If user is a doctor, show the block modal
      if (user.role.toLowerCase() === 'doctor') {
        setShowBlockModal(true);
      }
    }
  };

  // Handle hour selection
  const handleHourClick = (hour) => {
    if (!selectedDate) return;
    
    const isBlocked = isHourBlocked(selectedDate, hour);
    const hasAppointment = getAppointmentsForHour(selectedDate, hour).length > 0;
    const isDayBlocked = blockedTimes.days.includes(format(selectedDate, 'yyyy-MM-dd'));
    
    // Only allow selecting available hours and when the day is not blocked
    if (!isBlocked && !hasAppointment && !isDayBlocked) {
      setSelectedHour(hour);
      
      // If user is a patient, show the appointment form
      if (user.role.toLowerCase() === 'patient') {
        setShowAppointmentForm(true);
      }
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Create new appointment object
    const newAppointment = {
      id: Date.now(), // Using timestamp as temporary ID
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: `${selectedHour}:00`,
      phone: formData.phone,
      type: formData.appointmentType,
      note: formData.note,
      status: 'pending' // Make sure this matches exactly with the translation key
    };
    
    // Set active appointment
    setActiveAppointment(newAppointment);
    setHasActiveAppointment(true);
    
    // Show confirmation message
    setShowConfirmation(true);
    
    // Reset form and close modal after 3 seconds
    setTimeout(() => {
      setFormData({
        phone: '',
        appointmentType: 'consultation',
        note: ''
      });
      setShowAppointmentForm(false);
      setShowConfirmation(false);
      setSelectedHour(null);
      setSelectedDate(null);
    }, 3000);
  };

  // Handle appointment modification
  const handleModifyAppointment = () => {
    setHasActiveAppointment(false);
    setActiveAppointment(null);
    // Reset to calendar view
  };

  // Handle appointment modification
  const handleChangeAppointment = () => {
    setHasActiveAppointment(false);
    setActiveAppointment(null);
  };

  // Handle appointment deletion
  const handleDeleteAppointment = () => {
    setHasActiveAppointment(false);
    setActiveAppointment(null);
    // Reset to calendar view
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
    const formattedDate = format(date, 'yyyy-MM-dd');
    // Check if either the specific hour is blocked OR the entire day is blocked
    return blockedTimes.hours.some(
      block => block.date === formattedDate && block.hour === hour
    ) || blockedTimes.days.includes(formattedDate);
  };
 
  // Handle blocking/unblocking a day
  const handleDayBlock = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (isDayBlocked(date)) {
      dispatch(unblockDay(formattedDate));
      // Dispatch an action to clear any individual hour blocks for that day
      blockedTimes.hours.forEach(block => {
        if (block.date === formattedDate) {
          dispatch(unblockHour({ date: formattedDate, hour: block.hour }));
        }
      });
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

  // Handle time slot click
  const handleTimeSlotClick = (timeSlot) => {
    if (!selectedDate) return;
    
    const isBlocked = isTimeSlotBlocked(selectedDate, timeSlot);
    const hasAppointment = getAppointmentsForTimeSlot(selectedDate, timeSlot).length > 0;
    const isDayBlocked = blockedTimes.days.includes(format(selectedDate, 'yyyy-MM-dd'));
    
    // Only allow selecting available hours and when the day is not blocked
    if (!isBlocked && !hasAppointment && !isDayBlocked) {
      setSelectedHour(timeSlot.hour);
      setSelectedMinutes(timeSlot.minutes);
      
      // If user is a patient, show the appointment form
      if (user.role.toLowerCase() === 'patient') {
        setShowAppointmentForm(true);
      }
    }
  };

  // Render the month view
  const renderMonthView = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const firstDayOfMonth = startOfMonth(currentDate);
    const firstDayIndex = firstDayOfMonth.getDay();
    
    return (
      <div className={`grid ${isStacked ? 'grid-cols-1' : 'grid-cols-7'} gap-1 overflow-x-auto`}>
        {/* Day headers */}
        {!isStacked && days.map((day, index) => (
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
          const isAvailable = !isPast && !isFuture && !isBlocked;
          
          return (
            <div 
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg relative
                ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                ${isPast ? 'opacity-50 cursor-not-allowed bg-red-50/30' : 'cursor-pointer'}
                ${isFuture ? 'opacity-50 cursor-not-allowed bg-red-50/30' : ''}
                ${isBlocked ? 'bg-red-50' : ''}
                ${isAvailable ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}
                ${isStacked ? 'mb-2' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                <span className={`font-medium text-xs sm:text-sm ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                  {isStacked && (
                    <span className="ml-2 text-xs text-gray-500">
                      {getDayName(day, isMobile)}
                    </span>
                  )}
                </div>
                {user.role.toLowerCase() === 'doctor' && !isPast && !isFuture && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayBlock(day);
                    }}
                    className={`p-1.5 rounded-full ${isBlocked ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                  >
                    {isBlocked ? <Lock size={18} /> : <LockOpen size={18} />}
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

  // Block Modal for doctors
  const renderBlockModal = () => {
    if (!selectedDate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-6xl flex flex-col">
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg sm:text-xl font-bold">
              {t('agenda.timeSlots.title')} - {format(selectedDate, 'd')} {getMonthName(selectedDate)}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {timeSlots.map((timeSlot, index) => {
                const isBlocked = isTimeSlotBlocked(selectedDate, timeSlot);
                const hasAppointment = getAppointmentsForTimeSlot(selectedDate, timeSlot).length > 0;
                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    hasAppointment ? 'bg-blue-50' : isBlocked ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatTimeSlot(timeSlot)}
                      </span>
                      {hasAppointment && (
                        <span className="text-xs text-blue-600">
                          {t('agenda.hasAppointment')}
                        </span>
                      )}
                    </div>
                    {user.role.toLowerCase() === 'doctor' && !hasAppointment && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTimeSlotBlock(selectedDate, timeSlot);
                        }}
                        className={`p-2 rounded-full ${
                          isBlocked ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {isBlocked ? <Lock size={18} /> : <LockOpen size={18} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 sm:p-6 border-t flex justify-end">
            <button 
              onClick={() => {
                setShowBlockModal(false);
                setSelectedDate(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Appointment Form Modal for patients
  const renderAppointmentForm = () => {
    if (!selectedDate || !selectedHour) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6">
          
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                {t('agenda.newAppointment')} - {format(selectedDate, 'd')} {getMonthName(selectedDate)} {selectedHour}:00
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('agenda.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('agenda.form.appointmentType')}
                  </label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">{t('agenda.appointmentTypes.consultation')}</option>
                    <option value="follow-up">{t('agenda.appointmentTypes.follow-up')}</option>
                    <option value="emergency">{t('agenda.appointmentTypes.emergency')}</option>
                    <option value="other">{t('agenda.appointmentTypes.other')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('agenda.form.note')}
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAppointmentForm(false);
                      setSelectedHour(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {t('agenda.form.submit')}
                  </button>
                </div>
              </form>
           
        </div>
      </div>
    );
  };

  // Time slots view for patients
  const renderTimeSlotsView = () => {
    if (!selectedDate) return null;

    const isDayBlocked = blockedTimes.days.includes(format(selectedDate, 'yyyy-MM-dd'));
    const timeSlots = generateTimeSlots();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-6xl flex flex-col">
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg sm:text-xl font-bold">
              {t('agenda.timeSlots.title')} - {format(selectedDate, 'd')} {getMonthName(selectedDate)}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {timeSlots.map((timeSlot, index) => {
                const isBlocked = isDayBlocked || isTimeSlotBlocked(selectedDate, timeSlot);
                const hasAppointment = getAppointmentsForTimeSlot(selectedDate, timeSlot).length > 0;
                const isAvailable = !isBlocked && !hasAppointment;
                
                return (
                  <div 
                    key={index}
                    onClick={() => handleTimeSlotClick(timeSlot)}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      hasAppointment ? 'bg-blue-50 cursor-not-allowed' : 
                      isBlocked ? 'bg-red-50 cursor-not-allowed' : 
                      'bg-green-50 cursor-pointer hover:bg-green-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatTimeSlot(timeSlot)}
                      </span>
                      {hasAppointment && (
                        <span className="text-xs text-blue-600">
                          {t('agenda.hasAppointment')}
                        </span>
                      )}
                      {isBlocked && (
                        <span className="text-xs text-red-600">
                          {t('agenda.blocked')}
                        </span>
                      )}
                      {isAvailable && (
                        <span className="text-xs text-green-600">
                          {t('agenda.available')}
                        </span>
                      )}
                    </div>
                    {user.role.toLowerCase() === 'doctor' && !hasAppointment && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTimeSlotBlock(selectedDate, timeSlot);
                        }}
                        className={`p-2 rounded-full ${
                          isBlocked ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {isBlocked ? <Lock size={18} /> : <LockOpen size={18} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 sm:p-6 border-t flex justify-end">
            <button 
              onClick={() => {
                setSelectedDate(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render appointment management view
  const renderAppointmentManagement = () => {
    if (!hasActiveAppointment || !activeAppointment) return null;

    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">{t('agenda.manageAppointment')}</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('agenda.appointmentDetails')}</h3>
              <div className="space-y-2">
                <p><span className="font-medium">{t('agenda.date')}:</span> {activeAppointment.date}</p>
                <p><span className="font-medium">{t('agenda.time')}:</span> {activeAppointment.time}</p>
                <p><span className="font-medium">{t('agenda.type')}:</span> {t(`agenda.appointmentTypes.${activeAppointment.type}`)}</p>
                <p><span className="font-medium">{t('agenda.statusType')}:</span> {getStatusText(activeAppointment.status)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleChangeAppointment}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('agenda.modifyAppointment')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {hasActiveAppointment ? (
        renderAppointmentManagement()
      ) : (
        <>
          {/* Header with navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 bg-white border-b">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t('agenda.title')}</h1>
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

          {/* Block Modal for doctors */}
          {showBlockModal && renderBlockModal()}

          {/* Time slots view for patients */}
          {selectedDate && user.role.toLowerCase() === 'patient' && !showAppointmentForm && renderTimeSlotsView()}

          {/* Appointment Form Modal for patients */}
          {showAppointmentForm && renderAppointmentForm()}

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
        </>
      )}
    </div>
  );
} 