// app/(customer)/(tabs)/profile.tsx - Dashboard-Style Profile Design
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppData } from '../../contexts/AppDataContext';

const { width: screenWidth } = Dimensions.get('window');

export default function EnhancedProfileTab() {
  const { 
    userProfile, 
    updateUserProfile, 
    userEcoPoints, 
    availableDiscounts,
    appliedDiscounts,
    cartItems,
    getCartTotal,
    getCartItemCount,
    orders
  } = useAppData();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showEcoPointsModal, setShowEcoPointsModal] = useState(false);

  // Calculate real impact data from actual orders (same logic as impact tab)
  const calculateRealImpactData = useMemo(() => {
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const calculateForPeriod = (startDate: Date) => {
      const filteredOrders = orders.filter(order => order.date >= startDate);
      
      let co2Saved = 0;
      let mealsDonated = 0;
      let moneySaved = 0;
      let points = 0;
      let sustainableProducts = 0;
      let walmartSavings = 0;

      filteredOrders.forEach(order => {
        // Add EcoPoints earned from this order
        points += order.ecoPointsEarned;
        
        // Add money saved from discounts
        moneySaved += order.discount;
        
        // Calculate savings from Walmart-specific discounts (assume 60% of discounts are Walmart-related)
        walmartSavings += order.discount * 0.6;

        // Process each item in the order
        order.items.forEach(item => {
          // Calculate CO2 impact (negative values mean CO2 saved)
          if (item.co2Impact) {
            co2Saved += Math.round(Math.abs(item.co2Impact) * item.quantity * 100) / 100;
          }

          // Count sustainable/eco-friendly products
          if (item.isEcoFriendly) {
            sustainableProducts += item.quantity;
          }

          // Calculate meals donated (assume 1 meal donated for every 10 eco-friendly products)
          if (item.isEcoFriendly) {
            mealsDonated += Math.floor(item.quantity / 10);
          }

          // Add money saved from rescue deals
          if (item.isRescueDeal && item.originalPrice) {
            moneySaved += (item.originalPrice - item.price) * item.quantity;
          }
        });
      });

      // Add potential impact from current cart
      if (startDate <= now) {
        cartItems.forEach(item => {
          if (item.co2Impact) {
            co2Saved += Math.abs(item.co2Impact) * item.quantity * 0.1; // 10% of potential impact
          }
        });
      }

      return {
        co2Saved: Math.max(co2Saved, 0),
        mealsDonated: Math.max(mealsDonated, 0),
        moneySaved: Math.max(moneySaved, 0),
        points: Math.max(points, 0),
        sustainableProducts: Math.max(sustainableProducts, 0),
        walmartSavings: Math.max(walmartSavings, 0),
        treesEquivalent: co2Saved / 22.0, // 1 tree absorbs ~22kg CO2/year
        milesNotDriven: co2Saved * 2.3, // ~0.4kg CO2 per mile
        ordersCount: filteredOrders.length
      };
    };

    return calculateForPeriod(oneYearAgo); // Use all-time data for profile
  }, [orders, cartItems]);

  // Calculate streak from orders
  const calculateStreak = () => {
    if (orders.length === 0) return 0;
    
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const order of sortedOrders) {
      const orderDate = new Date(order.date);
      const daysDiff = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
        currentDate = orderDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const achievementLevels = [
    { name: 'Eco Rookie', pointsRequired: 0, color: '#6B7280', icon: '🌱' },
    { name: 'Green Warrior', pointsRequired: 500, color: '#059669', icon: '🛡️' },
    { name: 'Climate Champion', pointsRequired: 1500, color: '#7C3AED', icon: '🏆' },
    { name: 'Planet Protector', pointsRequired: 3000, color: '#DC2626', icon: '🌍' },
    { name: 'Sustainability Master', pointsRequired: 5000, color: '#F59E0B', icon: '👑' }
  ];

  const ecoPointsHistory = [
    { date: '2024-06-13', action: 'Organic product purchase', points: +15, type: 'earned' },
    { date: '2024-06-12', action: 'Eco Champion discount used', points: -250, type: 'spent' },
    { date: '2024-06-12', action: 'Scan bonus - eco alternative', points: +10, type: 'earned' },
    { date: '2024-06-11', action: 'Challenge completion', points: +50, type: 'earned' },
    { date: '2024-06-10', action: 'Refurbished product purchase', points: +35, type: 'earned' },
  ];

  const currentLevelIndex = achievementLevels.findIndex(level => level.name === userProfile.level);
  const nextLevel = achievementLevels[currentLevelIndex + 1];
  const levelProgress = nextLevel ? 
    ((userEcoPoints - achievementLevels[currentLevelIndex].pointsRequired) / 
     (nextLevel.pointsRequired - achievementLevels[currentLevelIndex].pointsRequired)) * 100 : 100;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)');
          }
        }
      ]
    );
  };

  const editProfile = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
    setShowEditModal(true);
  };

  const saveProfileChange = () => {
    if (editingField) {
      updateUserProfile({ [editingField]: tempValue });
    }
    setShowEditModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const EcoPointsModal = () => (
    <Modal visible={showEcoPointsModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEcoPointsModal(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>EcoPoints History</Text>
          <View style={styles.modalBalance}>
            <Text style={styles.modalBalanceText}>{userEcoPoints}</Text>
          </View>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.historySection}>
            {ecoPointsHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyContent}>
                  <Text style={styles.historyAction}>{entry.action}</Text>
                  <Text style={styles.historyDate}>{new Date(entry.date).toLocaleDateString()}</Text>
                </View>
                <Text style={[
                  styles.historyPoints,
                  { color: entry.type === 'earned' ? '#10B981' : '#EF4444' }
                ]}>
                  {entry.type === 'earned' ? '+' : ''}{entry.points}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const EditModal = () => (
    <Modal visible={showEditModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Text style={styles.modalCancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit {editingField}</Text>
          <TouchableOpacity onPress={saveProfileChange}>
            <Text style={styles.modalSaveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <TextInput
            style={styles.modalInput}
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={`Enter your ${editingField}`}
            autoFocus
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => editProfile('name', userProfile.name)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* EcoPoints Widget */}
        <View style={styles.ecoPointsWidget}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>EcoPoints Balance</Text>
            <TouchableOpacity onPress={() => setShowEcoPointsModal(true)}>
              <Text style={styles.viewAllText}>View All ›</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.ecoPointsValue}>{userEcoPoints}</Text>
          <Text style={styles.ecoPointsLabel}>Available Points</Text>
          
          {/* Level Progress Bar */}
          <View style={styles.levelProgressContainer}>
            <View style={styles.levelInfo}>
              <Text style={styles.currentLevel}>{achievementLevels[currentLevelIndex].icon} {userProfile.level}</Text>
              {nextLevel && (
                <Text style={styles.nextLevel}>Next: {nextLevel.name}</Text>
              )}
            </View>
            {nextLevel && (
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min(levelProgress, 100)}%`,
                        backgroundColor: achievementLevels[currentLevelIndex].color 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {nextLevel.pointsRequired - userEcoPoints} points to go
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Dashboard */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Impact Dashboard</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statWidget, { backgroundColor: '#ECFDF5' }]}>
              <Text style={styles.statIcon}>🌱</Text>
              <Text style={styles.statValue}>{calculateRealImpactData.co2Saved.toFixed(2)}kg</Text>
              <Text style={styles.statLabel}>CO₂ Saved</Text>
            </View>
            <View style={[styles.statWidget, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.statIcon}>🥗</Text>
              <Text style={styles.statValue}>{calculateRealImpactData.mealsDonated}</Text>
              <Text style={styles.statLabel}>Meals Donated</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statWidget, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>${calculateRealImpactData.moneySaved.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            <View style={[styles.statWidget, { backgroundColor: '#FEE2E2' }]}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{calculateStreak()}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            {userProfile.badges.slice(0, 3).map((badge, index) => (
              <View key={index} style={styles.achievementRow}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementEmoji}>🏅</Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{badge}</Text>
                  <Text style={styles.achievementDate}>Earned recently</Text>
                </View>
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>New</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          
          {/* Profile Settings */}
          <View style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>Profile Information</Text>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => editProfile('name', userProfile.name)}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>👤</Text>
                <Text style={styles.settingText}>Full Name</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{userProfile.name}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => editProfile('email', userProfile.email)}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📧</Text>
                <Text style={styles.settingText}>Email</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{userProfile.email}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>Notifications</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <Text style={styles.settingText}>Eco Alerts</Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={'#059669'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🎯</Text>
                <Text style={styles.settingText}>Challenge Updates</Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={'#059669'}
              />
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>Account</Text>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔒</Text>
                <Text style={styles.settingText}>Privacy Settings</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>❓</Text>
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingRow, styles.signOutRow]}
              onPress={handleSignOut}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🚪</Text>
                <Text style={[styles.settingText, styles.signOutText]}>Sign Out</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <EcoPointsModal />
      <EditModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#052e16',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  editButtonText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  ecoPointsWidget: {
    backgroundColor: '#052e16',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllText: {
    color: '#BBF7D0',
    fontSize: 14,
    fontWeight: '500',
  },
  ecoPointsValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ecoPointsLabel: {
    color: '#BBF7D0',
    fontSize: 14,
    marginBottom: 20,
  },
  levelProgressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentLevel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextLevel: {
    color: '#BBF7D0',
    fontSize: 12,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#BBF7D0',
    fontSize: 12,
    textAlign: 'center',
  },
  statsContainer: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statWidget: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsContainer: {
    margin: 16,
    marginTop: 0,
  },
  achievementsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 18,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },
  settingsContainer: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
  },
  settingsGroup: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingsGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  signOutRow: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  settingText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  signOutText: {
    color: '#EF4444',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  settingArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  modalHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCloseButton: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBalance: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalBalanceText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalSaveButton: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  historyPoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});