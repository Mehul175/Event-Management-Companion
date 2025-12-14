/**
 * Purpose: Display list of events with loading and error states.
 * Author: EventCompanion Team
 * Responsibility: Provide optimized event list with FlashList and pull-to-refresh.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../../components/event/EventCard';
import EventSkeletonCard from '../../components/event/EventSkeletonCard';
import ESafeAreaWrapper from '../../components/common/ESafeAreaWrapper';
import EText from '../../components/common/EText';
import { flex, gap, margin, padding } from '../../styles';
import { fetchEvents } from '../../features/events/eventSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useTheme } from '../../theme/ThemeContext';
import useAuth from '../../hooks/useAuth';
import { t } from '../../locales';
import { RootStackParamList } from '../../navigation/types';
import type { NavigationProp } from '@react-navigation/native';
import { Event } from '../../api/types';

const ESTIMATED_ITEM_SIZE = 140;

const ItemSeparator = () => <View style={{ height: ms(4) }} />;

const EventsListScreen: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  const { events, loading, error } = useAppSelector((state) => state.events);
  const [localLoading, setLocalLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

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
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('events.error'),
        text2: error,
      });
    }
  }, [error]);

  const onRefresh = useCallback(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleEventPress = useCallback(
    (eventId: number) => {
      navigation.navigate('EventDetail', { eventId });
    },
    [navigation],
  );

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            Toast.show({
              type: 'success',
              text1: t('auth.success.logout'),
            });
          },
        },
      ],
      { cancelable: true },
    );
  }, [logout]);

  const renderItem = useCallback(
    ({ item }: { item: Event }) => <EventCard event={item} onPress={() => handleEventPress(item.id)} />,
    [handleEventPress],
  );

  const renderSkeletonItem = useCallback(
    ({ index }: { item: Event | null; index: number }) => <EventSkeletonCard index={index} />,
    [],
  );

  const renderItemWithSkeleton = useCallback(
    ({ item, index }: { item: Event | null; index: number }) => {
      if (localLoading && events.length > 0 && item === null) {
        return renderSkeletonItem({ item, index });
      }
      if (item) {
        return renderItem({ item });
      }
      return null;
    },
    [localLoading, events.length, renderSkeletonItem, renderItem],
  );

  const keyExtractor = useCallback((item: Event | null, index: number): string => {
    if (item === null) {
      return `skeleton-${index}`;
    }
    return `${item.id}`;
  }, []);

  const ListEmptyComponent = useCallback(() => {
    if (localLoading) {
      return (
        <View style={styles.skeletonContainer}>
          {[0, 1, 2].map((key) => (
            <EventSkeletonCard key={key} index={key} />
          ))}
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <EText type="R14" color={theme.typography.textInputSecondary}>
          {t('events.empty')}
        </EText>
      </View>
    );
  }, [localLoading, styles.emptyState, styles.skeletonContainer, theme.typography.textInputSecondary]);

  // Show skeleton items when refreshing (localLoading and events exist)
  const displayData: (Event | null)[] = localLoading && events.length > 0 ? Array(3).fill(null) : events;

  return (
    <ESafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <EText type="S22">{t('events.title')}</EText>
            <EText type="R12" color={theme.typography.textInputSecondary}>
              {t('common.pullToRefresh')}
            </EText>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.darkModeContainer}>
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny-outline'}
                size={ms(20)}
                color={theme.colors.textSecondary}
                style={styles.darkModeIcon}
              />
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.card}
                ios_backgroundColor={theme.colors.border}
              />
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={ms(24)} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
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
          showsVerticalScrollIndicator={false}
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
      ...flex.rowSpaceBetween,
      ...flex.itemsCenter,
      ...margin.mb12,
    },
    headerLeft: {
      ...gap.g4,
      ...flex.flex,
    },
    headerRight: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g12,
    },
    darkModeContainer: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g8,
    },
    darkModeIcon: {
      ...margin.mr4,
    },
    logoutButton: {
      ...padding.p8,
    },
    listContent: {
      ...padding.pb20,
    },
    emptyState: {
      ...flex.flexCenter,
      ...padding.pv20,
    },
    skeletonContainer: {
      ...gap.g12,
    },
  });

export default EventsListScreen;
