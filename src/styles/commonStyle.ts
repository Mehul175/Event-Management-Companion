/**
 * Purpose: Common reusable styles shared across screens.
 * Author: EventCompanion Team
 * Responsibility: Provide base container and helper styles aligned with theme.
 */

import { StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../theme/ThemeContext';
import flex from './flex';
import margin from './margin';
import padding from './padding';

const createCommonStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    mainContainer: {
      ...flex.flex,
      backgroundColor: theme.colors.background,
    },
    backIcon: {
      marginLeft: ms(-10),
    },
    headerContainer: {
      ...flex.flexRow,
      ...flex.itemsCenter,
      ...margin.mh24,
      ...margin.mb46,
    },
    headerTextWrapper: {
      ...flex.flex,
      ...flex.itemsCenter,
    },
    innerContainer: {
      ...padding.ph24,
      ...margin.mt24,
    },
    underLineText: {
      textDecorationLine: 'underline',
    },
    capitalizeTextStyle: {
      textTransform: 'capitalize',
    },
  });
};

export default createCommonStyles;
