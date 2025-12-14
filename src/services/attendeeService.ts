/**
 * Purpose: Attendee API interactions.
 * Author: EventCompanion Team
 * Responsibility: Fetch attendees and submit check-ins.
 */

import api from '../api/axios';
import endpoints from '../api/endpoints';
import { Attendee, Checkin } from '../api/types';

export const fetchAttendees = async (eventId: number): Promise<Attendee[]> => {
  const response = await api.get<Attendee[]>(endpoints.attendees, {
    params: { eventId },
  });
  return response.data;
};

export const fetchCheckins = async (eventId?: number): Promise<Checkin[]> => {
  const response = await api.get<Checkin[]>(endpoints.checkins, {
    params: eventId ? { eventId } : undefined,
  });
  return response.data;
};

export type CheckInPayload = {
  eventId: number;
  attendeeId: number;
  timestamp?: string;
};

export const checkInAttendee = async (payload: CheckInPayload): Promise<Checkin> => {
  const response = await api.post<Checkin>(endpoints.checkins, {
    eventId: payload.eventId,
    attendeeId: payload.attendeeId,
    status: 'checked_in',
    timestamp: payload.timestamp || new Date().toISOString(),
    synced: true,
  });
  return response.data;
};

export default { fetchAttendees, fetchCheckins, checkInAttendee };
