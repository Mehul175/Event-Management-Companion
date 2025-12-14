/**
 * Purpose: Gap utilities for consistent spacing between elements.
 * Author: EventCompanion Team
 * Responsibility: Provide reusable gap styles without hardcoded values.
 */

import { StyleSheet, ViewStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

type GapStyles = {
  [key: string]: ViewStyle;
};

const gap: GapStyles = {};

for (let i = 0; i <= 100; i += 1) {
  gap[`g${i}`] = { gap: moderateScale(i) };
}

export default StyleSheet.create(gap);
