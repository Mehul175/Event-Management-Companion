/**
 * Purpose: Navigation type definitions.
 * Author: EventCompanion Team
 * Responsibility: Keep navigation params typed across screens.
 */

export type RootStackParamList = {
  Login: undefined;
  Events: undefined;
  EventDetail: { eventId: number };
  Attendees: { eventId: number };
};
