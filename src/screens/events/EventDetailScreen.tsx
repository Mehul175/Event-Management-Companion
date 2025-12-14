/**
 * @author: [EventCompanion Team]
 * @date: 14-12-2025
 * @lastModifiedBy: [EventCompanion Team]
 * @lastModifiedDate: 14-12-2025
 * @version: 1.0.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRoute, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    if (!event) {
      dispatch(fetchEventDetails(eventId));
    } else {
      dispatch(setSelectedEvent(event));
    }
    dispatch(fetchAttendees(eventId));
  }, [dispatch, event, eventId]);

  useEffect(() => {
    if (event && event.date) {
      const start = new Date(event.date).getTime();
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      if (start - now <= oneHour && start > now) {
        notifyEventStarting(event.title);
      }
    }
  }, [event]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const onRefresh = useCallback(() => {
    dispatch(fetchEventDetails(eventId));
    dispatch(fetchAttendees(eventId));
  }, [dispatch, eventId]);

  const eventDate = event?.date ? new Date(event.date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString() : '';
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const renderSkeleton = () => (
    <ESafeAreaWrapper>
      <View style={styles.container}>
        {/* Header skeleton */}
        <View style={styles.header}>
          <Skeleton
            isLoading
            containerStyle={styles.skeletonBackButton}
            layout={[{ key: 'back', width: ms(24), height: ms(24) }]}
          />
          <Skeleton
            isLoading
            containerStyle={styles.skeletonHeaderTitle}
            layout={[{ key: 'header-title', width: ms(150), height: ms(20) }]}
          />
          <View style={styles.backButtonPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {/* Image skeleton */}
          <Skeleton
            isLoading
            containerStyle={styles.skeletonImage}
            layout={[{ key: 'image', width: '100%', height: ms(250) }]}
          />

          {/* Content skeleton */}
          <View style={styles.content}>
            {/* Title row skeleton */}
            <View style={styles.titleRow}>
              <Skeleton
                isLoading
                containerStyle={styles.skeletonTitleContainer}
                layout={[
                  { key: 'title', width: '70%', height: ms(28) },
                  { key: 'title-line2', width: '50%', height: ms(28), marginTop: ms(4) },
                ]}
              />
              <Skeleton
                isLoading
                containerStyle={styles.skeletonDate}
                layout={[{ key: 'date', width: ms(100), height: ms(16) }]}
              />
            </View>

            {/* Description skeleton */}
            <Skeleton
              isLoading
              containerStyle={styles.skeletonDescription}
              layout={[
                { key: 'desc-1', width: '100%', height: ms(16), marginTop: ms(16) },
                { key: 'desc-2', width: '90%', height: ms(16), marginTop: ms(4) },
                { key: 'desc-3', width: '80%', height: ms(16), marginTop: ms(4) },
              ]}
            />

            {/* Info cards skeleton */}
            {[0, 1, 2].map((key) => (
              <View key={key} style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLabel}>
                    <Skeleton
                      isLoading
                      containerStyle={styles.skeletonIcon}
                      layout={[{ key: `icon-${key}`, width: ms(20), height: ms(20) }]}
                    />
                    <Skeleton
                      isLoading
                      containerStyle={styles.skeletonLabel}
                      layout={[{ key: `label-${key}`, width: ms(100), height: ms(16) }]}
                    />
                  </View>
                  <Skeleton
                    isLoading
                    containerStyle={styles.skeletonValue}
                    layout={[{ key: `value-${key}`, width: ms(120), height: ms(14) }]}
                  />
                </View>
              </View>
            ))}

            {/* Button skeleton */}
            <Skeleton
              isLoading
              containerStyle={styles.skeletonButton}
              layout={[{ key: 'button', width: '100%', height: ms(50) }]}
            />
          </View>
        </ScrollView>
      </View>
    </ESafeAreaWrapper>
  );

  if (localLoading) {
    return renderSkeleton();
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
        {/* Header with back arrow */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={ms(24)} color={theme.colors.text} />
          </TouchableOpacity>
          <EText type="S20" style={styles.headerTitle}>
            {t('events.details.title')}
          </EText>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        >
          {/* Event Image */}
          {event.image && (
            <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
          )}

          {/* Event Content */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <EText type="S24" style={styles.title}>
                {event.title}
              </EText>
              {formattedDate && (
                <EText type="R14" color={theme.colors.primary} style={styles.date}>
                  {formattedDate}
                </EText>
              )}
            </View>

            <EText type="R16" color={theme.typography.textInputSecondary} style={styles.description}>
              {event.description}
            </EText>

            {/* Info Cards */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="location-outline" size={ms(20)} color={theme.colors.primary} />
                  <EText type="S16" style={styles.infoLabelText}>
                    {t('events.details.location')}
                  </EText>
                </View>
                <EText type="R14" color={theme.typography.muted} style={styles.infoValue}>
                  {event.location}
                </EText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="time-outline" size={ms(20)} color={theme.colors.primary} />
                  <EText type="S16" style={styles.infoLabelText}>
                    {t('events.details.startsAt')}
                  </EText>
                </View>
                <EText type="R14" color={theme.typography.muted} style={styles.infoValue}>
                  {formattedTime || (event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--')}
                </EText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="people-outline" size={ms(20)} color={theme.colors.primary} />
                  <EText type="S16" style={styles.infoLabelText}>
                    {t('events.details.attendeeCount', { count: attendeeCount })}
                  </EText>
                </View>
              </View>
            </View>

            <PrimaryButton
              title={t('events.details.checkInCta')}
              onPress={() => navigation.navigate('Attendees', { eventId })}
              style={styles.cta}
            />
          </View>
        </ScrollView>
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
    scrollView: {
      ...flex.flex,
    },
    scrollContent: {
      ...padding.pb20,
    },
    eventImage: {
      width: '100%',
      height: ms(250),
      backgroundColor: theme.colors.border,
    },
    content: {
      ...padding.ph20,
      ...padding.pv16,
      ...gap.g16,
    },
    titleRow: {
      ...flex.rowSpaceBetween,
      ...flex.itemsStart,
      ...gap.g12,
      ...margin.mb8,
    },
    title: {
      ...flex.flex,
      ...flex.flexGrow1,
    },
    date: {
      ...flex.flex0,
    },
    description: {
      ...margin.mb16,
    },
    infoCard: {
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
      borderWidth: ms(1),
      borderColor: theme.colors.border,
      ...padding.p16,
      ...margin.mb12,
    },
    infoRow: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g12,
    },
    infoLabel: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g8,
      ...flex.flex,
    },
    infoLabelText: {
      ...flex.flex,
    },
    infoValue: {
      ...flex.flex0,
      textAlign: 'right',
      ...flex.flex,
    },
    cta: {
      ...margin.mt8,
    },
    skeletonBackButton: {
      ...padding.p8,
      ...margin.mr8,
    },
    skeletonHeaderTitle: {
      ...flex.flex,
      alignItems: 'center',
    },
    skeletonImage: {
      width: '100%',
      height: ms(250),
      backgroundColor: theme.colors.border,
    },
    skeletonTitleContainer: {
      ...flex.flex,
      ...flex.flexGrow1,
    },
    skeletonDate: {
      ...flex.flex0,
    },
    skeletonDescription: {
      ...margin.mb16,
    },
    skeletonIcon: {
      ...flex.flex0,
    },
    skeletonLabel: {
      ...flex.flex,
    },
    skeletonValue: {
      ...flex.flex0,
    },
    skeletonButton: {
      ...margin.mt8,
      borderRadius: ms(8),
    },
  });

export default EventDetailScreen;
