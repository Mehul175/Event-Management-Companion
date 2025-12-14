/**
 * Purpose: Theme provider and hook for light/dark mode support.
 * Author: EventCompanion Team
 * Responsibility: Supply themed colors and typography to components.
 */

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import Typography from '../typography';
import { darkColors, lightColors } from './colors';
import { Theme } from './types';

type ThemeContextValue = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: { colors: lightColors, typography: defaultTypographyPalette(lightColors), fonts: Typography },
  isDarkMode: false,
  toggleTheme: () => {},
});

function defaultTypographyPalette(colors = lightColors) {
  return {
    text: colors.text,
    textInputSecondary: colors.textSecondary,
    muted: colors.textSecondary,
    successDark: colors.successDark,
    errorDark: colors.errorDark,
    secondaryDark: colors.secondaryDark,
  };
}

type Props = {
  children: ReactNode;
  initialMode?: 'light' | 'dark';
};

export const ThemeProvider: React.FC<Props> = ({ children, initialMode = 'light' }) => {
  const [isDarkMode, setIsDarkMode] = useState(initialMode === 'dark');

  const value = useMemo<ThemeContextValue>(() => {
    const colors = isDarkMode ? darkColors : lightColors;
    return {
      theme: {
        colors,
        typography: defaultTypographyPalette(colors),
        fonts: Typography,
      },
      isDarkMode,
      toggleTheme: () => setIsDarkMode((prev) => !prev),
    };
  }, [isDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
