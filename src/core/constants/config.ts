// Configuration constants for the application
// This includes environment-specific settings and feature flags

import { Platform } from 'react-native';

interface AppConfig {
  // API related configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  
  // Authentication configuration
  auth: {
    tokenExpirationBuffer: number; // in seconds, how early to refresh token before expiry
    sessionTimeout: number; // in minutes, auto logout after inactivity
    biometricAuthEnabled: boolean;
  };
  
  // Security configuration
  security: {
    encryptedStorage: boolean;
    dataRetentionPeriod: number; // in days
    sensitiveDataFields: string[];
    minimumPasswordLength: number;
    requireSpecialCharacters: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
  };
  
  // Accessibility configuration
  accessibility: {
    defaultFontScale: number;
    minFontScale: number;
    maxFontScale: number;
    fontScaleStep: number;
    highContrastModeEnabled: boolean;
    animationDuration: number; // in ms, used for reduced motion support
  };
  
  // Feature flags
  features: {
    patientNotesEnabled: boolean;
    appointmentRemindersEnabled: boolean;
    medicalHistoryEnabled: boolean;
    teleHealthEnabled: boolean;
    documentUploadEnabled: boolean;
  };
  
  // Environment information
  environment: {
    name: 'development' | 'testing' | 'staging' | 'production';
    debug: boolean;
    version: string;
    buildNumber: string;
  };
}

// Environment-specific configuration
const envConfig: { [key: string]: Partial<AppConfig> } = {
  development: {
    api: {
      baseUrl: 'https://dev-api.medicalapp.example.com/v1',
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
    },
    environment: {
      name: 'development',
      debug: true,
    },
  },
  testing: {
    api: {
      baseUrl: 'https://test-api.medicalapp.example.com/v1',
      timeout: 30000,
      retryAttempts: 1,
      retryDelay: 1000,
    },
    environment: {
      name: 'testing',
      debug: true,
    },
  },
  staging: {
    api: {
      baseUrl: 'https://staging-api.medicalapp.example.com/v1',
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 1000,
    },
    environment: {
      name: 'staging',
      debug: false,
    },
  },
  production: {
    api: {
      baseUrl: 'https://api.medicalapp.example.com/v1',
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 2000,
    },
    environment: {
      name: 'production',
      debug: false,
    },
  },
};

// Get current environment from environment variables
// Default to development if not set
const currentEnv = process.env.NODE_ENV || 'development';

// Default configuration (shared across all environments)
const defaultConfig: AppConfig = {
  api: {
    baseUrl: 'https://api.medicalapp.example.com/v1',
    timeout: 15000, // 15 seconds
    retryAttempts: 2,
    retryDelay: 2000, // 2 seconds
  },
  auth: {
    tokenExpirationBuffer: 300, // 5 minutes
    sessionTimeout: 30, // 30 minutes
    biometricAuthEnabled: true,
  },
  security: {
    encryptedStorage: true,
    dataRetentionPeriod: 365, // 1 year
    sensitiveDataFields: [
      'medicalRecordNumber',
      'ssn',
      'dateOfBirth',
      'address',
      'phoneNumber',
      'email',
      'diagnosis',
      'medication',
    ],
    minimumPasswordLength: 8,
    requireSpecialCharacters: true,
    requireNumbers: true,
    requireUppercase: true,
    requireLowercase: true,
  },
  accessibility: {
    defaultFontScale: 1.0,
    minFontScale: 0.8,
    maxFontScale: 2.0,
    fontScaleStep: 0.1,
    highContrastModeEnabled: true,
    animationDuration: 300, // 300ms
  },
  features: {
    patientNotesEnabled: true,
    appointmentRemindersEnabled: true,
    medicalHistoryEnabled: true,
    teleHealthEnabled: true,
    documentUploadEnabled: true,
  },
  environment: {
    name: 'development',
    debug: true,
    version: '1.0.0',
    buildNumber: '1',
  },
};

// Get environment-specific configuration
const envSpecificConfig = envConfig[currentEnv] || envConfig.development;

// Merge configurations
export const config: AppConfig = {
  ...defaultConfig,
  ...envSpecificConfig,
  api: {
    ...defaultConfig.api,
    ...envSpecificConfig.api,
  },
  auth: {
    ...defaultConfig.auth,
    ...envSpecificConfig.auth,
  },
  security: {
    ...defaultConfig.security,
    ...envSpecificConfig.security,
  },
  accessibility: {
    ...defaultConfig.accessibility,
    ...envSpecificConfig.accessibility,
  },
  features: {
    ...defaultConfig.features,
    ...envSpecificConfig.features,
  },
  environment: {
    ...defaultConfig.environment,
    ...envSpecificConfig.environment,
  },
};

// Platform-specific configuration overrides
if (Platform.OS === 'ios') {
  // iOS specific configuration
  config.auth.biometricAuthEnabled = true; // Use Face ID/Touch ID
} else if (Platform.OS === 'android') {
  // Android specific configuration
  config.auth.biometricAuthEnabled = true; // Use fingerprint/biometric
}

// Export configuration
export default config;
