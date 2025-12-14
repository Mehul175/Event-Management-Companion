/**
 * Purpose: Render event summary for lists.
 * Author: EventCompanion Team
 * Responsibility: Show key event info with themed styling.
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { Event } from '../../api/types';
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <EText type="S18">{event.title}</EText>
        <EText type="R12" color={theme.typography.textInputSecondary}>
          {new Date(event.startTime).toLocaleDateString()}
        </EText>
      </View>
      <EText type="R14" color={theme.typography.textInputSecondary} style={margin.mb6}>
        {event.description}
      </EText>
      <View style={styles.metaRow}>
        <EText type="R12" color={theme.typography.muted}>
          {event.location}
        </EText>
        <EText type="R12" color={theme.typography.muted}>
          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
          {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </EText>
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
      ...padding.p16,
      ...margin.mb12,
      ...gap.g8,
    },
    row: {
      ...flex.rowSpaceBetween,
      ...gap.g6,
      alignItems: 'center',
    },
    metaRow: {
      ...flex.rowSpaceBetween,
      ...gap.g6,
      alignItems: 'center',
    },
  });

export default React.memo(EventCard);
