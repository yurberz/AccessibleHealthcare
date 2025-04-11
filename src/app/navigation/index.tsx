import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './auth-navigator';
import MainNavigator from './main-navigator';
import { useTheme } from '../providers/theme-provider';
import { useAuth } from '../../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

// Define the root stack navigator types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default NavigationRoot;
