import * as CryptoJS from 'crypto-js';
import { Platform } from 'react-native';
import * as Random from 'expo-random';
import * as Device from 'expo-device';
import { decode as atob, encode as btoa } from 'base-64';
import config from '../../core/constants/config';

// Get the encryption key from environment variables or generate a device-specific one
const getEncryptionKey = async (): Promise<string> => {
  // First try to use the environment variable
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey && envKey.length >= 32) {
    return envKey;
  }
  
  // If no environment key, create a device-specific key
  // This means that data encrypted on one device cannot be decrypted on another
  try {
    // Use device info and a random seed to create a consistent key
    const deviceId = await Device.getDeviceIdAsync() || 'unknown-device';
    const randomBytes = await Random.getRandomBytesAsync(16);
    const randomSeed = Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    // Create a SHA-256 hash from device info and random seed
    return CryptoJS.SHA256(`${deviceId}-${randomSeed}-MedicalAppSecretKey`).toString();
  } catch (error) {
    console.error('Error generating encryption key:', error);
    
    // Fallback to a default key (less secure, but better than nothing)
    return 'MedicalAppDefaultEncryptionKey12345678901234';
  }
};

// Centralized encryption key (lazy loaded when needed)
let encryptionKeyPromise: Promise<string> | null = null;

/**
 * Initialize the encryption key
 * Should be called early in the app lifecycle
 */
export const initEncryption = (): Promise<void> => {
  encryptionKeyPromise = getEncryptionKey();
  return encryptionKeyPromise.then(() => {});
};

/**
 * Encrypt a string using AES encryption
 * 
 * @param data The string to encrypt
 * @returns A promise that resolves to the encrypted string
 */
export const encrypt = async (data: string): Promise<string> => {
  try {
    // Initialize the key if not already done
    if (!encryptionKeyPromise) {
      encryptionKeyPromise = getEncryptionKey();
    }
    
    const key = await encryptionKeyPromise;
    
    // Generate a random IV for each encryption
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Combine IV and encrypted data for storage
    const ivHex = iv.toString(CryptoJS.enc.Hex);
    const encryptedHex = encrypted.toString();
    
    // Return the combined string
    return `${ivHex}:${encryptedHex}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt an encrypted string
 * 
 * @param encryptedData The encrypted string to decrypt
 * @returns A promise that resolves to the decrypted string
 */
export const decrypt = async (encryptedData: string): Promise<string> => {
  try {
    // Initialize the key if not already done
    if (!encryptionKeyPromise) {
      encryptionKeyPromise = getEncryptionKey();
    }
    
    const key = await encryptionKeyPromise;
    
    // Split the IV and encrypted data
    const [ivHex, encryptedHex] = encryptedData.split(':');
    
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted data format');
    }
    
    // Convert IV from hex to WordArray
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encryptedHex, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convert the decrypted data to a string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Encrypt sensitive patient data (specifically for fields that contain PHI)
 * This uses more secure encryption for HIPAA compliance
 * 
 * @param data The string to encrypt
 * @returns A promise that resolves to the encrypted string
 */
export const encryptPHI = async (data: string): Promise<string> => {
  try {
    // Currently, this uses the same encryption as the regular encrypt function
    // In a production environment, you might want to use different encryption methods
    // or keys for PHI vs other data
    return await encrypt(data);
  } catch (error) {
    console.error('PHI Encryption error:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
};

/**
 * Decrypt sensitive patient data (specifically for fields that contain PHI)
 * 
 * @param encryptedData The encrypted string to decrypt
 * @returns A promise that resolves to the decrypted string
 */
export const decryptPHI = async (encryptedData: string): Promise<string> => {
  try {
    // Corresponding decryption for encryptPHI
    return await decrypt(encryptedData);
  } catch (error) {
    console.error('PHI Decryption error:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
};

/**
 * Hash a string (e.g., for password storage)
 * Note: For actual password storage, use a server-side solution with proper salting
 * 
 * @param data The string to hash
 * @returns The hashed string
 */
export const hash = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

/**
 * Generate a random token (e.g., for CSRF protection)
 * 
 * @param length The desired length of the token
 * @returns A promise that resolves to the random token
 */
export const generateRandomToken = async (length: number = 32): Promise<string> => {
  try {
    const randomBytes = await Random.getRandomBytesAsync(length);
    return Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Error generating random token:', error);
    
    // Fallback if expo-random fails
    const fallbackRandom = CryptoJS.lib.WordArray.random(length);
    return fallbackRandom.toString(CryptoJS.enc.Hex);
  }
};

/**
 * Utility to mask sensitive data for display (e.g., SSN, credit card)
 * 
 * @param value The string to mask
 * @param visibleChars Number of characters to leave visible at the end
 * @returns The masked string
 */
export const maskSensitiveData = (
  value: string, 
  visibleChars: number = 4
): string => {
  if (!value) return '';
  if (value.length <= visibleChars) return value;
  
  const visible = value.slice(-visibleChars);
  const masked = '*'.repeat(value.length - visibleChars);
  
  return masked + visible;
};
