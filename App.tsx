/**
 * Purpose: Application entry point with providers and navigation.
 * Author: EventCompanion Team
 * Responsibility: Wire Redux, persistence, theming, navigation, and toasts.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/redux/store';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import ToastComponent from './src/components/common/Toast';
import useNetwork from './src/hooks/useNetwork';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const Bootstrap = () => {
  useNetwork();
  const { isDarkMode, theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ErrorBoundary>
            <Bootstrap />
            <ToastComponent />
          </ErrorBoundary>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
