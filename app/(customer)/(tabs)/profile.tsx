// app/(customer)/(tabs)/profile.tsx - Enhanced with EcoPoints Management
import React, { useState } from 'react';
import {
  Alert,
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

export default function EnhancedProfileTab() {
  const { 
    userProfile, 
    updateUserProfile, 
    userEcoPoints, 
    availableDiscounts,
    appliedDiscounts,
    cartItems,
    getCartTotal,
    getCartItemCount
  } = useAppData();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showEcoPointsModal, setShowEcoPointsModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const achievementLevels = [
    { name: 'Eco Rookie', pointsRequired: 0, color: '#6B7280', benefits: ['Basic eco tips', 'Standard EcoPoints earning'] },
    { name: 'Green Warrior', pointsRequired: 500, color: '#059669', benefits: ['5% bonus EcoPoints', 'Early access to deals', 'Eco badge'] },
    { name: 'Climate Champion', pointsRequired: 1500, color: '#7C3AED', benefits: ['10% bonus EcoPoints', 'Exclusive challenges', 'Priority support'] },
    { name: 'Planet Protector', pointsRequired: 3000, color: '#DC2626', benefits: ['15% bonus EcoPoints', 'VIP rewards', 'Impact multiplier'] },
    { name: 'Sustainability Master', pointsRequired: 5000, color: '#F59E0B', benefits: ['20% bonus EcoPoints', 'Master rewards', 'Community leader status'] }
  ];

  const ecoPointsHistory = [
    { date: '2024-06-13', action: 'Organic product purchase', points: +15, type: 'earned' },
    { date: '2024-06-12', action: 'Eco Champion discount used', points: -250, type: 'spent' },
    { date: '2024-06-12', action: 'Scan bonus - eco alternative', points: +10, type: 'earned' },
    { date: '2024-06-11', action: 'Challenge completion', points: +50, type: 'earned' },
    { date: '2024-06-10', action: 'Refurbished product purchase', points: +35, type: 'earned' },
    { date: '2024-06-09', action: 'Eco Starter discount used', points: -100, type: 'spent' },
    { date: '2024-06-09', action: 'Local product purchase', points: +20, type: 'earned' },
    { date: '2024-06-08', action: 'Bamboo product purchase', points: +25, type: 'earned' }
  ];

  const rewardsProgress = [
    { 
      name: 'Eco Enthusiast', 
      description: 'Purchase 10 organic products', 
      progress: 7, 
      target: 10, 
      reward: '100 EcoPoints + Organic Badge',
      icon: '🥬'
    },
    { 
      name: 'Waste Warrior', 
      description: 'Rescue 5 food items from waste', 
      progress: 3, 
      target: 5, 
      reward: '150 EcoPoints + Rescue Badge',
      icon: '🛟'
    },
    { 
      name: 'Carbon Crusher', 
      description: 'Save 50kg CO₂ through choices', 
      progress: 32.8, 
      target: 50, 
      reward: '200 EcoPoints + Climate Badge',
      icon: '🌍'
    },
    { 
      name: 'Scan Master', 
      description: 'Scan 25 products for alternatives', 
      progress: 18, 
      target: 25, 
      reward: '125 EcoPoints + Scanner Badge',
      icon: '📱'
    }
  ];

  const currentLevelIndex = achievementLevels.findIndex(level => level.name === userProfile.level);
  const nextLevel = achievementLevels[currentLevelIndex + 1];
  const levelProgress = nextLevel ? 
  ((userEcoPoints - achievementLevels[currentLevelIndex].pointsRequired) / 
   (nextLevel.pointsRequired - achievementLevels[currentLevelIndex].pointsRequired)) * 100 : 100;
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

  const toggleNotification = (key: string) => {
    // Implementation would depend on notification system
    Alert.alert('Settings Updated', `${key} notification preference updated`);
  };

  const shareMilestone = () => {
    Alert.alert(
      'Share Achievement',
      `Share your ${userProfile.level} achievement and ${userProfile.co2Saved.toFixed(1)} kg CO₂ saved!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Shared!', 'Your achievement has been shared!') }
      ]
    );
  };

  const redeemReward = (reward: any) => {
    if (reward.progress >= reward.target) {
      Alert.alert(
        'Reward Ready!',
        `Congratulations! You've completed the ${reward.name} challenge. Claim your reward: ${reward.reward}`,
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Claim Now', onPress: () => {
            // Add points and badge to user profile
            Alert.alert('Reward Claimed!', `You've earned your ${reward.reward}!`);
          }}
        ]
      );
    } else {
      Alert.alert(
        'Keep Going!',
        `You're ${reward.target - reward.progress} away from completing ${reward.name}. Keep up the great work!`
      );
    }
  };

  interface ProfileStatProps {
    icon: string;
    label: string;
    value: string;
    color: string;
  }

  const ProfileStat: React.FC<ProfileStatProps> = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statIcon, { color }]}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const EcoPointsModal = () => (
    <Modal visible={showEcoPointsModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEcoPointsModal(false)}>
            <Text style={styles.modalCancelButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>EcoPoints History</Text>
          <Text style={styles.modalBalance}>💰 {userEcoPoints}</Text>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.pointsSummary}>
            <Text style={styles.pointsSummaryTitle}>This Month</Text>
            <View style={styles.pointsSummaryStats}>
              <View style={styles.pointsStat}>
                <Text style={styles.pointsStatValue}>+{ecoPointsHistory.filter(h => h.type === 'earned').reduce((sum, h) => sum + h.points, 0)}</Text>
                <Text style={styles.pointsStatLabel}>Earned</Text>
              </View>
              <View style={styles.pointsStat}>
                <Text style={styles.pointsStatValue}>{ecoPointsHistory.filter(h => h.type === 'spent').reduce((sum, h) => sum + Math.abs(h.points), 0)}</Text>
                <Text style={styles.pointsStatLabel}>Spent</Text>
              </View>
            </View>
          </View>

          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>Recent Activity</Text>
            {ecoPointsHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemContent}>
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

          <View style={styles.pointsInfoSection}>
            <Text style={styles.pointsInfoTitle}>How to Earn More EcoPoints</Text>
            <View style={styles.pointsInfoList}>
              <View style={styles.pointsInfoItem}>
                <Text style={styles.pointsInfoIcon}>🥬</Text>
                <Text style={styles.pointsInfoText}>Choose organic products: 8-25 points</Text>
              </View>
              <View style={styles.pointsInfoItem}>
                <Text style={styles.pointsInfoIcon}>🏘️</Text>
                <Text style={styles.pointsInfoText}>Buy local products: 15-30 points</Text>
              </View>
              <View style={styles.pointsInfoItem}>
                <Text style={styles.pointsInfoIcon}>📱</Text>
                <Text style={styles.pointsInfoText}>Scan & choose eco alternatives: 10-15 bonus</Text>
              </View>
              <View style={styles.pointsInfoItem}>
                <Text style={styles.pointsInfoIcon}>🎯</Text>
                <Text style={styles.pointsInfoText}>Complete challenges: 50-300 points</Text>
              </View>
              <View style={styles.pointsInfoItem}>
                <Text style={styles.pointsInfoIcon}>♻️</Text>
                <Text style={styles.pointsInfoText}>Refurbished items: 30-50 points</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const RewardsModal = () => (
    <Modal visible={showRewardsModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowRewardsModal(false)}>
            <Text style={styles.modalCancelButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Rewards Progress</Text>
          <View />
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={styles.rewardsTitle}>Available Rewards</Text>
          {rewardsProgress.map((reward, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.rewardCard}
              onPress={() => redeemReward(reward)}
            >
              <View style={styles.rewardHeader}>
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                </View>
                <View style={styles.rewardProgress}>
                  <Text style={styles.rewardProgressText}>
                    {reward.progress}/{reward.target}
                  </Text>
                </View>
              </View>
              
              <View style={styles.rewardProgressBar}>
                <View 
                  style={[
                    styles.rewardProgressFill, 
                    { width: `${Math.min((reward.progress / reward.target) * 100, 100)}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.rewardReward}>🎁 {reward.reward}</Text>
              
              {reward.progress >= reward.target && (
                <View style={styles.rewardReadyBadge}>
                  <Text style={styles.rewardReadyText}>Ready to Claim!</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          <View style={styles.profileLevel}>
            <Text style={styles.profileLevelText}>{userProfile.level}</Text>
            <Text style={styles.profilePoints}>{userEcoPoints} EcoPoints</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsSection}>
          <View style={styles.quickStatsGrid}>
            <TouchableOpacity style={styles.quickStatCard} onPress={() => setShowEcoPointsModal(true)}>
              <Text style={styles.quickStatIcon}>💰</Text>
              <Text style={styles.quickStatValue}>{userEcoPoints}</Text>
              <Text style={styles.quickStatLabel}>EcoPoints</Text>
              <Text style={styles.quickStatAction}>View History ›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickStatCard} onPress={() => setShowRewardsModal(true)}>
              <Text style={styles.quickStatIcon}>🎁</Text>
              <Text style={styles.quickStatValue}>{rewardsProgress.filter(r => r.progress >= r.target).length}</Text>
              <Text style={styles.quickStatLabel}>Rewards Ready</Text>
              <Text style={styles.quickStatAction}>Claim Now ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelSection}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level Progress</Text>
            {nextLevel && (
              <Text style={styles.levelNext}>Next: {nextLevel.name}</Text>
            )}
          </View>
          <View style={styles.levelProgressTrack}>
            <View 
              style={[
                styles.levelProgressFill, 
                { 
                  width: `${Math.min(levelProgress, 100)}%`,
                  backgroundColor: achievementLevels[currentLevelIndex].color 
                }
              ]} 
            />
          </View>
          {nextLevel && (
            <Text style={styles.levelProgressText}>
              {nextLevel.pointsRequired - userEcoPoints} EcoPoints to next level
            </Text>
          )}
          
          {/* Level Benefits */}
          <View style={styles.levelBenefits}>
            <Text style={styles.levelBenefitsTitle}>Current Level Benefits:</Text>
            {achievementLevels[currentLevelIndex].benefits.map((benefit, index) => (
              <View key={index} style={styles.levelBenefit}>
                <Text style={styles.levelBenefitBullet}>✓</Text>
                <Text style={styles.levelBenefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <ProfileStat
              icon="🌱"
              label="CO₂ Saved"
              value={`${userProfile.co2Saved.toFixed(1)} kg`}
              color="#059669"
            />
            <ProfileStat
              icon="🥗"
              label="Meals Donated"
              value={userProfile.mealsDonated.toString()}
              color="#F59E0B"
            />
            <ProfileStat
              icon="💰"
              label="Money Saved"
              value={`₹${(userProfile.moneySaved * 75).toFixed(0)}`}
              color="#2563EB"
            />
            <ProfileStat
              icon="🔥"
              label="Day Streak"
              value={userProfile.streak.toString()}
              color="#EF4444"
            />
          </View>
        </View>

        {/* Cart Summary */}
        {getCartItemCount() > 0 && (
          <View style={styles.cartSummarySection}>
            <Text style={styles.sectionTitle}>Current Cart</Text>
            <View style={styles.cartSummaryCard}>
              <View style={styles.cartSummaryHeader}>
                <Text style={styles.cartSummaryIcon}>🛒</Text>
                <View style={styles.cartSummaryInfo}>
                  <Text style={styles.cartSummaryTitle}>
                    {getCartItemCount()} items • ₹{(getCartTotal() * 75).toFixed(0)}
                  </Text>
                  <Text style={styles.cartSummarySubtitle}>
                    EcoPoints to earn: {cartItems.reduce((sum, item) => sum + (item.ecoPoints * item.quantity), 0)}
                  </Text>
                </View>
                <Text style={styles.cartSummaryArrow}>›</Text>
              </View>
              <TouchableOpacity style={styles.viewCartButton}>
                <Text style={styles.viewCartButtonText}>View Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Badges */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesGrid}>
            {userProfile.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeIcon}>🏅</Text>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={shareMilestone}>
            <Text style={styles.shareButtonText}>Share Achievements</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.profileInfoCard}>
            <TouchableOpacity 
              style={styles.profileItem}
              onPress={() => editProfile('name', userProfile.name)}
            >
              <Text style={styles.profileItemLabel}>Full Name</Text>
              <View style={styles.profileItemRight}>
                <Text style={styles.profileItemValue}>{userProfile.name}</Text>
                <Text style={styles.profileItemArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileItem}
              onPress={() => editProfile('email', userProfile.email)}
            >
              <Text style={styles.profileItemLabel}>Email</Text>
              <View style={styles.profileItemRight}>
                <Text style={styles.profileItemValue}>{userProfile.email}</Text>
                <Text style={styles.profileItemArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileItem}
              onPress={() => editProfile('phone', userProfile.phone)}
            >
              <Text style={styles.profileItemLabel}>Phone</Text>
              <View style={styles.profileItemRight}>
                <Text style={styles.profileItemValue}>{userProfile.phone}</Text>
                <Text style={styles.profileItemArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileItem}
              onPress={() => editProfile('location', userProfile.location)}
            >
              <Text style={styles.profileItemLabel}>Location</Text>
              <View style={styles.profileItemRight}>
                <Text style={styles.profileItemValue}>{userProfile.location}</Text>
                <Text style={styles.profileItemArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.profileItem, styles.profileItemDisabled]}>
              <Text style={styles.profileItemLabel}>Member Since</Text>
              <View style={styles.profileItemRight}>
                <Text style={styles.profileItemValue}>November 2024</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.notificationsCard}>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Rescue Deal Alerts</Text>
              <Switch
                value={true}
                onValueChange={() => toggleNotification('rescueDeals')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={'#059669'}
              />
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Challenge Updates</Text>
              <Switch
                value={true}
                onValueChange={() => toggleNotification('challenges')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={'#059669'}
              />
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Achievement Notifications</Text>
              <Switch
                value={true}
                onValueChange={() => toggleNotification('achievements')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={'#059669'}
              />
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Weekly Summary</Text>
              <Switch
                value={false}
                onValueChange={() => toggleNotification('weekly')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={'#059669'}
              />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.actionsCard}>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionText}>Privacy Settings</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionText}>Help & Support</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionText}>Terms & Conditions</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionItem, styles.actionItemDanger]}>
              <Text style={[styles.actionText, styles.actionTextDanger]}>Sign Out</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <EcoPointsModal />
      <RewardsModal />
      <EditModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#059669',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  profileLevel: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  profileLevelText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  profilePoints: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickStatsSection: {
    padding: 16,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickStatIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  quickStatAction: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
  levelSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  levelNext: {
    fontSize: 14,
    color: '#6B7280',
  },
  levelProgressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  levelProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  levelBenefits: {
    marginTop: 8,
  },
  levelBenefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  levelBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelBenefitBullet: {
    fontSize: 12,
    color: '#10B981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  levelBenefitText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsSection: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cartSummarySection: {
    margin: 16,
    marginBottom: 0,
  },
  cartSummaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cartSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartSummaryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cartSummaryInfo: {
    flex: 1,
  },
  cartSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cartSummarySubtitle: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  cartSummaryArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  viewCartButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewCartButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  badgesSection: {
    margin: 16,
    marginBottom: 0,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  profileInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileItemDisabled: {
    opacity: 0.6,
  },
  profileItemLabel: {
    fontSize: 16,
    color: '#374151',
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemValue: {
    fontSize: 16,
    color: '#1F2937',
    marginRight: 8,
  },
  profileItemArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  notificationsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationLabel: {
    fontSize: 16,
    color: '#374151',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionItemDanger: {
    borderBottomWidth: 0,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
  },
  actionTextDanger: {
    color: '#EF4444',
  },
  actionArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBalance: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '600',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  pointsSummaryStats: {
    flexDirection: 'row',
    gap: 32,
  },
  pointsStat: {
    alignItems: 'center',
  },
  pointsStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  pointsStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyItemContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: '600',
  },
  pointsInfoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  pointsInfoList: {
    gap: 12,
  },
  pointsInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsInfoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  pointsInfoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  rewardProgress: {
    alignItems: 'center',
  },
  rewardProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  rewardProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  rewardProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  rewardReward: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  rewardReadyBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  rewardReadyText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
});