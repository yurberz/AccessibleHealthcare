import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FormField } from '../../../core/ui/form-field';
import { Button } from '../../../core/ui/button';
import { AccessibleText } from '../../../core/ui/accessible-text';
import { useTheme } from '../../../app/providers/theme-provider';
import { typography } from '../../../core/constants/typography';
import { formatDate, formatTime } from '../../../lib/utils/date-formatter';
import { useAppointmentsStore } from '../store/appointments-store';
import { handleError } from '../../../lib/utils/error-handlers';

// Schema for appointment validation
const appointmentSchema = yup.object().shape({
  patientId: yup.string().required('Patient is required'),
  date: yup.date().required('Date is required'),
  startTime: yup.date().required('Start time is required'),
  endTime: yup
    .date()
    .required('End time is required')
    .test(
      'is-greater',
      'End time must be after start time',
      function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        return endTime > startTime;
      }
    ),
  reason: yup.string().required('Reason is required'),
  notes: yup.string(),
});

type AppointmentFormData = {
  patientId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  reason: string;
  notes: string;
};

interface AppointmentFormProps {
  patientId?: string;
  onSuccess?: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  patientId,
  onSuccess
}) => {
  const { colors } = useTheme();
  const createAppointment = useAppointmentsStore((state) => state.createAppointment);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      patientId: patientId || '',
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      reason: '',
      notes: '',
    },
  });

  const watchedDate = watch('date');
  const watchedStartTime = watch('startTime');
  const watchedEndTime = watch('endTime');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('date', selectedDate);
    }
  };

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setValue('startTime', selectedTime);
      
      // Automatically set end time to 1 hour after start time
      const endTime = new Date(selectedTime);
      endTime.setHours(endTime.getHours() + 1);
      setValue('endTime', endTime);
    }
  };

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setValue('endTime', selectedTime);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsLoading(true);
      
      // Format the data for API
      const appointmentData = {
        patientId: data.patientId,
        date: data.date.toISOString().split('T')[0], // YYYY-MM-DD format
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
        reason: data.reason,
        notes: data.notes,
        status: 'scheduled'
      };
      
      // Create appointment
      await createAppointment(appointmentData);
      
      Alert.alert(
        'Success',
        'Appointment scheduled successfully',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      handleError(error, {
        title: 'Failed to Schedule',
        defaultMessage: 'Unable to schedule appointment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        {/* Date */}
        <Controller
          control={control}
          name="date"
          render={({ field: { value } }) => (
            <View style={styles.dateTimeField}>
              <AccessibleText 
                style={[styles.fieldLabel, { color: colors.text }]}
                textType="body"
              >
                Date
              </AccessibleText>
              <Button
                title={formatDate(value)}
                onPress={() => setShowDatePicker(true)}
                variant="outline"
                style={styles.dateTimeButton}
                icon="calendar"
                accessibilityLabel={`Select date, currently ${formatDate(value)}`}
                accessibilityHint="Opens date picker to select appointment date"
              />
              {showDatePicker && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
              {errors.date && (
                <AccessibleText 
                  style={[styles.errorText, { color: colors.error }]}
                  textType="caption"
                >
                  {errors.date.message}
                </AccessibleText>
              )}
            </View>
          )}
        />

        {/* Start Time */}
        <Controller
          control={control}
          name="startTime"
          render={({ field: { value } }) => (
            <View style={styles.dateTimeField}>
              <AccessibleText 
                style={[styles.fieldLabel, { color: colors.text }]}
                textType="body"
              >
                Start Time
              </AccessibleText>
              <Button
                title={formatTime(value)}
                onPress={() => setShowStartTimePicker(true)}
                variant="outline"
                style={styles.dateTimeButton}
                icon="clock"
                accessibilityLabel={`Select start time, currently ${formatTime(value)}`}
                accessibilityHint="Opens time picker to select appointment start time"
              />
              {showStartTimePicker && (
                <DateTimePicker
                  value={value}
                  mode="time"
                  display="default"
                  onChange={onStartTimeChange}
                />
              )}
              {errors.startTime && (
                <AccessibleText 
                  style={[styles.errorText, { color: colors.error }]}
                  textType="caption"
                >
                  {errors.startTime.message}
                </AccessibleText>
              )}
            </View>
          )}
        />

        {/* End Time */}
        <Controller
          control={control}
          name="endTime"
          render={({ field: { value } }) => (
            <View style={styles.dateTimeField}>
              <AccessibleText 
                style={[styles.fieldLabel, { color: colors.text }]}
                textType="body"
              >
                End Time
              </AccessibleText>
              <Button
                title={formatTime(value)}
                onPress={() => setShowEndTimePicker(true)}
                variant="outline"
                style={styles.dateTimeButton}
                icon="clock"
                accessibilityLabel={`Select end time, currently ${formatTime(value)}`}
                accessibilityHint="Opens time picker to select appointment end time"
              />
              {showEndTimePicker && (
                <DateTimePicker
                  value={value}
                  mode="time"
                  display="default"
                  onChange={onEndTimeChange}
                />
              )}
              {errors.endTime && (
                <AccessibleText 
                  style={[styles.errorText, { color: colors.error }]}
                  textType="caption"
                >
                  {errors.endTime.message}
                </AccessibleText>
              )}
            </View>
          )}
        />

        {/* Reason */}
        <Controller
          control={control}
          name="reason"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Reason for Visit"
              placeholder="Enter reason for appointment"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.reason?.message}
              multiline={false}
              accessibilityLabel="Reason for visit"
              accessibilityHint="Enter the reason for this appointment"
            />
          )}
        />

        {/* Notes */}
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Notes (Optional)"
              placeholder="Enter any additional notes"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.notes?.message}
              multiline={true}
              numberOfLines={4}
              accessibilityLabel="Additional notes"
              accessibilityHint="Enter any additional notes for this appointment"
            />
          )}
        />

        <Button
          title="Schedule Appointment"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          isLoading={isLoading}
          style={styles.submitButton}
          accessibilityLabel="Schedule appointment"
          accessibilityHint="Creates a new appointment with the provided information"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  form: {
    width: '100%',
  },
  dateTimeField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 8,
  },
  dateTimeButton: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  errorText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
  },
});
