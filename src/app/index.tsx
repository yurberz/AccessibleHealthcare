import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { useAccessibilitySettings } from './providers/accessibility-provider';
import { useTheme } from './providers/theme-provider';
import NavigationRoot from './navigation';
import { useAuthStore } from '../features/auth/store/auth-store';
import { colors } from '../core/constants/colors';

// Keep the splash screen visible until app is ready
SplashScreen.preventAutoHideAsync();

const AppContainer = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const { colorScheme } = useTheme();
  const { fontScale } = useAccessibilitySettings();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Load resources and check auth state
  useEffect(() => {
    async function prepare() {
      try {
        // Skip font loading for now
        // await Font.loadAsync({
        //   'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
        //   'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
        //   'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
        // });
        
        // Check if user is authenticated
        await checkAuth();
      } catch (e) {
        console.warn('Error loading resources:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [checkAuth]);

  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: colorScheme === 'dark',
        colors: {
          primary: colors.primary,
          background: colorScheme === 'dark' ? colors.darkBackground : colors.lightBackground,
          card: colorScheme === 'dark' ? colors.darkCard : colors.lightCard,
          text: colorScheme === 'dark' ? colors.lightText : colors.darkText,
          border: colors.border,
          notification: colors.notification,
        },
      }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <NavigationRoot />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBackground,
  },
});

export default AppContainer;
