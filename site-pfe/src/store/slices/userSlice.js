import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: localStorage.getItem('userName') || 'John Doe',
  email: localStorage.getItem('userEmail') || 'john.doe@example.com',
  role: localStorage.getItem('userRole') || 'Doctor',
  avatar: localStorage.getItem('userAvatar') || null,
  language: localStorage.getItem('appLanguage') || 'fr',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const { name, email, avatar } = action.payload;
      if (name) {
        state.name = name;
        localStorage.setItem('userName', name);
      }
      if (email) {
        state.email = email;
        localStorage.setItem('userEmail', email);
      }
      if (avatar) {
        state.avatar = avatar;
        localStorage.setItem('userAvatar', avatar);
      }
    },
    updateLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('appLanguage', action.payload);
    },
    updateUser: (state, action) => {
      const { role } = action.payload;
      if (role) {
        state.role = role;
        localStorage.setItem('userRole', role);
      }
    },
  },
});

export const { updateProfile, updateLanguage, updateUser } = userSlice.actions;
export default userSlice.reducer; 