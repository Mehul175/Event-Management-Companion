/**
 * Purpose: Safe area wrapper with configurable edges.
 * Author: EventCompanion Team
 * Responsibility: Wrap screens with consistent safe area handling.
 */

import React from 'react';
import { Edge, SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import createCommonStyles from '../../styles/commonStyle';

type Props = Omit<SafeAreaViewProps, 'edges'> & {
  children: React.ReactNode;
  edges?: Edge[];
  withBottomInset?: boolean;
  withTopInset?: boolean;
};

const ESafeAreaWrapper: React.FC<Props> = ({
  children,
  edges,
  withBottomInset = true,
  withTopInset = true,
  style,
  ...props
}) => {
  const styles = createCommonStyles();
  const defaultEdges: Edge[] = [];
  if (withTopInset) defaultEdges.push('top');
  if (withBottomInset) defaultEdges.push('bottom');

  return (
    <SafeAreaView edges={edges || defaultEdges} style={[styles.mainContainer, style]} {...props}>
      {children}
    </SafeAreaView>
  );
};

export default ESafeAreaWrapper;
