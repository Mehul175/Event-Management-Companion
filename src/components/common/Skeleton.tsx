/**
 * Purpose: Themed wrapper around react-native-reanimated-skeleton.
 * Author: EventCompanion Team
 * Responsibility: Provide consistent skeleton defaults for loading states.
 */

import React from 'react';
import SkeletonLib, { SkeletonProps as LibSkeletonProps } from 'react-native-reanimated-skeleton';
import { useTheme } from '../../theme/ThemeContext';

export type SkeletonProps = LibSkeletonProps;

const Skeleton: React.FC<SkeletonProps> = ({ boneColor, highlightColor, ...props }) => {
  const { theme } = useTheme();

  return (
    <SkeletonLib
      boneColor={boneColor || theme.colors.skeletonBackground}
      highlightColor={highlightColor || theme.colors.skeletonHighlight}
      {...props}
    />
  );
};

export default Skeleton;
