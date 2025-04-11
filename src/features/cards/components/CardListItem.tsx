import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

interface CardProps {
  card: {
    id: string;
    name: string;
    power: number;
    armor: number;
    provision: number;
    ability: string;
    type: string;
    rarity: string;
    category: string;
    faction: string;
    realtime?: string;
    creator?: string;
    creationDate?: string;
    modificationDate?: string;
    set?: string;
    color?: string;
  };
  isSelected: boolean;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  textColor: string;
  secondaryTextColor: string;
  backgroundColor?: string;
  borderColor: string;
}

const CardListItem: React.FC<CardProps> = ({
  card,
  isSelected,
  onPress,
  onEdit,
  onDelete,
  textColor,
  secondaryTextColor,
  backgroundColor,
  borderColor,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.cardItem, 
        backgroundColor && { backgroundColor },
        { borderBottomColor: borderColor }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.expandIconContainer}>
          <MaterialIcons 
            name={isSelected ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
            size={20} 
            color={textColor} 
          />
        </View>
        
        <View style={styles.mainInfo}>
          <Text style={[styles.cardName, { color: textColor }]}>{card.name}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statText, { color: textColor }]}>{card.power}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statText, { color: textColor }]}>{card.armor}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statText, { color: textColor }]}>{card.provision}</Text>
        </View>
      </View>

      {isSelected && (
        <View style={[styles.expandedContent, { borderTopColor: borderColor }]}>
          <Text style={[styles.abilityText, { color: textColor }]}>{card.ability}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Type</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{card.type}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Rarity</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{card.rarity}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Category</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{card.category}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Faction</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{card.faction}</Text>
              </View>
            </View>
          </View>
          
          {card.creator && (
            <View style={[styles.creatorSection, { borderTopColor: borderColor }]}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Creator</Text>
                  <Text style={[styles.detailValue, { color: textColor }]}>{card.creator}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Creation Date</Text>
                  <Text style={[styles.detailValue, { color: textColor }]}>{card.creationDate}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Set</Text>
                  <Text style={[styles.detailValue, { color: textColor }]}>{card.set}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Color</Text>
                  <Text style={[styles.detailValue, { color: textColor }]}>{card.color}</Text>
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Feather name="edit" size={18} color="#4299e1" />
              </TouchableOpacity>
            )}
            
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Feather name="trash-2" size={18} color="#e53e3e" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    borderBottomWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  expandIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '500',
  },
  statItem: {
    width: 40,
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  abilityText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  creatorSection: {
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
});

export default CardListItem;