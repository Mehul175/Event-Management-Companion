/**
 * Purpose: Convenience hook for auth state and actions.
 * Author: EventCompanion Team
 * Responsibility: Expose typed auth actions to components.
 */

import { useCallback } from 'react';
import { LoginRequest } from '../services/authService';
import { clearError, loginUser, logout } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './useRedux';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    (payload: LoginRequest) => dispatch(loginUser(payload)),
    [dispatch],
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...authState,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

export default useAuth;
