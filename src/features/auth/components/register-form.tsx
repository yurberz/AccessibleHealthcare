import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormField } from '../../../core/ui/form-field';
import { Button } from '../../../core/ui/button';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { useAuthStore } from '../store/auth-store';
import { typography } from '../../../core/constants/typography';
import { useTheme } from '../../../app/providers/theme-provider';
import { handleError } from '../../../lib/utils/error-handlers';

type RegisterFormProps = {
  setLoading: (loading: boolean) => void;
};

// Register form validation schema
const registerSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = ({ setLoading }: RegisterFormProps) => {
  const { colors } = useTheme();
  const register = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await register(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (error) {
      handleError(error, {
        title: 'Registration Failed',
        defaultMessage: 'Unable to create account. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="First Name"
              placeholder="Enter first name"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.firstName?.message}
              containerStyle={styles.nameField}
              autoCapitalize="words"
              textContentType="givenName"
              returnKeyType="next"
              accessibilityLabel="First name input field"
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Last Name"
              placeholder="Enter last name"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.lastName?.message}
              containerStyle={styles.nameField}
              autoCapitalize="words"
              textContentType="familyName"
              returnKeyType="next"
              accessibilityLabel="Last name input field"
            />
          )}
        />
      </View>

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
            textContentType="emailAddress"
            returnKeyType="next"
            accessibilityLabel="Email input field"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Password"
            placeholder="Create a password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCompleteType="password"
            textContentType="newPassword"
            returnKeyType="next"
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={togglePasswordVisibility}
            accessibilityLabel="Password input field"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Confirm Password"
            placeholder="Confirm your password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.confirmPassword?.message}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCompleteType="password"
            textContentType="newPassword"
            returnKeyType="done"
            rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
            onRightIconPress={toggleConfirmPasswordVisibility}
            accessibilityLabel="Confirm password input field"
          />
        )}
      />

      <View style={styles.privacyContainer}>
        <AccessibleText 
          style={[styles.privacyText, { color: colors.text }]}
          textType="caption"
        >
          By creating an account, you agree to our Privacy Policy and Terms of Service. Your medical information will be handled securely according to HIPAA and GDPR regulations.
        </AccessibleText>
      </View>

      <Button
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        variant="primary"
        accessibilityLabel="Create account button"
        accessibilityHint="Creates a new account with the provided information"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    flex: 0.48,
  },
  privacyContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});
