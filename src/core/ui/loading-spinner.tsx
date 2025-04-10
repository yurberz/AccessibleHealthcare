import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  ViewStyle, 
  Text 
} from 'react-native';
import { useTheme } from '../../app/providers/theme-provider';
import { typography } from '../constants/typography';
import { AccessibleText } from './accessible-text';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  message,
  fullScreen = false,
  style,
}) => {
  const { colors } = useTheme();
  const spinnerColor = color || colors.primary;

  // Determine container styles based on fullScreen prop
  const containerStyles = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View 
      style={containerStyles} 
      accessibilityRole="progressbar"
      accessibilityLabel={message || "Loading"}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} color={spinnerColor} />
      
      {message && (
        <AccessibleText
          style={[styles.message, { color: colors.text }]}
          textType="body"
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {message}
        </AccessibleText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  message: {
    marginTop: 10,
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
});
