import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator, 
  TouchableOpacity
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { PatientsStackParamList } from '../../../app/navigation/main-navigator';
import { useTheme } from '../../../app/providers/theme-provider';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { PatientList } from '../components/patient-list';
import { Button } from '../../../core/ui/button';
import { usePatientsStore } from '../store/patients-store';
import { EmptyState } from '../../../core/ui/empty-state';
import { ErrorState } from '../../../core/ui/error-state';
import { typography } from '../../../core/constants/typography';
import { useAccessibilitySettings } from '../../../app/providers/accessibility-provider';
import { usePatientsQuery } from '../../../lib/api/hooks';

type PatientListScreenNavigationProp = StackNavigationProp<PatientsStackParamList, 'PatientList'>;

const PatientListScreen = () => {
  const navigation = useNavigation<PatientListScreenNavigationProp>();
  const { colors, colorScheme } = useTheme();
  const { isScreenReaderEnabled } = useAccessibilitySettings();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch patients using react-query
  const {
    data: patients,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = usePatientsQuery();

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Navigate to patient details
  const handlePatientPress = (patientId: string) => {
    navigation.navigate('PatientDetails', { patientId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <AccessibleText
          style={[styles.title, { color: colors.text }]}
          textType="heading"
          accessibilityRole="header"
        >
          Patients
        </AccessibleText>
        
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          accessibilityLabel="Add new patient"
          accessibilityHint="Opens form to add a new patient"
          accessibilityRole="button"
          onPress={() => {
            // Handle add new patient - not implemented in this version
          }}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Search field would go here */}
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AccessibleText
              style={[styles.loadingText, { color: colors.text }]}
              textType="body"
              accessibilityLabel="Loading patients"
            >
              Loading patients...
            </AccessibleText>
          </View>
        ) : isError ? (
          <ErrorState
            title="Failed to load patients"
            message={error?.message || "There was an error retrieving the patient list."}
            onRetry={refetch}
          />
        ) : patients && patients.length > 0 ? (
          <PatientList
            patients={patients}
            onPatientPress={handlePatientPress}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          <EmptyState
            icon="users"
            title="No patients found"
            message="You don't have any patients in your list yet."
            actionLabel="Add your first patient"
            onAction={() => {
              // Handle add new patient - not implemented in this version
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: typography.fontSize.xlarge,
    fontFamily: typography.fontFamily.bold,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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

export default PatientListScreen;
