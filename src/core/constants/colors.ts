// Define color constants for the application
// This includes support for light/dark mode and accessibility options

// Color palette - these are base colors that don't change with theme
const palette = {
  // Primary colors
  blue: {
    100: '#E3F2FD',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Primary blue
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Secondary colors
  teal: {
    100: '#E0F2F1',
    200: '#B2DFDB',
    300: '#80CBC4',
    400: '#4DB6AC',
    500: '#26A69A', // Primary teal
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  },
  
  // Neutrals
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Status colors
  red: {
    100: '#FFEBEE',
    200: '#FFCDD2',
    300: '#EF9A9A',
    400: '#E57373',
    500: '#F44336', // Error red
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  
  green: {
    100: '#E8F5E9',
    200: '#C8E6C9',
    300: '#A5D6A7',
    400: '#81C784',
    500: '#4CAF50', // Success green
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  
  orange: {
    100: '#FFF3E0',
    200: '#FFE0B2',
    300: '#FFCC80',
    400: '#FFB74D',
    500: '#FF9800', // Warning orange
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  
  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Common contrast ratios targets for WCAG AA compliance
// Text: 4.5:1 for normal text, 3:1 for large text
// UI elements: 3:1 for UI components and graphical objects

// Color tokens for the app
export const colors = {
  // Primary brand colors
  primary: palette.blue[500],
  primaryDark: palette.blue[700],
  primaryLight: palette.blue[300],
  
  // Secondary colors
  secondary: palette.teal[500],
  secondaryDark: palette.teal[700],
  secondaryLight: palette.teal[300],
  
  // Status colors
  success: palette.green[500],
  error: palette.red[500],
  warning: palette.orange[500],
  info: palette.blue[400],
  
  // Neutrals for light theme
  lightBackground: palette.white,
  lightCard: palette.white,
  lightText: palette.gray[900],
  lightTextSecondary: palette.gray[700],
  lightBorder: palette.gray[300],
  lightPlaceholder: palette.gray[500],
  
  // Neutrals for dark theme
  darkBackground: palette.gray[900],
  darkCard: palette.gray[800],
  darkText: palette.white,
  darkTextSecondary: palette.gray[400],
  darkBorder: palette.gray[700],
  darkPlaceholder: palette.gray[600],
  
  // Shared properties (these will be set dynamically in the theme provider)
  background: palette.white, // Will be overridden by theme
  card: palette.white, // Will be overridden by theme
  text: palette.gray[900], // Will be overridden by theme
  textSecondary: palette.gray[700], // Will be overridden by theme
  border: palette.gray[300], // Will be overridden by theme
  shadow: palette.black,
  
  // Others
  disabled: palette.gray[300],
  disabledText: palette.gray[500],
  icon: palette.gray[600],
  notification: palette.red[500],
  inputBackground: palette.white,
  
  // Specific to inputs and forms
  inputBorder: palette.gray[300],
  inputText: palette.gray[900],
  placeholder: palette.gray[500],
  inputFocus: palette.blue[500],
  
  // Specific to alerts and status indicators
  errorBackground: palette.red[100],
  warningBackground: palette.orange[100],
  successBackground: palette.green[100],
  infoBackground: palette.blue[100],
};

// Export the palette for specific use cases where direct color access is needed
export { palette };
