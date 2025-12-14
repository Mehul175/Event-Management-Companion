/**
 * Purpose: Common flexbox utilities for layout composition.
 * Author: EventCompanion Team
 * Responsibility: Provide reusable flex styles for consistent layouts.
 */

import { StyleSheet, ViewStyle } from 'react-native';

type FlexStyles = Record<
  | 'flex'
  | 'flex0'
  | 'flexGrow1'
  | 'flexRow'
  | 'flexColumn'
  | 'flexCenter'
  | 'rowCenter'
  | 'rowSpaceBetween'
  | 'rowSpaceAround'
  | 'rowEnd'
  | 'rowStart'
  | 'justifyBetween'
  | 'justifyCenter'
  | 'justifyEnd'
  | 'justifyStart'
  | 'justifyEvenly'
  | 'alignStart'
  | 'itemsCenter'
  | 'itemsStart'
  | 'itemsEnd'
  | 'wrap'
  | 'selfCenter'
  | 'selfStart'
  | 'selfEnd'
  | 'contentCenter',
  ViewStyle
>;

const flex: FlexStyles = StyleSheet.create({
  flex: { flex: 1 },
  flex0: { flex: 0 },
  flexGrow1: { flexGrow: 1 },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  flexCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowSpaceAround: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  rowEnd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  rowStart: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  alignStart: { alignItems: 'flex-start', justifyContent: 'center' },
  itemsCenter: { alignItems: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  wrap: { flexWrap: 'wrap' },
  selfCenter: { alignSelf: 'center' },
  selfStart: { alignSelf: 'flex-start' },
  selfEnd: { alignSelf: 'flex-end' },
  contentCenter: { alignContent: 'center' },
});

export default flex;
