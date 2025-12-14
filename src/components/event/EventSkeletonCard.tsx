/**
 * Purpose: Reusable skeleton component matching EventCard layout.
 * Author: EventCompanion Team
 * Responsibility: Provide consistent skeleton loading state for event cards.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { flex, gap, margin, padding } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import Skeleton from '../common/Skeleton';

type Props = {
  index?: number;
};

const EventSkeletonCard: React.FC<Props> = ({ index = 0 }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.skeletonCard}>
      {/* Image skeleton */}
      <Skeleton
        isLoading
        containerStyle={styles.skeletonImage}
        layout={[{ key: `image-${index}`, width: '100%', height: ms(180) }]}
      />
      {/* Content skeleton */}
      <View style={styles.skeletonContent}>
        {/* Header row: Title + Date */}
        <View style={styles.skeletonHeaderRow}>
          <Skeleton
            isLoading
            containerStyle={styles.skeletonTitleContainer}
            layout={[
              { key: `title-${index}`, width: '70%', height: ms(22) },
              { key: `title-line2-${index}`, width: '50%', height: ms(22), marginTop: ms(4) },
            ]}
          />
          <Skeleton
            isLoading
            containerStyle={styles.skeletonDate}
            layout={[{ key: `date-${index}`, width: ms(80), height: ms(16) }]}
          />
        </View>
        {/* Description */}
        <Skeleton
          isLoading
          containerStyle={styles.skeletonDescription}
          layout={[
            { key: `desc-${index}`, width: '90%', height: ms(16), marginTop: ms(12) },
            { key: `desc-line2-${index}`, width: '75%', height: ms(16), marginTop: ms(4) },
          ]}
        />
        {/* Meta row: Location + Time */}
        <View style={styles.skeletonMetaRow}>
          <Skeleton
            isLoading
            containerStyle={styles.skeletonMetaItem}
            layout={[{ key: `location-${index}`, width: ms(100), height: ms(14) }]}
          />
          <Skeleton
            isLoading
            containerStyle={styles.skeletonMetaItem}
            layout={[{ key: `time-${index}`, width: ms(80), height: ms(14) }]}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    skeletonCard: {
      backgroundColor: theme.colors.card,
      borderRadius: ms(12),
      borderWidth: ms(1),
      borderColor: theme.colors.border,
      overflow: 'hidden',
      ...margin.mb12,
    },
    skeletonImage: {
      width: '100%',
      height: ms(180),
      backgroundColor: theme.colors.border,
    },
    skeletonContent: {
      ...padding.p16,
      ...gap.g12,
    },
    skeletonHeaderRow: {
      ...flex.rowSpaceBetween,
      ...gap.g8,
      ...flex.itemsStart,
    },
    skeletonTitleContainer: {
      ...flex.flex,
      ...flex.flexGrow1,
    },
    skeletonDate: {
      ...flex.flex0,
    },
    skeletonDescription: {
      ...margin.mt4,
    },
    skeletonMetaRow: {
      ...flex.flexRow,
      ...gap.g12,
      flexWrap: 'wrap',
      ...margin.mt8,
    },
    skeletonMetaItem: {
      ...flex.flexRow,
      ...flex.itemsCenter,
    },
  });

export default React.memo(EventSkeletonCard);
