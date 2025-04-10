import { AccessibilityInfo, Platform } from 'react-native';
import { useAccessibilitySettings } from '../../app/providers/accessibility-provider';

/**
 * Screen reader utilities to improve accessibility
 * 
 * These functions help manage screen reader interactions and announcements
 */

/**
 * Check if a screen reader is currently active
 * 
 * @returns Promise that resolves to true if a screen reader is active
 */
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  return await AccessibilityInfo.isScreenReaderEnabled();
};

/**
 * Announce a message to screen readers
 * 
 * @param message The message to announce
 * @param options Priority options (polite vs assertive)
 */
export const announceForAccessibility = (
  message: string,
  options?: { polite?: boolean }
): void => {
  if (!message) return;
  
  // Default to polite announcements
  const polite = options?.polite ?? true;
  
  // Use platform-specific announcement methods for best results
  if (Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(message);
  } else if (Platform.OS === 'android') {
    if (polite) {
      AccessibilityInfo.announceForAccessibility(message);
    } else {
      // For assertive announcements on Android, we still use the same method
      // but might want to add additional handling in the future
      AccessibilityInfo.announceForAccessibility(message);
    }
  } else {
    // Web or other platforms
    AccessibilityInfo.announceForAccessibility(message);
  }
};

/**
 * Format a string for better screen reader pronunciation
 * 
 * @param text The text to format
 * @returns Formatted text for better screen reader pronunciation
 */
export const formatForScreenReader = (text: string): string => {
  if (!text) return '';
  
  // Replace symbols that screen readers might struggle with
  return text
    // Add spaces around symbols to improve reading
    .replace(/([&+%$#@!])/g, ' $1 ')
    // Ensure acronyms are spelled out by adding periods
    .replace(/\b([A-Z]{2,})\b/g, (match) => match.split('').join('.') + '.')
    // Improve number reading by adding spaces
    .replace(/(\d+)/g, ' $1 ')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Create an accessible label for a complex UI element
 * 
 * @param parts Object containing parts of the label
 * @returns A formatted accessible label string
 */
export const createAccessibleLabel = (parts: {
  main: string;
  details?: string;
  state?: string;
  instructions?: string;
}): string => {
  const { main, details, state, instructions } = parts;
  
  let label = main;
  
  if (details) {
    label += `. ${details}`;
  }
  
  if (state) {
    label += `. ${state}`;
  }
  
  if (instructions) {
    label += `. ${instructions}`;
  }
  
  return label;
};

/**
 * Format a currency value for screen readers
 * 
 * @param amount The amount to format
 * @param currencyCode The currency code (e.g., USD)
 * @returns A screen reader friendly currency string
 */
export const formatCurrencyForScreenReader = (
  amount: number, 
  currencyCode: string = 'USD'
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  
  const formatted = formatter.format(amount);
  
  // Replace symbols with words for better screen reader experience
  return formatted
    .replace('$', 'dollar ')
    .replace('€', 'euro ')
    .replace('£', 'pound ')
    .replace('¥', 'yen ');
};

/**
 * Format a date for screen readers
 * 
 * @param date The date to format
 * @returns A screen reader friendly date string
 */
export const formatDateForScreenReader = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a time for screen readers
 * 
 * @param time The time to format (Date object or string)
 * @returns A screen reader friendly time string
 */
export const formatTimeForScreenReader = (time: Date | string): string => {
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  
  return timeObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Custom hook to get screen reader status and helpers
 * 
 * @returns Screen reader utilities and state
 */
export const useScreenReader = () => {
  const { isScreenReaderEnabled } = useAccessibilitySettings();
  
  return {
    isEnabled: isScreenReaderEnabled,
    announce: announceForAccessibility,
    format: formatForScreenReader,
    createLabel: createAccessibleLabel,
    formatDate: formatDateForScreenReader,
    formatTime: formatTimeForScreenReader,
    formatCurrency: formatCurrencyForScreenReader,
  };
};
