/**
 * API endpoints for the application
 * 
 * This file contains all API endpoint URLs organized by feature/resource.
 * It helps maintain consistency in API calls throughout the app and makes
 * it easier to update endpoints if the API changes.
 */

const apiVersion = 'v1';

export const endpoints = {
  // Authentication endpoints
  auth: {
    login: `/auth/login`,
    register: `/auth/register`,
    refreshToken: `/auth/refresh-token`,
    forgotPassword: `/auth/forgot-password`,
    resetPassword: `/auth/reset-password`,
    changePassword: `/auth/change-password`,
    me: `/auth/me`,
    logout: `/auth/logout`,
  },

  // User profile endpoints
  profile: {
    get: `/users/profile`,
    update: `/users/profile`,
    updateAvatar: `/users/profile/avatar`,
    updateSettings: `/users/profile/settings`,
  },

  // Patient endpoints
  patients: {
    list: `/patients`,
    search: (query: string) => `/patients/search?q=${encodeURIComponent(query)}`,
    detail: (id: string) => `/patients/${id}`,
    create: `/patients`,
    update: (id: string) => `/patients/${id}`,
    delete: (id: string) => `/patients/${id}`,
  },

  // Appointment endpoints
  appointments: {
    list: `/appointments`,
    upcoming: `/appointments/upcoming`,
    past: `/appointments/past`,
    detail: (id: string) => `/appointments/${id}`,
    create: `/appointments`,
    update: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
    forPatient: (patientId: string) => `/patients/${patientId}/appointments`,
  },

  // Medical records endpoints
  medicalRecords: {
    list: (patientId: string) => `/patients/${patientId}/medical-records`,
    detail: (patientId: string, id: string) => 
      `/patients/${patientId}/medical-records/${id}`,
    create: (patientId: string) => `/patients/${patientId}/medical-records`,
    update: (patientId: string, id: string) => 
      `/patients/${patientId}/medical-records/${id}`,
    delete: (patientId: string, id: string) => 
      `/patients/${patientId}/medical-records/${id}`,
  },

  // Medications endpoints
  medications: {
    list: (patientId: string) => `/patients/${patientId}/medications`,
    detail: (patientId: string, id: string) => 
      `/patients/${patientId}/medications/${id}`,
    create: (patientId: string) => `/patients/${patientId}/medications`,
    update: (patientId: string, id: string) => 
      `/patients/${patientId}/medications/${id}`,
    delete: (patientId: string, id: string) => 
      `/patients/${patientId}/medications/${id}`,
  },

  // Notifications endpoints
  notifications: {
    list: `/notifications`,
    unread: `/notifications/unread`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: `/notifications/read-all`,
  },
  
  // Consents endpoints (HIPAA/GDPR)
  consents: {
    list: `/consents`,
    get: (id: string) => `/consents/${id}`,
    create: `/consents`,
    update: (id: string) => `/consents/${id}`,
    latest: (type: string) => `/consents/latest?type=${type}`,
  },
  
  // Data access logs (HIPAA)
  accessLogs: {
    list: `/access-logs`,
    get: (id: string) => `/access-logs/${id}`,
    create: `/access-logs`,
    myData: `/access-logs/my-data`,
  },
  
  // Break-glass access (emergency access)
  breakGlass: {
    request: `/break-glass/request`,
    approve: (id: string) => `/break-glass/${id}/approve`,
    reject: (id: string) => `/break-glass/${id}/reject`,
    list: `/break-glass`,
  },
};
