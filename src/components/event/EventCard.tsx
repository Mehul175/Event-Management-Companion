/**
 * Purpose: Render event summary for lists.
 * Author: EventCompanion Team
 * Responsibility: Show key event info with themed styling.
 */

import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import type { Event } from '../../api/types';
import { flex, gap, margin, padding } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import EText from '../common/EText';

type Props = {
  event: Event;
  onPress?: () => void;
};

const EventCard: React.FC<Props> = ({ event, onPress }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const eventDate = event.date ? new Date(event.date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString() : '';
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <EText type="S18" numberOfLines={2} style={styles.title}>
              {event.title}
            </EText>
          </View>
          {formattedDate && (
            <EText type="R12" color={theme.colors.primary} style={styles.date}>
              {formattedDate}
            </EText>
          )}
        </View>
        <EText type="R14" color={theme.typography.textInputSecondary} numberOfLines={2} style={styles.description}>
          {event.description}
        </EText>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <EText type="R12" color={theme.typography.muted} numberOfLines={1}>
              📍 {event.location}
            </EText>
          </View>
          {formattedTime && (
            <View style={styles.metaItem}>
              <EText type="R12" color={theme.typography.muted}>
                🕐 {formattedTime}
              </EText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
      borderWidth: ms(1),
      borderColor: theme.colors.border,
      overflow: 'hidden',
      ...margin.mb12,
    },
    image: {
      width: '100%',
      height: ms(180),
      backgroundColor: theme.colors.border,
    },
    content: {
      ...padding.p16,
      ...gap.g12,
    },
    headerRow: {
      ...flex.rowSpaceBetween,
      ...gap.g8,
      ...flex.itemsStart,
    },
    titleContainer: {
      ...flex.flex,
      ...flex.flexGrow1,
    },
    title: {
      ...flex.flex,
    },
    date: {
      ...flex.flex0,
    },
    description: {
      ...margin.mt4,
    },
    metaRow: {
      ...flex.flexRow,
      ...gap.g12,
      flexWrap: 'wrap',
      ...margin.mt8,
    },
    metaItem: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...gap.g4,
    },
  });

export default React.memo(EventCard);
