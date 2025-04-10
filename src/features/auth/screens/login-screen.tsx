import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthStackParamList } from '../../../app/navigation/auth-navigator';
import { LoginForm } from '../components/login-form';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { Button } from '../../../core/ui/button';
import { useTheme } from '../../../app/providers/theme-provider';
import { colors } from '../../../core/constants/colors';
import { typography } from '../../../core/constants/typography';
import { useAccessibilitySettings } from '../../../app/providers/accessibility-provider';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { colors, colorScheme } = useTheme();
  const { isScreenReaderEnabled } = useAccessibilitySettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
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
                  Medical App
                </AccessibleText>
                <AccessibleText
                  style={[styles.subtitle, { color: colors.text }]}
                  textType="subheading"
                  accessibilityLabel="Secure health information at your fingertips"
                >
                  Secure health information at your fingertips
                </AccessibleText>
              </View>

              <View style={styles.formContainer}>
                <LoginForm setLoading={setIsLoading} />
              </View>

              <View style={styles.registerContainer}>
                <AccessibleText
                  style={[styles.registerText, { color: colors.text }]}
                  textType="body"
                >
                  Don't have an account?
                </AccessibleText>
                <Button
                  title="Sign Up"
                  onPress={handleNavigateToRegister}
                  style={styles.registerButton}
                  textStyle={styles.registerButtonText}
                  variant="text"
                  accessibilityLabel="Sign up for a new account"
                  accessibilityHint="Navigates to registration screen"
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
    marginBottom: 40,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
  registerButton: {
    marginLeft: 4,
  },
  registerButtonText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
});

export default LoginScreen;
