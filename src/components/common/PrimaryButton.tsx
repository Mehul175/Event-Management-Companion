/**
 * Purpose: Themed primary button for call-to-action interactions.
 * Author: EventCompanion Team
 * Responsibility: Provide consistent button styling across screens.
 */

import React from 'react';
import { ActivityIndicator, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { ms } from 'react-native-size-matters';
import { flex, padding } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import EText from './EText';

type Props = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const PrimaryButton: React.FC<Props> = ({ title, onPress, isLoading, disabled, style }) => {
  const { theme } = useTheme();
  const isDisabled = disabled || isLoading;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: isDisabled ? theme.colors.border : theme.colors.primary,
          borderRadius: ms(10),
          ...padding.pv12,
          ...padding.ph16,
          ...flex.itemsCenter,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.text} />
      ) : (
        <EText type="S16" color={theme.colors.card}>
          {title}
        </EText>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
