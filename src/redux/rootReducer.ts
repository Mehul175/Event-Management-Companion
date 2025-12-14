/**
 * Purpose: Combine feature reducers for the Redux store.
 * Author: EventCompanion Team
 * Responsibility: Expose root reducer for store configuration and persistence.
 */

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import attendeeReducer from '../features/attendees/attendeeSlice';
import eventReducer from '../features/events/eventSlice';
import networkReducer from './networkSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventReducer,
  attendees: attendeeReducer,
  network: networkReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
