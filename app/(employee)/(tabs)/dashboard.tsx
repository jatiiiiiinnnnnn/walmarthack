// dashboard.tsx - Enhanced Employee Dashboard with Dynamic Features
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { useAppData } from "../../contexts/AppDataContext";

const { width, height } = Dimensions.get('window');

type RescueDealCategory = 'Produce' | 'Bakery' | 'Dairy' | 'Meat';

interface EmployeeStats {
  weeklyImpact: number;
  monthlyTarget: number;
  currentStreak: number;
  sustainabilityLevel: number;
  badges: string[];
  weeklyGoal: number;
  completedTasks: number;
  totalTasks: number;
}

export default function EmployeeDashboard() {
  const {
    createRescueDeal,
    updateRescueDealStatus,
    dashboardData,
    activities,
    todaysStats
  } = useAppData();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // State management
  const [modalVisible, setModalVisible] = useState(false);
  const [dealCategory, setDealCategory] = useState<RescueDealCategory>('Produce');
  const [dealDescription, setDealDescription] = useState('');
  const [dealDiscount, setDealDiscount] = useState('');
  const [dealQuantity, setDealQuantity] = useState('');
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationCount, setNotificationCount] = useState(3);

  // Employee sustainability stats
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats>({
    weeklyImpact: 247,
    monthlyTarget: 1000,
    currentStreak: 12,
    sustainabilityLevel: 7,
    badges: ['🌱', '♻️', '🏆', '⭐'],
    weeklyGoal: 50,
    completedTasks: 8,
    totalTasks: 12
  });

  const [systemSettings, setSystemSettings] = useState({
    autoRescueDeals: true,
    donationAlerts: true,
    customerNotifications: true,
    peakHourOptimization: false,
    sustainabilityReports: true,
    realTimeTracking: true,
    teamCollaboration: true
  });

  const categories: RescueDealCategory[] = ['Produce', 'Bakery', 'Dairy', 'Meat'];

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: employeeStats.weeklyImpact / employeeStats.monthlyTarget,
        duration: 1500,
        useNativeDriver: false,
      })
    ]).start();

    // Pulse animation for notifications
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

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

    // Update employee stats
    setEmployeeStats(prev => ({
      ...prev,
      weeklyImpact: prev.weeklyImpact + 15,
      completedTasks: prev.completedTasks + 1,
      currentStreak: prev.currentStreak + 1
    }));

    // Trigger visual feedback and celebration
    setRecentlyUpdated(true);
    setShowCelebration(true);
    Vibration.vibrate(100);
    
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: (employeeStats.weeklyImpact + 15) / employeeStats.monthlyTarget,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setRecentlyUpdated(false);
      setShowCelebration(false);
    }, 3000);
    
    Alert.alert(
      '🎉 Rescue Deal Created!', 
      `Great job! You've helped reduce waste and earn +15 sustainability points!`,
      [{ 
        text: 'Awesome!', 
        onPress: () => {
          setModalVisible(false);
          setDealDescription('');
          setDealDiscount('');
          setDealQuantity('');
        }
      }]
    );
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      donation: { 
        message: 'Donation alert sent to 3 local food banks',
        points: 10
      },
      sustainability: { 
        message: 'Eco-tip broadcasted to 2,847 customers',
        points: 5
      },
      discount: { 
        message: 'Flash discount activated! 73% customer engagement',
        points: 15
      },
      announcement: { 
        message: 'Store update sent to customer app',
        points: 5
      },
      team: {
        message: 'Team sustainability challenge initiated!',
        points: 20
      }
    };
    
    const actionData = actions[action as keyof typeof actions];
    setEmployeeStats(prev => ({
      ...prev,
      weeklyImpact: prev.weeklyImpact + actionData.points
    }));
    
    setNotificationCount(prev => prev + 1);
    Alert.alert('🌟 Action Completed!', 
      `${actionData.message}\n\n+${actionData.points} sustainability points earned!`
    );
  };

  const navigateToTab = (tab: string) => {
    switch(tab) {
      case 'analytics':
        router.push('/analytics');
        break;
      case 'customers':
        router.push('/customers');
        break;
      case 'tasks':
        router.push('/tasks');
        break;
      default:
        Alert.alert('Navigation', `Opening ${tab} section...`);
    }
  };

  const getSustainabilityLevelColor = (level: number) => {
    if (level >= 8) return '#10B981'; // Green
    if (level >= 6) return '#F59E0B'; // Yellow
    if (level >= 4) return '#EF4444'; // Orange
    return '#6B7280'; // Gray
  };

  const renderActivity = ({ item }: { item: any }) => (
    <Animated.View style={[
      styles.activityItem, 
      item.status === 'new' && styles.newActivity,
      { opacity: fadeAnim }
    ]}>
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
            <View style={[styles.impactBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={styles.impactText}>🌱 {item.impact.co2Saved}kg CO₂</Text>
            </View>
          )}
          {'moneySaved' in item.impact && (
            <View style={[styles.impactBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.impactText}>💰 ${item.impact.moneySaved}</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Celebration Animation */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <Text style={styles.celebrationText}>🎉 Great Job! 🌱</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Live Stats */}
        <LinearGradient
          colors={['#047857', '#065F46', '#064E3B']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <Text style={styles.welcomeText}>
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
              </Text>
              <Text style={styles.userName}>Sarah Johnson</Text>
              <Text style={styles.userRole}>Sustainability Champion • Level {employeeStats.sustainabilityLevel}</Text>
              
              {/* Live streak counter */}
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>🔥 {employeeStats.currentStreak} day streak</Text>
                <View style={styles.badgeContainer}>
                  {employeeStats.badges.map((badge, index) => (
                    <Text key={index} style={styles.badge}>{badge}</Text>
                  ))}
                </View>
              </View>
            </Animated.View>
            
            
          </View>

          {/* Progress Bar for Monthly Goal */}
          <Animated.View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Monthly Sustainability Target</Text>
              <Text style={styles.progressValue}>
                {employeeStats.weeklyImpact}/{employeeStats.monthlyTarget} points
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]} 
              />
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Dynamic Key Metrics */}
        <Animated.View style={[styles.metricsContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={[
              styles.metricCard, 
              recentlyUpdated && styles.metricCardUpdated,
              { backgroundColor: recentlyUpdated ? '#F0FDF4' : 'white' }
            ]}
            onPress={() => navigateToTab('analytics')}
          >
            <Text style={styles.metricIcon}>🏪</Text>
            <Text style={styles.metricValue}>{dashboardData.rescueDeals.total}</Text>
            <Text style={styles.metricLabel}>Rescue Deals</Text>
            <View style={styles.metricDetailsContainer}>
              <Text style={styles.metricDetail}>
                {dashboardData.rescueDeals.sold} sold • {dashboardData.rescueDeals.donated} donated
              </Text>
              <Text style={styles.metricTrend}>↗ +{Math.round((dashboardData.rescueDeals.total / 50) * 100)}%</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => navigateToTab('analytics')}
          >
            <Text style={styles.metricIcon}>♻️</Text>
            <Text style={styles.metricValue}>{dashboardData.wasteReduction.percentage}%</Text>
            <Text style={styles.metricLabel}>Waste Prevented</Text>
            <View style={styles.metricDetailsContainer}>
              <Text style={styles.metricDetail}>{dashboardData.wasteReduction.totalKg}kg saved</Text>
              <Text style={styles.metricTrend}>↗ +5%</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.metricCard}
            onPress={() => navigateToTab('analytics')}
          >
            <Text style={styles.metricIcon}>🌱</Text>
            <Text style={styles.metricValue}>{(dashboardData.wasteReduction.co2Saved / 1000).toFixed(1)}k</Text>
            <Text style={styles.metricLabel}>CO₂ Saved</Text>
            <View style={styles.metricDetailsContainer}>
              <Text style={styles.metricDetail}>kg this month</Text>
              <Text style={styles.metricTrend}>↗ +15.7%</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Enhanced Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Impact Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#047857' }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.quickActionIcon}>🏪</Text>
              <Text style={styles.quickActionText}>Create Rescue Deal</Text>
              <Text style={styles.quickActionSubtext}>+15 points</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#F59E0B' }]}
              onPress={() => handleQuickAction('donation')}
            >
              <Text style={styles.quickActionIcon}>🤝</Text>
              <Text style={styles.quickActionText}>Alert Food Banks</Text>
              <Text style={styles.quickActionSubtext}>+10 points</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#10B981' }]}
              onPress={() => handleQuickAction('sustainability')}
            >
              <Text style={styles.quickActionIcon}>🌱</Text>
              <Text style={styles.quickActionText}>Send Eco-Tip</Text>
              <Text style={styles.quickActionSubtext}>+5 points</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#8B5CF6' }]}
              onPress={() => handleQuickAction('discount')}
            >
              <Text style={styles.quickActionIcon}>⚡</Text>
              <Text style={styles.quickActionText}>Flash Discount</Text>
              <Text style={styles.quickActionSubtext}>+15 points</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#EC4899' }]}
              onPress={() => handleQuickAction('team')}
            >
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={styles.quickActionText}>Team Challenge</Text>
              <Text style={styles.quickActionSubtext}>+20 points</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: '#06B6D4' }]}
              onPress={() => handleQuickAction('announcement')}
            >
              <Text style={styles.quickActionIcon}>📢</Text>
              <Text style={styles.quickActionText}>Store Update</Text>
              <Text style={styles.quickActionSubtext}>+5 points</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Sustainability Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Your Sustainability Journey</Text>
          <View style={styles.personalDashboard}>
            <View style={styles.personalCard}>
              <Text style={styles.personalCardTitle}>Daily Tasks</Text>
              <View style={styles.taskProgress}>
                <View style={styles.taskProgressBar}>
                  <View 
                    style={[
                      styles.taskProgressFill,
                      { width: `${(employeeStats.completedTasks / employeeStats.totalTasks) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.taskProgressText}>
                  {employeeStats.completedTasks}/{employeeStats.totalTasks} completed
                </Text>
              </View>
            </View>

            <View style={styles.personalCard}>
              <Text style={styles.personalCardTitle}>Sustainability Level</Text>
              <View style={styles.levelContainer}>
                <View style={[
                  styles.levelIndicator,
                  { backgroundColor: getSustainabilityLevelColor(employeeStats.sustainabilityLevel) }
                ]}>
                  <Text style={styles.levelText}>{employeeStats.sustainabilityLevel}</Text>
                </View>
                <Text style={styles.levelLabel}>Eco Champion</Text>
              </View>
            </View>
          </View>
        </View>

        

        {/* Enhanced System Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Smart Controls</Text>
          <View style={styles.systemControls}>
            {Object.entries(systemSettings).map(([key, value]) => (
              <View key={key} style={styles.systemControl}>
                <View style={styles.systemControlLeft}>
                  <Text style={styles.systemLabel}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                  <Text style={styles.systemSubLabel}>
                    {getSystemDescription(key)}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={(newValue) => {
                    setSystemSettings(prev => ({ ...prev, [key]: newValue }));
                    if (newValue) {
                      setEmployeeStats(prev => ({ ...prev, weeklyImpact: prev.weeklyImpact + 2 }));
                    }
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#047857' }}
                  thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Management Tools (without challenges) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Management Hub</Text>
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
          </View>
        </View>

        {/* Today's Environmental Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Today's Environmental Impact</Text>
          <View style={styles.impactSummary}>
            <View style={styles.impactMetric}>
              <Text style={styles.impactIcon}>🌱</Text>
              <Text style={styles.impactValue}>{todaysStats.co2Saved} kg</Text>
              <Text style={styles.impactLabel}>CO₂ Saved Today</Text>
              <Text style={styles.impactGrowth}>+12% vs yesterday</Text>
            </View>
            <View style={styles.impactMetric}>
              <Text style={styles.impactIcon}>♻️</Text>
              <Text style={styles.impactValue}>{todaysStats.wastePrevented} kg</Text>
              <Text style={styles.impactLabel}>Waste Prevented</Text>
              <Text style={styles.impactGrowth}>+8% vs yesterday</Text>
            </View>
            <View style={styles.impactMetric}>
              <Text style={styles.impactIcon}>💰</Text>
              <Text style={styles.impactValue}>${todaysStats.customerSavings}</Text>
              <Text style={styles.impactLabel}>Customer Savings</Text>
              <Text style={styles.impactGrowth}>+15% vs yesterday</Text>
            </View>
          </View>
        </View>

        {/* Team Leaderboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Team Sustainability Leaders</Text>
          <View style={styles.leaderboard}>
            {[
              { name: 'Sarah Johnson', points: 247, rank: 1, trend: '↗️' },
              { name: 'Mike Chen', points: 234, rank: 2, trend: '↗️' },
              { name: 'Lisa Rodriguez', points: 198, rank: 3, trend: '↘️' },
              { name: 'David Kim', points: 176, rank: 4, trend: '➡️' }
            ].map((member, index) => (
              <View key={index} style={[
                styles.leaderboardItem,
                index === 0 && styles.leaderboardFirst
              ]}>
                <View style={styles.leaderboardLeft}>
                  <Text style={styles.leaderboardRank}>#{member.rank}</Text>
                  <Text style={styles.leaderboardName}>
                    {member.name} {index === 0 ? '(You)' : ''}
                  </Text>
                </View>
                <View style={styles.leaderboardRight}>
                  <Text style={styles.leaderboardPoints}>{member.points} pts</Text>
                  <Text style={styles.leaderboardTrend}>{member.trend}</Text>
                </View>
              </View>
            ))}
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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🏪 Create Rescue Deal</Text>
                <Text style={styles.modalSubtitle}>Help reduce waste and earn sustainability points!</Text>
              </View>
              
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
              
              <View style={styles.modalReward}>
                <Text style={styles.modalRewardText}>🌟 You'll earn +15 sustainability points!</Text>
              </View>
              
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

  function getSystemDescription(key: string): string {
    const descriptions = {
      autoRescueDeals: 'Automatically suggest rescue deals',
      donationAlerts: 'Alert food banks of surplus',
      customerNotifications: 'Notify customers of deals',
      peakHourOptimization: 'Optimize during busy hours',
      sustainabilityReports: 'Generate eco reports',
      realTimeTracking: 'Track impact in real-time',
      teamCollaboration: 'Enable team features'
    };
    return descriptions[key as keyof typeof descriptions] || '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: height * 0.4,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#047857',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  notificationBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    width: 32,
    height: 32,
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
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsButtonText: {
    fontSize: 18,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metricCardUpdated: {
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricDetailsContainer: {
    alignItems: 'center',
    gap: 4,
  },
  metricDetail: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  metricTrend: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
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
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  personalDashboard: {
    flexDirection: 'row',
    gap: 12,
  },
  personalCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  personalCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  taskProgress: {
    alignItems: 'center',
  },
  taskProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  taskProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  taskProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  levelContainer: {
    alignItems: 'center',
  },
  levelIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  levelLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  activityFeed: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 16,
    color: 'white',
  },
  activityContent: {
    flex: 1,
  },
  activityCustomer: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  activityAction: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 3,
  },
  impactText: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '600',
  },
  systemControls: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  systemControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  systemControlLeft: {
    flex: 1,
  },
  systemLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  systemSubLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: (width - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolIconText: {
    fontSize: 24,
  },
  toolText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  toolSubtext: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  impactSummary: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  impactMetric: {
    alignItems: 'center',
  },
  impactIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 2,
  },
  impactGrowth: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '700',
  },
  leaderboard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  leaderboardFirst: {
    backgroundColor: '#FEF3C7',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    width: 30,
  },
  leaderboardName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  leaderboardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderboardPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#047857',
  },
  leaderboardTrend: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: width - 32,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
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
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalReward: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalRewardText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
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
    fontWeight: '700',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '700',
  },
});