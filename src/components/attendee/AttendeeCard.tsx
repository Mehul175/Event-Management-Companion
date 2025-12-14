/**
 * Purpose: Render attendee info with check-in controls.
 * Author: EventCompanion Team
 * Responsibility: Display attendee status and handle check-in actions.
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms } from 'react-native-size-matters';
import { Attendee } from '../../api/types';
import { flex, gap, margin, padding } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import EText from '../common/EText';
import { t } from '../../locales';

type Props = {
  attendee: Attendee;
  status: 'checked_in' | 'pending' | 'not_checked';
  onCheckIn: () => void;
};

const AttendeeCard: React.FC<Props> = ({ attendee, status, onCheckIn }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const isChecked = status === 'checked_in';
  const isPending = status === 'pending';

  return (
    <View style={styles.card}>
      <View style={styles.nameContainer}>
        <EText type="S16" style={styles.name}>
          {attendee.name}
        </EText>
        {attendee.company && (
          <EText type="R12" color={theme.typography.textInputSecondary} style={styles.company}>
            {attendee.company}
          </EText>
        )}
      </View>
      <EText type="R12" color={theme.typography.textInputSecondary} style={styles.email}>
        {attendee.email}
      </EText>

      <View style={styles.footer}>
        <View style={styles.statusRow}>
          <Ionicons
            name={isChecked ? 'checkmark-circle' : isPending ? 'time-outline' : 'ellipse-outline'}
            size={ms(18)}
            color={
              isChecked
                ? theme.colors.success
                : isPending
                  ? theme.colors.warning
                  : theme.typography.textInputSecondary
            }
          />
          <EText type="R12" color={theme.typography.textInputSecondary}>
            {isChecked
              ? tStatusLabel('checked_in')
              : isPending
                ? tStatusLabel('pending')
                : tStatusLabel('not_checked')}
          </EText>
        </View>
        {!isChecked && (
          <TouchableOpacity style={styles.checkInButton} onPress={onCheckIn} activeOpacity={0.85}>
            <EText type="M12" color={theme.colors.card}>
              {tStatusLabel('cta')}
            </EText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const tStatusLabel = (state: 'checked_in' | 'pending' | 'not_checked' | 'cta') => {
  switch (state) {
    case 'checked_in':
      return t('attendees.checkedIn');
    case 'pending':
      return t('attendees.pendingSync');
    case 'cta':
      return t('attendees.checkIn');
    default:
      return t('attendees.checkIn');
  }
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
      borderWidth: ms(1),
      borderColor: theme.colors.border,
      ...padding.p16,
      overflow: 'hidden',
    },
    nameContainer: {
      ...flex.flex,
      ...margin.mb12,
    },
    name: {
      ...margin.mb4,
    },
    company: {
      ...margin.mt0,
    },
    email: {
      ...margin.mb12,
    },
    footer: {
      ...flex.rowSpaceBetween,
      ...gap.g12,
      ...flex.itemsCenter,
    },
    statusRow: {
      ...flex.flexRow,
      ...gap.g6,
      ...flex.itemsCenter,
    },
    checkInButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: ms(8),
      ...padding.pv10,
      ...padding.ph16,
      minHeight: ms(36),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default React.memo(AttendeeCard);
