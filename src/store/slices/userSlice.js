import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  role: '',
  avatar: null,
  language: 'fr',
  isAuthenticated: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const { name, email, avatar } = action.payload;
      if (name) state.name = name;
      if (email) state.email = email;
      if (avatar) state.avatar = avatar;
    },
    updateLanguage: (state, action) => {
      state.language = action.payload;
    },
    updateUser: (state, action) => {
      const { role, name, email, avatar, isAuthenticated } = action.payload;
      if (role) state.role = role;
      if (name) state.name = name;
      if (email) state.email = email;
      if (avatar) state.avatar = avatar;
      if (typeof isAuthenticated === 'boolean') state.isAuthenticated = isAuthenticated;
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.role = '';
      state.avatar = null;
      state.isAuthenticated = false;
    }
  },
});

export const { updateProfile, updateLanguage, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 