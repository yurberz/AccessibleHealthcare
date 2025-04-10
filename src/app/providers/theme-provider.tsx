import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { colors } from '../../core/constants/colors';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof colors;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  colorScheme: 'light',
  setThemeMode: () => {},
  colors: colors,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const deviceColorScheme = useColorScheme() as ColorScheme || 'light';
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(deviceColorScheme);

  // Update the color scheme based on the theme mode and device settings
  useEffect(() => {
    if (themeMode === 'system') {
      setColorScheme(deviceColorScheme);
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode, deviceColorScheme]);

  // Listen for appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system' && colorScheme) {
        setColorScheme(colorScheme as ColorScheme);
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  // Get the appropriate color palette based on the current color scheme
  const themeColors = {
    ...colors,
    background: colorScheme === 'dark' ? colors.darkBackground : colors.lightBackground,
    card: colorScheme === 'dark' ? colors.darkCard : colors.lightCard,
    text: colorScheme === 'dark' ? colors.lightText : colors.darkText,
    border: colorScheme === 'dark' ? colors.darkBorder : colors.lightBorder,
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorScheme,
        setThemeMode,
        colors: themeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
