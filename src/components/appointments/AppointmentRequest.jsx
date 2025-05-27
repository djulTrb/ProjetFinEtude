import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, X } from 'phosphor-react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function AppointmentRequest() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      type: 'consultation',
      note: '',
      phone: ''
    }
  });

  const watchType = watch('type');

  const onSubmit = async (data) => {
    if (!selectedDate || !selectedTime) {
      setError(t('appointments.errors.selectDateTime'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const appointmentData = {
        id: uuidv4(),
        patient_id: supabase.auth.user()?.id,
        date_heure: `${selectedDate}T${selectedTime}`,
        type_rendez_vous: data.type,
        statut: 'en_attente',
        note: data.note,
        telephone: data.phone
      };

      const { error: insertError } = await supabase
        .from('rendez_vous')
        .insert([appointmentData]);

      if (insertError) throw insertError;

      // Create notification for doctors
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          id: uuidv4(),
          type: 'nouveau_rendez_vous',
          message: t('appointments.notifications.newRequest'),
          lu: false,
          user_id: supabase.auth.user()?.id
        }]);

      if (notificationError) throw notificationError;

      setSuccess(true);
      reset();
      setSelectedDate('');
      setSelectedTime('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{t('appointments.requestTitle')}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('appointments.date')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('appointments.time')}
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Appointment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('appointments.type')}
          </label>
          <select
            {...register('type', { required: t('validation.required') })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="consultation">{t('appointments.types.consultation')}</option>
            <option value="follow-up">{t('appointments.types.followUp')}</option>
            <option value="emergency">{t('appointments.types.emergency')}</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('appointments.phone')}
          </label>
          <input
            type="tel"
            {...register('phone', {
              required: t('validation.required'),
              pattern: {
                value: /^[0-9]{10}$/,
                message: t('validation.phoneFormat')
              }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0123456789"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('appointments.notes')}
          </label>
          <textarea
            {...register('note', {
              maxLength: {
                value: 500,
                message: t('validation.maxLength', { length: 500 })
              }
            })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.note ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('appointments.notesPlaceholder')}
          />
          {errors.note && (
            <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 text-green-600 rounded-md">
            {t('appointments.success')}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white rounded-md ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? t('common.submitting') : t('appointments.submit')}
        </button>
      </form>
    </div>
  );
} 