/**
 * Mock API Service
 * 
 * This service provides mock implementations for API endpoints during development
 * It simulates backend functionality for testing without a real server
 */

import { User, Patient, Appointment } from '../../core/types';
import { endpoints } from './endpoints';
import { secureStore } from '../storage/secure-storage';

// Default delay to simulate network latency (ms)
const DEFAULT_DELAY = 500;

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'doctor@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'doctor',
    createdAt: new Date(2022, 0, 1).toISOString(),
    updatedAt: new Date(2022, 0, 1).toISOString(),
  },
  {
    id: '2',
    email: 'patient@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'patient',
    createdAt: new Date(2022, 0, 10).toISOString(),
    updatedAt: new Date(2022, 0, 10).toISOString(),
  },
];

// Initialize the mock API
export async function initMockApi() {
  // Register mock API handlers
  mockAuth();
}

// Helper function to delay responses for realistic network simulation
function delay<T>(data: T, ms: number = DEFAULT_DELAY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

// Mock authentication endpoints
function mockAuth() {
  // Login endpoint
  endpoints.auth.login = '/mock/auth/login';
  
  // Register endpoint
  endpoints.auth.register = '/mock/auth/register';
  
  // Get current user endpoint
  endpoints.auth.me = '/mock/auth/me';
  
  // Logout endpoint
  endpoints.auth.logout = '/mock/auth/logout';
}

// Mock authentication service
export const mockAuthService = {
  // Login with email and password
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate network request
    await delay(null);
    
    // Find user by email
    const user = MOCK_USERS.find(u => u.email === email);
    
    // Simulate authentication
    if (!user || password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    
    // Generate mock token
    const token = `mock-token-${user.id}-${new Date().getTime()}`;
    
    // Store token in secure storage
    await secureStore.setItem('auth_token', token);
    await secureStore.setItem('user_id', user.id);
    
    return { user, token };
  },
  
  // Register new user
  async register(
    email: string, 
    password: string, 
    userData: { firstName: string; lastName: string }
  ): Promise<{ user: User; token: string }> {
    // Simulate network request
    await delay(null);
    
    // Check if email is already used
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser: User = {
      id: `${MOCK_USERS.length + 1}`,
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'patient',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock users (in memory only)
    MOCK_USERS.push(newUser);
    
    // Generate mock token
    const token = `mock-token-${newUser.id}-${new Date().getTime()}`;
    
    // Store token in secure storage
    await secureStore.setItem('auth_token', token);
    await secureStore.setItem('user_id', newUser.id);
    
    return { user: newUser, token };
  },
  
  // Get current user (authenticated)
  async getCurrentUser(): Promise<User | null> {
    // Simulate network request
    await delay(null);
    
    // Get token from secure storage
    const token = await secureStore.getItem('auth_token');
    
    if (!token) {
      return null;
    }
    
    // Extract user ID from token (mock implementation)
    const match = token.match(/mock-token-(\d+)-/);
    
    if (!match) {
      return null;
    }
    
    const userId = match[1];
    const user = MOCK_USERS.find(u => u.id === userId);
    
    return user || null;
  },
  
  // Logout user
  async logout(): Promise<void> {
    // Simulate network request
    await delay(null);
    
    // Clear stored tokens
    await secureStore.deleteItem('auth_token');
    await secureStore.deleteItem('user_id');
  },
};

// Export the mock services
export const mockApiServices = {
  auth: mockAuthService,
};