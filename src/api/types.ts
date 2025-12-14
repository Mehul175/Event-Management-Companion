/**
 * Purpose: Shared API types used across services and Redux slices.
 * Author: EventCompanion Team
 * Responsibility: Keep server contract definitions in one place.
 */

export type UserRole = 'organizer' | 'staff';

export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  token: string;
  role: UserRole;
};

export type Attendee = {
  id: number;
  eventId: number;
  name: string;
  email: string;
  company?: string;
};

export type CheckinStatus = 'pending' | 'checked_in';

export type Checkin = {
  id: number;
  eventId: number;
  attendeeId: number;
  status: CheckinStatus;
  timestamp: string;
  synced?: boolean;
};

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export type PaginatedResponse<T> = {
  data: T[];
  total?: number;
};

export type ApiResponse<T> = {
  data: T;
};
/**
 * @description API Types - Define TypeScript types for API requests and responses
 * @author [EventCompanion Team]
 * @date 14-12-2025
 * @lastModifiedBy [EventCompanion Team]
 * @lastModifiedDate 14-12-2025
 * @version 1.0.0
 */

// User types
export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
  image?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: number;
  organizer?: User;
  image?: string;
}

export interface EventListResponse {
  events: Event[];
  total: number;
}

// Attendee types
export interface Attendee {
  id: number;
  eventId: number;
  name: string;
  email: string;
  checkedIn: boolean;
  checkedInAt?: string;
  image?: string;
}

export interface AttendeeListResponse {
  attendees: Attendee[];
  total: number;
}

// Check-in types
export interface CheckInRequest {
  attendeeId: number;
  eventId: number;
}

export interface CheckInResponse {
  id: number;
  attendeeId: number;
  eventId: number;
  timestamp: string;
  synced: boolean;
}

export interface CheckOutRequest {
  attendeeId: number;
  eventId: number;
}

// API Error Response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
