import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Calendar, CaretLeft, CaretRight, Clock, Check, X, Plus } from 'phosphor-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isSameHour, setHours, getHours } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'day'
  const hourlySlots = generateHourlySlots();

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
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 1);
        return newDate;
      });
    }
  };

  // Navigate to next month/day
  const goToNext = () => {
    // Limit to 3 months in the future
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    if (viewMode === 'month') {
      const nextMonth = addMonths(currentDate, 1);
      if (nextMonth <= maxDate) {
        setCurrentDate(nextMonth);
      }
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      if (nextDay <= maxDate) {
        setCurrentDate(nextDay);
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
      setViewMode('day');
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

  // Render the month view
  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isPast = day < new Date();
          const isFuture = day > new Date(new Date().setMonth(new Date().getMonth() + 3));
          
          return (
            <div 
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[100px] p-2 border rounded-lg
                ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
                ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                ${isFuture ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              {/* Appointments for this day */}
              <div className="mt-2 space-y-1">
                {dayAppointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className={`text-xs p-1 rounded ${getStatusColor(appointment.status)}`}
                  >
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>{formatAppointmentTime(appointment.date)}</span>
                    </div>
                    <div className="truncate">{appointment.patientName}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the day view
  const renderDayView = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-[100px_1fr] gap-1">
          {/* Time column */}
          <div className="space-y-1">
            <div className="h-12"></div> {/* Header spacer */}
            {hourlySlots.map(hour => (
              <div key={hour} className="h-16 flex items-center justify-end pr-2 text-sm text-gray-500">
                {format(setHours(new Date(), hour), 'HH:00')}
              </div>
            ))}
          </div>
          
          {/* Appointments column */}
          <div className="space-y-1">
            <div className="h-12"></div> {/* Header spacer */}
            
            {hourlySlots.map(hour => {
              const hourAppointments = getAppointmentsForHour(selectedDate, hour);
              
              return (
                <div 
                  key={hour} 
                  className="h-16 border-b border-gray-100 relative"
                  onClick={() => {
                    // In a real app, this would open a modal to add an appointment
                    console.log(`Add appointment for ${format(setHours(selectedDate, hour), 'HH:00')}`);
                  }}
                >
                  {hourAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className={`absolute inset-0 m-1 p-1 rounded ${getStatusColor(appointment.status)} text-xs flex flex-col`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appointment);
                        setShowAppointmentModal(true);
                      }}
                    >
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-xs opacity-75">{appointment.type}</div>
                    </div>
                  ))}
                  
                  {/* Add appointment button (only visible on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">{t('agenda.title')}</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToPrevious}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <CaretLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            {viewMode === 'month' 
              ? format(currentDate, 'MMMM', { locale: fr })
              : format(selectedDate || currentDate, 'EEEE d MMMM', { locale: fr })}
          </h2>
          <button 
            onClick={goToNext}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <CaretRight size={24} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg ${viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          >
            {t('agenda.monthView')}
          </button>
        </div>
      </div>

      {/* Calendar content */}
      <div className="flex-1 p-4 overflow-auto">
        {viewMode === 'month' ? renderMonthView() : renderDayView()}
      </div>

      {/* Appointment details modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{t('agenda.appointmentDetails')}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t('agenda.patient')}</p>
                <p className="font-medium">{selectedAppointment.patientName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t('agenda.date')}</p>
                <p className="font-medium">
                  {format(parseISO(selectedAppointment.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t('agenda.time')}</p>
                <p className="font-medium">{formatAppointmentTime(selectedAppointment.date)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t('agenda.type')}</p>
                <p className="font-medium capitalize">{selectedAppointment.type}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t('agenda.status')}</p>
                <p className={`font-medium capitalize ${getStatusColor(selectedAppointment.status)} inline-block px-2 py-1 rounded`}>
                  {selectedAppointment.status}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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