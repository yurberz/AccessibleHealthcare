import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import { useTheme } from '../../app/providers/theme-provider';
import { AccessibleText } from './accessible-text';
import { typography } from '../constants/typography';

interface CardProps extends AccessibilityProps {
  children: ReactNode;
  style?: ViewStyle;
  title?: string;
  subTitle?: string;
  pressable?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  title,
  subTitle,
  pressable = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  // Base component styles
  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    },
    style,
  ];

  // Content to render
  const content = (
    <>
      {(title || subTitle) && (
        <View style={styles.headerContainer}>
          {title && (
            <AccessibleText
              style={[styles.title, { color: colors.text }]}
              textType="subheading"
              accessibilityRole="header"
            >
              {title}
            </AccessibleText>
          )}
          {subTitle && (
            <AccessibleText
              style={[styles.subTitle, { color: colors.textSecondary }]}
              textType="caption"
            >
              {subTitle}
            </AccessibleText>
          )}
        </View>
      )}
      <View style={styles.contentContainer}>{children}</View>
    </>
  );

  // If the card is pressable, wrap it in a TouchableOpacity
  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        {...accessibilityProps}
      >
        {content}
      </TouchableOpacity>
    );
  }

  // Otherwise, render as a simple view
  return (
    <View
      style={cardStyles}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="none"
      {...accessibilityProps}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
  },
  contentContainer: {},
});
