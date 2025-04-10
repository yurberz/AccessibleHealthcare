import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View, 
  TouchableOpacityProps, 
  AccessibilityState,
  AccessibilityInfo,
  AccessibilityProps
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../app/providers/theme-provider';
import { typography } from '../constants/typography';
import { useAccessibilitySettings } from '../../app/providers/accessibility-provider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: any;
  textStyle?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { colors } = useTheme();
  const { isScreenReaderEnabled } = useAccessibilitySettings();
  
  // Determine background color based on variant and state
  const getBackgroundColor = () => {
    if (disabled) {
      return colors.disabled;
    }
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      case 'danger':
        return colors.error;
      default:
        return colors.primary;
    }
  };
  
  // Determine text color based on variant and state
  const getTextColor = () => {
    if (disabled) {
      return colors.disabledText;
    }
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
        return variant === 'outline' ? colors.primary : colors.text;
      case 'text':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };
  
  // Determine border style based on variant
  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.disabled : colors.primary,
      };
    }
    
    return {};
  };
  
  // Determine padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default: // medium
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };
  
  // Determine font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.fontSize.small;
      case 'large':
        return typography.fontSize.large;
      default: // medium
        return typography.fontSize.medium;
    }
  };
  
  // Configure proper accessibility properties
  const getAccessibilityState = (): AccessibilityState => {
    return {
      disabled: disabled || isLoading,
      busy: isLoading,
    };
  };

  // Render icon if provided
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    const iconColor = getTextColor();
    const iconMargin = iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 };
    
    return (
      <Feather
        name={icon}
        size={iconSize}
        color={iconColor}
        style={[iconMargin, isLoading && styles.hidden]}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getPadding(),
        getBorderStyle(),
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={getAccessibilityState()}
      {...props}
    >
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={getTextColor()} 
            accessibilityElementsHidden={true}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && renderIcon()}
            <Text
              style={[
                styles.buttonText,
                { 
                  color: getTextColor(),
                  fontSize: getFontSize(),
                  fontFamily: typography.fontFamily.medium,
                },
                textStyle,
              ]}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && renderIcon()}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  hidden: {
    opacity: 0,
  },
});
