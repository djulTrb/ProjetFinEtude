import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  blockedTimes: {
    days: [], 
    hours: [], 
  },
  loading: false,
  error: null,
};

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(app => app.id !== action.payload);
    },
    blockDay: (state, action) => {
      if (!state.blockedTimes.days.includes(action.payload)) {
        state.blockedTimes.days.push(action.payload);
      }
    },
    unblockDay: (state, action) => {
      state.blockedTimes.days = state.blockedTimes.days.filter(day => day !== action.payload);
    },
    blockHour: (state, action) => {
      const { date, hour, minutes } = action.payload;
      const existingBlock = state.blockedTimes.hours.find(
        block => block.date === date && 
                block.hour === hour && 
                block.minutes === minutes
      );
      if (!existingBlock) {
        state.blockedTimes.hours.push({ date, hour, minutes });
      }
    },
    unblockHour: (state, action) => {
      const { date, hour, minutes } = action.payload;
      state.blockedTimes.hours = state.blockedTimes.hours.filter(
        block => !(block.date === date && 
                  block.hour === hour && 
                  block.minutes === minutes)
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBlockedTimes: (state, action) => {
      state.blockedTimes = action.payload;
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  blockDay,
  unblockDay,
  blockHour,
  unblockHour,
  setLoading,
  setError,
  setBlockedTimes,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer; 