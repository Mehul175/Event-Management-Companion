/**
 * Purpose: Sync pending offline operations when connectivity is restored.
 * Author: EventCompanion Team
 * Responsibility: Retry queued check-ins and mark them as synced.
 */

import { AppDispatch } from '../redux/store';
import { Checkin } from '../api/types';
import { checkInAttendeeRemote, markCheckinSynced } from '../features/attendees/attendeeSlice';
import { notifySyncComplete } from './notificationService';

export const syncPendingCheckins = async (dispatch: AppDispatch, pending: Checkin[]) => {
  const unsynced = pending.filter((item) => !item.synced);
  let syncedAny = false;
  for (const item of unsynced) {
    try {
      await dispatch(
        checkInAttendeeRemote({ attendeeId: item.attendeeId, eventId: item.eventId }),
      ).unwrap();
      dispatch(markCheckinSynced({ attendeeId: item.attendeeId, eventId: item.eventId }));
      syncedAny = true;
    } catch (err) {
      // Keep in queue for next attempt.
    }
  }
  if (syncedAny) {
    notifySyncComplete();
  }
};

export default { syncPendingCheckins };
