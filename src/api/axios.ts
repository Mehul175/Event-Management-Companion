/**
 * Purpose: Configure the shared Axios instance for the app.
 * Author: EventCompanion Team
 * Responsibility: Apply base URL, timeouts, and interceptors.
 */

import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { applyInterceptors, setTokenProvider } from './interceptors';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Log API URL - this will help debug in release builds
// In release, console.log might be stripped, but it's useful for development
if (__DEV__) {
  console.log('[API] Base URL:', API_BASE_URL);
  console.log('[API] __DEV__:', __DEV__);
} else {
  // In release builds, we can't rely on console.log, but we log anyway
  // You can check this via adb logcat if needed
  console.log('[API] Base URL (RELEASE):', API_BASE_URL);
}

// Default token provider; updated by auth layer once the store is available.
setTokenProvider(() => null);

applyInterceptors(api);

export default api;
