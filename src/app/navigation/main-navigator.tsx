import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { AccessibilityInfo, Platform } from 'react-native';
import PatientListScreen from '../../features/patients/screens/patient-list-screen';
import PatientDetailsScreen from '../../features/patients/screens/patient-details-screen';
import AppointmentsScreen from '../../features/appointments/screens/appointments-screen';
import { useTheme } from '../providers/theme-provider';
import { colors } from '../../core/constants/colors';
import { typography } from '../../core/constants/typography';
import { useAccessibilitySettings } from '../providers/accessibility-provider';

// Define the main tab navigator types
export type MainTabParamList = {
  PatientsStack: undefined;
  AppointmentsStack: undefined;
  ProfileStack: undefined;
};

// Define the patients stack navigator types
export type PatientsStackParamList = {
  PatientList: undefined;
  PatientDetails: { patientId: string };
};

// Define the appointments stack navigator types
export type AppointmentsStackParamList = {
  Appointments: undefined;
  AppointmentDetails: { appointmentId: string };
  AddAppointment: { patientId?: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const PatientsStack = createStackNavigator<PatientsStackParamList>();
const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>();

// Patients stack navigator
const PatientsStackNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <PatientsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <PatientsStack.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{ title: 'Patients' }}
      />
      <PatientsStack.Screen
        name="PatientDetails"
        component={PatientDetailsScreen}
        options={({ route }) => ({
          title: 'Patient Details',
          headerBackTitleVisible: false,
        })}
      />
    </PatientsStack.Navigator>
  );
};

// Appointments stack navigator
const AppointmentsStackNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <AppointmentsStack.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
    </AppointmentsStack.Navigator>
  );
};

// Main tab navigator
const MainNavigator = () => {
  const { colors, colorScheme } = useTheme();
  const { isScreenReaderEnabled } = useAccessibilitySettings();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.small,
          fontFamily: typography.fontFamily.regular,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="PatientsStack"
        component={PatientsStackNavigator}
        options={{
          tabBarLabel: 'Patients',
          tabBarAccessibilityLabel: 'Patients Tab',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentsStack"
        component={AppointmentsStackNavigator}
        options={{
          tabBarLabel: 'Appointments',
          tabBarAccessibilityLabel: 'Appointments Tab',
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
