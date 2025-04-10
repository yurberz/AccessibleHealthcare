import create from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../../lib/api/api-client';
import { secureStore } from '../../../lib/storage/secure-storage';
import { endpoints } from '../../../lib/api/endpoints';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          // API call to login
          const response = await apiClient.post(endpoints.auth.login, {
            email,
            password,
          });
          
          const { token, user } = response.data;
          
          // Store token securely
          await secureStore.setItem('auth_token', token);
          
          // Update auth state
          set({
            isAuthenticated: true,
            user,
            token,
            isLoading: false,
          });
          
          // Set auth header for future requests
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (
        email: string,
        password: string,
        userData: { firstName: string; lastName: string }
      ) => {
        try {
          set({ isLoading: true });
          
          // API call to register
          const response = await apiClient.post(endpoints.auth.register, {
            email,
            password,
            firstName: userData.firstName,
            lastName: userData.lastName,
          });
          
          const { token, user } = response.data;
          
          // Store token securely
          await secureStore.setItem('auth_token', token);
          
          // Update auth state
          set({
            isAuthenticated: true,
            user,
            token,
            isLoading: false,
          });
          
          // Set auth header for future requests
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Clear stored token
          await secureStore.deleteItem('auth_token');
          
          // Remove auth header
          delete apiClient.defaults.headers.common['Authorization'];
          
          // Reset auth state
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
          });
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          // Get stored token
          const token = await secureStore.getItem('auth_token');
          
          if (!token) {
            set({ isAuthenticated: false, user: null, token: null, isLoading: false });
            return;
          }
          
          // Set auth header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token validity by fetching user data
          const response = await apiClient.get(endpoints.auth.me);
          
          // Update auth state with user data
          set({
            isAuthenticated: true,
            user: response.data,
            token,
            isLoading: false,
          });
          
        } catch (error) {
          // Token is invalid or expired
          await secureStore.deleteItem('auth_token');
          delete apiClient.defaults.headers.common['Authorization'];
          
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Don't persist sensitive data
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
