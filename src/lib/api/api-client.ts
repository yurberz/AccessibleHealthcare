import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import config from '../../core/constants/config';
import { secureStore } from '../storage/secure-storage';
import { handleApiError } from '../utils/error-handlers';
import { ApiError } from '../../core/types';
import NetInfo from '@react-native-community/netinfo';

// Create a custom axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Track if we're refreshing the token to prevent multiple refresh attempts
let isRefreshingToken = false;
let tokenRefreshPromise: Promise<string> | null = null;

// Request interceptor
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // Check for network connectivity
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return Promise.reject(new Error('No network connection available'));
    }

    // Add authorization token to requests if available
    try {
      const token = await secureStore.getItem('auth_token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }

    // Add headers for HIPAA/GDPR compliance
    if (config.headers) {
      config.headers['X-App-Version'] = config.environment.version;
      
      // For secure logging of who accessed what data
      const userId = await secureStore.getItem('user_id');
      if (userId) {
        config.headers['X-User-ID'] = userId;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add additional logging for HIPAA compliance
    if (config.environment.debug) {
      const { method, url } = response.config;
      console.log(`API ${method?.toUpperCase()} ${url} - Status: ${response.status}`);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Only try to refresh token once per request
      originalRequest._retry = true;
      
      try {
        // If we're already refreshing token, wait for that to complete
        if (isRefreshingToken) {
          const newToken = await tokenRefreshPromise;
          if (newToken && originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
        
        // Start token refresh process
        isRefreshingToken = true;
        tokenRefreshPromise = refreshToken();
        
        const newToken = await tokenRefreshPromise;
        
        // Set new token in header and retry request
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        // Clear stored tokens
        await secureStore.deleteItem('auth_token');
        await secureStore.deleteItem('refresh_token');
        
        // Return a specific error that can be handled by the auth store
        return Promise.reject({
          status: 401,
          code: 'AUTH_REQUIRED',
          message: 'Authentication required. Please log in again.',
        } as ApiError);
      } finally {
        isRefreshingToken = false;
        tokenRefreshPromise = null;
      }
    }
    
    // Transform error to a standardized format
    return Promise.reject(handleApiError(error));
  }
);

// Function to refresh the access token
async function refreshToken(): Promise<string> {
  try {
    const refreshToken = await secureStore.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post(
      `${config.api.baseUrl}/auth/refresh-token`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    
    const { token } = response.data;
    
    // Store the new token
    await secureStore.setItem('auth_token', token);
    
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
}

// Export the API client
export { apiClient };
