import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { useTheme } from '../../../app/providers/theme-provider';
import { typography } from '../../../core/constants/typography';
import { Patient } from '../../../core/types';

interface PatientInfoProps {
  patient: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  const { colors } = useTheme();
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const patientAge = calculateAge(patient.dateOfBirth);
  
  return (
    <View style={styles.container}>
      <View style={[styles.initialCircle, { backgroundColor: colors.primary }]}>
        <AccessibleText
          style={styles.initialText}
          textType="heading"
          accessibilityLabel={`${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`}
        >
          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
        </AccessibleText>
      </View>
      
      <View style={styles.infoContainer}>
        <AccessibleText
          style={[styles.name, { color: colors.text }]}
          textType="heading"
          accessibilityLabel={`Patient name: ${patient.firstName} ${patient.lastName}`}
        >
          {patient.firstName} {patient.lastName}
        </AccessibleText>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Feather name="user" size={16} color={colors.textSecondary} style={styles.icon} />
            <AccessibleText
              style={[styles.detailText, { color: colors.textSecondary }]}
              textType="body"
              accessibilityLabel={`${patientAge} years old`}
            >
              {patientAge} years old
            </AccessibleText>
          </View>
          
          <View style={styles.detailRow}>
            <Feather name="hash" size={16} color={colors.textSecondary} style={styles.icon} />
            <AccessibleText
              style={[styles.detailText, { color: colors.textSecondary }]}
              textType="body"
              accessibilityLabel={`Patient ID: ${patient.id}`}
            >
              ID: {patient.id}
            </AccessibleText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialText: {
    color: 'white',
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'column',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
  },
  icon: {
    marginRight: 8,
  },
});
