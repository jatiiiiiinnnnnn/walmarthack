// app/(customer)/(tabs)/profile.tsx
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

export default function ProfileTab() {
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Green',
    email: 'alex.green@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Delhi, IN',
    joinDate: '2024-11-15',
    preferredStore: 'Walmart Supercenter - Downtown',
    dietaryPreferences: ['Vegetarian', 'Organic'],
    sustainabilityGoals: ['Low Carbon', 'Zero Waste'],
    notifications: {
      rescueDeals: true,
      challenges: true,
      achievements: true,
      weekly: false,
    }
  });

  const [userStats, setUserStats] = useState({
    totalPurchases: 47,
    co2Saved: 156.3,
    mealsDonated: 12,
    moneySaved: 234.50,
    points: 2847,
    level: 'Green Warrior',
    streak: 28,
    badges: ['Carbon Saver', 'Waste Reducer', 'Plant Pioneer', 'Community Helper']
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const achievementLevels = [
    { name: 'Eco Rookie', pointsRequired: 0, color: '#6B7280' },
    { name: 'Green Warrior', pointsRequired: 500, color: '#059669' },
    { name: 'Climate Champion', pointsRequired: 1500, color: '#7C3AED' },
    { name: 'Planet Protector', pointsRequired: 3000, color: '#DC2626' },
    { name: 'Sustainability Master', pointsRequired: 5000, color: '#F59E0B' }
  ];

  const currentLevelIndex = achievementLevels.findIndex(level => level.name === userStats.level);
  const nextLevel = achievementLevels[currentLevelIndex + 1];
  const levelProgress = nextLevel ? 
    ((userStats.points - achievementLevels[currentLevelIndex].pointsRequired) / 
     (nextLevel.pointsRequired - achievementLevels[currentLevelIndex].pointsRequired)) * 100 : 100;

  const editProfile = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
    setShowEditModal(true);
  };

  const saveProfileChange = () => {
    setUserProfile(prev => ({
      ...prev,
      [(editingField ?? '')]: tempValue
    }));
    setShowEditModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

interface Notifications {
    rescueDeals: boolean;
    challenges: boolean;
    achievements: boolean;
    weekly: boolean;
}

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    preferredStore: string;
    dietaryPreferences: string[];
    sustainabilityGoals: string[];
    notifications: Notifications;
}

interface UserStats {
    totalPurchases: number;
    co2Saved: number;
    mealsDonated: number;
    moneySaved: number;
    points: number;
    level: string;
    streak: number;
    badges: string[];
}

const toggleNotification = (key: keyof Notifications) => {
    setUserProfile((prev: UserProfile) => ({
        ...prev,
        notifications: {
            ...prev.notifications,
            [key]: !prev.notifications[key]
        }
    }));
};

  const shareMilestone = () => {
    Alert.alert(
      'Share Achievement',
      `Share your ${userStats.level} achievement and ${userStats.co2Saved.toFixed(1)} kg CO₂ saved!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Shared!', 'Your achievement has been shared!') }
      ]
    );
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

  interface ProfileItemProps {
    label: string;
    value: string;
    editable?: boolean;
    onPress?: () => void;
  }

  const ProfileItem: React.FC<ProfileItemProps> = ({ label, value, editable = false, onPress }) => (
    <TouchableOpacity 
      style={[styles.profileItem, !editable && styles.profileItemDisabled]}
      onPress={editable ? onPress : undefined}
      disabled={!editable}
    >
      <Text style={styles.profileItemLabel}>{label}</Text>
      <View style={styles.profileItemRight}>
        <Text style={styles.profileItemValue}>{value}</Text>
        {editable && <Text style={styles.profileItemArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  interface NotificationItemProps {
    label: string;
    value: boolean;
    onToggle: () => void;
  }

  const NotificationItem: React.FC<NotificationItemProps> = ({ label, value, onToggle }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
        thumbColor={value ? '#059669' : '#9CA3AF'}
      />
    </View>
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
            <Text style={styles.profileLevelText}>{userStats.level}</Text>
            <Text style={styles.profilePoints}>{userStats.points} points</Text>
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
              {nextLevel.pointsRequired - userStats.points} points to next level
            </Text>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <ProfileStat
              icon="🌱"
              label="CO₂ Saved"
              value={`${userStats.co2Saved} kg`}
              color="#059669"
            />
            <ProfileStat
              icon="🥗"
              label="Meals Donated"
              value={userStats.mealsDonated.toString()}
              color="#F59E0B"
            />
            <ProfileStat
              icon="💰"
              label="Money Saved"
              value={`$${userStats.moneySaved.toFixed(2)}`}
              color="#2563EB"
            />
            <ProfileStat
              icon="🔥"
              label="Day Streak"
              value={userStats.streak.toString()}
              color="#EF4444"
            />
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesGrid}>
            {userStats.badges.map((badge, index) => (
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
            <ProfileItem
              label="Full Name"
              value={userProfile.name}
              editable
              onPress={() => editProfile('name', userProfile.name)}
            />
            <ProfileItem
              label="Email"
              value={userProfile.email}
              editable
              onPress={() => editProfile('email', userProfile.email)}
            />
            <ProfileItem
              label="Phone"
              value={userProfile.phone}
              editable
              onPress={() => editProfile('phone', userProfile.phone)}
            />
            <ProfileItem
              label="Location"
              value={userProfile.location}
              editable
              onPress={() => editProfile('location', userProfile.location)}
            />
            <ProfileItem
              label="Member Since"
              value={new Date(userProfile.joinDate).toLocaleDateString()}
            />
            <ProfileItem
              label="Preferred Store"
              value={userProfile.preferredStore}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Dietary Preferences</Text>
              <Text style={styles.preferenceValue}>
                {userProfile.dietaryPreferences.join(', ')}
              </Text>
            </View>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Sustainability Goals</Text>
              <Text style={styles.preferenceValue}>
                {userProfile.sustainabilityGoals.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.notificationsCard}>
            <NotificationItem
              label="Rescue Deal Alerts"
              value={userProfile.notifications.rescueDeals}
              onToggle={() => toggleNotification('rescueDeals')}
            />
            <NotificationItem
              label="Challenge Updates"
              value={userProfile.notifications.challenges}
              onToggle={() => toggleNotification('challenges')}
            />
            <NotificationItem
              label="Achievement Notifications"
              value={userProfile.notifications.achievements}
              onToggle={() => toggleNotification('achievements')}
            />
            <NotificationItem
              label="Weekly Summary"
              value={userProfile.notifications.weekly}
              onToggle={() => toggleNotification('weekly')}
            />
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
  levelSection: {
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 0,
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
  preferencesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#6B7280',
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
    textTransform: 'capitalize',
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
});