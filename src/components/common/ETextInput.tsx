/**
 * Purpose: Themed input with label, validation, and password toggling.
 * @author: [EventCompanion Team]
 * @date: 14-12-2025
 * @lastModifiedBy: [EventCompanion Team]
 * @lastModifiedDate: 14-12-2025
 * @version: 1.0.0
 * Responsibility: Provide a reusable text input aligned with sizing and typography rules.
 */

import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms, ScaledSheet } from 'react-native-size-matters';
import { flex, gap, margin, padding, Typography } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import EText from './EText';

export type ETextInputProps = TextInputProps & {
  label?: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onPressUneditable?: () => void;
  isError?: boolean;
  errorMessage?: string;
  isTouched?: boolean;
  isFocused?: boolean;
  isMandatory?: boolean;
  showCharacterCount?: boolean;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperText?: string;
  helperActionLabel?: string;
  onHelperActionPress?: () => void;
};

const ETextInput = forwardRef<TextInput, ETextInputProps>(
  (
    {
      label,
      value,
      placeholder,
      onChangeText,
      onBlur,
      onFocus,
      onPressUneditable,
      isError = false,
      errorMessage,
      isTouched = false,
      isFocused = false,
      editable = true,
      isMandatory = true,
      showCharacterCount = true,
      maxLength,
      inputWrapperStyle,
      inputStyle,
      helperText,
      helperActionLabel,
      onHelperActionPress,
      secureTextEntry,
      multiline = false,
      numberOfLines = 1,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = useMemo(
      () => !!secureTextEntry || (label ? label.toLowerCase().includes('password') : false),
      [secureTextEntry, label],
    );

    const activeColor = useMemo(() => {
      if (isError) return theme.typography.errorDark;
      if (isFocused) return theme.colors.primary;
      if (isTouched || value) return theme.typography.secondaryDark;
      return theme.typography.textInputSecondary;
    }, [isError, isFocused, isTouched, theme.colors.primary, theme.typography.errorDark, theme.typography.secondaryDark, theme.typography.textInputSecondary, value]);

    const renderError = useCallback(
      (message: string) => (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={ms(18)} color={theme.typography.errorDark} />
          <EText type="R14" style={{ flexShrink: 1 }} color={theme.typography.errorDark}>
            {message}
          </EText>
        </View>
      ),
      [styles.errorRow, theme.typography.errorDark],
    );

    const inputNode = (
      <TextInput
        ref={ref}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={activeColor}
        style={[
          styles.input,
          multiline && { ...padding.pv12 },
          { color: activeColor },
          inputStyle,
        ]}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onFocus={onFocus}
        secureTextEntry={isPasswordField && !showPassword}
        autoCapitalize="none"
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        {...props}
      />
    );

    return (
      <View style={[styles.container]}>
        <View style={flex.rowSpaceBetween}>
          {label && (
            <EText type="R14" color={theme.colors.text} style={styles.label}>
              {label}
              {isMandatory && <EText color={theme.typography.errorDark}> *</EText>}
            </EText>
          )}
          {showCharacterCount && maxLength && (
            <View>
              <EText type="R14" color={theme.colors.text} style={styles.label}>
                {value?.length || 0}/{maxLength}
              </EText>
            </View>
          )}
        </View>

        <View
          style={[
            styles.inputWrapper,
            { borderColor: activeColor },
            multiline && { height: ms(120) },
            inputWrapperStyle,
          ]}
        >
          {editable ? (
            inputNode
          ) : (
            <TouchableOpacity activeOpacity={0.7} style={styles.nonEditableInput} onPress={onPressUneditable}>
              <EText type="R14" style={{ flex: 1 }} color={activeColor} numberOfLines={1}>
                {value || placeholder}
              </EText>

              <Ionicons
                name="chevron-down-outline"
                color={theme.typography.muted}
                size={ms(18)}
                style={styles.nonEditableIcon}
              />
            </TouchableOpacity>
          )}

          {isPasswordField && editable && (
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.passwordEyeIcon}
              accessibilityLabel="Toggle password visibility"
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={ms(18)}
                color={isError ? theme.typography.errorDark : activeColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {helperText && !errorMessage && (
          <View style={[flex.rowSpaceBetween, margin.mt4]}>
            <EText type="R12" color={theme.typography.textInputSecondary}>
              {helperText}
            </EText>
            {helperActionLabel && onHelperActionPress && (
              <TouchableOpacity onPress={onHelperActionPress}>
                <EText type="M12" color={theme.colors.primary} isUnderlined>
                  {helperActionLabel}
                </EText>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isTouched && isError && errorMessage && renderError(errorMessage)}
      </View>
    );
  },
);

ETextInput.displayName = 'ETextInput';

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  ScaledSheet.create({
    container: {
      ...margin.mb6,
    },
    label: {
      ...margin.mb6,
    },
    nonEditableInput: {
      ...flex.flex,
      ...flex.itemsCenter,
      ...flex.flexRow,
    },
    inputWrapper: {
      borderWidth: ms(1),
      borderColor: theme.typography.textInputSecondary,
      height: ms(50),
      backgroundColor: theme.colors.card,
      borderRadius: ms(8),
      ...flex.flexRow,
    },
    input: {
      flex: 1,
      ...Typography.fontWeights.Regular,
      ...Typography.fontSizes.f14,
      color: theme.colors.text,
      includeFontPadding: false,
      ...padding.ph16,
      borderRadius: ms(8),
    },
    nonEditableIcon: {
      ...padding.pl20,
    },
    passwordEyeIcon: {
      ...padding.pr16,
      ...flex.selfCenter,
    },
    errorRow: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g8,
      ...margin.mt4,
    },
    helperRow: {
      ...flex.rowSpaceBetween,
      ...margin.mb6,
    },
  });

export default ETextInput;
