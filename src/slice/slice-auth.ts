import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser, LoginPayload } from '../types/auth';
import { getUser, getToken } from '../lib/tokenHelper';

const initialUser = getUser();
const initialToken = getToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null,
  isAuthenticated: !!(initialUser && initialToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state, _action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    forgotPasswordStart(state, _action: PayloadAction<{ email: string }>) {
      state.loading = true;
      state.error = null;
    },
    forgotPasswordSuccess(state) {
      state.loading = false;
    },
    forgotPasswordError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordStart(state, _action: PayloadAction<{ token: string; password: string }>) {
      state.loading = true;
      state.error = null;
    },
    resetPasswordSuccess(state) {
      state.loading = false;
    },
    resetPasswordError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  logout,
  clearError,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordError,
} = authSlice.actions;

export default authSlice.reducer;
