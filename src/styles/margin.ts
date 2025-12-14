/**
 * Purpose: Scalable margin utilities using react-native-size-matters.
 * Author: EventCompanion Team
 * Responsibility: Provide reusable margin styles without hardcoded values.
 */

import { StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

type MarginStyles = {
  [key: string]: {
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginHorizontal?: number;
    marginVertical?: number;
  };
};

const margin: MarginStyles = {};

for (let i = 0; i <= 100; i += 1) {
  margin[`m${i}`] = { margin: moderateScale(i) };
  margin[`mt${i}`] = { marginTop: moderateVerticalScale(i) };
  margin[`mb${i}`] = { marginBottom: moderateVerticalScale(i) };
  margin[`ml${i}`] = { marginLeft: moderateScale(i) };
  margin[`mr${i}`] = { marginRight: moderateScale(i) };
  margin[`mh${i}`] = { marginHorizontal: moderateScale(i) };
  margin[`mv${i}`] = { marginVertical: moderateVerticalScale(i) };
}

export default StyleSheet.create(margin);
