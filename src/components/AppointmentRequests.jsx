import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, User, Note } from 'phosphor-react';
import { format, parseISO } from 'date-fns';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function AppointmentRequests() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointment requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('rendez_vous')
          .select(`
            *,
            patient:patient_id (
              id,
              email,
              full_name,
              avatar_url
            )
          `)
          .eq('statut', 'en_attente')
          .order('date_heure', { ascending: true });

        if (error) throw error;

        const transformedRequests = data.map(request => ({
          id: request.id,
          patientId: request.patient_id,
          patientName: request.patient?.full_name || 'Unknown',
          profilePicture: request.patient?.avatar_url,
          date: request.date_heure,
          type: request.type_rendez_vous,
          status: request.statut,
          note: request.note,
          telephone: request.telephone
        }));

        setRequests(transformedRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle appointment action (accept or decline)
  const handleAppointmentAction = async (requestId, action) => {
    try {
      // Update appointment status
      const { error: updateError } = await supabase
        .from('rendez_vous')
        .update({ statut: action === 'accept' ? 'accepte' : 'refuse' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create response record
      const { error: responseError } = await supabase
        .from('reponses_rendez_vous')
        .insert([{
          id: uuidv4(),
          rendez_vous_id: requestId,
          reponse: action === 'accept' ? 'accepte' : 'refuse',
          message: action === 'accept' ? 'Rendez-vous accepté' : 'Rendez-vous refusé'
        }]);

      if (responseError) throw responseError;

      // Create notification for patient
      const request = requests.find(r => r.id === requestId);
      if (request) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert([{
            id: uuidv4(),
            user_id: request.patientId,
            type: action === 'accept' ? 'rendez_vous_accepte' : 'rendez_vous_refuse',
            message: action === 'accept' 
              ? 'Votre demande de rendez-vous a été acceptée'
              : 'Votre demande de rendez-vous a été refusée',
            lu: false
          }]);

        if (notificationError) throw notificationError;
      }

      // Update local state
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (err) {
      console.error('Error handling appointment action:', err);
      setError(err.message);
    }
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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

                {/* Appointment type and note */}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getAppointmentTypeColor(request.type)}`}>
                    {t(`agenda.appointmentTypes.${request.type}`)}
                  </span>
                  {request.note && (
                    <button
                      onClick={() => setSelectedNote(request.note)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Note size={20} />
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAppointmentAction(request.id, 'accept')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check size={24} />
                  </button>
                  <button
                    onClick={() => handleAppointmentAction(request.id, 'decline')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{t('appointmentRequests.note')}</h3>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedNote}</p>
          </div>
        </div>
      )}
    </div>
  );
} 