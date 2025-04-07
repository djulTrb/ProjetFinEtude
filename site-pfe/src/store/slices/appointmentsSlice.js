import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  blockedTimes: {
    days: [], // Array of blocked full days
    hours: [], // Array of blocked specific hours {date: string, hour: number}
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
      const { date, hour } = action.payload;
      const existingBlock = state.blockedTimes.hours.find(
        block => block.date === date && block.hour === hour
      );
      if (!existingBlock) {
        state.blockedTimes.hours.push({ date, hour });
      }
    },
    unblockHour: (state, action) => {
      const { date, hour } = action.payload;
      state.blockedTimes.hours = state.blockedTimes.hours.filter(
        block => !(block.date === date && block.hour === hour)
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
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
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer; 