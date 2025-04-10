// Define typography constants for the application
// This includes support for dynamic font scaling and text styles

// Define font families to use in the app
const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

// Base font sizes - these will be scaled by the accessibility settings
// These are the initial sizes without any scaling applied
const baseFontSizes = {
  xsmall: 10,
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 20,
  xxlarge: 24,
  xxxlarge: 32,
};

// Initialize fontSize with the base sizes
// The actual scaled values will be updated in accessibility-provider
const fontSize = { ...baseFontSizes };

// Line height multipliers
// These are proportional to the font size to ensure proper spacing
const lineHeightMultiplier = {
  tight: 1.2,    // For headings
  normal: 1.5,   // For body text
  loose: 1.8,    // For more readable body text
};

// Compute line heights based on font sizes and multipliers
// These will be updated when font scaling changes
const lineHeight = {
  small: baseFontSizes.small * lineHeightMultiplier.normal,
  medium: baseFontSizes.medium * lineHeightMultiplier.normal,
  large: baseFontSizes.large * lineHeightMultiplier.tight,
  xlarge: baseFontSizes.xlarge * lineHeightMultiplier.tight,
  xxlarge: baseFontSizes.xxlarge * lineHeightMultiplier.tight,
};

// Letter spacing (tracking) for different text styles
const letterSpacing = {
  tight: -0.5,   // For headings that need to be more compact
  normal: 0,     // Default, no additional spacing
  wide: 0.5,     // For emphasis or UI elements
};

// Text case transformations
const textCase = {
  upper: 'uppercase',
  lower: 'lowercase',
  cap: 'capitalize',
  none: 'none',
};

// Text styles for consistent usage throughout the app
const textStyle = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxlarge,
    lineHeight: fontSize.xxxlarge * lineHeightMultiplier.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxlarge,
    lineHeight: fontSize.xxlarge * lineHeightMultiplier.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xlarge,
    lineHeight: fontSize.xlarge * lineHeightMultiplier.tight,
    letterSpacing: letterSpacing.tight,
  },
  subtitle1: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.large,
    lineHeight: fontSize.large * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.normal,
  },
  subtitle2: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.medium,
    lineHeight: fontSize.medium * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.normal,
  },
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.medium,
    lineHeight: fontSize.medium * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.normal,
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.small,
    lineHeight: fontSize.small * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.normal,
  },
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.medium,
    lineHeight: fontSize.medium * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.small,
    lineHeight: fontSize.small * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xsmall,
    lineHeight: fontSize.xsmall * lineHeightMultiplier.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: textCase.upper,
  },
};

// Export the typography settings for use throughout the app
export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  textCase,
  textStyle,
  
  // Keep track of base font sizes for scaling calculations
  baseFontSizes,
  
  // Methods to update typography based on accessibility settings
  updateFontScale: (scale: number) => {
    // Update each font size based on the scale factor
    Object.keys(baseFontSizes).forEach((key) => {
      const sizeKey = key as keyof typeof baseFontSizes;
      fontSize[sizeKey] = baseFontSizes[sizeKey] * scale;
    });
    
    // Also update line heights accordingly
    lineHeight.small = fontSize.small * lineHeightMultiplier.normal;
    lineHeight.medium = fontSize.medium * lineHeightMultiplier.normal;
    lineHeight.large = fontSize.large * lineHeightMultiplier.tight;
    lineHeight.xlarge = fontSize.xlarge * lineHeightMultiplier.tight;
    lineHeight.xxlarge = fontSize.xxlarge * lineHeightMultiplier.tight;
    
    // Update text styles as well
    textStyle.h1.fontSize = fontSize.xxxlarge;
    textStyle.h1.lineHeight = fontSize.xxxlarge * lineHeightMultiplier.tight;
    
    textStyle.h2.fontSize = fontSize.xxlarge;
    textStyle.h2.lineHeight = fontSize.xxlarge * lineHeightMultiplier.tight;
    
    textStyle.h3.fontSize = fontSize.xlarge;
    textStyle.h3.lineHeight = fontSize.xlarge * lineHeightMultiplier.tight;
    
    textStyle.subtitle1.fontSize = fontSize.large;
    textStyle.subtitle1.lineHeight = fontSize.large * lineHeightMultiplier.normal;
    
    textStyle.subtitle2.fontSize = fontSize.medium;
    textStyle.subtitle2.lineHeight = fontSize.medium * lineHeightMultiplier.normal;
    
    textStyle.body1.fontSize = fontSize.medium;
    textStyle.body1.lineHeight = fontSize.medium * lineHeightMultiplier.normal;
    
    textStyle.body2.fontSize = fontSize.small;
    textStyle.body2.lineHeight = fontSize.small * lineHeightMultiplier.normal;
    
    textStyle.button.fontSize = fontSize.medium;
    textStyle.button.lineHeight = fontSize.medium * lineHeightMultiplier.normal;
    
    textStyle.caption.fontSize = fontSize.small;
    textStyle.caption.lineHeight = fontSize.small * lineHeightMultiplier.normal;
    
    textStyle.overline.fontSize = fontSize.xsmall;
    textStyle.overline.lineHeight = fontSize.xsmall * lineHeightMultiplier.normal;
  },
};
