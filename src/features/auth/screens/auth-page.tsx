import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../app/providers/theme-provider';
import { typography } from '../../../core/constants/typography';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { Button } from '../../../core/ui/button';

enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register',
}

// Login form component
const LoginForm = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginMutation } = useAuth();
  
  const handleSubmit = () => {
    loginMutation.mutate({ email, password });
  };
  
  return (
    <View style={styles.formInner}>
      <View style={styles.field}>
        <AccessibleText 
          style={[styles.label, { color: colors.text }]} 
          textType="label"
        >
          Email
        </AccessibleText>
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            accessibilityLabel="Email address input"
          />
        </View>
      </View>
      
      <View style={styles.field}>
        <AccessibleText 
          style={[styles.label, { color: colors.text }]} 
          textType="label"
        >
          Password
        </AccessibleText>
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            accessibilityLabel="Password input"
          />
        </View>
      </View>
      
      <Button
        title="Sign In"
        onPress={handleSubmit}
        variant="primary"
        isLoading={loginMutation.isPending}
        style={styles.submitButton}
        accessibilityLabel="Sign in button"
      />
    </View>
  );
};

// Register form component
const RegisterForm = () => {
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerMutation } = useAuth();
  
  const handleSubmit = () => {
    registerMutation.mutate({ 
      email, 
      password,
      firstName,
      lastName
    });
  };
  
  return (
    <View style={styles.formInner}>
      <View style={styles.nameFields}>
        <View style={[styles.field, styles.nameField]}>
          <AccessibleText 
            style={[styles.label, { color: colors.text }]} 
            textType="label"
          >
            First Name
          </AccessibleText>
          <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="First name"
              placeholderTextColor={colors.textSecondary}
              value={firstName}
              onChangeText={setFirstName}
              autoComplete="given-name"
              accessibilityLabel="First name input"
            />
          </View>
        </View>
        
        <View style={[styles.field, styles.nameField]}>
          <AccessibleText 
            style={[styles.label, { color: colors.text }]} 
            textType="label"
          >
            Last Name
          </AccessibleText>
          <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Last name"
              placeholderTextColor={colors.textSecondary}
              value={lastName}
              onChangeText={setLastName}
              autoComplete="family-name"
              accessibilityLabel="Last name input"
            />
          </View>
        </View>
      </View>
      
      <View style={styles.field}>
        <AccessibleText 
          style={[styles.label, { color: colors.text }]} 
          textType="label"
        >
          Email
        </AccessibleText>
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            accessibilityLabel="Email address input"
          />
        </View>
      </View>
      
      <View style={styles.field}>
        <AccessibleText 
          style={[styles.label, { color: colors.text }]} 
          textType="label"
        >
          Password
        </AccessibleText>
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Create a password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            accessibilityLabel="Password input"
          />
        </View>
      </View>
      
      <View style={styles.privacyContainer}>
        <AccessibleText 
          style={[styles.privacyText, { color: colors.textSecondary }]}
          textType="caption"
        >
          By creating an account, you agree to our Privacy Policy and Terms of Service. Your medical information will be handled securely according to HIPAA and GDPR regulations.
        </AccessibleText>
      </View>
      
      <Button
        title="Create Account"
        onPress={handleSubmit}
        variant="primary"
        isLoading={registerMutation.isPending}
        style={styles.submitButton}
        accessibilityLabel="Create account button"
      />
    </View>
  );
};

const AuthPage = () => {
  const { colors, colorScheme } = useTheme();
  const { width } = useWindowDimensions();
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const navigation = useNavigation();
  const { user, isLoading } = useAuth();

  // Redirect to home if already logged in
  React.useEffect(() => {
    if (user) {
      navigation.navigate('Main' as never);
    }
  }, [user, navigation]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
                    <LoginForm />
                  ) : (
                    <RegisterForm />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  formInner: {
    width: '100%',
  },
  field: {
    marginBottom: 16,
  },
  nameFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    width: '48%',
  },
  label: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 6,
  },
  inputContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
  privacyContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: typography.fontSize.xsmall,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
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