import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../features/auth/screens/login-screen';
import RegisterScreen from '../../features/auth/screens/register-screen';
import AuthPage from '../../features/auth/screens/auth-page';
import { useTheme } from '../providers/theme-provider';

// Define the auth stack navigator types
export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0, // for Android
          shadowOpacity: 0, // for iOS
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="Auth" 
        component={AuthPage} 
        options={{ 
          title: 'Authentication',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Sign In',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          title: 'Create Account',
          headerBackTitle: '' // Use this instead of headerBackTitleVisible
        }} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
