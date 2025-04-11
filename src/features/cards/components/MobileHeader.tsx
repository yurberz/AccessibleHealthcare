import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../app/providers/theme-provider';
import { useAccessibilitySettings } from '../../../app/providers/accessibility-provider';

interface MobileHeaderProps {
  title?: string;
  onMenuItemPress?: (menuItem: string) => void;
  showNotifications?: boolean;
  userName?: string;
  userAvatar?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'G-Gaming',
  onMenuItemPress,
  showNotifications = true,
  userName = 'Albert Flores',
  userAvatar,
}) => {
  const { colors, colorScheme } = useTheme();
  const { fontScale } = useAccessibilitySettings();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  
  // Menu items from the web header
  const menuItems = [
    { id: 'cards', label: 'CARDS LIBRARY', selected: true },
    { id: 'users', label: 'USER MANAGEMENT', selected: false },
    { id: 'logs', label: 'LOGS', selected: false },
    { id: 'system', label: 'SYSTEM', selected: false },
  ];
  
  const toggleMenu = () => {
    if (menuVisible) {
      // Animate menu out
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      // Animate menu in
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handleMenuItemPress = (menuId: string) => {
    if (onMenuItemPress) {
      onMenuItemPress(menuId);
    }
    toggleMenu();
  };
  
  const translateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });
  
  const opacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.logoSection}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Feather name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.primary }]}>G</Text>
            <Text style={[styles.logoSmallText, { color: colors.text }]}>
              Gaming
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          {showNotifications && (
            <TouchableOpacity 
              style={styles.iconButton}
              accessibilityLabel="Notifications"
            >
              <Feather name="bell" size={20} color={colors.text} />
              <View style={[styles.notificationBadge, { backgroundColor: colors.error }]} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.userButton}
            accessibilityLabel={`User profile: ${userName}`}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {userAvatar ? (
                <Text>AV</Text> // This would be an actual image in real implementation
              ) : (
                <Text style={styles.avatarText}>
                  {userName.split(' ').map(n => n[0]).join('')}
                </Text>
              )}
            </View>
            <Text 
              style={[
                styles.userName, 
                { color: colors.text, fontSize: 14 * fontScale }
              ]}
              numberOfLines={1}
            >
              {userName}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Slide-in menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalContainer}>
          {/* Dark overlay */}
          <Animated.View 
            style={[
              styles.modalOverlay, 
              { opacity, backgroundColor: '#000' }
            ]}
            onTouchEnd={toggleMenu}
          />
          
          {/* Drawer menu */}
          <Animated.View 
            style={[
              styles.menuContainer, 
              { 
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
                transform: [{ translateX }]
              }
            ]}
          >
            <SafeAreaView style={styles.menuContent}>
              <View style={styles.menuHeader}>
                <View style={styles.logoContainerMenu}>
                  <Text style={[styles.logoText, { color: colors.primary }]}>G</Text>
                  <Text style={[styles.logoSmallText, { color: colors.text }]}>
                    Gaming
                  </Text>
                </View>
                <TouchableOpacity onPress={toggleMenu}>
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    item.selected && { backgroundColor: `${colors.primary}20` }
                  ]}
                  onPress={() => handleMenuItemPress(item.id)}
                >
                  <Text 
                    style={[
                      styles.menuItemText, 
                      { 
                        color: item.selected ? colors.primary : colors.text,
                        fontSize: 14 * fontScale 
                      }
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.selected && (
                    <View style={[styles.menuItemIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
              
              <View style={styles.menuFooter}>
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={() => handleMenuItemPress('logout')}
                >
                  <Feather name="log-out" size={18} color={colors.error} />
                  <Text 
                    style={[
                      styles.logoutText, 
                      { color: colors.error, fontSize: 14 * fontScale }
                    ]}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    paddingRight: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoSmallText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    marginHorizontal: 8,
    maxWidth: 100,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    width: windowWidth * 0.8,
    maxWidth: 300,
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  menuItemText: {
    fontWeight: '500',
  },
  menuItemIndicator: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  menuFooter: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default MobileHeader;