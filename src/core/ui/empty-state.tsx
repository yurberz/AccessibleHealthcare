import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AccessibleText } from './accessible-text';
import { Button } from './button';
import { useTheme } from '../../app/providers/theme-provider';
import { typography } from '../constants/typography';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: keyof typeof Feather.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'info',
  actionLabel,
  onAction,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View 
      style={[styles.container, style]} 
      testID={testID}
      accessibilityLabel={`${title}. ${message}`}
      accessibilityRole="summary"
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: colors.background, borderColor: colors.border }
        ]}
      >
        <Feather 
          name={icon} 
          size={36} 
          color={colors.primary} 
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        />
      </View>
      
      <AccessibleText
        style={[styles.title, { color: colors.text }]}
        textType="subheading"
        accessibilityRole="header"
      >
        {title}
      </AccessibleText>
      
      <AccessibleText
        style={[styles.message, { color: colors.textSecondary }]}
        textType="body"
      >
        {message}
      </AccessibleText>
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.actionButton}
          accessibilityLabel={actionLabel}
          accessibilityHint={`Performs action: ${actionLabel}`}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    minWidth: 200,
  },
});
