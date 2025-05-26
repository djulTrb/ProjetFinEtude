import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadUserState = () => {
  try {
    const userState = localStorage.getItem('userState');
    return userState ? JSON.parse(userState) : {
      name: '',
      email: '',
      role: '',
      avatar: null,
      language: 'fr',
      isAuthenticated: false
    };
  } catch (err) {
    return {
      name: '',
      email: '',
      role: '',
      avatar: null,
      language: 'fr',
      isAuthenticated: false
    };
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState: loadUserState(),
  reducers: {
    updateProfile: (state, action) => {
      const { name, email, avatar } = action.payload;
      if (name) state.name = name;
      if (email) state.email = email;
      if (avatar) state.avatar = avatar;
      localStorage.setItem('userState', JSON.stringify(state));
    },
    updateLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('userState', JSON.stringify(state));
    },
    updateUser: (state, action) => {
      const { role, name, email, avatar, isAuthenticated } = action.payload;
      if (role) state.role = role;
      if (name) state.name = name;
      if (email) state.email = email;
      if (avatar) state.avatar = avatar;
      if (typeof isAuthenticated === 'boolean') state.isAuthenticated = isAuthenticated;
      localStorage.setItem('userState', JSON.stringify(state));
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.role = '';
      state.avatar = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userState');
    }
  }
});

export const { updateProfile, updateLanguage, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 