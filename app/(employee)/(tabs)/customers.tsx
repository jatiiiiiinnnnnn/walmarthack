// app/(employee)/(tabs)/customers.tsx - Sustainability Engagement Hub
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const sustainabilityCustomers = [
  {
    id: 1,
    name: 'Alex Green',
    email: 'alex.green@email.com',
    joinDate: '2024-11-15',
    sustainabilityLevel: 'Eco Champion',
    impactScore: 847,
    co2Saved: 156.3,
    wasteReduced: 89.4,
    rescueDealsCount: 47,
    donationsCount: 12,
    challengesCompleted: 8,
    currentStreak: 12,
    lastActive: '2 hours ago',
    ecoGoals: ['Zero Waste by 2025', 'Plant-based meals', 'Local shopping'],
    sustainabilityTrend: 'increasing',
    engagementLevel: 'high',
    preferredCategories: ['Produce', 'Dairy'],
    avatar: 'AG',
    monthlyTarget: 200,
    achievements: ['First Rescue Deal', 'Week Warrior', 'Community Helper']
  },
  {
    id: 2,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    joinDate: '2024-10-22',
    sustainabilityLevel: 'Planet Protector',
    impactScore: 1456,
    co2Saved: 234.7,
    wasteReduced: 145.8,
    rescueDealsCount: 68,
    donationsCount: 23,
    challengesCompleted: 15,
    currentStreak: 25,
    lastActive: '1 day ago',
    ecoGoals: ['Carbon Neutral', 'Support Local', 'Zero Food Waste'],
    sustainabilityTrend: 'stable',
    engagementLevel: 'very_high',
    preferredCategories: ['Bakery', 'Produce'],
    avatar: 'MS',
    monthlyTarget: 300,
    achievements: ['Eco Master', 'Donation Hero', 'Challenge Champion', 'Streak Legend']
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'david.chen@email.com',
    joinDate: '2024-12-01',
    sustainabilityLevel: 'Green Rookie',
    impactScore: 234,
    co2Saved: 78.9,
    wasteReduced: 34.2,
    rescueDealsCount: 23,
    donationsCount: 3,
    challengesCompleted: 2,
    currentStreak: 3,
    lastActive: '3 hours ago',
    ecoGoals: ['Learn about sustainability', 'Reduce waste'],
    sustainabilityTrend: 'increasing',
    engagementLevel: 'medium',
    preferredCategories: ['Meat', 'Dairy'],
    avatar: 'DC',
    monthlyTarget: 100,
    achievements: ['First Steps']
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    joinDate: '2024-09-15',
    sustainabilityLevel: 'Eco Expert',
    impactScore: 2234,
    co2Saved: 345.6,
    wasteReduced: 298.7,
    rescueDealsCount: 89,
    donationsCount: 34,
    challengesCompleted: 22,
    currentStreak: 8,
    lastActive: '5 days ago',
    ecoGoals: ['Inspire others', 'Community leadership'],
    sustainabilityTrend: 'decreasing',
    engagementLevel: 'low',
    preferredCategories: ['Produce', 'Bakery'],
    avatar: 'EW',
    monthlyTarget: 400,
    achievements: ['Eco Legend', 'Community Leader', 'Impact Maker']
  },
  {
    id: 5,
    name: 'James Rodriguez',
    email: 'james.r@email.com',
    joinDate: '2024-11-30',
    sustainabilityLevel: 'Green Warrior',
    impactScore: 523,
    co2Saved: 123.4,
    wasteReduced: 67.8,
    rescueDealsCount: 34,
    donationsCount: 8,
    challengesCompleted: 5,
    currentStreak: 7,
    lastActive: '1 hour ago',
    ecoGoals: ['Sustainable living', 'Community support'],
    sustainabilityTrend: 'increasing',
    engagementLevel: 'high',
    preferredCategories: ['Meat', 'Produce'],
    avatar: 'JR',
    monthlyTarget: 150,
    achievements: ['Rising Star', 'Deal Hunter']
  }
];

export default function SustainabilityEngagementHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState('impactScore');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof sustainabilityCustomers[number] | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const filteredCustomers = sustainabilityCustomers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = filterLevel === 'all' || customer.sustainabilityLevel === filterLevel;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'impactScore':
          return b.impactScore - a.impactScore;
        case 'co2Saved':
          return b.co2Saved - a.co2Saved;
        case 'engagementLevel':
          const engagementOrder = { 'very_high': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return engagementOrder[b.engagementLevel as keyof typeof engagementOrder] - 
                 engagementOrder[a.engagementLevel as keyof typeof engagementOrder];
        case 'rescueDeals':
          return b.rescueDealsCount - a.rescueDealsCount;
        default:
          return 0;
      }
    });

  // Calculate community impact stats
  const totalImpactScore = sustainabilityCustomers.reduce((sum, c) => sum + c.impactScore, 0);
  const totalCO2Saved = sustainabilityCustomers.reduce((sum, c) => sum + c.co2Saved, 0);
  const totalWasteReduced = sustainabilityCustomers.reduce((sum, c) => sum + c.wasteReduced, 0);
  const activeChallenges = sustainabilityCustomers.filter(c => c.currentStreak > 0).length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Green Rookie': return '#6B7280';
      case 'Green Warrior': return '#059669';
      case 'Eco Champion': return '#7C3AED';
      case 'Planet Protector': return '#DC2626';
      case 'Eco Expert': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'very_high': return '#10B981';
      case 'high': return '#059669';
      case 'medium': return '#F59E0B';
      case 'low': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'stable': return '➡️';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const viewCustomerDetails = (customer: typeof sustainabilityCustomers[number]) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const sendSustainabilityAction = (customer: typeof sustainabilityCustomers[number], action: string) => {
    let message = '';
    let actionTitle = '';
    
    switch (action) {
      case 'eco_tip':
        actionTitle = 'Eco-Tip Sent';
        message = `Personalized sustainability tip sent to ${customer.name} based on their ${customer.preferredCategories.join(' and ')} preferences!`;
        break;
      case 'challenge':
        actionTitle = 'Challenge Created';
        message = `New sustainability challenge sent to ${customer.name}! This could help increase their impact score.`;
        break;
      case 'reward':
        actionTitle = 'Eco-Reward Sent';
        message = `Sustainability reward sent to ${customer.name} for their ${customer.impactScore} impact points!`;
        break;
      case 'donation_opportunity':
        actionTitle = 'Donation Opportunity';
        message = `Local food bank opportunity shared with ${customer.name}. Great way to boost their community impact!`;
        break;
      case 'goal_check':
        actionTitle = 'Goal Check-in';
        message = `Goal progress check-in sent to ${customer.name}. This helps maintain their ${customer.currentStreak}-day streak!`;
        break;
      default:
        return;
    }
    
    Alert.alert(actionTitle, message);
  };

  const showActionModal = (customer: typeof sustainabilityCustomers[number]) => {
    setSelectedCustomer(customer);
    setActionModalVisible(true);
  };

  const SustainabilityCard = ({ customer }: { customer: typeof sustainabilityCustomers[number] }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => viewCustomerDetails(customer)}
    >
      <View style={styles.customerHeader}>
        <View style={[styles.customerAvatar, { backgroundColor: getLevelColor(customer.sustainabilityLevel) }]}>
          <Text style={styles.customerAvatarText}>{customer.avatar}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerEmail}>{customer.email}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(customer.sustainabilityLevel) + '20' }]}>
            <Text style={[styles.levelText, { color: getLevelColor(customer.sustainabilityLevel) }]}>
              {customer.sustainabilityLevel}
            </Text>
          </View>
        </View>
        <View style={styles.customerStatus}>
          <Text style={styles.trendIcon}>{getTrendIcon(customer.sustainabilityTrend)}</Text>
          <View style={[styles.engagementDot, 
            { backgroundColor: getEngagementColor(customer.engagementLevel) }]} 
          />
        </View>
      </View>

      <View style={styles.impactStats}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>{customer.impactScore}</Text>
          <Text style={styles.statLabel}>Impact Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🌱</Text>
          <Text style={styles.statValue}>{customer.co2Saved.toFixed(1)}kg</Text>
          <Text style={styles.statLabel}>CO₂ Saved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>♻️</Text>
          <Text style={styles.statValue}>{customer.wasteReduced.toFixed(1)}kg</Text>
          <Text style={styles.statLabel}>Waste Reduced</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{customer.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.engagementInfo}>
        <View style={styles.engagementLeft}>
          <Text style={styles.rescueDealsText}>
            🏪 {customer.rescueDealsCount} rescue deals • 🤝 {customer.donationsCount} donations
          </Text>
          <Text style={styles.goalProgressTextInline}>
            Goal: {Math.round((customer.impactScore / customer.monthlyTarget) * 100)}% of {customer.monthlyTarget} monthly target
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => showActionModal(customer)}
        >
          <Text style={styles.actionButtonText}>Engage</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const SustainabilityActionModal = () => (
    <Modal visible={actionModalVisible} animationType="slide" transparent={true}>
      <View style={styles.actionModalOverlay}>
        <View style={styles.actionModalContent}>
          <Text style={styles.actionModalTitle}>🌱 Sustainability Engagement</Text>
          <Text style={styles.actionModalSubtitle}>
            Choose how to engage {selectedCustomer?.name} in sustainability
          </Text>
          
          <View style={styles.actionOptions}>
            <TouchableOpacity 
              style={styles.actionOption}
              onPress={() => {
                if (selectedCustomer) sendSustainabilityAction(selectedCustomer, 'eco_tip');
                setActionModalVisible(false);
              }}
            >
              <Text style={styles.actionOptionIcon}>💡</Text>
              <View style={styles.actionOptionContent}>
                <Text style={styles.actionOptionTitle}>Send Eco-Tip</Text>
                <Text style={styles.actionOptionDescription}>Personalized sustainability advice</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionOption}
              onPress={() => {
                if (selectedCustomer) sendSustainabilityAction(selectedCustomer, 'challenge');
                setActionModalVisible(false);
              }}
            >
              <Text style={styles.actionOptionIcon}>🎯</Text>
              <View style={styles.actionOptionContent}>
                <Text style={styles.actionOptionTitle}>Create Challenge</Text>
                <Text style={styles.actionOptionDescription}>Custom sustainability challenge</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionOption}
              onPress={() => {
                if (selectedCustomer) sendSustainabilityAction(selectedCustomer, 'reward');
                setActionModalVisible(false);
              }}
            >
              <Text style={styles.actionOptionIcon}>🏆</Text>
              <View style={styles.actionOptionContent}>
                <Text style={styles.actionOptionTitle}>Send Eco-Reward</Text>
                <Text style={styles.actionOptionDescription}>Recognize their impact</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionOption}
              onPress={() => {
                if (selectedCustomer) sendSustainabilityAction(selectedCustomer, 'donation_opportunity');
                setActionModalVisible(false);
              }}
            >
              <Text style={styles.actionOptionIcon}>🤝</Text>
              <View style={styles.actionOptionContent}>
                <Text style={styles.actionOptionTitle}>Donation Opportunity</Text>
                <Text style={styles.actionOptionDescription}>Connect with local food banks</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionOption}
              onPress={() => {
                if (selectedCustomer) sendSustainabilityAction(selectedCustomer, 'goal_check');
                setActionModalVisible(false);
              }}
            >
              <Text style={styles.actionOptionIcon}>📊</Text>
              <View style={styles.actionOptionContent}>
                <Text style={styles.actionOptionTitle}>Goal Check-in</Text>
                <Text style={styles.actionOptionDescription}>Review progress and goals</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.actionModalCancel}
            onPress={() => setActionModalVisible(false)}
          >
            <Text style={styles.actionModalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const CustomerDetailsModal = () => (
    <Modal visible={showCustomerModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Sustainability Profile</Text>
          <TouchableOpacity
            onPress={() => {
              setShowCustomerModal(false);
              if (selectedCustomer) showActionModal(selectedCustomer);
            }}
          >
            <Text style={styles.modalActionButton}>Engage</Text>
          </TouchableOpacity>
        </View>

        {selectedCustomer && (
          <ScrollView style={styles.modalContent}>
            {/* Customer Header */}
            <View style={styles.modalCustomerHeader}>
              <View style={[styles.modalAvatar, { backgroundColor: getLevelColor(selectedCustomer.sustainabilityLevel) }]}>
                <Text style={styles.modalAvatarText}>{selectedCustomer.avatar}</Text>
              </View>
              <Text style={styles.modalCustomerName}>{selectedCustomer.name}</Text>
              <Text style={styles.modalCustomerEmail}>{selectedCustomer.email}</Text>
              <View style={[styles.modalLevelBadge, { backgroundColor: getLevelColor(selectedCustomer.sustainabilityLevel) }]}>
                <Text style={styles.modalLevelText}>{selectedCustomer.sustainabilityLevel}</Text>
              </View>
            </View>

            {/* Impact Overview */}
            <View style={styles.modalStatsSection}>
              <Text style={styles.modalSectionTitle}>🌍 Environmental Impact</Text>
              <View style={styles.modalStatsGrid}>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>⚡</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.impactScore}</Text>
                  <Text style={styles.modalStatLabel}>Impact Score</Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>🌱</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.co2Saved.toFixed(1)} kg</Text>
                  <Text style={styles.modalStatLabel}>CO₂ Saved</Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>♻️</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.wasteReduced.toFixed(1)} kg</Text>
                  <Text style={styles.modalStatLabel}>Waste Reduced</Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>🏪</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.rescueDealsCount}</Text>
                  <Text style={styles.modalStatLabel}>Rescue Deals</Text>
                </View>
              </View>
            </View>

            {/* Sustainability Goals */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🎯 Sustainability Goals</Text>
              <View style={styles.goalsContainer}>
                {selectedCustomer.ecoGoals.map((goal, index) => (
                  <View key={index} style={styles.goalTag}>
                    <Text style={styles.goalText}>🌿 {goal}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.goalProgress}>
                <Text style={styles.goalProgressLabel}>Monthly Target Progress</Text>
                <View style={styles.goalProgressBar}>
                  <View style={[styles.goalProgressFill, { 
                    width: `${Math.min((selectedCustomer.impactScore / selectedCustomer.monthlyTarget) * 100, 100)}%`
                  }]} />
                </View>
                <Text style={styles.goalProgressText}>
                  {selectedCustomer.impactScore} / {selectedCustomer.monthlyTarget} points 
                  ({Math.round((selectedCustomer.impactScore / selectedCustomer.monthlyTarget) * 100)}%)
                </Text>
              </View>
            </View>

            {/* Engagement Analytics */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>📊 Engagement Analytics</Text>
              <View style={styles.modalInfoCard}>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Current Streak</Text>
                  <Text style={styles.modalInfoValue}>🔥 {selectedCustomer.currentStreak} days</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Challenges Completed</Text>
                  <Text style={styles.modalInfoValue}>🎯 {selectedCustomer.challengesCompleted}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Community Donations</Text>
                  <Text style={styles.modalInfoValue}>🤝 {selectedCustomer.donationsCount}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Engagement Level</Text>
                  <View style={styles.modalEngagementContainer}>
                    <View style={[styles.modalEngagementDot, 
                      { backgroundColor: getEngagementColor(selectedCustomer.engagementLevel) }]} 
                    />
                    <Text style={[styles.modalInfoValue, { textTransform: 'capitalize' }]}>
                      {selectedCustomer.engagementLevel.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🏆 Achievements</Text>
              <View style={styles.achievementsContainer}>
                {selectedCustomer.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementBadge}>
                    <Text style={styles.achievementText}>🏅 {achievement}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Sustainability Insights */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>💡 Sustainability Insights</Text>
              <View style={styles.insightsCard}>
                <Text style={styles.insightText}>
                  {selectedCustomer.engagementLevel === 'low' && selectedCustomer.sustainabilityTrend === 'decreasing'
                    ? `${selectedCustomer.name} shows decreased engagement. Consider sending personalized eco-tips or a gentle challenge to re-engage them.`
                    : selectedCustomer.engagementLevel === 'very_high'
                    ? `${selectedCustomer.name} is highly engaged! They could be a great community leader. Consider featuring their achievements or inviting them to mentor others.`
                    : selectedCustomer.sustainabilityTrend === 'increasing'
                    ? `${selectedCustomer.name} is on an upward sustainability journey! Send encouragement and new challenges to maintain momentum.`
                    : `${selectedCustomer.name} maintains steady sustainability habits. Regular check-ins and goal adjustments could help boost their impact.`
                  }
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalActionButton2}
                onPress={() => {
                  setShowCustomerModal(false);
                  showActionModal(selectedCustomer);
                }}
              >
                <Text style={styles.modalActionButtonText}>🌱 Send Sustainability Action</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalActionButton2, styles.modalSecondaryButton]}
                onPress={() => {
                  Alert.alert('Coming Soon', 'Detailed impact history will be available soon!');
                }}
              >
                <Text style={[styles.modalActionButtonText, styles.modalSecondaryButtonText]}>
                  📊 View Impact History
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sustainability Engagement</Text>
        <Text style={styles.headerSubtitle}>Foster eco-friendly behaviors and track community impact</Text>
      </View>

      {/* Community Impact Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>⚡</Text>
          <Text style={styles.summaryValue}>{totalImpactScore.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Community Impact</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>🌱</Text>
          <Text style={styles.summaryValue}>{totalCO2Saved.toFixed(1)}kg</Text>
          <Text style={styles.summaryLabel}>CO₂ Saved</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>♻️</Text>
          <Text style={styles.summaryValue}>{totalWasteReduced.toFixed(1)}kg</Text>
          <Text style={styles.summaryLabel}>Waste Reduced</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>🔥</Text>
          <Text style={styles.summaryValue}>{activeChallenges}</Text>
          <Text style={styles.summaryLabel}>Active Streaks</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or sustainability level..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Level:</Text>
              {['all', 'Green Rookie', 'Green Warrior', 'Eco Champion', 'Planet Protector', 'Eco Expert'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[styles.filterButton, filterLevel === level && styles.filterButtonActive]}
                  onPress={() => setFilterLevel(level)}
                >
                  <Text style={[styles.filterButtonText, filterLevel === level && styles.filterButtonTextActive]}>
                    {level === 'all' ? 'All' : level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort:</Text>
            {[
              { key: 'impactScore', label: 'Impact' },
              { key: 'co2Saved', label: 'CO₂' },
              { key: 'engagementLevel', label: 'Engagement' },
              { key: 'rescueDeals', label: 'Deals' }
            ].map(sort => (
              <TouchableOpacity
                key={sort.key}
                style={[styles.filterButton, sortBy === sort.key && styles.filterButtonActive]}
                onPress={() => setSortBy(sort.key)}
              >
                <Text style={[styles.filterButtonText, sortBy === sort.key && styles.filterButtonTextActive]}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Customer List */}
      <ScrollView style={styles.customersList}>
        <View style={styles.customersContainer}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <SustainabilityCard key={customer.id} customer={customer} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🌱</Text>
              <Text style={styles.emptyStateTitle}>No customers found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search criteria' : 'No customers match the selected filters'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <SustainabilityActionModal />
      <CustomerDetailsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#047857',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  summarySection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    gap: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#047857',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  customersList: {
    flex: 1,
  },
  customersContainer: {
    padding: 16,
    gap: 16,
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  customerAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerStatus: {
    alignItems: 'center',
    gap: 6,
  },
  trendIcon: {
    fontSize: 18,
  },
  engagementDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  engagementInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementLeft: {
    flex: 1,
  },
  rescueDealsText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  goalProgressTextInline: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  actionModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionOptions: {
    gap: 12,
    marginBottom: 20,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionOptionContent: {
    flex: 1,
  },
  actionOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionModalCancel: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionModalCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal styles
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
  modalBackButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalActionButton: {
    fontSize: 16,
    color: '#047857',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalCustomerHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  modalCustomerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalCustomerEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  modalLevelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalLevelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalStatsSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  modalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modalStatCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  modalStatIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalSection: {
    marginBottom: 24,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  goalTag: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  goalText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
  },
  goalProgress: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  goalProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  modalInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalEngagementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalEngagementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
  insightsCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
  },
  insightText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    fontWeight: '500',
  },
  modalActions: {
    gap: 12,
    marginTop: 24,
  },
  modalActionButton2: {
    backgroundColor: '#047857',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalSecondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSecondaryButtonText: {
    color: '#374151',
  },
});