import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  announcements: [],
  loading: false,
  error: null,
};

export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    addAnnouncement: (state, action) => {
      state.announcements.unshift(action.payload);
    },
    deleteAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(
        (announcement) => announcement.id !== action.payload
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
  setAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
  setLoading,
  setError,
} = announcementsSlice.actions;
export default announcementsSlice.reducer; 