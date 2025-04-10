import create from 'zustand';
import { apiClient } from '../../../lib/api/api-client';
import { endpoints } from '../../../lib/api/endpoints';
import { Patient } from '../../../core/types';

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<Patient[]>;
  fetchPatientById: (patientId: string) => Promise<Patient>;
  createPatient: (patientData: Omit<Patient, 'id'>) => Promise<Patient>;
  updatePatient: (patientId: string, patientData: Partial<Patient>) => Promise<Patient>;
  deletePatient: (patientId: string) => Promise<void>;
  setSelectedPatient: (patient: Patient | null) => void;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.get(endpoints.patients.list);
      const patients: Patient[] = response.data;
      
      set({ patients, isLoading: false });
      return patients;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch patients' 
      });
      throw error;
    }
  },

  fetchPatientById: async (patientId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.get(endpoints.patients.detail(patientId));
      const patient: Patient = response.data;
      
      set({ selectedPatient: patient, isLoading: false });
      return patient;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch patient' 
      });
      throw error;
    }
  },

  createPatient: async (patientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.post(endpoints.patients.create, patientData);
      const newPatient: Patient = response.data;
      
      set(state => ({ 
        patients: [...state.patients, newPatient],
        isLoading: false
      }));
      
      return newPatient;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create patient' 
      });
      throw error;
    }
  },

  updatePatient: async (patientId, patientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.put(
        endpoints.patients.update(patientId), 
        patientData
      );
      const updatedPatient: Patient = response.data;
      
      set(state => ({ 
        patients: state.patients.map(p => 
          p.id === patientId ? updatedPatient : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? updatedPatient 
          : state.selectedPatient,
        isLoading: false
      }));
      
      return updatedPatient;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update patient' 
      });
      throw error;
    }
  },

  deletePatient: async (patientId) => {
    try {
      set({ isLoading: true, error: null });
      
      await apiClient.delete(endpoints.patients.delete(patientId));
      
      set(state => ({ 
        patients: state.patients.filter(p => p.id !== patientId),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? null 
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete patient' 
      });
      throw error;
    }
  },

  setSelectedPatient: (patient) => {
    set({ selectedPatient: patient });
  }
}));
