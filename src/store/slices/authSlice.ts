import { createSlice } from '@reduxjs/toolkit';

// Define the initial state type
interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string; id: string }; // Basic user structure for now
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Placeholder action to test the store
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;