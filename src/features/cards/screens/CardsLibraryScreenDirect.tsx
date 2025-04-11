import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../app/providers/theme-provider';

// Mock data for cards
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

// Filter options
const filterOptions = {
  faction: ['All', 'Neutral', 'Scoia\'tael', 'Monsters', 'Nilfgaard', 'Northern Realms', 'Skellige', 'Syndicate'],
  category: ['All', 'Dragon Knight', 'Human Knight', 'Knight', 'Human Dragon'],
  type: ['All', 'Unit', 'Special', 'Artifact'],
  rarity: ['All', 'Legendary', 'Epic', 'Rare', 'Common'],
  set: ['All', 'BaseSet', 'Tutorial', 'Expansion'],
  color: ['All', 'Gold', 'Silver', 'Bronze'],
};

const CardsLibraryScreen = () => {
  const { colors, colorScheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Render card item
  const renderCard = ({ item, index }) => {
    const isSelected = selectedCard?.id === item.id;
    return (
      <TouchableOpacity 
        style={[
          styles.cardItem, 
          isSelected && { backgroundColor: colors.cardSelected },
          index % 2 === 0 ? { backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5' } : {}
        ]}
        onPress={() => setSelectedCard(item)}
      >
        <View style={styles.expandButton}>
          <MaterialIcons 
            name={isSelected ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
            size={20} 
            color={colors.text} 
          />
        </View>
        
        <View style={styles.cardNameSection}>
          <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={[styles.statText, { color: colors.text }]}>{item.power}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={[styles.statText, { color: colors.text }]}>{item.armor}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={[styles.statText, { color: colors.text }]}>{item.provision}</Text>
        </View>

        {isSelected ? (
          <View style={styles.fullCardInfo}>
            <Text style={[styles.cardAbility, { color: colors.text }]}>{item.ability}</Text>
            
            <View style={styles.cardDetailsGrid}>
              <View style={styles.cardDetailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.type}</Text>
              </View>
              
              <View style={styles.cardDetailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Rarity</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.rarity}</Text>
              </View>
              
              <View style={styles.cardDetailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.category}</Text>
              </View>
              
              <View style={styles.cardDetailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Faction</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.faction}</Text>
              </View>
            </View>
            
            {item.creator && (
              <View style={styles.creatorInfo}>
                <View style={styles.creatorSection}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Creator</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.creator}</Text>
                </View>
                
                <View style={styles.creatorSection}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Creation Date</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.creationDate}</Text>
                </View>
                
                <View style={styles.creatorSection}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Set</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.set}</Text>
                </View>
                
                <View style={styles.creatorSection}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Color</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.color}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton}>
                <Feather name="edit" size={16} color="#4299e1" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.deleteButton}>
                <Feather name="trash-2" size={16} color="#e53e3e" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  // Render header component
  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Cards Library</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: '#10b981' }]}
          onPress={() => console.log('Add new card')}
        >
          <Feather name="plus" size={16} color="white" />
          <Text style={styles.addButtonText}>ADD NEW CARD</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchBar}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
              color: colors.text,
              borderColor: colors.border
            }
          ]}
          placeholder="Please Enter Name of Card or Ability"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: '#3b82f6' }]}
          onPress={() => console.log('Search')}
        >
          <Feather name="search" size={16} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: '#ef4444' }]}
          onPress={() => setSearchQuery('')}
        >
          <Feather name="x" size={16} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: '#6366f1' }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name="filter" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <ScrollView horizontal style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Faction</Text>
            <View style={styles.filterSelect}>
              <Text style={[styles.filterValue, { color: colors.text }]}>All</Text>
              <Feather name="chevron-down" size={16} color={colors.text} />
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Category</Text>
            <View style={styles.filterSelect}>
              <Text style={[styles.filterValue, { color: colors.text }]}>All</Text>
              <Feather name="chevron-down" size={16} color={colors.text} />
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Type</Text>
            <View style={styles.filterSelect}>
              <Text style={[styles.filterValue, { color: colors.text }]}>All</Text>
              <Feather name="chevron-down" size={16} color={colors.text} />
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Rarity</Text>
            <View style={styles.filterSelect}>
              <Text style={[styles.filterValue, { color: colors.text }]}>All</Text>
              <Feather name="chevron-down" size={16} color={colors.text} />
            </View>
          </View>
        </ScrollView>
      )}
      
      <View style={styles.tableHeader}>
        <View style={styles.expandButton}>
          <MaterialIcons name="unfold-more" size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.cardNameSection}>
          <Text style={[styles.columnTitle, { color: colors.textSecondary }]}>NAME</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={[styles.columnTitle, { color: colors.textSecondary }]}>POWER</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={[styles.columnTitle, { color: colors.textSecondary }]}>ARMOR</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={[styles.columnTitle, { color: colors.textSecondary }]}>PROVISION</Text>
        </View>
      </View>
    </View>
  );
  
  // Render footer component with pagination
  const renderFooter = () => (
    <View style={styles.pagination}>
      <Text style={[styles.paginationText, { color: colors.textSecondary }]}>
        Showing 1-10 from 1000
      </Text>
      
      <View style={styles.paginationControls}>
        <TouchableOpacity style={styles.paginationButton}>
          <Feather name="chevron-left" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.pageButton, 
            { backgroundColor: '#3b82f6' }
          ]}
        >
          <Text style={styles.pageButtonTextActive}>1</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.pageButton}>
          <Text style={[styles.pageButtonText, { color: colors.text }]}>2</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.pageButton}>
          <Text style={[styles.pageButtonText, { color: colors.text }]}>3</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.paginationButton}>
          <Feather name="chevron-right" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={mockCards}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 12,
  },
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterGroup: {
    marginRight: 16,
    width: 140,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  filterSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterValue: {
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  expandButton: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNameSection: {
    flex: 1,
    paddingRight: 10,
  },
  cardName: {
    fontSize: 14,
  },
  statContainer: {
    width: 60,
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
  },
  fullCardInfo: {
    width: '100%',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cardAbility: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  cardDetailItem: {
    width: '50%',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  creatorInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  creatorSection: {
    width: '50%',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  paginationText: {
    fontSize: 12,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paginationButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageButtonText: {
    fontWeight: '500',
  },
});

export default CardsLibraryScreen;