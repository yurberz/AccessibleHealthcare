import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from '../security/encryption';
import config from '../../core/constants/config';

// Prefix for keys used in secure storage
const KEY_PREFIX = 'medical_app_secure_';

// List of sensitive keys that should always be encrypted
// even when using AsyncStorage fallback on web
const SENSITIVE_KEYS = [
  'auth_token',
  'refresh_token',
  'user_data',
  'personal_info',
  'medical_data',
  'patient_data',
];

/**
 * Secure Storage Interface
 * 
 * This is a wrapper around Expo SecureStore with web fallback using AsyncStorage + encryption
 * It provides a unified API for secure data storage across all platforms
 */
class SecureStorage {
  /**
   * Store a value securely
   * 
   * @param key The key to store the value under
   * @param value The string value to store
   * @returns A promise that resolves when the operation is complete
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const prefixedKey = `${KEY_PREFIX}${key}`;
      
      // For native platforms, use SecureStore
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(prefixedKey, value, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        return;
      }
      
      // For web, use AsyncStorage + encryption
      const encryptedValue = await encrypt(value);
      await AsyncStorage.setItem(prefixedKey, encryptedValue);
    } catch (error) {
      console.error(`Error storing secure value for key ${key}:`, error);
      throw new Error(`Failed to securely store data for key: ${key}`);
    }
  }

  /**
   * Retrieve a securely stored value
   * 
   * @param key The key the value is stored under
   * @returns A promise that resolves to the stored value, or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const prefixedKey = `${KEY_PREFIX}${key}`;
      
      // For native platforms, use SecureStore
      if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(prefixedKey);
      }
      
      // For web, use AsyncStorage + decryption
      const encryptedValue = await AsyncStorage.getItem(prefixedKey);
      if (!encryptedValue) return null;
      
      return await decrypt(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving secure value for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a securely stored value
   * 
   * @param key The key the value is stored under
   * @returns A promise that resolves when the operation is complete
   */
  async deleteItem(key: string): Promise<void> {
    try {
      const prefixedKey = `${KEY_PREFIX}${key}`;
      
      // For native platforms, use SecureStore
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(prefixedKey);
        return;
      }
      
      // For web, use AsyncStorage
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error deleting secure value for key ${key}:`, error);
      throw new Error(`Failed to delete secure data for key: ${key}`);
    }
  }

  /**
   * Store a complex object securely (JSON serialized)
   * 
   * @param key The key to store the value under
   * @param value The object to store
   * @returns A promise that resolves when the operation is complete
   */
  async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing secure object for key ${key}:`, error);
      throw new Error(`Failed to securely store object for key: ${key}`);
    }
  }

  /**
   * Retrieve a securely stored object
   * 
   * @param key The key the object is stored under
   * @returns A promise that resolves to the stored object, or null if not found
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) as T : null;
    } catch (error) {
      console.error(`Error retrieving secure object for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Check if a key exists in secure storage
   * 
   * @param key The key to check
   * @returns A promise that resolves to true if the key exists, false otherwise
   */
  async hasKey(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }

  /**
   * Clear all secure storage items for this app
   * This is a potentially dangerous operation and should be used with caution
   * 
   * @returns A promise that resolves when the operation is complete
   */
  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      // For web, we can only clear AsyncStorage items with our prefix
      const allKeys = await AsyncStorage.getAllKeys();
      const secureKeys = allKeys.filter(key => key.startsWith(KEY_PREFIX));
      await AsyncStorage.multiRemove(secureKeys);
    } else {
      // For native platforms, we can't clear all SecureStore items
      // We would need to know all keys we've used
      console.warn('Clearing all SecureStore keys is not supported on native platforms');
    }
  }
}

// Create and export a singleton instance
export const secureStore = new SecureStorage();
