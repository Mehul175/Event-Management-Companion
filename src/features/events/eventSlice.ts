/**
 * Purpose: Manage event list and selection state.
 * Author: EventCompanion Team
 * Responsibility: Fetch and cache events for online/offline access.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../api/types';
import { fetchEventById, fetchEvents as fetchEventsApi } from '../../services/eventService';

export type EventsState = {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error?: string;
  lastFetched?: number;
};

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: undefined,
  lastFetched: undefined,
};

export const fetchEvents = createAsyncThunk<Event[]>('events/fetchAll', async () => {
  const events = await fetchEventsApi();
  return events;
});

export const fetchEventDetails = createAsyncThunk<Event, number>(
  'events/fetchById',
  async (eventId) => {
    const event = await fetchEventById(eventId);
    return event;
  },
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    clearEventError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEventDetails.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedEvent, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
