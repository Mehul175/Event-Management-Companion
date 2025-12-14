/**
 * Purpose: Responsive helpers for device-specific UI adjustments.
 * Author: EventCompanion Team
 * Responsibility: Provide simple device helpers (e.g., tablet detection).
 */

import { Dimensions, Platform } from 'react-native';

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const shortest = Math.min(width, height);
  return shortest >= 600;
};

export const isAndroid = () => Platform.OS === 'android';

export const getScreenHeight = () => {
  const { height } = Dimensions.get('window');
  return height;
};

export default { isTablet, isAndroid, getScreenHeight };
