/**
 * Purpose: Manage attendees, check-ins, and pending offline queue.
 * Author: EventCompanion Team
 * Responsibility: Support online/offline attendee workflows.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Attendee, Checkin } from '../../api/types';
import {
  CheckInPayload,
  checkInAttendee as checkInAttendeeApi,
  fetchAttendees as fetchAttendeesApi,
  fetchCheckins as fetchCheckinsApi,
} from '../../services/attendeeService';

export type AttendeesState = {
  attendeesByEvent: Record<number, Attendee[]>;
  checkinsByEvent: Record<number, Checkin[]>;
  pendingCheckins: Checkin[];
  loading: boolean;
  error?: string;
};

const initialState: AttendeesState = {
  attendeesByEvent: {},
  checkinsByEvent: {},
  pendingCheckins: [],
  loading: false,
  error: undefined,
};

export const fetchAttendees = createAsyncThunk<Attendee[], number>(
  'attendees/fetchByEvent',
  async (eventId) => {
    const attendees = await fetchAttendeesApi(eventId);
    return attendees;
  },
);

export const fetchCheckins = createAsyncThunk<Checkin[], number | undefined>(
  'attendees/fetchCheckins',
  async (eventId) => {
    const checkins = await fetchCheckinsApi(eventId);
    return checkins;
  },
);

export const checkInAttendeeRemote = createAsyncThunk<Checkin, CheckInPayload>(
  'attendees/checkInRemote',
  async (payload) => {
    const checkin = await checkInAttendeeApi(payload);
    return checkin;
  },
);

const upsertCheckin = (state: AttendeesState, checkin: Checkin) => {
  const list = state.checkinsByEvent[checkin.eventId] || [];
  const existingIndex = list.findIndex((c) => c.attendeeId === checkin.attendeeId);
  if (existingIndex >= 0) {
    list[existingIndex] = checkin;
  } else {
    list.push(checkin);
  }
  state.checkinsByEvent[checkin.eventId] = list;
};

const attendeeSlice = createSlice({
  name: 'attendees',
  initialState,
  reducers: {
    addPendingCheckin: (state, action: PayloadAction<Checkin>) => {
      state.pendingCheckins.push(action.payload);
    },
    markCheckinSynced: (state, action: PayloadAction<{ attendeeId: number; eventId: number }>) => {
      state.pendingCheckins = state.pendingCheckins.filter(
        (c) => !(c.attendeeId === action.payload.attendeeId && c.eventId === action.payload.eventId),
      );
    },
    clearAttendeeError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendees.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAttendees.fulfilled, (state, action) => {
        state.loading = false;
        const eventId = action.meta.arg;
        state.attendeesByEvent[eventId] = action.payload;
      })
      .addCase(fetchAttendees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCheckins.fulfilled, (state, action) => {
        const eventId = action.meta.arg;
        if (eventId) {
          state.checkinsByEvent[eventId] = action.payload;
        } else {
          // group by event
          const grouped: Record<number, Checkin[]> = {};
          action.payload.forEach((c) => {
            if (!grouped[c.eventId]) grouped[c.eventId] = [];
            grouped[c.eventId].push(c);
          });
          state.checkinsByEvent = grouped;
        }
      })
      .addCase(checkInAttendeeRemote.fulfilled, (state, action) => {
        upsertCheckin(state, { ...action.payload, synced: true });
        state.pendingCheckins = state.pendingCheckins.filter(
          (c) => !(c.attendeeId === action.payload.attendeeId && c.eventId === action.payload.eventId),
        );
      })
      .addCase(checkInAttendeeRemote.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { addPendingCheckin, markCheckinSynced, clearAttendeeError } = attendeeSlice.actions;
export default attendeeSlice.reducer;
