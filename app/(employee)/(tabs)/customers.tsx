// app/(employee)/(tabs)/customers.tsx
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

const customerData = [
  {
    id: 1,
    name: 'Alex Green',
    email: 'alex.green@email.com',
    joinDate: '2024-11-15',
    level: 'Green Warrior',
    points: 2847,
    co2Saved: 156.3,
    purchases: 47,
    lastActive: '2 hours ago',
    preferences: ['Vegetarian', 'Organic'],
    status: 'active',
    avatar: 'AG'
  },
  {
    id: 2,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    joinDate: '2024-10-22',
    level: 'Climate Champion',
    points: 3456,
    co2Saved: 234.7,
    purchases: 68,
    lastActive: '1 day ago',
    preferences: ['Vegan', 'Zero Waste'],
    status: 'active',
    avatar: 'MS'
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'david.chen@email.com',
    joinDate: '2024-12-01',
    level: 'Eco Rookie',
    points: 1234,
    co2Saved: 78.9,
    purchases: 23,
    lastActive: '3 hours ago',
    preferences: ['Local', 'Organic'],
    status: 'active',
    avatar: 'DC'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    joinDate: '2024-09-15',
    level: 'Planet Protector',
    points: 4567,
    co2Saved: 345.6,
    purchases: 89,
    lastActive: '5 days ago',
    preferences: ['Vegetarian', 'Zero Waste'],
    status: 'inactive',
    avatar: 'EW'
  },
  {
    id: 5,
    name: 'James Rodriguez',
    email: 'james.r@email.com',
    joinDate: '2024-11-30',
    level: 'Green Warrior',
    points: 2123,
    co2Saved: 123.4,
    purchases: 34,
    lastActive: '1 hour ago',
    preferences: ['Local', 'Low Carbon'],
    status: 'active',
    avatar: 'JR'
  }
];

export default function CustomersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'points', 'co2Saved', 'joinDate'
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customerData[number] | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const filteredCustomers = customerData
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'points':
          return b.points - a.points;
        case 'co2Saved':
          return b.co2Saved - a.co2Saved;
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default:
          return 0;
      }
    });

  const totalCustomers = customerData.length;
  const activeCustomers = customerData.filter(c => c.status === 'active').length;
  const totalPoints = customerData.reduce((sum, c) => sum + c.points, 0);
  const totalCO2Saved = customerData.reduce((sum, c) => sum + c.co2Saved, 0);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Eco Rookie': return '#6B7280';
      case 'Green Warrior': return '#059669';
      case 'Climate Champion': return '#7C3AED';
      case 'Planet Protector': return '#DC2626';
      case 'Sustainability Master': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const viewCustomerDetails = (customer: typeof customerData[number]) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const sendNotification = (customer: typeof customerData[number]) => {
    Alert.alert(
      'Send Notification',
      `Send a notification to ${customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => Alert.alert('Sent!', `Notification sent to ${customer.name}`)
        }
      ]
    );
  };

  const CustomerCard = ({ customer }: { customer: typeof customerData[number] }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => viewCustomerDetails(customer)}
    >
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerAvatarText}>{customer.avatar}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerEmail}>{customer.email}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(customer.level) + '20' }]}>
            <Text style={[styles.levelText, { color: getLevelColor(customer.level) }]}>
              {customer.level}
            </Text>
          </View>
        </View>
        <View style={[styles.statusIndicator, 
          { backgroundColor: customer.status === 'active' ? '#10B981' : '#EF4444' }]} 
        />
      </View>

      <View style={styles.customerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{customer.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{customer.co2Saved.toFixed(1)}</Text>
          <Text style={styles.statLabel}>kg CO₂</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{customer.purchases}</Text>
          <Text style={styles.statLabel}>Purchases</Text>
        </View>
      </View>

      <View style={styles.customerFooter}>
        <Text style={styles.lastActive}>Last active: {customer.lastActive}</Text>
        <TouchableOpacity 
          style={styles.notifyButton}
          onPress={() => sendNotification(customer)}
        >
          <Text style={styles.notifyButtonText}>Notify</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const CustomerModal = () => (
    <Modal visible={showCustomerModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Customer Details</Text>
          <TouchableOpacity
            onPress={() => {
              if (selectedCustomer) sendNotification(selectedCustomer);
            }}
          >
            <Text style={styles.modalActionButton}>Notify</Text>
          </TouchableOpacity>
        </View>

        {selectedCustomer && (
          <ScrollView style={styles.modalContent}>
            {/* Customer Header */}
            <View style={styles.modalCustomerHeader}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>{selectedCustomer.avatar}</Text>
              </View>
              <Text style={styles.modalCustomerName}>{selectedCustomer.name}</Text>
              <Text style={styles.modalCustomerEmail}>{selectedCustomer.email}</Text>
              <View style={[styles.modalLevelBadge, { backgroundColor: getLevelColor(selectedCustomer.level) }]}>
                <Text style={styles.modalLevelText}>{selectedCustomer.level}</Text>
              </View>
            </View>

            {/* Stats Overview */}
            <View style={styles.modalStatsSection}>
              <Text style={styles.modalSectionTitle}>Overview</Text>
              <View style={styles.modalStatsGrid}>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>⭐</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.points}</Text>
                  <Text style={styles.modalStatLabel}>Points Earned</Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>🌱</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.co2Saved.toFixed(1)} kg</Text>
                  <Text style={styles.modalStatLabel}>CO₂ Saved</Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>🛒</Text>
                  <Text style={styles.modalStatValue}>{selectedCustomer.purchases}</Text>
                  <Text style={styles.modalStatLabel}>Total Purchases</Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatIcon}>📅</Text>
                  <Text style={styles.modalStatValue}>
                    {Math.floor((new Date().getTime() - new Date(selectedCustomer.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </Text>
                  <Text style={styles.modalStatLabel}>Days Active</Text>
                </View>
              </View>
            </View>

            {/* Activity Information */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Activity Information</Text>
              <View style={styles.modalInfoCard}>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Member Since</Text>
                  <Text style={styles.modalInfoValue}>
                    {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Last Active</Text>
                  <Text style={styles.modalInfoValue}>{selectedCustomer.lastActive}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Status</Text>
                  <View style={styles.modalStatusContainer}>
                    <View style={[styles.modalStatusDot, 
                      { backgroundColor: selectedCustomer.status === 'active' ? '#10B981' : '#EF4444' }]} 
                    />
                    <Text style={[styles.modalInfoValue, { textTransform: 'capitalize' }]}>
                      {selectedCustomer.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Preferences</Text>
              <View style={styles.preferencesContainer}>
                {selectedCustomer.preferences.map((preference, index) => (
                  <View key={index} style={styles.preferenceTag}>
                    <Text style={styles.preferenceText}>{preference}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Recent Activity</Text>
              <View style={styles.activityContainer}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🛒</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Purchased rescue deal</Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                  <Text style={styles.activityPoints}>+10 pts</Text>
                </View>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🎯</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Completed challenge</Text>
                    <Text style={styles.activityTime}>1 day ago</Text>
                  </View>
                  <Text style={styles.activityPoints}>+25 pts</Text>
                </View>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🎁</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Donated to food bank</Text>
                    <Text style={styles.activityTime}>3 days ago</Text>
                  </View>
                  <Text style={styles.activityPoints}>+15 pts</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalActionButton2}>
                <Text style={styles.modalActionButtonText}>Send Personal Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionButton2, styles.modalSecondaryButton]}>
                <Text style={[styles.modalActionButtonText, styles.modalSecondaryButtonText]}>
                  View Purchase History
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
        <Text style={styles.headerTitle}>Customer Management</Text>
        <Text style={styles.headerSubtitle}>Manage and engage with your customers</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalCustomers}</Text>
          <Text style={styles.summaryLabel}>Total Customers</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activeCustomers}</Text>
          <Text style={styles.summaryLabel}>Active Users</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalPoints.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Points</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalCO2Saved.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>kg CO₂ Saved</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === 'active' && styles.filterButtonActive]}
              onPress={() => setFilterStatus('active')}
            >
              <Text style={[styles.filterButtonText, filterStatus === 'active' && styles.filterButtonTextActive]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === 'inactive' && styles.filterButtonActive]}
              onPress={() => setFilterStatus('inactive')}
            >
              <Text style={[styles.filterButtonText, filterStatus === 'inactive' && styles.filterButtonTextActive]}>
                Inactive
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === 'name' && styles.filterButtonActive]}
              onPress={() => setSortBy('name')}
            >
              <Text style={[styles.filterButtonText, sortBy === 'name' && styles.filterButtonTextActive]}>
                Name
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === 'points' && styles.filterButtonActive]}
              onPress={() => setSortBy('points')}
            >
              <Text style={[styles.filterButtonText, sortBy === 'points' && styles.filterButtonTextActive]}>
                Points
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === 'joinDate' && styles.filterButtonActive]}
              onPress={() => setSortBy('joinDate')}
            >
              <Text style={[styles.filterButtonText, sortBy === 'joinDate' && styles.filterButtonTextActive]}>
                Recent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Customer List */}
      <ScrollView style={styles.customersList}>
        <View style={styles.customersContainer}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👥</Text>
              <Text style={styles.emptyStateTitle}>No customers found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search criteria' : 'No customers match the selected filters'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CustomerModal />
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
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    fontWeight: '500',
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
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  customerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastActive: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notifyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  notifyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    borderRadius: 16,
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
  },
  modalSection: {
    marginBottom: 24,
  },
  modalInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceTag: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
  },
  activityContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  modalActions: {
    gap: 12,
    marginTop: 24,
  },
  modalActionButton2: {
    backgroundColor: '#047857',
    borderRadius: 12,
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
    fontWeight: '600',
  },
  modalSecondaryButtonText: {
    color: '#374151',
  },
});