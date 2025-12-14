/**
 * Purpose: Auth service for login and session helpers.
 * Author: EventCompanion Team
 * Responsibility: Communicate with mock backend for authentication.
 */

import api from '../api/axios';
import endpoints from '../api/endpoints';
import { ApiError, User } from '../api/types';

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (payload: LoginRequest): Promise<User> => {
  const response = await api.get<User[]>(endpoints.login, {
    params: { email: payload.email, password: payload.password },
  });

  const matchedUser = response.data?.[0];

  if (!matchedUser) {
    const error: ApiError = { status: 401, message: 'Invalid credentials' };
    throw error;
  }

  return matchedUser;
};

export default { login };
