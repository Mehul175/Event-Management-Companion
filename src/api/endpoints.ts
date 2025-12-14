/**
 * Purpose: Centralize API endpoint paths.
 * Author: EventCompanion Team
 * Responsibility: Avoid hardcoded URLs across services.
 */

import { Platform } from 'react-native';

// On Android emulator, use 10.0.2.2 to access host machine's localhost
// On iOS simulator, localhost works directly
// For physical Android devices, use your machine's IP address (e.g., http://192.168.x.x:3000)
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const endpoints = {
  login: '/users',
  events: '/events',
  attendees: '/attendees',
  checkins: '/checkins',
};

export default endpoints;
