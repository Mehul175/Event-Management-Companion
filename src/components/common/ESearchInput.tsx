/**
 * Purpose: Debounced search input with icons and themed styling.
 * Author: EventCompanion Team
 * Responsibility: Provide a reusable search bar for list filtering.
 */

import React, { useCallback, useEffect } from 'react';
import { StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms } from 'react-native-size-matters';
import { flex, gap, padding, Typography } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import useDebounce from '../../hooks/useDebounce';
import { t } from '../../locales';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onDebouncedChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};

const ESearchInput: React.FC<Props> = ({
  value,
  onChange,
  onDebouncedChange,
  onSubmit,
  onClear,
  debounceMs = 400,
  placeholder,
  containerStyle,
  inputStyle,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    if (onDebouncedChange) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange]);

  const handleSubmitEditing = useCallback(() => {
    if (onSubmit) {
      onSubmit(value);
    }
  }, [onSubmit, value]);

  const resolvedPlaceholder = placeholder || t('common.searchPlaceholder');

  return (
    <View style={[styles.inputWrap, containerStyle]}>
      <Ionicons name="search" size={ms(18)} color={theme.colors.secondaryDark} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={theme.typography.textInputSecondary}
        style={[styles.input, inputStyle]}
        returnKeyType="search"
        onSubmitEditing={handleSubmitEditing}
        numberOfLines={1}
      />
      {value?.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChange('');
            if (onClear) onClear();
          }}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={ms(22)} color={theme.typography.textInputSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ESearchInput;

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    inputWrap: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: ms(10),
      backgroundColor: theme.colors.card,
      ...padding.ph12,
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g8,
      height: ms(50),
    },
    input: {
      flex: 1,
      color: theme.colors.text,
      ...Typography.fontSizes.f14,
      ...Typography.fontWeights.Regular,
      includeFontPadding: false,
    },
  });
