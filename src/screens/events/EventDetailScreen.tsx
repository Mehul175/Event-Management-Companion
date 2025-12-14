/**
 * @author: [EventCompanion Team]
 * @date: 14-12-2025
 * @lastModifiedBy: [EventCompanion Team]
 * @lastModifiedDate: 14-12-2025
 * @version: 1.0.0
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
import ESafeAreaWrapper from '../../components/common/ESafeAreaWrapper';
import EText from '../../components/common/EText';
import PrimaryButton from '../../components/common/PrimaryButton';
import Skeleton from '../../components/common/Skeleton';
import { fetchAttendees } from '../../features/attendees/attendeeSlice';
import { fetchEventDetails, setSelectedEvent } from '../../features/events/eventSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { flex, gap, margin, padding } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import { t } from '../../locales';
import { RootStackParamList } from '../../navigation/types';
import { notifyEventStarting } from '../../services/notificationService';

const EventDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    params: { eventId },
  } = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();

  const { events, selectedEvent, loading } = useAppSelector((state) => state.events);
  const { attendeesByEvent } = useAppSelector((state) => state.attendees);

  const eventFromList = useMemo(() => events.find((evt) => evt.id === eventId), [events, eventId]);
  const event = selectedEvent?.id === eventId ? selectedEvent : eventFromList;
  const attendeeCount = attendeesByEvent[eventId]?.length ?? '--';
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (!event) {
      dispatch(fetchEventDetails(eventId));
    } else {
      dispatch(setSelectedEvent(event));
    }
    dispatch(fetchAttendees(eventId));
  }, [dispatch, event, eventId]);

  useEffect(() => {
    if (event) {
      const start = new Date(event.startTime).getTime();
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      if (start - now <= oneHour && start > now) {
        notifyEventStarting(event.title);
      }
    }
  }, [event]);

  if (loading && !event) {
    return (
      <ESafeAreaWrapper>
        <View style={styles.container}>
          <Skeleton
            isLoading
            containerStyle={styles.skeleton}
            layout={[
              { key: 'title', width: '70%', height: 24, marginBottom: 10 },
              { key: 'desc', width: '90%', height: 16, marginBottom: 8 },
              { key: 'meta', width: '60%', height: 14 },
            ]}
          />
        </View>
      </ESafeAreaWrapper>
    );
  }

  if (!event) {
    return (
      <ESafeAreaWrapper>
        <View style={styles.container}>
          <EText type="R14">{t('events.error')}</EText>
        </View>
      </ESafeAreaWrapper>
    );
  }

  return (
    <ESafeAreaWrapper>
      <View style={styles.container}>
        <EText type="S22" style={margin.mb8}>
          {event.title}
        </EText>
        <EText type="R14" color={theme.typography.textInputSecondary} style={margin.mb12}>
          {event.description}
        </EText>

        <View style={styles.infoRow}>
          <EText type="S16">{t('events.details.location')}</EText>
          <EText type="R14" color={theme.typography.muted}>
            {event.location}
          </EText>
        </View>

        <View style={styles.infoRow}>
          <EText type="S16">{t('events.details.startsAt')}</EText>
          <EText type="R14" color={theme.typography.muted}>
            {new Date(event.startTime).toLocaleString()}
          </EText>
        </View>

        <View style={styles.infoRow}>
          <EText type="S16">{t('events.details.endsAt')}</EText>
          <EText type="R14" color={theme.typography.muted}>
            {new Date(event.endTime).toLocaleString()}
          </EText>
        </View>

        <View style={styles.infoRow}>
          <EText type="S16">{t('events.details.attendeeCount', { count: attendeeCount })}</EText>
        </View>

        <PrimaryButton
          title={t('events.details.checkInCta')}
          onPress={() => navigation.navigate('Attendees', { eventId })}
          style={styles.cta}
        />
      </View>
    </ESafeAreaWrapper>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      ...flex.flex,
      ...padding.ph20,
      ...padding.pv16,
      backgroundColor: theme.colors.background,
      ...gap.g12,
    },
    infoRow: {
      ...gap.g4,
    },
    cta: {
      ...margin.mt16,
    },
    skeleton: {
      ...padding.p16,
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
    },
  });

export default EventDetailScreen;
