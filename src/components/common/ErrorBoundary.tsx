/**
 * Purpose: Catch runtime errors and render a fallback UI.
 * Author: EventCompanion Team
 * Responsibility: Prevent crashes and allow safe recovery.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';
import EText from './EText';
import { padding, gap } from '../../styles';
import { useTheme } from '../../theme/ThemeContext';
import { t } from '../../locales';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

class ErrorBoundaryBase extends React.Component<Props & { themeColors: ReturnType<typeof useTheme>['theme'] }, State> {
  constructor(props: Props & { themeColors: ReturnType<typeof useTheme>['theme'] }) {
    super(props);
    this.state = { hasError: false, message: undefined };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { themeColors } = this.props;
      return (
        <View style={[styles.fallback, { backgroundColor: themeColors.colors.background }]}>
          <EText type="S18">{t('common.errorFallback')}</EText>
          {this.state.message && (
            <EText type="R12" color={themeColors.typography.textInputSecondary}>
              {this.state.message}
            </EText>
          )}
          <PrimaryButton title={t('common.retry')} onPress={this.handleReset} />
        </View>
      );
    }
    return this.props.children;
  }
}

const ErrorBoundaryWrapper: React.FC<Props> = ({ children }) => {
  const { theme } = useTheme();
  return <ErrorBoundaryBase themeColors={theme}>{children}</ErrorBoundaryBase>;
};

const styles = StyleSheet.create({
  fallback: {
    ...padding.p16,
    ...gap.g12,
  },
});

export default ErrorBoundaryWrapper;
