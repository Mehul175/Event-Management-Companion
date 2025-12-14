/**
 * Purpose: Manage attendee list with search and check-ins.
 * Author: EventCompanion Team
 * Responsibility: Support online/offline check-ins with syncing queue.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { ms } from 'react-native-size-matters';
import AttendeeCard from '../../components/attendee/AttendeeCard';
import ESafeAreaWrapper from '../../components/common/ESafeAreaWrapper';
import ESearchInput from '../../components/common/ESearchInput';
import EText from '../../components/common/EText';
import Skeleton from '../../components/common/Skeleton';
import {
  addCheckinImmediately,
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

const ItemSeparator = () => <View style={{ height: ms(4) }} />;

const AttendeesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const {
    params: { eventId },
  } = useRoute<RouteProp<RootStackParamList, 'Attendees'>>();

  const dispatch = useAppDispatch();
  const { attendeesByEvent, checkinsByEvent, pendingCheckins, loading, error } = useAppSelector(
    (state) => state.attendees,
  );
  const { isConnected } = useAppSelector((state) => state.network);
  const [localLoading, setLocalLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [search, setSearch] = useState('');

  // Manage local loading state with minimum 3 second display
  useEffect(() => {
    if (loading) {
      // When Redux loading starts, immediately show skeleton
      setLocalLoading(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      // When Redux loading ends, wait 3 seconds before hiding skeleton
      timeoutRef.current = setTimeout(() => {
        setLocalLoading(false);
        timeoutRef.current = null;
      }, 2000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [loading]);

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

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
        // Also add to state immediately for instant UI update
        dispatch(addCheckinImmediately(payload));
        Toast.show({
          type: 'info',
          text1: t('offline.status'),
          text2: t('attendees.pendingSync'),
        });
        return;
      }

      // Optimistically update UI immediately
      dispatch(addCheckinImmediately(payload));

      try {
        await dispatch(
          checkInAttendeeRemote({ attendeeId: payload.attendeeId, eventId: payload.eventId }),
        ).unwrap();
        // State is already updated optimistically, API response will confirm/update it
        Toast.show({
          type: 'success',
          text1: t('attendees.checkedIn'),
        });
      } catch {
        // On error, the optimistic update stays but marked as pending
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

  const renderSkeletonItem = useCallback(
    ({ index }: { item: Attendee | null; index: number }) => (
      <View style={styles.skeletonCard}>
        {/* Name */}
        <Skeleton
          isLoading
          containerStyle={styles.skeletonNameContainer}
          layout={[
            { key: `name-${index}`, width: '65%', height: ms(18) },
            { key: `company-${index}`, width: '50%', height: ms(14), marginTop: ms(4) },
          ]}
        />
        {/* Email */}
        <Skeleton
          isLoading
          containerStyle={styles.skeletonEmail}
          layout={[{ key: `email-${index}`, width: '80%', height: ms(14) }]}
        />
        {/* Footer: Status + Button */}
        <View style={styles.skeletonFooter}>
          <View style={styles.skeletonStatusRow}>
            <Skeleton
              isLoading
              containerStyle={styles.skeletonIcon}
              layout={[{ key: `icon-${index}`, width: ms(18), height: ms(18) }]}
            />
            <Skeleton
              isLoading
              containerStyle={styles.skeletonStatus}
              layout={[{ key: `status-${index}`, width: ms(100), height: ms(14) }]}
            />
          </View>
        </View>
      </View>
    ),
    [styles],
  );

  const renderItemWithSkeleton = useCallback(
    ({ item, index }: { item: Attendee | null; index: number }) => {
      if (localLoading && attendees.length > 0 && item === null) {
        return renderSkeletonItem({ item, index });
      }
      if (item) {
        return renderItem({ item });
      }
      return null;
    },
    [localLoading, attendees.length, renderSkeletonItem, renderItem],
  );

  const keyExtractor = useCallback((item: Attendee | null, index: number): string => {
    if (item === null) {
      return `skeleton-${index}`;
    }
    return `${item.id}`;
  }, []);

  const ListEmptyComponent = useCallback(() => {
    if (localLoading) {
      return (
        <View style={styles.skeletonContainer}>
          {[0, 1, 2, 3].map((key) => (
            <View key={key} style={styles.skeletonCard}>
              {/* Name */}
              <Skeleton
                isLoading
                containerStyle={styles.skeletonNameContainer}
                layout={[
                  { key: `name-empty-${key}`, width: '65%', height: ms(18) },
                  { key: `company-empty-${key}`, width: '50%', height: ms(14), marginTop: ms(4) },
                ]}
              />
              {/* Email */}
              <Skeleton
                isLoading
                containerStyle={styles.skeletonEmail}
                layout={[{ key: `email-empty-${key}`, width: '80%', height: ms(14) }]}
              />
              {/* Footer: Status + Button */}
              <View style={styles.skeletonFooter}>
                <View style={styles.skeletonStatusRow}>
                  <Skeleton
                    isLoading
                    containerStyle={styles.skeletonIcon}
                    layout={[{ key: `icon-empty-${key}`, width: ms(18), height: ms(18) }]}
                  />
                  <Skeleton
                    isLoading
                    containerStyle={styles.skeletonStatus}
                    layout={[{ key: `status-empty-${key}`, width: ms(100), height: ms(14) }]}
                  />
                </View>
                <Skeleton
                  isLoading
                  containerStyle={styles.skeletonButton}
                  layout={[{ key: `button-empty-${key}`, width: ms(90), height: ms(36) }]}
                />
              </View>
            </View>
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
  }, [localLoading, styles, theme.typography.textInputSecondary]);

  // Show skeleton items when refreshing (localLoading and attendees exist)
  const displayData: (Attendee | null)[] = localLoading && attendees.length > 0 ? Array(3).fill(null) : filteredAttendees;

  return (
    <ESafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with back arrow */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={ms(24)} color={theme.colors.text} />
          </TouchableOpacity>
          <EText type="S20" style={styles.headerTitle}>
            {t('attendees.title')}
          </EText>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <ESearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('attendees.searchPlaceholder')}
          />
        </View>

        <FlashList
          data={displayData}
          renderItem={renderItemWithSkeleton}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          ListEmptyComponent={ListEmptyComponent}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          extraData={checkins}
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
    },
    header: {
      ...flex.rowSpaceBetween,
      ...flex.itemsCenter,
      ...padding.ph16,
      ...padding.pv12,
      backgroundColor: theme.colors.background,
      borderBottomWidth: ms(1),
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      ...padding.p8,
      ...margin.mr8,
    },
    backButtonPlaceholder: {
      width: ms(40),
    },
    headerTitle: {
      ...flex.flex,
      textAlign: 'center',
    },
    searchContainer: {
      ...flex.flexRow,
      ...padding.ph16,
      ...padding.pv12,
      ...margin.mb12,
      backgroundColor: theme.colors.background,
      width: '100%',
    },
    listContent: {
      ...padding.pb20,
      ...padding.ph16,
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
    skeletonCard: {
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
      borderWidth: ms(1),
      borderColor: theme.colors.border,
      ...padding.p16,
      overflow: 'hidden',
    },
    skeletonNameContainer: {
      ...margin.mb12,
    },
    skeletonEmail: {
      ...margin.mb12,
    },
    skeletonFooter: {
      ...flex.rowSpaceBetween,
      ...gap.g12,
      ...flex.itemsCenter,
    },
    skeletonStatusRow: {
      ...flex.flexRow,
      ...gap.g6,
      ...flex.itemsCenter,
    },
    skeletonIcon: {
      ...flex.flex0,
    },
    skeletonStatus: {
      ...flex.flex,
    },
    skeletonButton: {
      ...flex.flex0,
      borderRadius: ms(8),
      minHeight: ms(36),
    },
  });

export default AttendeesScreen;
