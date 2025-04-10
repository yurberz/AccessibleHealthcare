import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from './api-client';
import { endpoints } from './endpoints';
import { ApiError, Patient, Appointment, MedicalRecord, User } from '../../core/types';
import { secureStore } from '../storage/secure-storage';
import { handleError } from '../utils/error-handlers';

// React Query Keys
export const queryKeys = {
  patients: 'patients',
  patient: (id: string) => ['patient', id],
  appointments: 'appointments',
  appointment: (id: string) => ['appointment', id],
  patientAppointments: (patientId: string) => ['patient', patientId, 'appointments'],
  medicalRecords: (patientId: string) => ['patient', patientId, 'medicalRecords'],
  medicalRecord: (patientId: string, id: string) => ['patient', patientId, 'medicalRecord', id],
  userData: 'userData',
  notifications: 'notifications',
};

/**
 * User data hooks
 */
export const useUserDataQuery = (options?: UseQueryOptions<User, ApiError>) => {
  return useQuery<User, ApiError>(
    [queryKeys.userData],
    async () => {
      const response = await apiClient.get(endpoints.auth.me);
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 30, // 30 minutes
      cacheTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      ...options,
    }
  );
};

/**
 * Patient hooks
 */
export const usePatientsQuery = (options?: UseQueryOptions<Patient[], ApiError>) => {
  return useQuery<Patient[], ApiError>(
    [queryKeys.patients],
    async () => {
      const response = await apiClient.get(endpoints.patients.list);
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      ...options,
    }
  );
};

export const usePatientQuery = (id: string, options?: UseQueryOptions<Patient, ApiError>) => {
  return useQuery<Patient, ApiError>(
    queryKeys.patient(id),
    async () => {
      const response = await apiClient.get(endpoints.patients.detail(id));
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      enabled: !!id, // Only run query if ID is provided
      ...options,
    }
  );
};

export const useCreatePatientMutation = (
  options?: UseMutationOptions<Patient, ApiError, Omit<Patient, 'id'>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Patient, ApiError, Omit<Patient, 'id'>>(
    async (newPatient) => {
      const response = await apiClient.post(endpoints.patients.create, newPatient);
      return response.data;
    },
    {
      onSuccess: (data) => {
        // Invalidate patients list query to fetch updated data
        queryClient.invalidateQueries([queryKeys.patients]);
        
        // Update cache with the new patient
        queryClient.setQueryData(queryKeys.patient(data.id), data);
      },
      ...options,
    }
  );
};

export const useUpdatePatientMutation = (
  options?: UseMutationOptions<Patient, ApiError, { id: string; data: Partial<Patient> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Patient, ApiError, { id: string; data: Partial<Patient> }>(
    async ({ id, data }) => {
      const response = await apiClient.put(endpoints.patients.update(id), data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Update the patient in the cache
        queryClient.setQueryData(queryKeys.patient(variables.id), data);
        
        // Invalidate patients list to reflect updates
        queryClient.invalidateQueries([queryKeys.patients]);
      },
      ...options,
    }
  );
};

export const useDeletePatientMutation = (
  options?: UseMutationOptions<void, ApiError, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, ApiError, string>(
    async (id) => {
      await apiClient.delete(endpoints.patients.delete(id));
    },
    {
      onSuccess: (_, id) => {
        // Remove patient from cache
        queryClient.removeQueries(queryKeys.patient(id));
        
        // Invalidate patients list to reflect updates
        queryClient.invalidateQueries([queryKeys.patients]);
      },
      ...options,
    }
  );
};

/**
 * Appointment hooks
 */
export const useAppointmentsQuery = (options?: UseQueryOptions<Appointment[], ApiError>) => {
  return useQuery<Appointment[], ApiError>(
    [queryKeys.appointments],
    async () => {
      const response = await apiClient.get(endpoints.appointments.list);
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      ...options,
    }
  );
};

export const usePatientAppointmentsQuery = (
  patientId: string,
  options?: UseQueryOptions<Appointment[], ApiError>
) => {
  return useQuery<Appointment[], ApiError>(
    queryKeys.patientAppointments(patientId),
    async () => {
      const response = await apiClient.get(endpoints.appointments.forPatient(patientId));
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      enabled: !!patientId, // Only run query if patientId is provided
      ...options,
    }
  );
};

export const useAppointmentQuery = (
  id: string,
  options?: UseQueryOptions<Appointment, ApiError>
) => {
  return useQuery<Appointment, ApiError>(
    queryKeys.appointment(id),
    async () => {
      const response = await apiClient.get(endpoints.appointments.detail(id));
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      enabled: !!id, // Only run query if ID is provided
      ...options,
    }
  );
};

export const useCreateAppointmentMutation = (
  options?: UseMutationOptions<Appointment, ApiError, Omit<Appointment, 'id'>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Appointment, ApiError, Omit<Appointment, 'id'>>(
    async (newAppointment) => {
      const response = await apiClient.post(endpoints.appointments.create, newAppointment);
      return response.data;
    },
    {
      onSuccess: (data) => {
        // Add the new appointment to the cache
        queryClient.setQueryData(queryKeys.appointment(data.id), data);
        
        // Invalidate relevant queries to reflect updates
        queryClient.invalidateQueries([queryKeys.appointments]);
        if (data.patientId) {
          queryClient.invalidateQueries(queryKeys.patientAppointments(data.patientId));
        }
      },
      ...options,
    }
  );
};

export const useUpdateAppointmentMutation = (
  options?: UseMutationOptions<Appointment, ApiError, { id: string; data: Partial<Appointment> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Appointment, ApiError, { id: string; data: Partial<Appointment> }>(
    async ({ id, data }) => {
      const response = await apiClient.put(endpoints.appointments.update(id), data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Update appointment in cache
        queryClient.setQueryData(queryKeys.appointment(variables.id), data);
        
        // Invalidate relevant queries to reflect updates
        queryClient.invalidateQueries([queryKeys.appointments]);
        if (data.patientId) {
          queryClient.invalidateQueries(queryKeys.patientAppointments(data.patientId));
        }
      },
      ...options,
    }
  );
};

export const useCancelAppointmentMutation = (
  options?: UseMutationOptions<Appointment, ApiError, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Appointment, ApiError, string>(
    async (id) => {
      const response = await apiClient.put(endpoints.appointments.cancel(id));
      return response.data;
    },
    {
      onSuccess: (data, id) => {
        // Update appointment in cache
        queryClient.setQueryData(queryKeys.appointment(id), data);
        
        // Invalidate relevant queries to reflect updates
        queryClient.invalidateQueries([queryKeys.appointments]);
        if (data.patientId) {
          queryClient.invalidateQueries(queryKeys.patientAppointments(data.patientId));
        }
      },
      ...options,
    }
  );
};

/**
 * Medical Records hooks
 */
export const useMedicalRecordsQuery = (
  patientId: string,
  options?: UseQueryOptions<MedicalRecord[], ApiError>
) => {
  return useQuery<MedicalRecord[], ApiError>(
    queryKeys.medicalRecords(patientId),
    async () => {
      const response = await apiClient.get(endpoints.medicalRecords.list(patientId));
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      enabled: !!patientId, // Only run query if patientId is provided
      ...options,
    }
  );
};

export const useMedicalRecordQuery = (
  patientId: string,
  id: string,
  options?: UseQueryOptions<MedicalRecord, ApiError>
) => {
  return useQuery<MedicalRecord, ApiError>(
    queryKeys.medicalRecord(patientId, id),
    async () => {
      const response = await apiClient.get(endpoints.medicalRecords.detail(patientId, id));
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      enabled: !!patientId && !!id, // Only run query if both IDs are provided
      ...options,
    }
  );
};

// Hooks for access logs and HIPAA compliance
export const useAccessLogsForMyDataQuery = (options?: UseQueryOptions<any[], ApiError>) => {
  return useQuery<any[], ApiError>(
    ['accessLogs', 'myData'],
    async () => {
      const response = await apiClient.get(endpoints.accessLogs.myData);
      return response.data;
    },
    {
      ...options,
    }
  );
};

// Hook for logging access to patient data (for HIPAA compliance)
export const useLogAccessMutation = (
  options?: UseMutationOptions<void, ApiError, {
    resourceType: string;
    resourceId: string;
    action: string;
    reason?: string;
  }>
) => {
  return useMutation<void, ApiError, {
    resourceType: string;
    resourceId: string;
    action: string;
    reason?: string;
  }>(
    async (logData) => {
      await apiClient.post(endpoints.accessLogs.create, logData);
    },
    options
  );
};
