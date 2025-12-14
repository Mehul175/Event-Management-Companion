/**
 * Purpose: Scalable padding utilities using react-native-size-matters.
 * Author: EventCompanion Team
 * Responsibility: Provide reusable padding styles without hardcoded values.
 */

import { StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

type PaddingStyles = {
  [key: string]: {
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
  };
};

const padding: PaddingStyles = {};

for (let i = 0; i <= 100; i += 1) {
  padding[`p${i}`] = { padding: moderateScale(i) };
  padding[`pt${i}`] = { paddingTop: moderateVerticalScale(i) };
  padding[`pb${i}`] = { paddingBottom: moderateVerticalScale(i) };
  padding[`pl${i}`] = { paddingLeft: moderateScale(i) };
  padding[`pr${i}`] = { paddingRight: moderateScale(i) };
  padding[`ph${i}`] = { paddingHorizontal: moderateScale(i) };
  padding[`pv${i}`] = { paddingVertical: moderateVerticalScale(i) };
}

export default StyleSheet.create(padding);
