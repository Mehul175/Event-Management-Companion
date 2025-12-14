/**
 * Purpose: Centralize API endpoint paths.
 * Author: EventCompanion Team
 * Responsibility: Avoid hardcoded URLs across services.
 */

export const API_BASE_URL = 'http://localhost:3000';

export const endpoints = {
  login: '/users',
  events: '/events',
  attendees: '/attendees',
  checkins: '/checkins',
};

export default endpoints;
