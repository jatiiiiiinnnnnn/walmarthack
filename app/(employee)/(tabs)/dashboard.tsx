// dashboard.tsx - Updated to use shared context
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useAppData } from "../../contexts/AppDataContext";

// Add at the very top of your JSX return:


const { width } = Dimensions.get('window');

type RescueDealCategory = 'Produce' | 'Bakery' | 'Dairy' | 'Meat';


export default function EmployeeDashboard() {

  const {
    createRescueDeal,
    updateRescueDealStatus,
    dashboardData,
    activities,
    todaysStats
  } = useAppData();

  const [modalVisible, setModalVisible] = useState(false);
  const [dealCategory, setDealCategory] = useState<RescueDealCategory>('Produce');
  const [dealDescription, setDealDescription] = useState('');
  const [dealDiscount, setDealDiscount] = useState('');
  const [dealQuantity, setDealQuantity] = useState('');
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);

  const [systemSettings, setSystemSettings] = useState({
    autoRescueDeals: true,
    donationAlerts: true,
    customerNotifications: true,
    peakHourOptimization: false,
    sustainabilityReports: true
  });

  const categories: RescueDealCategory[] = ['Produce', 'Bakery', 'Dairy', 'Meat'];

  const handleCreateRescueDeal = () => {
    if (!dealDescription.trim() || !dealDiscount.trim() || !dealQuantity.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Create rescue deal using context
    createRescueDeal({
      category: dealCategory,
      description: dealDescription,
      discount: parseInt(dealDiscount),
      quantity: dealQuantity,
      priority: "medium",
      aisle: ""
    });

    // Trigger visual feedback
    setRecentlyUpdated(true);
    setTimeout(() => setRecentlyUpdated(false), 2000);
    
    Alert.alert(
      'Rescue Deal Created!', 
      `${dealCategory} rescue deal has been published to customers`,
      [{ text: 'OK', onPress: () => {
        setModalVisible(false);
        setDealDescription('');
        setDealDiscount('');
        setDealQuantity('');
      }}]
    );
  };

  // Simulate some rescue deals being sold/donated (for demo purposes)
  const simulateRescueDealSale = () => {
    // In a real app, this would be triggered by customer purchases
    // For now, we'll simulate it with random data
    const customerNames = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown'];
    const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
    const randomPrice = Math.floor(Math.random() * 50) + 10;
    
    // This would typically come from a purchase system
    Alert.alert('Demo', `Simulated sale to ${randomCustomer} for $${randomPrice}`);
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      donation: 'Donation alert sent to local food banks',
      sustainability: 'Weekly sustainability tip sent to all customers',
      discount: 'Flash discount campaign activated for all rescue deals',
      announcement: 'Store update published to customer app'
    };
    
    if (action === 'discount') {
      // Simulate a flash sale
      simulateRescueDealSale();
    } else {
      Alert.alert('Action Completed!', actions[action as keyof typeof actions]);
    }
  };

  const renderActivity = ({ item }: { item: any }) => (
    <View style={[styles.activityItem, item.status === 'new' && styles.newActivity]}>
      <View style={styles.activityHeader}>
        <View style={[
          styles.activityIcon, 
          { backgroundColor: getActivityColor(item.type) }
        ]}>
          <Text style={styles.activityIconText}>
            {getActivityIcon(item.type)}
          </Text>
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityCustomer}>{item.customer}</Text>
          <Text style={styles.activityAction}>{item.action}</Text>
          <Text style={styles.activityDetails}>{item.details}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
        <View style={styles.activityImpact}>
          {'co2Saved' in item.impact && (
            <View style={styles.impactBadge}>
              <Text style={styles.impactText}>🌱 {item.impact.co2Saved}kg CO₂</Text>
            </View>
          )}
          {'moneySaved' in item.impact && (
            <View style={styles.impactBadge}>
              <Text style={styles.impactText}>💰 ${item.impact.moneySaved}</Text>
            </View>
          )}
          {'itemCount' in item.impact && (
            <View style={styles.impactBadge}>
              <Text style={styles.impactText}>📦 {item.impact.itemCount} items</Text>
            </View>
          )}
          {'dealCategory' in item.impact && (
            <View style={styles.impactBadge}>
              <Text style={styles.impactText}>🏪 {item.impact.dealCategory}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const getActivityColor = (type: string) => {
    const colors = {
      rescue_deal_sold: '#10B981',
      rescue_deal_created: '#047857',
      donation_completed: '#F59E0B', 
      challenge_completed: '#6366F1',
      milestone_reached: '#8B5CF6'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      rescue_deal_sold: '🛒',
      rescue_deal_created: '🏪',
      donation_completed: '🤝',
      challenge_completed: '🎯',
      milestone_reached: '🏆'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const navigateToTab = (tab: string) => {
    // This would integrate with your router
    Alert.alert('Navigation', `Navigate to ${tab} tab`);
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollContainer}>
        {/* Enhanced Header with consistent styling */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Employee Portal</Text>
              <Text style={styles.userName}>Sarah Johnson</Text>
              <Text style={styles.userRole}>Environmental Coordinator</Text>
            </View>
            
          </View>
        </View>

        {/* Key Metrics - Now using real-time data from context */}
        <View style={styles.metricsContainer}>
          <TouchableOpacity 
            style={[styles.metricCard, recentlyUpdated && styles.metricCardUpdated]}
            onPress={() => navigateToTab('analytics')}
          >
            <Text style={styles.metricValue}>{dashboardData.rescueDeals.total}</Text>
            <Text style={styles.metricLabel}>Rescue Deals Created</Text>
            <Text style={styles.metricDetail}>
              {dashboardData.rescueDeals.sold} sold • {dashboardData.rescueDeals.donated} donated • {dashboardData.rescueDeals.pending} pending
            </Text>
            <Text style={styles.metricTrend}>↗ +{Math.round((dashboardData.rescueDeals.total / 50) * 100)}%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => navigateToTab('analytics')}
          >
            <Text style={styles.metricValue}>{dashboardData.wasteReduction.percentage}%</Text>
            <Text style={styles.metricLabel}>Waste Reduction</Text>
            <Text style={styles.metricDetail}>{dashboardData.wasteReduction.totalKg}kg prevented</Text>
            <Text style={styles.metricTrend}>↗ +5%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => navigateToTab('analytics')}
          >
            <Text style={styles.metricValue}>{(dashboardData.wasteReduction.co2Saved / 1000).toFixed(1)}k</Text>
            <Text style={styles.metricLabel}>kg CO₂ Saved</Text>
            <Text style={styles.metricDetail}>Environmental impact</Text>
            <Text style={styles.metricTrend}>↗ +15.7%</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions for Store Operations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#047857' }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.quickActionIcon}>🏪</Text>
              <Text style={styles.quickActionText}>Create Rescue Deal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#F59E0B' }]}
              onPress={() => handleQuickAction('donation')}
            >
              <Text style={styles.quickActionIcon}>🤝</Text>
              <Text style={styles.quickActionText}>Alert Food Banks</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#10B981' }]}
              onPress={() => handleQuickAction('sustainability')}
            >
              <Text style={styles.quickActionIcon}>🌱</Text>
              <Text style={styles.quickActionText}>Send Eco-Tip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#8B5CF6' }]}
              onPress={() => handleQuickAction('discount')}
            >
              <Text style={styles.quickActionIcon}>⚡</Text>
              <Text style={styles.quickActionText}>Flash Discount</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Store Activity - Now using real-time activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Store Activity</Text>
            <TouchableOpacity onPress={() => navigateToTab('analytics')}>
              <Text style={styles.viewAllText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityFeed}>
            <FlatList
              data={activities}
              renderItem={renderActivity}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              extraData={activities}
            />
          </View>
        </View>

        {/* System Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Controls</Text>
          <View style={styles.systemControls}>
            {Object.entries(systemSettings).map(([key, value]) => (
              <View key={key} style={styles.systemControl}>
                <Text style={styles.systemLabel}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <Switch
                  value={value}
                  onValueChange={(newValue) => 
                    setSystemSettings(prev => ({ ...prev, [key]: newValue }))
                  }
                  trackColor={{ false: '#E5E7EB', true: '#047857' }}
                  thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Management Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigateToTab('analytics')}
            >
              <View style={[styles.toolIcon, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.toolIconText}>📊</Text>
              </View>
              <Text style={styles.toolText}>Analytics</Text>
              <Text style={styles.toolSubtext}>Real-time insights & trends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigateToTab('customers')}
            >
              <View style={[styles.toolIcon, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.toolIconText}>👥</Text>
              </View>
              <Text style={styles.toolText}>Customers</Text>
              <Text style={styles.toolSubtext}>Manage customer profiles</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigateToTab('tasks')}
            >
              <View style={[styles.toolIcon, { backgroundColor: '#F3E8FF' }]}>
                <Text style={styles.toolIconText}>📋</Text>
              </View>
              <Text style={styles.toolText}>Tasks</Text>
              <Text style={styles.toolSubtext}>Daily assignments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigateToTab('challenges')}
            >
              <View style={[styles.toolIcon, { backgroundColor: '#DCFCE7' }]}>
                <Text style={styles.toolIconText}>🎯</Text>
              </View>
              <Text style={styles.toolText}>Challenges</Text>
              <Text style={styles.toolSubtext}>Sustainability campaigns</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Environmental Impact Summary - Now using real-time today's stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Environmental Impact</Text>
          <View style={styles.impactSummary}>
            <View style={styles.impactMetric}>
              <Text style={styles.impactIcon}>🌱</Text>
              <Text style={styles.impactValue}>{todaysStats.co2Saved} kg</Text>
              <Text style={styles.impactLabel}>CO₂ Saved Today</Text>
            </View>
            <View style={styles.impactMetric}>
              <Text style={styles.impactIcon}>♻️</Text>
              <Text style={styles.impactValue}>{todaysStats.wastePrevented} kg</Text>
              <Text style={styles.impactLabel}>Waste Prevented</Text>
            </View>
            <View style={styles.impactMetric}>
              <Text style={styles.impactIcon}>💰</Text>
              <Text style={styles.impactValue}>${todaysStats.customerSavings}</Text>
              <Text style={styles.impactLabel}>Customer Savings</Text>
            </View>
          </View>
        </View>

        {/* Create Rescue Deal Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Rescue Deal</Text>
              
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      dealCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setDealCategory(category)}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      dealCategory === category && styles.categoryButtonTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.inputLabel}>Deal Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the items and their condition..."
                value={dealDescription}
                onChangeText={setDealDescription}
                multiline
                numberOfLines={3}
              />
              
              <Text style={styles.inputLabel}>Discount Percentage</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 40"
                value={dealDiscount}
                onChangeText={setDealDiscount}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Quantity Available</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 5kg or 10 items"
                value={dealQuantity}
                onChangeText={setDealQuantity}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.createButton]}
                  onPress={handleCreateRescueDeal}
                >
                  <Text style={styles.createButtonText}>Create Deal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain the same as original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#047857',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  notificationBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analyticsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsButtonText: {
    fontSize: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricCardUpdated: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricDetail: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#047857',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityFeed: {
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  newActivity: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 14,
    color: 'white',
  },
  activityContent: {
    flex: 1,
  },
  activityCustomer: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityAction: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityDetails: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  activityImpact: {
    alignItems: 'flex-end',
  },
  impactBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 2,
  },
  impactText: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '500',
  },
  systemControls: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  systemControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  systemLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: (width - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolIconText: {
    fontSize: 20,
  },
  toolText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  toolSubtext: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  impactSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  impactMetric: {
    alignItems: 'center',
  },
  impactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: width - 32,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  createButton: {
    backgroundColor: '#047857',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});