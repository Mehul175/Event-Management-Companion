/**
 * Purpose: Define strongly typed theme contracts for colors and typography.
 * Author: EventCompanion Team
 * Responsibility: Keep theme shape consistent across the app.
 */

import type Typography from '../typography';

export type ColorPalette = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  success: string;
  successDark: string;
  error: string;
  errorDark: string;
  warning: string;
  toastSuccessBg: string;
  toastErrorBg: string;
  toastInfoBg: string;
  skeletonHighlight: string;
  skeletonBackground: string;
};

export type TypographyPalette = {
  text: string;
  textInputSecondary: string;
  muted: string;
  successDark: string;
  errorDark: string;
  secondaryDark: string;
};

export type Theme = {
  colors: ColorPalette;
  typography: TypographyPalette;
  fonts: typeof Typography;
};
