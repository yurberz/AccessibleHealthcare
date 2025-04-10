/**
 * Error handling utilities for the application
 * 
 * This file provides consistent error handling across the app,
 * with support for API errors, form validation errors, and general exceptions.
 */

import { Alert, Platform } from 'react-native';
import axios, { AxiosError } from 'axios';
import { ApiError } from '../../core/types';

/**
 * Options for error handling
 */
interface ErrorHandlerOptions {
  title?: string;
  defaultMessage?: string;
  showAlert?: boolean;
  logError?: boolean;
  onError?: (error: any) => void;
}

/**
 * Handle a general error with consistent formatting and logging
 * 
 * @param error The error to handle
 * @param options Options for error handling
 * @returns Formatted error message
 */
export const handleError = (
  error: any,
  options: ErrorHandlerOptions = {}
): string => {
  const {
    title = 'Error',
    defaultMessage = 'An unexpected error occurred. Please try again.',
    showAlert = true,
    logError = true,
    onError,
  } = options;
  
  let errorMessage = defaultMessage;
  
  // Extract error message based on error type
  if (error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = typeof error.error === 'string' ? error.error : defaultMessage;
    } else if (error.status && error.code) {
      // Likely an ApiError
      errorMessage = error.message || `Error ${error.status}: ${error.code}`;
    }
  }
  
  // Sanitize error message for security
  // Remove any potentially sensitive information
  errorMessage = sanitizeErrorMessage(errorMessage);
  
  // Log the error (if enabled)
  if (logError) {
    logErrorToConsole(error, errorMessage);
  }
  
  // Show alert (if enabled)
  if (showAlert) {
    Alert.alert(title, errorMessage);
  }
  
  // Call custom error handler (if provided)
  if (onError) {
    onError(error);
  }
  
  return errorMessage;
};

/**
 * Handle API error specifically, with proper typing
 * 
 * @param error The API error to handle (usually from axios)
 * @returns Standardized ApiError object
 */
export const handleApiError = (error: any): ApiError => {
  // Default error response
  const apiError: ApiError = {
    status: 500,
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred while communicating with the server.'
  };
  
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Set HTTP status if available
    if (axiosError.response) {
      apiError.status = axiosError.response.status;
      
      // Try to extract error details from response
      const responseData = axiosError.response.data as any;
      
      if (responseData) {
        // Extract error code
        if (responseData.code) {
          apiError.code = responseData.code;
        } else if (responseData.error) {
          apiError.code = typeof responseData.error === 'string' 
            ? responseData.error 
            : 'API_ERROR';
        }
        
        // Extract error message
        if (responseData.message) {
          apiError.message = responseData.message;
        } else if (responseData.error && typeof responseData.error === 'string') {
          apiError.message = responseData.error;
        }
        
        // Extract validation errors if available
        if (responseData.errors && typeof responseData.errors === 'object') {
          apiError.errors = responseData.errors;
        }
      }
      
      // Set default messages based on status code if none provided
      if (!apiError.message || apiError.message === apiError.code) {
        apiError.message = getDefaultMessageForStatus(apiError.status);
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      apiError.status = 0;
      apiError.code = 'NETWORK_ERROR';
      apiError.message = 'Network error. Please check your internet connection.';
    }
    
    // Set error code if not already set
    if (!apiError.code) {
      apiError.code = axiosError.code || 'API_ERROR';
    }
  } else if (error instanceof Error) {
    // Handle regular JavaScript errors
    apiError.code = 'CLIENT_ERROR';
    apiError.message = error.message;
  } else if (typeof error === 'object' && error !== null) {
    // Handle other error objects
    Object.assign(apiError, error);
  }
  
  // Sanitize error message for security
  apiError.message = sanitizeErrorMessage(apiError.message);
  
  // Log the API error
  logErrorToConsole(error, `API Error (${apiError.status} ${apiError.code}): ${apiError.message}`);
  
  return apiError;
};

/**
 * Handle form validation errors
 * 
 * @param errors Object containing field validation errors
 * @param options Options for error handling
 */
export const handleFormErrors = (
  errors: Record<string, string>,
  options: ErrorHandlerOptions = {}
): void => {
  const {
    title = 'Form Validation Error',
    showAlert = true,
    logError = true,
  } = options;
  
  // Get list of error messages
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (errorMessages.length === 0) {
    return;
  }
  
  // Create a combined error message
  const errorMessage = errorMessages.join('\n• ');
  const formattedErrorMessage = `• ${errorMessage}`;
  
  // Log errors (if enabled)
  if (logError) {
    console.log('Form Validation Errors:', errors);
  }
  
  // Show alert (if enabled)
  if (showAlert) {
    Alert.alert(title, formattedErrorMessage);
  }
};

/**
 * Get default error message based on HTTP status code
 * 
 * @param status HTTP status code
 * @returns Default error message for the status
 */
const getDefaultMessageForStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your information and try again.';
    case 401:
      return 'You need to be logged in to access this. Please log in and try again.';
    case 403:
      return 'You don\'t have permission to access this resource.';
    case 404:
      return 'The requested information could not be found.';
    case 408:
    case 504:
      return 'The server took too long to respond. Please try again later.';
    case 409:
      return 'There was a conflict with the current state of the resource.';
    case 422:
      return 'The provided information could not be processed.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
    case 502:
    case 503:
      return 'The server encountered an error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Sanitize error messages to remove potentially sensitive information
 * 
 * @param message The error message to sanitize
 * @returns Sanitized error message
 */
const sanitizeErrorMessage = (message: string): string => {
  if (!message) return 'An unknown error occurred';
  
  // List of patterns to sanitize (regex replacements)
  const sanitizationPatterns = [
    // Remove API keys
    { pattern: /api[_-]?key[=:]\s*["']?\w+["']?/gi, replacement: 'API_KEY=[REDACTED]' },
    
    // Remove auth tokens
    { pattern: /bearer\s+[\w\d._-]+/gi, replacement: 'Bearer [REDACTED]' },
    { pattern: /authorization:?\s*["']?bearer\s+[\w\d._-]+["']?/gi, replacement: 'Authorization: Bearer [REDACTED]' },
    
    // Remove sensitive PHI/PII patterns
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN REDACTED]' }, // SSN
    { pattern: /\b\d{9}\b/g, replacement: '[ID REDACTED]' }, // 9-digit IDs
    { pattern: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[CARD REDACTED]' }, // Credit card numbers
    
    // Remove email addresses
    { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL REDACTED]' },
    
    // Remove DB connection strings
    { pattern: /mongodb(?:\+srv)?:\/\/[^\s]*/g, replacement: 'mongodb://[REDACTED]' },
    { pattern: /postgres(?:ql)?:\/\/[^\s]*/g, replacement: 'postgresql://[REDACTED]' },
    
    // Remove IP addresses
    { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[IP REDACTED]' },
  ];
  
  // Apply each sanitization pattern
  let sanitizedMessage = message;
  sanitizationPatterns.forEach(({ pattern, replacement }) => {
    sanitizedMessage = sanitizedMessage.replace(pattern, replacement);
  });
  
  return sanitizedMessage;
};

/**
 * Log error to console with appropriate level and formatting
 * 
 * @param error The original error object
 * @param message The formatted error message
 */
const logErrorToConsole = (error: any, message: string): void => {
  // Skip logging in production (or do something else like send to a monitoring service)
  if (process.env.NODE_ENV === 'production') {
    // In production, we would typically send to a monitoring service
    // For now, just console.error with limited info
    console.error(`[ERROR] ${message}`);
    return;
  }
  
  // In development, log detailed error information
  console.group('Error Details:');
  console.error(message);
  
  if (axios.isAxiosError(error)) {
    // Log Axios error details
    const axiosError = error as AxiosError;
    console.error('Request:', {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      headers: axiosError.config?.headers,
    });
    
    if (axiosError.response) {
      console.error('Response:', {
        status: axiosError.response.status,
        data: axiosError.response.data,
      });
    }
  } else {
    // Log the original error object
    console.error('Original Error:', error);
  }
  
  // Log stack trace
  if (error && error.stack) {
    console.error('Stack Trace:', error.stack);
  }
  
  console.groupEnd();
};
