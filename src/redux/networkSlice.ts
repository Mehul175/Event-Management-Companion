/**
 * Purpose: Track network connectivity state.
 * Author: EventCompanion Team
 * Responsibility: Expose online/offline status for offline workflows.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NetworkState = {
  isConnected: boolean;
  lastChangedAt?: number;
};

const initialState: NetworkState = {
  isConnected: true,
  lastChangedAt: undefined,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.lastChangedAt = Date.now();
    },
  },
});

export const { setIsConnected } = networkSlice.actions;
export default networkSlice.reducer;
