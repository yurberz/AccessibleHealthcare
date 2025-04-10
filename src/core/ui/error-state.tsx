import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AccessibleText } from './accessible-text';
import { Button } from './button';
import { useTheme } from '../../app/providers/theme-provider';
import { typography } from '../constants/typography';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
  testID?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  icon = 'alert-triangle',
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View 
      style={[styles.container, style]} 
      testID={testID}
      accessibilityLabel={`Error: ${title}. ${message}`}
      accessibilityRole="alert"
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: colors.errorBackground, borderColor: colors.error }
        ]}
      >
        <Feather 
          name={icon} 
          size={36} 
          color={colors.error} 
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
      
      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="primary"
          style={styles.retryButton}
          accessibilityLabel={retryLabel}
          accessibilityHint="Retries the failed operation"
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
  retryButton: {
    minWidth: 200,
  },
});
