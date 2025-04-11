import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../app/providers/theme-provider';
import CardListItem from '../components/CardListItem';
import { FilterGroup } from '../components/FilterRow';
import { useAccessibilitySettings } from '../../../app/providers/accessibility-provider';

// Mock data
const mockCards = [
  {
    id: '1',
    name: 'Vibreinieinventh',
    power: 8,
    armor: 0,
    provision: 8,
    ability: 'Deploy (Melee): Damage the units on each end of an enemy row by 2. Deploy (Ranged): Damage all units on an enemy row by 1. If you control an Elven Deadeye, use both abilities.',
    type: 'Unit',
    rarity: 'Legendary',
    category: 'Dragon Knight',
    faction: 'Neutral',
    realtime: 'Realtime',
    creator: 'Esther Howard',
    creationDate: '12/12/22 8:23 AM',
    modificationDate: '12/12/22 8:23 AM',
    set: 'BaseSet',
    color: 'Gold',
  },
  {
    id: '2',
    name: 'Vibreinieinventh',
    power: 8,
    armor: 0,
    provision: 8,
    ability: 'Deploy (Melee): Damage the units on each end of an enemy row by 2. Deploy (Ranged): Damage all units on an enemy row by 1. If you control an Elven Deadeye, use both abilities.',
    type: 'Unit',
    rarity: 'Legendary',
    category: 'Human Knight',
    faction: 'Neutral',
    realtime: 'Realtime',
  },
  {
    id: '3',
    name: 'Vibreinieinventh',
    power: 8,
    armor: 0,
    provision: 8,
    ability: 'Deploy (Melee): Damage the units on each end of an enemy row by 2. Deploy (Ranged): Damage all units on an enemy row by 1. If you control an Elven Deadeye, use both abilities.',
    type: 'Unit',
    rarity: 'Legendary',
    category: 'Knight',
    faction: 'Neutral',
    realtime: 'Realtime',
  },
  {
    id: '4',
    name: 'Vibreinieinventh',
    power: 8,
    armor: 0,
    provision: 8,
    ability: 'Purify an allied unit and boost it by 3. If you control a Dryad, also give it Vitality for 3 turns.',
    type: 'Unit',
    rarity: 'Legendary',
    category: 'Human Dragon',
    faction: 'Realtime',
  },
];

// Define Filter data
const filterData = [
  {
    label: 'Faction',
    options: [
      { label: 'All', value: 'all', selected: true },
      { label: 'Neutral', value: 'neutral', selected: false },
      { label: 'Monsters', value: 'monsters', selected: false },
      { label: 'Nilfgaard', value: 'nilfgaard', selected: false },
    ],
    onSelect: (value: string) => console.log(`Selected faction: ${value}`),
  },
  {
    label: 'Type',
    options: [
      { label: 'All', value: 'all', selected: true },
      { label: 'Unit', value: 'unit', selected: false },
      { label: 'Special', value: 'special', selected: false },
      { label: 'Artifact', value: 'artifact', selected: false },
    ],
    onSelect: (value: string) => console.log(`Selected type: ${value}`),
  },
  {
    label: 'Rarity',
    options: [
      { label: 'All', value: 'all', selected: true },
      { label: 'Legendary', value: 'legendary', selected: false },
      { label: 'Epic', value: 'epic', selected: false },
      { label: 'Rare', value: 'rare', selected: false },
    ],
    onSelect: (value: string) => console.log(`Selected rarity: ${value}`),
  },
  {
    label: 'Category',
    options: [
      { label: 'All', value: 'all', selected: true },
      { label: 'Dragon Knight', value: 'dragon_knight', selected: false },
      { label: 'Human', value: 'human', selected: false },
      { label: 'Elf', value: 'elf', selected: false },
    ],
    onSelect: (value: string) => console.log(`Selected category: ${value}`),
  },
];

const CardsLibraryScreenOptimized = () => {
  // Hooks
  const { colors, colorScheme } = useTheme();
  const { fontScale } = useAccessibilitySettings();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handlers
  const handleCardPress = useCallback((cardId: string) => {
    setSelectedCardId(prevId => prevId === cardId ? null : cardId);
  }, []);
  
  const handleSearch = useCallback(() => {
    console.log(`Searching for: ${searchQuery}`);
    // Would trigger an actual search API call in a real app
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate network request
  }, [searchQuery]);
  
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);
  
  const handleAddNewCard = useCallback(() => {
    console.log('Add new card');
    // Would navigate to card creation screen in a real app
  }, []);
  
  const handleEditCard = useCallback((cardId: string) => {
    console.log(`Edit card: ${cardId}`);
    // Would navigate to card edit screen in a real app
  }, []);
  
  const handleDeleteCard = useCallback((cardId: string) => {
    console.log(`Delete card: ${cardId}`);
    // Would show confirmation dialog in a real app
  }, []);

  // Rendering
  const renderHeader = () => (
    <View>
      <View style={styles.screenHeader}>
        <Text style={[
          styles.screenTitle, 
          { color: colors.text, fontSize: 22 * fontScale }
        ]}>
          Cards Library
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: '#10b981' }]}
          onPress={handleAddNewCard}
          accessibilityLabel="Add new card"
          accessibilityHint="Opens the form to create a new card"
        >
          <Feather name="plus" size={16} color="white" />
          <Text style={styles.buttonText}>ADD NEW CARD</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather 
            name="search" 
            size={16} 
            color={colors.textSecondary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { 
                color: colors.text,
                fontSize: 14 * fontScale
              }
            ]}
            placeholder="Search by card name or ability..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            accessibilityLabel="Search cards input"
            accessibilityHint="Enter card name or ability text to search"
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={handleClearSearch}
              accessibilityLabel="Clear search"
            >
              <Feather name="x" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View style={styles.searchActions}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: '#3b82f6' }]}
            onPress={handleSearch}
            accessibilityLabel="Search"
            accessibilityHint="Start searching with the entered term"
          >
            <Feather name="search" size={18} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.iconButton, 
              { backgroundColor: showFilters ? '#4f46e5' : '#6366f1' }
            ]}
            onPress={() => setShowFilters(!showFilters)}
            accessibilityLabel={showFilters ? "Hide filters" : "Show filters"}
            accessibilityHint={showFilters ? "Hide the filtering options" : "Display filtering options"}
          >
            <Feather name="filter" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {showFilters && (
        <FilterGroup 
          filters={filterData}
          textColor={colors.text}
          secondaryTextColor={colors.textSecondary}
          borderColor={colors.border}
        />
      )}
      
      <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.expandColumn}>
          <MaterialIcons name="unfold-more" size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.nameColumn}>
          <Text style={[
            styles.columnHeader, 
            { color: colors.textSecondary, fontSize: 12 * fontScale }
          ]}>
            NAME
          </Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={[
            styles.columnHeader, 
            { color: colors.textSecondary, fontSize: 12 * fontScale }
          ]}>
            PWR
          </Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={[
            styles.columnHeader, 
            { color: colors.textSecondary, fontSize: 12 * fontScale }
          ]}>
            ARM
          </Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={[
            styles.columnHeader, 
            { color: colors.textSecondary, fontSize: 12 * fontScale }
          ]}>
            PROV
          </Text>
        </View>
      </View>
    </View>
  );
  
  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
            Loading cards...
          </Text>
        </View>
      );
    }
    
    return (
      <View style={[styles.pagination, { borderTopColor: colors.border }]}>
        <Text style={[styles.paginationInfo, { color: colors.textSecondary }]}>
          Showing 1-10 from 1000
        </Text>
        
        <View style={styles.paginationControls}>
          <TouchableOpacity 
            style={styles.paginationArrow}
            accessibilityLabel="Previous page"
          >
            <Feather name="chevron-left" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.paginationNumbers}>
            <TouchableOpacity 
              style={[styles.pageNumber, { backgroundColor: colors.primary }]}
              accessibilityLabel="Page 1, current page"
            >
              <Text style={styles.activePageText}>1</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.pageNumber}
              accessibilityLabel="Page 2"
            >
              <Text style={[styles.pageText, { color: colors.text }]}>2</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.pageNumber}
              accessibilityLabel="Page 3"
            >
              <Text style={[styles.pageText, { color: colors.text }]}>3</Text>
            </TouchableOpacity>
            
            <Text style={[styles.pageText, { color: colors.textSecondary }]}>...</Text>
            
            <TouchableOpacity 
              style={styles.pageNumber}
              accessibilityLabel="Page 10"
            >
              <Text style={[styles.pageText, { color: colors.text }]}>10</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.paginationArrow}
            accessibilityLabel="Next page"
          >
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderItem = ({ item, index }) => {
    const isSelected = selectedCardId === item.id;
    const rowBackgroundColor = index % 2 === 0 
      ? colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5' 
      : undefined;
      
    return (
      <CardListItem 
        card={item}
        isSelected={isSelected}
        onPress={() => handleCardPress(item.id)}
        onEdit={() => handleEditCard(item.id)}
        onDelete={() => handleDeleteCard(item.id)}
        textColor={colors.text}
        secondaryTextColor={colors.textSecondary}
        backgroundColor={rowBackgroundColor}
        borderColor={colors.border}
      />
    );
  };
  
  const getItemLayout = (data, index) => ({
    length: 56, // height of non-expanded item
    offset: 56 * index,
    index,
  });
  
  const keyExtractor = item => item.id;
  
  // Main render
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={mockCards}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        stickyHeaderIndices={[0]}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        accessibilityLabel="Cards list"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  screenTitle: {
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 8,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  expandColumn: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameColumn: {
    flex: 1,
  },
  statColumn: {
    width: 40,
    alignItems: 'center',
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
  },
  pagination: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationInfo: {
    fontSize: 12,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationArrow: {
    padding: 8,
  },
  paginationNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageNumber: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageText: {
    fontWeight: '500',
  },
});

export default CardsLibraryScreenOptimized;