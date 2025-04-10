import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { PatientsStackParamList } from '../../../app/navigation/main-navigator';
import { useTheme } from '../../../app/providers/theme-provider';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { PatientInfo } from '../components/patient-info';
import { Button } from '../../../core/ui/button';
import { Card } from '../../../core/ui/card';
import { ErrorState } from '../../../core/ui/error-state';
import { typography } from '../../../core/constants/typography';
import { usePatientQuery } from '../../../lib/api/hooks';
import { formatDate } from '../../../lib/utils/date-formatter';

type PatientDetailsRouteProp = RouteProp<PatientsStackParamList, 'PatientDetails'>;
type PatientDetailsNavigationProp = StackNavigationProp<PatientsStackParamList, 'PatientDetails'>;

const PatientDetailsScreen = () => {
  const route = useRoute<PatientDetailsRouteProp>();
  const navigation = useNavigation<PatientDetailsNavigationProp>();
  const { colors, colorScheme } = useTheme();
  const { patientId } = route.params;
  
  // Fetch single patient
  const {
    data: patient,
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientQuery(patientId);

  // Handle edit
  const handleEditPatient = () => {
    // Not implemented in this version
    Alert.alert('Feature Coming Soon', 'Patient editing will be available in a future update.');
  };

  // Handle appointments
  const navigateToAppointments = () => {
    // Navigate to appointments for this patient
    // Not fully implemented in this version
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AccessibleText
            style={[styles.loadingText, { color: colors.text }]}
            textType="body"
            accessibilityLabel="Loading patient details"
          >
            Loading patient details...
          </AccessibleText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !patient) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ErrorState
          title="Failed to load patient"
          message={error?.message || "There was an error retrieving the patient details."}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <PatientInfo patient={patient} />
          
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={handleEditPatient}
            accessibilityLabel="Edit patient information"
            accessibilityRole="button"
          >
            <Feather name="edit" size={18} color="white" />
          </TouchableOpacity>
        </View>
        
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Date of Birth
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {formatDate(patient.dateOfBirth)}
              </AccessibleText>
            </View>
            
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Gender
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.gender}
              </AccessibleText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Phone
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.phone}
              </AccessibleText>
            </View>
            
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Email
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.email}
              </AccessibleText>
            </View>
          </View>
        </Card>
        
        <Card style={styles.card} title="Medical Information">
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Blood Type
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.bloodType || 'Not recorded'}
              </AccessibleText>
            </View>
            
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Height
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.height ? `${patient.height} cm` : 'Not recorded'}
              </AccessibleText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Weight
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.weight ? `${patient.weight} kg` : 'Not recorded'}
              </AccessibleText>
            </View>
            
            <View style={styles.infoItem}>
              <AccessibleText
                style={styles.infoLabel}
                textType="caption"
                accessibilityRole="text"
              >
                Allergies
              </AccessibleText>
              <AccessibleText
                style={[styles.infoValue, { color: colors.text }]}
                textType="body"
                accessibilityRole="text"
              >
                {patient.allergies || 'None recorded'}
              </AccessibleText>
            </View>
          </View>
        </Card>
        
        <Button
          title="View Appointments"
          onPress={navigateToAppointments}
          style={styles.appointmentsButton}
          variant="secondary"
          icon="calendar"
          accessibilityLabel="View patient appointments"
          accessibilityHint="Shows all appointments for this patient"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 4,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
  appointmentsButton: {
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
});

export default PatientDetailsScreen;
