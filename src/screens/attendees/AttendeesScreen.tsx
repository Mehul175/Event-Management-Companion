/**
 * Purpose: Manage attendee list with search and check-ins.
 * Author: EventCompanion Team
 * Responsibility: Support online/offline check-ins with syncing queue.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { RouteProp, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ms } from 'react-native-size-matters';
import AttendeeCard from '../../components/attendee/AttendeeCard';
import ESafeAreaWrapper from '../../components/common/ESafeAreaWrapper';
import ESearchInput from '../../components/common/ESearchInput';
import EText from '../../components/common/EText';
import Skeleton from '../../components/common/Skeleton';
import {
  addPendingCheckin,
  checkInAttendeeRemote,
  fetchAttendees,
  fetchCheckins,
} from '../../features/attendees/attendeeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { flex, gap, margin, padding } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import { t } from '../../locales';
import { Attendee, Checkin } from '../../api/types';
import { RootStackParamList } from '../../navigation/types';

const ESTIMATED_ITEM_SIZE = 96;

const AttendeesScreen: React.FC = () => {
  const { theme } = useTheme();
  const {
    params: { eventId },
  } = useRoute<RouteProp<RootStackParamList, 'Attendees'>>();

  const dispatch = useAppDispatch();
  const { attendeesByEvent, checkinsByEvent, pendingCheckins, loading, error } = useAppSelector(
    (state) => state.attendees,
  );
  const { isConnected } = useAppSelector((state) => state.network);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAttendees(eventId));
    dispatch(fetchCheckins(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('attendees.error'),
        text2: error,
      });
    }
  }, [error]);

  const attendees = useMemo(() => attendeesByEvent[eventId] || [], [attendeesByEvent, eventId]);
  const checkins = useMemo(() => checkinsByEvent[eventId] || [], [checkinsByEvent, eventId]);

  const filteredAttendees = useMemo(() => {
    if (!search) return attendees;
    const term = search.toLowerCase();
    return attendees.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        (item.company || '').toLowerCase().includes(term),
    );
  }, [attendees, search]);

  const getStatus = useCallback(
    (attendeeId: number): 'checked_in' | 'pending' | 'not_checked' => {
      const pending = pendingCheckins.find(
        (c) => c.attendeeId === attendeeId && c.eventId === eventId && !c.synced,
      );
      if (pending) return 'pending';
      const remote = checkins.find((c) => c.attendeeId === attendeeId && c.status === 'checked_in');
      return remote ? 'checked_in' : 'not_checked';
    },
    [checkins, eventId, pendingCheckins],
  );

  const onRefresh = useCallback(() => {
    dispatch(fetchAttendees(eventId));
    dispatch(fetchCheckins(eventId));
  }, [dispatch, eventId]);

  const handleCheckIn = useCallback(
    async (attendeeId: number) => {
      const payload: Checkin = {
        id: Date.now(),
        attendeeId,
        eventId,
        status: 'checked_in',
        timestamp: new Date().toISOString(),
        synced: isConnected,
      };

      if (!isConnected) {
        dispatch(addPendingCheckin(payload));
        Toast.show({
          type: 'info',
          text1: t('offline.status'),
          text2: t('attendees.pendingSync'),
        });
        return;
      }

      try {
        await dispatch(
          checkInAttendeeRemote({ attendeeId: payload.attendeeId, eventId: payload.eventId }),
        ).unwrap();
        Toast.show({
          type: 'success',
          text1: t('attendees.checkedIn'),
        });
      } catch {
        dispatch(addPendingCheckin({ ...payload, synced: false }));
        Toast.show({
          type: 'error',
          text1: t('attendees.pendingSync'),
          text2: t('offline.status'),
        });
      }
    },
    [dispatch, eventId, isConnected],
  );

  const renderItem = useCallback(
    ({ item }: { item: Attendee }) => (
      <AttendeeCard attendee={item} status={getStatus(item.id)} onCheckIn={() => handleCheckIn(item.id)} />
    ),
    [getStatus, handleCheckIn],
  );

  const keyExtractor = useCallback((item: any) => `${item.id}`, []);

  const ListEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          {[0, 1, 2, 3].map((key) => (
            <Skeleton
              key={key}
              isLoading
              containerStyle={styles.skeleton}
              layout={[
                { key: `name-${key}`, width: '50%', height: 18, marginBottom: 8 },
                { key: `email-${key}`, width: '70%', height: 14, marginBottom: 6 },
                { key: `status-${key}`, width: '40%', height: 14 },
              ]}
            />
          ))}
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <EText type="R14" color={theme.typography.textInputSecondary}>
          {t('attendees.empty')}
        </EText>
      </View>
    );
  }, [loading, styles.emptyState, styles.skeleton, styles.skeletonContainer, theme.typography.textInputSecondary]);

  return (
    <ESafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <EText type="S22">{t('attendees.title')}</EText>
          <ESearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('attendees.searchPlaceholder')}
            containerStyle={styles.search}
          />
        </View>

        <FlashList
          data={filteredAttendees}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          ListEmptyComponent={ListEmptyComponent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ESafeAreaWrapper>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      ...flex.flex,
      backgroundColor: theme.colors.background,
      ...padding.ph16,
      ...padding.pv12,
    },
    header: {
      ...gap.g12,
      ...margin.mb12,
    },
    search: {
      ...margin.mt4,
    },
    listContent: {
      ...padding.pb20,
    },
    separator: {
      height: ms(4),
    },
    emptyState: {
      ...flex.flex,
      ...flex.itemsCenter,
      ...flex.justifyCenter,
      ...padding.pv20,
    },
    skeletonContainer: {
      ...gap.g12,
    },
    skeleton: {
      ...padding.p16,
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
    },
  });

export default AttendeesScreen;
