import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../app/providers/theme-provider';
import { typography } from '../constants/typography';
import { useAccessibilitySettings } from '../../app/providers/accessibility-provider';

interface FormFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  rightIcon,
  onRightIconPress,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const { colors } = useTheme();
  const { isScreenReaderEnabled, fontScale } = useAccessibilitySettings();
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(undefined as any);
    }
  };

  // Handle blur event
  const handleBlur = () => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(undefined as any);
    }
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) {
      return colors.error;
    }
    if (isFocused) {
      return colors.primary;
    }
    return colors.border;
  };

  // Create accessible error message for screen readers
  const getAccessibleErrorMessage = () => {
    return error ? `Error: ${error}` : undefined;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          styles.label,
          { color: error ? colors.error : colors.text },
          labelStyle,
        ]}
        accessibilityRole="text"
      >
        {label}
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: getBorderColor(),
              color: colors.text,
              backgroundColor: colors.inputBackground,
              paddingRight: rightIcon ? 40 : 12,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessible={true}
          accessibilityRole="text"
          accessibilityState={{
            disabled: rest.editable === false,
            selected: isFocused,
          }}
          accessibilityValue={{
            text: value,
          }}
          accessibilityLiveRegion="polite"
          {...rest}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            accessibilityRole="button"
            accessibilityLabel={`${rightIcon === 'eye' ? 'Show' : 'Hide'} password`}
            accessibilityHint={`${rightIcon === 'eye' ? 'Shows' : 'Hides'} the password text`}
          >
            <Feather
              name={rightIcon}
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error ? (
        <Text
          style={[
            styles.errorText,
            { color: colors.error },
            errorStyle,
          ]}
          accessibilityLabel={getAccessibleErrorMessage()}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 40,
  },
  errorText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    marginTop: 4,
  },
});
