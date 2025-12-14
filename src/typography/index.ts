/**
 * Purpose: Central typography scale for fonts and weights.
 * Author: EventCompanion Team
 * Responsibility: Provide consistent font families and sizes across the app.
 */

import { moderateScale } from 'react-native-size-matters';

type FontWeight = { fontFamily: string };

type FontWeights = {
  Regular: FontWeight;
  Medium: FontWeight;
  SemiBold: FontWeight;
  Bold: FontWeight;
  Light: FontWeight;
  Thin: FontWeight;
  ExtraLight: FontWeight;
  ExtraBold: FontWeight;
  Black: FontWeight;
  Italic: FontWeight;
  MediumItalic: FontWeight;
  LightItalic: FontWeight;
  BoldItalic: FontWeight;
  SemiBoldItalic: FontWeight;
  ExtraBoldItalic: FontWeight;
  BlackItalic: FontWeight;
  ThinItalic: FontWeight;
  ExtraLightItalic: FontWeight;
};

type FontSize = { fontSize: number };

type FontSizes = Record<
  | 'f8'
  | 'f10'
  | 'f12'
  | 'f14'
  | 'f16'
  | 'f18'
  | 'f20'
  | 'f22'
  | 'f24'
  | 'f26'
  | 'f28'
  | 'f30'
  | 'f32'
  | 'f34'
  | 'f35'
  | 'f36'
  | 'f40'
  | 'f46',
  FontSize
>;

const baseFontFamily = 'System';

const fontWeights: FontWeights = {
  Regular: { fontFamily: baseFontFamily },
  Medium: { fontFamily: baseFontFamily },
  SemiBold: { fontFamily: baseFontFamily },
  Bold: { fontFamily: baseFontFamily },
  Light: { fontFamily: baseFontFamily },
  Thin: { fontFamily: baseFontFamily },
  ExtraLight: { fontFamily: baseFontFamily },
  ExtraBold: { fontFamily: baseFontFamily },
  Black: { fontFamily: baseFontFamily },
  Italic: { fontFamily: baseFontFamily },
  MediumItalic: { fontFamily: baseFontFamily },
  LightItalic: { fontFamily: baseFontFamily },
  BoldItalic: { fontFamily: baseFontFamily },
  SemiBoldItalic: { fontFamily: baseFontFamily },
  ExtraBoldItalic: { fontFamily: baseFontFamily },
  BlackItalic: { fontFamily: baseFontFamily },
  ThinItalic: { fontFamily: baseFontFamily },
  ExtraLightItalic: { fontFamily: baseFontFamily },
};

const fontSizes: FontSizes = {
  f8: { fontSize: moderateScale(8) },
  f10: { fontSize: moderateScale(10) },
  f12: { fontSize: moderateScale(12) },
  f14: { fontSize: moderateScale(14) },
  f16: { fontSize: moderateScale(16) },
  f18: { fontSize: moderateScale(18) },
  f20: { fontSize: moderateScale(20) },
  f22: { fontSize: moderateScale(22) },
  f24: { fontSize: moderateScale(24) },
  f26: { fontSize: moderateScale(26) },
  f28: { fontSize: moderateScale(28) },
  f30: { fontSize: moderateScale(30) },
  f32: { fontSize: moderateScale(32) },
  f34: { fontSize: moderateScale(34) },
  f35: { fontSize: moderateScale(35) },
  f36: { fontSize: moderateScale(36) },
  f40: { fontSize: moderateScale(40) },
  f46: { fontSize: moderateScale(46) },
};

const Typography = { fontWeights, fontSizes };

export type { FontWeights, FontSizes };
export default Typography;
