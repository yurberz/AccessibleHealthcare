import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthStackParamList } from '../../../app/navigation/auth-navigator';
import { RegisterForm } from '../components/register-form';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { Button } from '../../../core/ui/button';
import { useTheme } from '../../../app/providers/theme-provider';
import { colors } from '../../../core/constants/colors';
import { typography } from '../../../core/constants/typography';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { colors, colorScheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <View style={styles.headerContainer}>
                <AccessibleText
                  style={[styles.title, { color: colors.text }]}
                  textType="heading"
                  accessibilityRole="header"
                >
                  Create Account
                </AccessibleText>
                <AccessibleText
                  style={[styles.subtitle, { color: colors.text }]}
                  textType="subheading"
                  accessibilityLabel="Create an account to access your health information securely"
                >
                  Create an account to access your health information securely
                </AccessibleText>
              </View>

              <View style={styles.formContainer}>
                <RegisterForm setLoading={setIsLoading} />
              </View>

              <View style={styles.loginContainer}>
                <AccessibleText
                  style={[styles.loginText, { color: colors.text }]}
                  textType="body"
                >
                  Already have an account?
                </AccessibleText>
                <Button
                  title="Sign In"
                  onPress={handleNavigateToLogin}
                  style={styles.loginButton}
                  textStyle={styles.loginButtonText}
                  variant="text"
                  accessibilityLabel="Sign in to your existing account"
                  accessibilityHint="Navigates to login screen"
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxlarge,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
  loginButton: {
    marginLeft: 4,
  },
  loginButtonText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
});

export default RegisterScreen;
