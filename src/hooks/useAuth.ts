import React, { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  QueryFunction,
  QueryClient
} from "@tanstack/react-query";
import { User } from "../core/types";
import { apiClient } from "../lib/api/api-client";
import { endpoints } from "../lib/api/endpoints";
import { handleError } from '../lib/utils/error-handlers';

// Define auth-related types
type LoginData = {
  email: string;
  password: string;
};

type RegisterData = LoginData & {
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

// Create the context with a default value of null
export const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook for accessing auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to get query functions with error handling
const getQueryFn = (options: { on401?: 'returnNull' | 'throw' } = {}): QueryFunction<User | null> => {
  return async ({ queryKey }) => {
    try {
      const [url] = queryKey as string[];
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && options.on401 === 'returnNull') {
        return null;
      }
      throw error;
    }
  };
};

// Helper function for API requests
const apiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
) => {
  try {
    if (method === 'GET') {
      return await apiClient.get(url);
    } else if (method === 'POST') {
      return await apiClient.post(url, data);
    } else if (method === 'PUT') {
      return await apiClient.put(url, data);
    } else if (method === 'DELETE') {
      return await apiClient.delete(url);
    }
    throw new Error(`Unsupported method: ${method}`);
  } catch (error) {
    throw error;
  }
};

// Resets query client cache when auth state changes
const resetQueries = (queryClient: QueryClient) => {
  // Reset any queries that depend on auth state
  queryClient.invalidateQueries({ queryKey: ['user'] });
};

// Create a Provider component to manage authentication state
interface AuthProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, queryClient }) => {
  // Get current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: [endpoints.auth.me],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest('POST', endpoints.auth.login, credentials);
      return res.data;
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData([endpoints.auth.me], userData);
    },
    onError: (error: Error) => {
      handleError(error, {
        title: 'Login Failed',
        defaultMessage: 'Unable to login. Please check your credentials and try again.'
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation<User, Error, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest('POST', endpoints.auth.register, userData);
      return res.data;
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData([endpoints.auth.me], userData);
    },
    onError: (error: Error) => {
      handleError(error, {
        title: 'Registration Failed',
        defaultMessage: 'Unable to create your account. Please try again.'
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiRequest('POST', endpoints.auth.logout);
    },
    onSuccess: () => {
      queryClient.setQueryData([endpoints.auth.me], null);
      resetQueries(queryClient);
    },
    onError: (error: Error) => {
      handleError(error, {
        title: 'Logout Failed',
        defaultMessage: 'Unable to logout. Please try again.'
      });
    },
  });

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};