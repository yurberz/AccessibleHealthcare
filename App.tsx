import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import AppContainer from './src/app';
import { AccessibilityProvider } from './src/app/providers/accessibility-provider';
import { ThemeProvider } from './src/app/providers/theme-provider';

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
      <SafeAreaProvider>
        <AccessibilityProvider>
          <ThemeProvider>
            <AppContainer />
          </ThemeProvider>
        </AccessibilityProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent('main', () => App);
