/**
 * Purpose: Mock notification service for app events.
 * Author: EventCompanion Team
 * Responsibility: Provide in-app toasts simulating notifications.
 */

import Toast from 'react-native-toast-message';
import { t } from '../locales';

export const notifyEventStarting = (eventTitle: string) => {
  Toast.show({
    type: 'info',
    text1: t('notifications.eventStarting'),
    text2: eventTitle,
  });
};

export const notifySyncComplete = () => {
  Toast.show({
    type: 'success',
    text1: t('notifications.syncComplete'),
  });
};

export default { notifyEventStarting, notifySyncComplete };
