/**
 * Purpose: Themed text component with type-based typography.
 * Author: EventCompanion Team
 * Responsibility: Render text with consistent fonts, sizing, and colors.
 */

import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Typography from '../../typography';

export type ETextType =
  | 'R8'
  | 'R10'
  | 'R12'
  | 'R14'
  | 'R16'
  | 'R18'
  | 'R20'
  | 'R22'
  | 'R24'
  | 'R26'
  | 'R28'
  | 'R30'
  | 'R32'
  | 'R34'
  | 'R35'
  | 'R36'
  | 'R40'
  | 'R46'
  | 'M12'
  | 'M14'
  | 'M16'
  | 'M18'
  | 'M20'
  | 'M24'
  | 'S14'
  | 'S16'
  | 'S18'
  | 'S20'
  | 'S24'
  | 'B14'
  | 'B16'
  | 'B18'
  | 'B20'
  | 'B24';

type Props = TextProps & {
  type?: ETextType | string;
  style?: StyleProp<TextStyle>;
  align?: TextStyle['textAlign'];
  color?: string;
  children: ReactNode;
  isUnderlined?: boolean;
  underlineColor?: string;
};

const EText: React.FC<Props> = ({
  type = 'R14',
  style,
  align,
  color,
  children,
  isUnderlined = false,
  underlineColor,
  ...props
}) => {
  const { theme } = useTheme();

  const fontWeights = (): TextStyle => {
    const match = type.match(/^[A-Za-z]+/);
    const prefix = match ? match[0].toUpperCase() : 'R';
    switch (prefix) {
      case 'R':
        return Typography.fontWeights.Regular;
      case 'M':
        return Typography.fontWeights.Medium;
      case 'S':
        return Typography.fontWeights.SemiBold;
      case 'B':
        return Typography.fontWeights.Bold;
      case 'L':
        return Typography.fontWeights.Light;
      case 'T':
        return Typography.fontWeights.Thin;
      case 'EL':
        return Typography.fontWeights.ExtraLight;
      case 'EB':
        return Typography.fontWeights.ExtraBold;
      case 'BL':
        return Typography.fontWeights.Black;
      default:
        return Typography.fontWeights.Regular;
    }
  };

  const fontSize = (): TextStyle => {
    const sizeMatch = type.match(/\d+/);
    const size = sizeMatch ? sizeMatch[0] : '14';
    const key = `f${size}` as keyof typeof Typography.fontSizes;
    return Typography.fontSizes[key] || Typography.fontSizes.f14;
  };

  return (
    <Text
      style={[
        { includeFontPadding: false },
        type && { ...fontWeights(), ...fontSize() },
        { color: color || theme.colors.text },
        align && { textAlign: align },
        style,
        isUnderlined && {
          ...styles.underlineStyle,
          textDecorationColor: underlineColor || theme.colors.text,
        },
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default React.memo(EText);

const styles = StyleSheet.create({
  underlineStyle: {
    textDecorationLine: 'underline',
  },
});
