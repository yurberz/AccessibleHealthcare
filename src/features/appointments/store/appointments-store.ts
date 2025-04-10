import create from 'zustand';
import { apiClient } from '../../../lib/api/api-client';
import { endpoints } from '../../../lib/api/endpoints';
import { Appointment } from '../../../core/types';

interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<Appointment[]>;
  fetchAppointmentById: (appointmentId: string) => Promise<Appointment>;
  createAppointment: (appointmentData: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (appointmentId: string, appointmentData: Partial<Appointment>) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  setSelectedAppointment: (appointment: Appointment | null) => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.get(endpoints.appointments.list);
      const appointments: Appointment[] = response.data;
      
      set({ appointments, isLoading: false });
      return appointments;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch appointments' 
      });
      throw error;
    }
  },

  fetchAppointmentById: async (appointmentId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.get(endpoints.appointments.detail(appointmentId));
      const appointment: Appointment = response.data;
      
      set({ selectedAppointment: appointment, isLoading: false });
      return appointment;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch appointment' 
      });
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.post(endpoints.appointments.create, appointmentData);
      const newAppointment: Appointment = response.data;
      
      set(state => ({ 
        appointments: [...state.appointments, newAppointment],
        isLoading: false
      }));
      
      return newAppointment;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create appointment' 
      });
      throw error;
    }
  },

  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.put(
        endpoints.appointments.update(appointmentId), 
        appointmentData
      );
      const updatedAppointment: Appointment = response.data;
      
      set(state => ({ 
        appointments: state.appointments.map(a => 
          a.id === appointmentId ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.id === appointmentId 
          ? updatedAppointment 
          : state.selectedAppointment,
        isLoading: false
      }));
      
      return updatedAppointment;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update appointment' 
      });
      throw error;
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      set({ isLoading: true, error: null });
      
      await apiClient.put(endpoints.appointments.cancel(appointmentId), {
        status: 'cancelled'
      });
      
      set(state => ({ 
        appointments: state.appointments.map(a => 
          a.id === appointmentId 
            ? { ...a, status: 'cancelled' } 
            : a
        ),
        selectedAppointment: state.selectedAppointment?.id === appointmentId 
          ? { ...state.selectedAppointment, status: 'cancelled' } 
          : state.selectedAppointment,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to cancel appointment' 
      });
      throw error;
    }
  },

  setSelectedAppointment: (appointment) => {
    set({ selectedAppointment: appointment });
  }
}));
