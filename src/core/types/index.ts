// Core types for the application

/**
 * User type - represents an authenticated user of the app
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'patient';
  createdAt: string;
  updatedAt: string;
}

/**
 * Patient type - represents a patient in the system
 */
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  // Medical information
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string[];
  medications?: string[];
  height?: number;
  weight?: number;
  // Computed property
  age?: number;
  // Meta information
  createdAt: string;
  updatedAt: string;
}

/**
 * Appointment type - represents a scheduled appointment
 */
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type?: string;
  reason: string;
  notes?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medical Record type - represents a patient's medical record
 */
export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'visit' | 'lab' | 'imaging' | 'medication' | 'procedure' | 'diagnosis';
  date: string;
  provider?: string;
  description: string;
  notes?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Attachment type - represents a file attached to a medical record
 */
export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

/**
 * Notification type - represents a notification sent to a user
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'message' | 'reminder' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

/**
 * Authentication types
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

/**
 * Form state types
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * UI State types
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Configuration Types
 */
export interface AppConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  version: string;
  environment: 'development' | 'production';
}

/**
 * HIPAA and GDPR related types for data privacy
 */
export interface PrivacyConsent {
  id: string;
  userId: string;
  type: 'hipaa' | 'gdpr' | 'terms' | 'privacy';
  version: string;
  consented: boolean;
  consentDate: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataAccessLog {
  id: string;
  userId: string;
  resourceType: 'patient' | 'appointment' | 'medicalRecord';
  resourceId: string;
  action: 'view' | 'create' | 'update' | 'delete';
  timestamp: string;
  ipAddress?: string;
  reason?: string;
}

export interface BreakGlassAccess {
  id: string;
  userId: string;
  resourceType: 'patient' | 'medicalRecord';
  resourceId: string;
  reason: string;
  timestamp: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}
