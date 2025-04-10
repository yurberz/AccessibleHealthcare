import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { Card } from '../../../core/ui/card';
import { useTheme } from '../../../app/providers/theme-provider';
import { typography } from '../../../core/constants/typography';
import { Appointment } from '../../../core/types';
import { formatDate, formatTime } from '../../../lib/utils/date-formatter';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onPress 
}) => {
  const { colors } = useTheme();
  
  // Format appointment details for accessibility
  const appointmentInfo = `Appointment with ${appointment.patientName} on ${formatDate(appointment.date)} at ${formatTime(appointment.startTime)}`;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return '#4CAF50'; // Green
      case 'cancelled':
        return '#F44336'; // Red
      case 'completed':
        return '#9E9E9E'; // Grey
      default:
        return '#2196F3'; // Blue
    }
  };

  return (
    <Card
      style={styles.card}
      pressable
      onPress={onPress}
      accessibilityLabel={appointmentInfo}
      accessibilityHint="View appointment details"
      accessibilityRole="button"
    >
      <View style={styles.contentContainer}>
        <View style={styles.dateTimeContainer}>
          <View style={[styles.dateBadge, { backgroundColor: colors.primary + '20' }]}>
            <AccessibleText
              style={[styles.dateText, { color: colors.primary }]}
              textType="subheading"
              accessibilityLabel={formatDate(appointment.date)}
            >
              {new Date(appointment.date).getDate()}
            </AccessibleText>
            <AccessibleText
              style={[styles.monthText, { color: colors.primary }]}
              textType="caption"
            >
              {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
            </AccessibleText>
          </View>
          
          <View style={styles.timeContainer}>
            <AccessibleText
              style={[styles.timeText, { color: colors.text }]}
              textType="body"
              accessibilityLabel={`Time: ${formatTime(appointment.startTime)} to ${formatTime(appointment.endTime)}`}
            >
              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
            </AccessibleText>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailsContainer}>
          <AccessibleText
            style={[styles.patientName, { color: colors.text }]}
            textType="subheading"
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityLabel={`Patient: ${appointment.patientName}`}
          >
            {appointment.patientName}
          </AccessibleText>
          
          <View style={styles.detailsRow}>
            <Feather name="clipboard" size={14} color={colors.textSecondary} style={styles.icon} />
            <AccessibleText
              style={[styles.detailText, { color: colors.textSecondary }]}
              textType="caption"
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityLabel={`Reason: ${appointment.reason}`}
            >
              {appointment.reason}
            </AccessibleText>
          </View>
          
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(appointment.status) }
              ]}
            >
              <AccessibleText
                style={styles.statusText}
                textType="caption"
                accessibilityLabel={`Status: ${appointment.status}`}
              >
                {appointment.status}
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
  dateTimeContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  dateBadge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
  },
  monthText: {
    fontSize: typography.fontSize.xsmall,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'uppercase',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
  },
  icon: {
    marginRight: 4,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.fontSize.xsmall,
    fontFamily: typography.fontFamily.medium,
    color: 'white',
    textTransform: 'uppercase',
  },
  chevron: {
    marginLeft: 'auto',
  },
});
