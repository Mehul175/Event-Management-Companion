/**
 * Purpose: Centralize API endpoint paths.
 * Author: EventCompanion Team
 * Responsibility: Avoid hardcoded URLs across services.
 */

import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * Development (__DEV__ = true):
 *   - Android emulator: http://10.0.2.2:3000
 *   - iOS simulator: http://localhost:3000
 * 
 * Production/Release (__DEV__ = false):
 *   - Uses PRODUCTION_API_URL
 *   - For real devices, use your machine's IP address (e.g., http://192.168.1.100:3000)
 *   - Update PRODUCTION_API_URL below with your server's IP address
 */

// Production API URL - UPDATE THIS with your server's IP address for release builds
// Example: 'http://192.168.1.100:3000' or 'https://your-api-server.com'
const PRODUCTION_API_URL = 'http://192.168.1.2:3000';

// Development API URLs
const DEV_API_URL_ANDROID = 'http://192.168.1.2:3000'; // Android emulator
const DEV_API_URL_IOS = 'http://localhost:3000'; // iOS simulator

// Determine API URL based on build type and platform
// In release builds, __DEV__ is false, so we use PRODUCTION_API_URL
// For safety, we also check if __DEV__ is explicitly undefined (which happens in some release builds)
const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__ === true;

// For release APK, always use production URL
// For development, use platform-specific URLs
export const API_BASE_URL = isDevelopment
  ? Platform.OS === 'android'
    ? DEV_API_URL_ANDROID
    : DEV_API_URL_IOS
  : PRODUCTION_API_URL;

export const endpoints = {
  login: '/users',
  events: '/events',
  attendees: '/attendees',
  checkins: '/checkins',
};

export default endpoints;
