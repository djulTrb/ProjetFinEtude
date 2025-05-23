import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, User, Note } from 'phosphor-react';
import { format, parseISO } from 'date-fns';

// Mock data for appointment requests - in a real app, this would come from an API
const mockAppointmentRequests = [
  {
    id: 1,
    patientId: 101,
    patientName: 'Jean Dupont',
    profilePicture: null, // URL to profile picture if available
    date: '2023-06-15T10:00:00',
    type: 'consultation',
    status: 'pending',
    note: 'Première consultation pour douleurs chroniques'
  },
  {
    id: 2,
    patientId: 102,
    patientName: 'Marie Martin',
    profilePicture: null,
    date: '2023-06-16T14:30:00',
    type: 'follow-up',
    status: 'pending',
    note: null
  },
  {
    id: 3,
    patientId: 103,
    patientName: 'Pierre Durand',
    profilePicture: null,
    date: '2023-06-17T09:15:00',
    type: 'emergency',
    status: 'pending',
    note: 'Urgence: douleur intense à la poitrine'
  }
];

export default function AppointmentRequests() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(mockAppointmentRequests);
  const [selectedNote, setSelectedNote] = useState(null);

  // Handle appointment action (accept or decline)
  const handleAppointmentAction = (requestId, action) => {
    setRequests(prevRequests => 
      prevRequests.filter(request => request.id !== requestId)
    );
    
    // In a real app, this would dispatch an action to update the appointment status
    console.log(`Appointment ${requestId} ${action === 'accept' ? 'accepted' : 'declined'}`);
  };

  // Get appointment type color
  const getAppointmentTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const dayIndex = date.getDay();
    const monthIndex = date.getMonth();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    
    return `${t(`agenda.days.${days[dayIndex]}`)} ${format(date, 'd')} ${t(`agenda.months.${months[monthIndex]}`)} ${format(date, 'yyyy')} ${format(date, 'HH:mm')}`;
  };

  // Note modal
  const renderNoteModal = () => {
    if (!selectedNote) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedNote(null)}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-2">{t('appointmentRequests.note')}</h3>
          <p className="text-gray-600">{selectedNote}</p>
          <button 
            onClick={() => setSelectedNote(null)}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">{t('appointmentRequests.title')}</h1>
        <p className="text-gray-600 mt-1">{t('appointmentRequests.subtitle')}</p>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">{t('appointmentRequests.noRequests')}</p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {requests.map(request => (
              <div 
                key={request.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4"
              >
                {/* Patient profile picture and name */}
                <div className="flex items-center w-full sm:w-1/3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                    {request.profilePicture ? (
                      <img 
                        src={request.profilePicture} 
                        alt={request.patientName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{request.patientName}</p>
                    <p className="text-xs text-gray-500">{formatDate(request.date)}</p>
                  </div>
                </div>

                {/* Appointment type flag, note icon, and action buttons in a row */}
                <div className="w-full sm:w-2/4 flex flex-row justify-self-end items-center">
                  <div className="flex items-center flex-1 sm:-translate-x-8">
                    {/* Appointment type flag */}
                    <div className="flex-shrink-0 ">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAppointmentTypeColor(request.type)}`}>
                        {t(`agenda.appointmentTypes.${request.type}`)}
                      </span>
                    </div>

                    {/* Note icon - only show if there's a note */}
                    {request.note && (
                      <button
                        onClick={() => setSelectedNote(request.note)}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
                        title={t('appointmentRequests.viewNote')}
                      >
                        <Note size={20} />
                      </button>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2 flex-shrink-0">
                    <button 
                      onClick={() => handleAppointmentAction(request.id, 'decline')}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title={t('appointmentRequests.decline')}
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={() => handleAppointmentAction(request.id, 'accept')}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      title={t('appointmentRequests.accept')}
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {renderNoteModal()}
    </div>
  );
} 