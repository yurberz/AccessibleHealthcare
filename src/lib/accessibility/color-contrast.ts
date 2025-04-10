/**
 * Color contrast utilities to ensure WCAG AA compliance
 * 
 * These functions help verify and adjust colors to meet accessibility standards:
 * - WCAG AA requires a contrast ratio of at least 4.5:1 for normal text
 * - WCAG AA requires a contrast ratio of at least 3:1 for large text
 * - WCAG AA requires a contrast ratio of at least 3:1 for UI components
 */

/**
 * Convert a hex color to RGB
 * 
 * @param hex The hex color (e.g., "#FFFFFF" or "#FFF")
 * @returns The RGB color as an object {r, g, b}
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values based on length
  let r, g, b;
  
  if (hex.length === 3) {
    // Convert 3-character hex to 6-character hex
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // Parse 6-character hex
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Invalid hex format
    return null;
  }
  
  return { r, g, b };
};

/**
 * Convert RGB to a hex color
 * 
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns The hex color (e.g., "#FFFFFF")
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Calculate relative luminance of a color (per WCAG)
 * 
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns The relative luminance (0-1)
 */
export const calculateLuminance = (r: number, g: number, b: number): number => {
  // Convert RGB to sRGB
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Calculate RGB values
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 The first color in hex format
 * @param color2 The second color in hex format
 * @returns The contrast ratio (1-21)
 */
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    console.error('Invalid color format');
    return 1; // Return minimum ratio if there's an error
  }
  
  const luminance1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const luminance2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  // Ensure the lighter color is first for the calculation
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  // Calculate contrast ratio
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if colors meet WCAG AA contrast requirements
 * 
 * @param foreground The foreground color (text)
 * @param background The background color
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns True if the contrast meets WCAG AA requirements
 */
export const meetsWCAGAA = (foreground: string, background: string, isLargeText: boolean = false): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  
  // WCAG AA requirements
  // 4.5:1 for normal text, 3:1 for large text
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Check if colors meet WCAG AAA contrast requirements (stricter)
 * 
 * @param foreground The foreground color (text)
 * @param background The background color
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns True if the contrast meets WCAG AAA requirements
 */
export const meetsWCAGAAA = (foreground: string, background: string, isLargeText: boolean = false): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  
  // WCAG AAA requirements
  // 7:1 for normal text, 4.5:1 for large text
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Adjust a color to meet WCAG AA contrast requirements
 * 
 * @param foreground The foreground color (text)
 * @param background The background color
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns An adjusted foreground color that meets contrast requirements
 */
export const adjustColorForContrast = (foreground: string, background: string, isLargeText: boolean = false): string => {
  if (meetsWCAGAA(foreground, background, isLargeText)) {
    return foreground; // Already meets requirements
  }
  
  const foreRgb = hexToRgb(foreground);
  const backRgb = hexToRgb(background);
  
  if (!foreRgb || !backRgb) {
    return foreground; // Return original if invalid format
  }
  
  // Calculate luminance of background
  const backLuminance = calculateLuminance(backRgb.r, backRgb.g, backRgb.b);
  
  // Determine if we should go lighter or darker based on background
  const shouldGoLighter = backLuminance < 0.5;
  
  // Increments to adjust color
  const step = shouldGoLighter ? 5 : -5;
  
  // Clone original color
  let adjustedR = foreRgb.r;
  let adjustedG = foreRgb.g;
  let adjustedB = foreRgb.b;
  
  // Keep adjusting until we meet the contrast requirement
  // or reach the limits of the color range
  let iterations = 0;
  const maxIterations = 50; // Prevent infinite loops
  
  while (!meetsWCAGAA(rgbToHex(adjustedR, adjustedG, adjustedB), background, isLargeText) && iterations < maxIterations) {
    // Adjust the color components
    adjustedR = Math.max(0, Math.min(255, adjustedR + step));
    adjustedG = Math.max(0, Math.min(255, adjustedG + step));
    adjustedB = Math.max(0, Math.min(255, adjustedB + step));
    
    iterations++;
    
    // Break if we've reached the limits
    if ((shouldGoLighter && (adjustedR === 255 && adjustedG === 255 && adjustedB === 255)) ||
        (!shouldGoLighter && (adjustedR === 0 && adjustedG === 0 && adjustedB === 0))) {
      break;
    }
  }
  
  return rgbToHex(adjustedR, adjustedG, adjustedB);
};

/**
 * Create a high contrast version of a color
 * 
 * @param color The original color
 * @returns A high contrast version of the color
 */
export const createHighContrastColor = (color: string): string => {
  const rgb = hexToRgb(color);
  
  if (!rgb) {
    return color; // Return original if invalid format
  }
  
  // Calculate luminance
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  
  // For light colors, make them darker; for dark colors, make them lighter
  if (luminance > 0.5) {
    // Make darker for light colors
    const darkerR = Math.floor(rgb.r * 0.7);
    const darkerG = Math.floor(rgb.g * 0.7);
    const darkerB = Math.floor(rgb.b * 0.7);
    return rgbToHex(darkerR, darkerG, darkerB);
  } else {
    // Make lighter for dark colors
    const lighterR = Math.min(255, Math.floor(rgb.r * 1.3));
    const lighterG = Math.min(255, Math.floor(rgb.g * 1.3));
    const lighterB = Math.min(255, Math.floor(rgb.b * 1.3));
    return rgbToHex(lighterR, lighterG, lighterB);
  }
};

/**
 * Determine if a color is light or dark
 * 
 * @param color The color to check
 * @returns True if the color is light, false if dark
 */
export const isLightColor = (color: string): boolean => {
  const rgb = hexToRgb(color);
  
  if (!rgb) {
    return true; // Default to light if invalid format
  }
  
  // Calculate luminance
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  
  // Threshold for determining light vs dark
  return luminance > 0.5;
};

/**
 * Get a text color (black or white) that contrasts well with the background
 * 
 * @param backgroundColor The background color
 * @returns Black or white, whichever contrasts better
 */
export const getContrastingTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};
