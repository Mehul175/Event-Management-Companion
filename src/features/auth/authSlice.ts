/**
 * Purpose: Manage authentication state and async login flow.
 * Author: EventCompanion Team
 * Responsibility: Handle login, logout, and session metadata.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginRequest, login } from '../../services/authService';
import { ApiError, User } from '../../api/types';

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: undefined,
};

export const loginUser = createAsyncThunk<User, LoginRequest, { rejectValue: ApiError }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const user = await login(payload);
      return user;
    } catch (err) {
      return rejectWithValue(err as ApiError);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
