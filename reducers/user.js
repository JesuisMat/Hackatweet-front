import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  token: '',
  isAuthenticated: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser: (state, action) => {
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.username = '';
      state.token = '';
      state.isAuthenticated = false;
    }
  },
});

export const { setToken, setUser, logout } = userSlice.actions;
export default userSlice.reducer;