import React from 'react';
import { Text, TextProps, AccessibilityInfo, StyleSheet } from 'react-native';
import { typography } from '../constants/typography';
import { useAccessibilitySettings } from '../../app/providers/accessibility-provider';

type TextType = 'heading' | 'subheading' | 'body' | 'caption' | 'button' | 'label';

interface AccessibleTextProps extends TextProps {
  textType?: TextType;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityInfo['role'];
  children: React.ReactNode;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  textType = 'body',
  accessibilityLabel,
  accessibilityRole,
  style,
  children,
  ...props
}) => {
  const { fontScale, isScreenReaderEnabled } = useAccessibilitySettings();

  const getTextStyle = () => {
    switch (textType) {
      case 'heading':
        return styles.heading;
      case 'subheading':
        return styles.subheading;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'button':
        return styles.button;
      case 'label':
        return styles.label;
      default:
        return styles.body;
    }
  };

  // Determine appropriate accessible role
  const getAccessibilityRole = (): any => {
    if (accessibilityRole) return accessibilityRole;
    
    switch (textType) {
      case 'heading':
        return 'header';
      case 'button':
        return 'button';
      default:
        return 'text';
    }
  };

  return (
    <Text
      style={[getTextStyle(), style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={getAccessibilityRole()}
      accessible={true}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
    lineHeight: typography.lineHeight.large,
  },
  subheading: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    lineHeight: typography.lineHeight.medium,
  },
  body: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeight.medium,
  },
  caption: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeight.small,
  },
  button: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    lineHeight: typography.lineHeight.medium,
  },
  label: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    lineHeight: typography.lineHeight.medium,
  },
});
