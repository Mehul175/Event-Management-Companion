/**
 * Purpose: Application entry point with providers and navigation.
 * Author: EventCompanion Team
 * Responsibility: Wire Redux, persistence, theming, navigation, and toasts.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/redux/store';
import { ThemeProvider } from './src/theme/ThemeContext';
import ToastComponent from './src/components/common/Toast';
import useNetwork from './src/hooks/useNetwork';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const Bootstrap = () => {
  useNetwork();
  return <AppNavigator />;
};

const App = (): JSX.Element => {
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
