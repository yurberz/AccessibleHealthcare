import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  AccessibilityInfo, 
  AccessibilityRole
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { useTheme } from '../../../app/providers/theme-provider';
import { Card } from '../../../core/ui/card';
import { typography } from '../../../core/constants/typography';
import { Patient } from '../../../core/types';
import { formatDate } from '../../../lib/utils/date-formatter';

interface PatientCardProps {
  patient: Patient;
  onPress: (patientId: string) => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors } = useTheme();
  
  // Format the patient's name and age for accessibility
  const patientInfo = `${patient.firstName} ${patient.lastName}, ${patient.age} years old`;
  
  return (
    <Card
      style={styles.card}
      pressable
      onPress={() => onPress(patient.id)}
      accessibilityLabel={accessibilityLabel || patientInfo}
      accessibilityHint={accessibilityHint || "View patient details"}
      accessibilityRole="button"
    >
      <View style={styles.contentContainer}>
        <View style={styles.initialCircle}>
          <AccessibleText
            style={styles.initialText}
            textType="subheading"
            accessibilityLabel={`${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`}
          >
            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
          </AccessibleText>
        </View>
        
        <View style={styles.infoContainer}>
          <AccessibleText
            style={[styles.name, { color: colors.text }]}
            textType="subheading"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {patient.firstName} {patient.lastName}
          </AccessibleText>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Feather name="calendar" size={14} color={colors.textSecondary} style={styles.icon} />
              <AccessibleText
                style={[styles.detailText, { color: colors.textSecondary }]}
                textType="caption"
                accessibilityLabel={`Born on ${formatDate(patient.dateOfBirth)}`}
              >
                {formatDate(patient.dateOfBirth)}
              </AccessibleText>
            </View>
            
            <View style={styles.detailItem}>
              <Feather name="phone" size={14} color={colors.textSecondary} style={styles.icon} />
              <AccessibleText
                style={[styles.detailText, { color: colors.textSecondary }]}
                textType="caption"
                accessibilityLabel={`Phone: ${patient.phone}`}
              >
                {patient.phone}
              </AccessibleText>
            </View>
          </View>
        </View>
        
        <Feather 
          name="chevron-right" 
          size={20} 
          color={colors.primary} 
          style={styles.chevron}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4D79FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialText: {
    color: 'white',
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.bold,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
  },
  icon: {
    marginRight: 4,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
