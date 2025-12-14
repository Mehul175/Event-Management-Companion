/**
 * Purpose: Event API interactions.
 * Author: EventCompanion Team
 * Responsibility: Fetch events and details from the backend.
 */

import api from '../api/axios';
import endpoints from '../api/endpoints';
import { Event } from '../api/types';

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>(endpoints.events);
  return response.data;
};

export const fetchEventById = async (eventId: number): Promise<Event> => {
  const response = await api.get<Event>(`${endpoints.events}/${eventId}`);
  return response.data;
};

export default { fetchEvents, fetchEventById };
