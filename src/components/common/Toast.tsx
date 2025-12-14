/**
 * Purpose: Themed toast component for global notifications.
 * Author: EventCompanion Team
 * Responsibility: Render success, error, and info toasts with consistent styling.
 */

import React from 'react';
import ToastLib, { BaseToast, ToastConfig } from 'react-native-toast-message';
import { mvs } from 'react-native-size-matters';
import { padding, Typography } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import { isTablet } from '../../utils/responsive';

const ToastComponent: React.FC = () => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const typography = theme.typography;

  const baseContentStyle = padding.ph15;
  const baseTitleStyle = {
    ...Typography.fontSizes.f14,
    ...Typography.fontWeights.Medium,
  };
  const baseSubtitleStyle = {
    ...Typography.fontSizes.f12,
    ...Typography.fontWeights.Medium,
  };

  const config: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: typography.successDark,
          backgroundColor: colors.toastSuccessBg,
          width: '90%',
          paddingVertical: mvs(10),
          borderLeftWidth: mvs(4),
          height: isTablet() ? mvs(80) : mvs(60),
        }}
        contentContainerStyle={baseContentStyle}
        text1Style={{ ...baseTitleStyle, color: typography.successDark }}
        text2Style={{ ...baseSubtitleStyle, color: colors.text }}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: typography.errorDark,
          backgroundColor: colors.toastErrorBg,
          width: '90%',
          paddingVertical: mvs(10),
          borderLeftWidth: mvs(4),
          height: isTablet() ? mvs(80) : mvs(60),
        }}
        contentContainerStyle={baseContentStyle}
        text1Style={{ ...baseTitleStyle, color: typography.errorDark }}
        text2Style={{ ...baseSubtitleStyle, color: colors.text }}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: typography.secondaryDark,
          backgroundColor: colors.toastInfoBg,
          width: '90%',
          paddingVertical: mvs(10),
          borderLeftWidth: mvs(4),
          height: isTablet() ? mvs(80) : mvs(60),
        }}
        contentContainerStyle={baseContentStyle}
        text1Style={{ ...baseTitleStyle, color: typography.secondaryDark }}
        text2Style={{ ...baseSubtitleStyle, color: colors.text }}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
  };

  return <ToastLib swipeable position="top" visibilityTime={2000} topOffset={70} config={config} />;
};

export default ToastComponent;
