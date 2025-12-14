/**
 * Purpose: Configure Redux store with persistence.
 * Author: EventCompanion Team
 * Responsibility: Provide global state container with offline caching.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';
import rootReducer from './rootReducer';
import { setTokenProvider, setUnauthorizedHandler } from '../api/interceptors';
import { logout } from '../features/auth/authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'events', 'attendees'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Keep Axios token in sync with persisted auth state.
setTokenProvider(() => store.getState().auth.token);
setUnauthorizedHandler(() => {
  store.dispatch(logout());
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
