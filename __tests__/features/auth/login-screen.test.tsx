import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../../src/features/auth/screens/login-screen';
import { useAuthStore } from '../../../src/features/auth/store/auth-store';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('../../../src/features/auth/store/auth-store');
jest.mock('../../../src/app/providers/theme-provider', () => ({
  useTheme: jest.fn().mockImplementation(() => ({
    colors: {
      background: '#FFFFFF',
      primary: '#2196F3',
      text: '#000000',
      error: '#FF0000',
      border: '#E0E0E0',
      placeholder: '#757575',
      inputBackground: '#FFFFFF',
      icon: '#757575',
    },
    colorScheme: 'light',
  })),
}));

jest.mock('../../../src/app/providers/accessibility-provider', () => ({
  useAccessibilitySettings: jest.fn().mockImplementation(() => ({
    isScreenReaderEnabled: false,
    fontScale: 1,
    reducedMotionEnabled: false,
    highContrastEnabled: false,
  })),
}));

jest.mock('../../../src/lib/utils/error-handlers', () => ({
  handleError: jest.fn(),
}));

// Create a mock navigation stack for testing
const Stack = createStackNavigator();
const MockNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={() => null} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Mock navigation hooks
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the auth store
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });
  });

  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<MockNavigator />);
    
    // Check that important elements are rendered
    expect(getByText('Medical App')).toBeTruthy();
    expect(getByText('Secure health information at your fingertips')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
  });

  it('validates email input', async () => {
    const { getByPlaceholderText, getByText } = render(<MockNavigator />);
    
    // Enter invalid email
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'invalid-email');
    
    // Submit form
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);
    
    // Check that validation error appears
    await waitFor(() => {
      // The actual error text depends on your validation schema
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('validates password input', async () => {
    const { getByPlaceholderText, getByText } = render(<MockNavigator />);
    
    // Enter valid email but no password
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    // Submit form
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);
    
    // Check that validation error appears
    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('submits the form with valid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(<MockNavigator />);
    
    // Enter valid email and password
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123!');
    
    // Submit form
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);
    
    // Check that login function was called with correct arguments
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123!');
    });
  });

  it('handles login errors', async () => {
    // Mock login to throw an error
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));
    
    const { getByPlaceholderText, getByText } = render(<MockNavigator />);
    
    // Enter valid credentials
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123!');
    
    // Submit form
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);
    
    // Check that error handling occurred
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(require('../../../src/lib/utils/error-handlers').handleError).toHaveBeenCalled();
    });
  });

  it('navigates to register screen', () => {
    const navigateMock = jest.fn();
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate: navigateMock,
      }),
    }));
    
    const { getByText } = render(<MockNavigator />);
    
    // Press the sign up button
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
    
    // Navigation is mocked so this doesn't actually happen,
    // but we'll check if the navigate function is called in our component
    expect(navigateMock).toHaveBeenCalledWith('Register');
  });

  it('shows forgot password alert', () => {
    const { getByText } = render(<MockNavigator />);
    
    // Press forgot password button
    const forgotPasswordButton = getByText('Forgot Password?');
    fireEvent.press(forgotPasswordButton);
    
    // Check that alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Reset Password',
      'Password reset functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  });
});
