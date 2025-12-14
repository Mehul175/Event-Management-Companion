/**
 * Purpose: Display list of events with loading and error states.
 * Author: EventCompanion Team
 * Responsibility: Provide optimized event list with FlashList and pull-to-refresh.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { Alert, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../../components/event/EventCard';
import ESafeAreaWrapper from '../../components/common/ESafeAreaWrapper';
import EText from '../../components/common/EText';
import Skeleton from '../../components/common/Skeleton';
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
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  const { events, loading, error } = useAppSelector((state) => state.events);
  const styles = useMemo(() => createStyles(theme), [theme]);

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

  const keyExtractor = useCallback((item: any) => `${item.id}`, []);

  const ListEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          {[0, 1, 2].map((key) => (
            <Skeleton
              key={key}
              isLoading
              containerStyle={styles.skeleton}
              layout={[
                { key: `title-${key}`, width: '70%', height: 20, marginBottom: 8 },
                { key: `desc-${key}`, width: '90%', height: 16, marginBottom: 6 },
                { key: `meta-${key}`, width: '60%', height: 14 },
              ]}
            />
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
  }, [loading, styles.emptyState, styles.skeleton, styles.skeletonContainer, theme.typography.textInputSecondary]);

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
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={ms(24)} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <FlashList
          data={events}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          ListEmptyComponent={ListEmptyComponent}
          ItemSeparatorComponent={ItemSeparator}
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
      ...flex.rowSpaceBetween,
      ...flex.itemsCenter,
      ...margin.mb12,
    },
    headerLeft: {
      ...gap.g4,
      ...flex.flex,
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
    skeleton: {
      ...padding.p16,
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
    },
  });

export default EventsListScreen;
