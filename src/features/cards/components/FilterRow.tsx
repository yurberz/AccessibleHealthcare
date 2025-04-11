import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FilterOption {
  label: string;
  value: string;
  selected: boolean;
}

interface FilterRowProps {
  label: string;
  options: FilterOption[];
  onSelect: (value: string) => void;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

const FilterRow: React.FC<FilterRowProps> = ({
  label,
  options,
  onSelect,
  textColor,
  secondaryTextColor,
  borderColor,
}) => {
  // Find the selected option to display
  const selectedOption = options.find(option => option.selected) || options[0];

  // Create dropdown selector that would open a modal in a real app
  return (
    <View style={styles.filterContainer}>
      <Text style={[styles.filterLabel, { color: secondaryTextColor }]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.dropdownSelector, { borderColor }]}
        onPress={() => {/* Would show filter options modal */}}
      >
        <Text style={[styles.selectedText, { color: textColor }]}>
          {selectedOption.label}
        </Text>
        <Feather name="chevron-down" size={16} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

interface FilterGroupProps {
  filters: {
    label: string;
    options: FilterOption[];
    onSelect: (value: string) => void;
  }[];
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  filters,
  textColor,
  secondaryTextColor,
  borderColor,
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersScrollContainer}
    >
      {filters.map((filter, index) => (
        <FilterRow
          key={index}
          label={filter.label}
          options={filter.options}
          onSelect={filter.onSelect}
          textColor={textColor}
          secondaryTextColor={secondaryTextColor}
          borderColor={borderColor}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersScrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  filterContainer: {
    marginRight: 12,
    width: 140,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedText: {
    fontSize: 14,
  },
});

export default FilterRow;