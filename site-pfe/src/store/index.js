import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import sidebarReducer from './slices/sidebarSlice';
import announcementsReducer from './slices/announcementsSlice';
import appointmentsReducer from './slices/appointmentsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    announcements: announcementsReducer,
    appointments: appointmentsReducer,
  },
}); 