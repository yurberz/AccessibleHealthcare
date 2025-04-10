import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import { secureStore } from '../src/lib/storage/secure-storage';

// Mock dependencies
jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(true),
}));
jest.mock('@tanstack/react-query', () => {
  const original = jest.requireActual('@tanstack/react-query');
  return {
    ...original,
    QueryClient: jest.fn().mockImplementation(() => ({
      ...original.QueryClient.prototype,
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    })),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

jest.mock('../src/app/providers/accessibility-provider', () => ({
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => children,
  useAccessibilitySettings: jest.fn().mockImplementation(() => ({
    isScreenReaderEnabled: false,
    fontScale: 1,
    reducedMotionEnabled: false,
    highContrastEnabled: false,
    updateFontScale: jest.fn(),
  })),
}));

jest.mock('../src/app/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: jest.fn().mockImplementation(() => ({
    themeMode: 'light',
    colorScheme: 'light',
    setThemeMode: jest.fn(),
    colors: {
      primary: '#2196F3',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#E0E0E0',
      notification: '#FF0000',
    },
  })),
}));

jest.mock('../src/features/auth/store/auth-store', () => ({
  useAuthStore: jest.fn().mockImplementation(() => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    token: null,
    checkAuth: jest.fn().mockResolvedValue(null),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  })),
}));

jest.mock('../src/lib/storage/secure-storage', () => ({
  secureStore: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    deleteItem: jest.fn().mockResolvedValue(undefined),
  },
}));

// Test the App component
describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const { getByText } = render(<App />);
    
    // Wait for app to load
    await waitFor(() => {
      expect(secureStore.getItem).toHaveBeenCalledWith('auth_token');
    });
  });

  it('checks authentication on load', async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(null);
    jest.mock('../src/features/auth/store/auth-store', () => ({
      useAuthStore: jest.fn().mockImplementation(() => ({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        checkAuth: mockCheckAuth,
      })),
    }));

    render(<App />);
    
    await waitFor(() => {
      expect(mockCheckAuth).toHaveBeenCalled();
    });
  });

  it('loads fonts', async () => {
    const loadAsync = require('expo-font').loadAsync;
    render(<App />);
    
    await waitFor(() => {
      expect(loadAsync).toHaveBeenCalledWith({
        'Inter-Regular': expect.any(Object),
        'Inter-Medium': expect.any(Object),
        'Inter-Bold': expect.any(Object),
      });
    });
  });

  it('hides splash screen after loading', async () => {
    const hideAsync = require('expo-splash-screen').hideAsync;
    render(<App />);
    
    await waitFor(() => {
      expect(hideAsync).toHaveBeenCalled();
    });
  });
});
