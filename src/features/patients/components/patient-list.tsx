import React from 'react';
import { 
  FlatList,
  StyleSheet,
  RefreshControl,
  ListRenderItemInfo,
  View,
} from 'react-native';
import { Patient } from '../../../core/types';
import { PatientCard } from './patient-card';
import { EmptyState } from '../../../core/ui/empty-state';
import { useTheme } from '../../../app/providers/theme-provider';

interface PatientListProps {
  patients: Patient[];
  onPatientPress: (patientId: string) => void;
  refreshControl?: React.ReactElement;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  onPatientPress,
  refreshControl,
}) => {
  const { colors } = useTheme();
  
  const renderPatientCard = ({ item }: ListRenderItemInfo<Patient>) => {
    return (
      <PatientCard 
        patient={item} 
        onPress={() => onPatientPress(item.id)}
        accessibilityLabel={`${item.firstName} ${item.lastName}, ${item.age} years old`}
        accessibilityHint="Double tap to view patient details"
      />
    );
  };

  const keyExtractor = (item: Patient) => item.id;

  const renderEmpty = () => (
    <EmptyState
      icon="users"
      title="No patients found"
      message="There are no patients matching your criteria."
    />
  );

  const ItemSeparatorComponent = () => (
    <View style={styles.separator} />
  );

  return (
    <FlatList
      data={patients}
      renderItem={renderPatientCard}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer}
      refreshControl={refreshControl}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={ItemSeparatorComponent}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      accessibilityLabel="List of patients"
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  separator: {
    height: 8,
  },
});
