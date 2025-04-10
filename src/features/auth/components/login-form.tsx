import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormField } from '../../../core/ui/form-field';
import { Button } from '../../../core/ui/button';
import { useAuthStore } from '../store/auth-store';
import { typography } from '../../../core/constants/typography';
import { useTheme } from '../../../app/providers/theme-provider';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { handleError } from '../../../lib/utils/error-handlers';

type LoginFormProps = {
  setLoading: (loading: boolean) => void;
};

// Login form validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginForm = ({ setLoading }: LoginFormProps) => {
  const { colors } = useTheme();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      handleError(error, {
        title: 'Login Failed',
        defaultMessage: 'Unable to login. Please check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Email"
            placeholder="Enter your email"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            accessibilityLabel="Email input field"
            accessibilityHint="Enter your email address for login"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Password"
            placeholder="Enter your password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCompleteType="password"
            textContentType="password"
            returnKeyType="done"
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={togglePasswordVisibility}
            accessibilityLabel="Password input field"
            accessibilityHint="Enter your password for login"
          />
        )}
      />

      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        variant="primary"
        accessibilityLabel="Sign in button"
        accessibilityHint="Signs in with the provided credentials"
      />

      <Button
        title="Forgot Password?"
        onPress={() => {
          // Handle forgot password
          Alert.alert(
            'Reset Password',
            'Password reset functionality will be implemented in a future update.',
            [{ text: 'OK' }]
          );
        }}
        style={styles.forgotPasswordButton}
        textStyle={styles.forgotPasswordText}
        variant="text"
        accessibilityLabel="Forgot password button"
        accessibilityHint="Helps you reset your password if forgotten"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: 24,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
  },
});
