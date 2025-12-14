/**
 * @author: [EventCompanion Team]
 * @date: 14-12-2025
 * @lastModifiedBy: [EventCompanion Team]
 * @lastModifiedDate: 14-12-2025
 * @version: 1.0.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import ESafeAreaWrapper from '../../components/common/ESafeAreaWrapper';
import ETextInput from '../../components/common/ETextInput';
import EText from '../../components/common/EText';
import PrimaryButton from '../../components/common/PrimaryButton';
import KeyboardAwareWrapper, { KeyboardAwareScrollViewRef } from '../../components/common/KeyboardAwareWrapper';
import { flex, gap, margin, padding } from '../../styles';
import useAuth from '../../hooks/useAuth';
import { LoginRequest } from '../../services/authService';
import { useTheme } from '../../theme/ThemeContext';
import { t } from '../../locales';
import { isAndroid } from '../../utils/responsive';

type FormValues = LoginRequest;

const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);

  const fieldRefs = {
    email: emailRef,
    password: passwordRef,
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email(t('auth.errors.emailInvalid'))
          .required(t('auth.errors.emailRequired')),
        password: Yup.string()
          .min(8, t('auth.errors.passwordMin', { min: 8 }))
          .required(t('auth.errors.passwordRequired')),
      }),
    [],
  );

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.errors.loginFailed'),
        text2: error,
      });
    }
    return () => {
      clearError();
    };
  }, [error, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      Toast.show({
        type: 'success',
        text1: t('auth.success.login'),
      });
    }
  }, [isAuthenticated]);

  console.log('error', error);
  const handleSubmit = async (values: FormValues) => {
    console.log('handleSubmit', values);
    try {
      await login(values).unwrap();
      clearError();
    } catch (err) {
      console.log('err', err);
      clearError();
      // Errors are surfaced via toast; no-op.
    }
  };

  const initialValues: FormValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    [],
  );


  return (
    <ESafeAreaWrapper>
      <View style={styles.container}>
        <KeyboardAwareWrapper ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <EText type="S24">{t('auth.title')}</EText>
            <EText type="R14" color={theme.typography.textInputSecondary} style={margin.mt4}>
              {t('auth.subtitle')}
            </EText>
          </View>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit: formSubmit, values, errors, touched }) => {
              const disabled = !values.email || !values.password || loading;

              const renderFormField = (field: 'email' | 'password') => {
                const isTouched = touched[field];
                const fieldError = errors[field];
                const isFocused = focusedField === field;
                const isPasswordField = field === 'password';
                const fieldRef = fieldRefs[field];

                const handleFocus = () => {
                  setFocusedField(field);
                  setTimeout(() => {
                    if (fieldRef?.current && scrollViewRef.current) {
                      (scrollViewRef.current as any).scrollToFocusedInput(fieldRef, isAndroid() ? 50 : 80);
                    }
                  }, 100);
                };

                return (
                  <ETextInput
                    key={field}
                    ref={fieldRef}
                    label={t(`auth.${field}`)}
                    value={values[field]}
                    placeholder={t(`auth.${field}`)}
                    onChangeText={handleChange(field)}
                    onBlur={(e) => {
                      setFocusedField(null);
                      handleBlur(field)(e);
                    }}
                    onFocus={handleFocus}
                    keyboardType={field === 'email' ? 'email-address' : 'default'}
                    autoCapitalize="none"
                    secureTextEntry={isPasswordField}
                    isError={isTouched && !!fieldError}
                    errorMessage={fieldError}
                    isTouched={isTouched}
                    isFocused={isFocused}
                    returnKeyType={isPasswordField ? 'done' : 'next'}
                    onSubmitEditing={() => {
                      if (field === 'email') {
                        passwordRef.current?.focus();
                      } else {
                        passwordRef.current?.blur();
                        formSubmit();
                      }
                    }}
                  />
                );
              };

              return (
                <View style={styles.form}>
                  {renderFormField('email')}
                  {renderFormField('password')}

                  <PrimaryButton
                    title={t('auth.login')}
                    onPress={formSubmit}
                    isLoading={loading}
                    disabled={disabled}
                    style={styles.loginButton}
                  />
                </View>
              );
            }}
          </Formik>
        </KeyboardAwareWrapper>
      </View>
    </ESafeAreaWrapper>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      ...flex.flex,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      ...padding.ph24,
      ...padding.pv20,
    },
    header: {
      ...margin.mb24,
      ...gap.g8,
    },
    form: {
      ...gap.g12,
    },
    loginButton: {
      ...margin.mt12,
    },
  });

export default LoginScreen;
