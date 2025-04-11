import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import AppContainer from './src/app';
import { AccessibilityProvider } from './src/app/providers/accessibility-provider';
import { ThemeProvider } from './src/app/providers/theme-provider';
import { AuthProvider } from './src/hooks/useAuth';
import { initMockApi } from './src/lib/api/mock-api';

// Initialize mock API for development
initMockApi();

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider queryClient={queryClient}>
        <SafeAreaProvider>
          <AccessibilityProvider>
            <ThemeProvider>
              <AppContainer />
            </ThemeProvider>
          </AccessibilityProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent('main', () => App);
