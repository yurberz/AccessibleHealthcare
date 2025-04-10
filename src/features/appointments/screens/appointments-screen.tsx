import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { Button } from '../../../core/ui/button';
import { AppointmentCard } from '../components/appointment-card';
import { useAppointmentsStore } from '../store/appointments-store';
import { EmptyState } from '../../../core/ui/empty-state';
import { ErrorState } from '../../../core/ui/error-state';
import { useTheme } from '../../../app/providers/theme-provider';
import { typography } from '../../../core/constants/typography';
import { useAppointmentsQuery } from '../../../lib/api/hooks';

const AppointmentsScreen = () => {
  const { colors, colorScheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch appointments using react-query
  const {
    data: appointments,
    isLoading,
    isError,
    error,
    refetch,
  } = useAppointmentsQuery();
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Handle appointment tap
  const handleAppointmentPress = (appointmentId: string) => {
    // Navigate to appointment details (not implemented in this version)
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
          Appointments
        </AccessibleText>
        
        <Button
          onPress={() => {
            // Handle add new appointment (not fully implemented in this version)
          }}
          title="Add"
          icon="plus"
          variant="primary"
          style={styles.addButton}
          accessibilityLabel="Add new appointment"
          accessibilityHint="Opens form to create a new appointment"
        />
      </View>
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AccessibleText
              style={[styles.loadingText, { color: colors.text }]}
              textType="body"
              accessibilityLabel="Loading appointments"
            >
              Loading appointments...
            </AccessibleText>
          </View>
        ) : isError ? (
          <ErrorState
            title="Failed to load appointments"
            message={error?.message || "There was an error retrieving appointments."}
            onRetry={refetch}
          />
        ) : appointments && appointments.length > 0 ? (
          <FlatList
            data={appointments}
            renderItem={({ item }) => (
              <AppointmentCard
                appointment={item}
                onPress={() => handleAppointmentPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="calendar"
            title="No appointments"
            message="You don't have any upcoming appointments."
            actionLabel="Schedule an appointment"
            onAction={() => {
              // Handle scheduling appointment (not implemented in this version)
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
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 16,
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

export default AppointmentsScreen;
