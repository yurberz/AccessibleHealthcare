import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Image,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LoginForm } from '../components/login-form';
import { RegisterForm } from '../components/register-form';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { Button } from '../../../core/ui/button';
import { useTheme } from '../../../app/providers/theme-provider';
import { typography } from '../../../core/constants/typography';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register',
}

const AuthPage = () => {
  const { colors, colorScheme } = useTheme();
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const navigation = useNavigation();
  const { user } = useAuth();

  // Redirect to home if already logged in
  React.useEffect(() => {
    if (user) {
      navigation.navigate('Home' as never);
    }
  }, [user, navigation]);

  const isDesktopLayout = width > 768;

  const toggleAuthMode = () => {
    setAuthMode(authMode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollView,
              isDesktopLayout && styles.desktopScrollView,
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.contentWrapper,
                isDesktopLayout && styles.desktopContentWrapper,
              ]}
            >
              {/* Form Section */}
              <View
                style={[
                  styles.formSection,
                  isDesktopLayout && styles.desktopFormSection,
                  { backgroundColor: colors.card },
                ]}
              >
                <View style={styles.formHeader}>
                  <AccessibleText
                    style={[styles.title, { color: colors.text }]}
                    textType="heading"
                    accessibilityRole="header"
                  >
                    {authMode === AuthMode.LOGIN ? 'Sign In' : 'Create Account'}
                  </AccessibleText>
                  <AccessibleText
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                    textType="subheading"
                  >
                    {authMode === AuthMode.LOGIN
                      ? 'Access your secure health information'
                      : 'Join our secure health platform'}
                  </AccessibleText>
                </View>

                <View style={styles.formContainer}>
                  {authMode === AuthMode.LOGIN ? (
                    <LoginForm setLoading={setIsLoading} />
                  ) : (
                    <RegisterForm setLoading={setIsLoading} />
                  )}
                </View>

                <View style={styles.switchModeContainer}>
                  <AccessibleText
                    style={[styles.switchModeText, { color: colors.text }]}
                    textType="body"
                  >
                    {authMode === AuthMode.LOGIN
                      ? "Don't have an account?"
                      : 'Already have an account?'}
                  </AccessibleText>
                  <Button
                    title={authMode === AuthMode.LOGIN ? 'Sign Up' : 'Sign In'}
                    onPress={toggleAuthMode}
                    style={styles.switchModeButton}
                    textStyle={[styles.switchModeButtonText, { color: colors.primary }]}
                    variant="text"
                    accessibilityLabel={
                      authMode === AuthMode.LOGIN
                        ? 'Switch to sign up form'
                        : 'Switch to sign in form'
                    }
                  />
                </View>
              </View>

              {/* Hero Section - Only shown on desktop layout */}
              {isDesktopLayout && (
                <View
                  style={[
                    styles.heroSection,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <View style={styles.heroContent}>
                    <Feather
                      name="plus-circle"
                      size={60}
                      color="white"
                      style={styles.heroIcon}
                    />
                    <AccessibleText
                      style={styles.heroTitle}
                      textType="heading"
                      accessibilityRole="header"
                    >
                      Medical Care App
                    </AccessibleText>
                    <AccessibleText
                      style={styles.heroSubtitle}
                      textType="body"
                    >
                      Your health information, securely accessible anytime, anywhere.
                      We prioritize accessibility and security to provide the best
                      healthcare experience.
                    </AccessibleText>

                    <View style={styles.featureList}>
                      <Feature
                        icon="shield"
                        text="HIPAA & GDPR Compliant Security"
                      />
                      <Feature
                        icon="users"
                        text="Complete Patient Management"
                      />
                      <Feature
                        icon="calendar"
                        text="Easy Appointment Scheduling"
                      />
                      <Feature
                        icon="eye"
                        text="Accessibility Features (WCAG AA)"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

// Feature component for hero section
const Feature = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <View style={styles.featureItem}>
      <Feather name={icon as any} size={20} color="white" style={styles.featureIcon} />
      <AccessibleText style={styles.featureText} textType="body">
        {text}
      </AccessibleText>
    </View>
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
  desktopScrollView: {
    flexGrow: 1,
    minHeight: '100%',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
  },
  desktopContentWrapper: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  formSection: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopFormSection: {
    flex: 1,
    padding: 40,
    maxWidth: '50%',
  },
  heroSection: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 500,
  },
  heroIcon: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  heroTitle: {
    fontSize: typography.fontSize.xxlarge,
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: 'white',
    opacity: 0.9,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: typography.fontSize.medium * 1.6,
  },
  featureList: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: 'white',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
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
    width: '100%',
    maxWidth: 400,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  switchModeText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
  switchModeButton: {
    marginLeft: 8,
  },
  switchModeButtonText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
  },
});

export default AuthPage;