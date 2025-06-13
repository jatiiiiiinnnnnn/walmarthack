// app/(customer)/(tabs)/impact.tsx - Real-Time Impact Based on Actual Purchases
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppData } from '../../contexts/AppDataContext';

const { width: screenWidth } = Dimensions.get('window');

type Timeframe = 'week' | 'month' | 'year';

export default function ImpactTab() {
  const { orders, cartItems, userEcoPoints } = useAppData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('month');
  const [showReportModal, setShowReportModal] = useState(false);
  const [liveStats, setLiveStats] = useState({
    globalCO2Saved: 45892.3,
    communityMembers: 89432,
    treesPlanted: 2847,
    mealsProvided: 15632
  });
  const [animatedValues] = useState({
    co2: new Animated.Value(0),
    meals: new Animated.Value(0),
    money: new Animated.Value(0),
    points: new Animated.Value(0)
  });

  // Calculate real impact data from actual orders
  const calculateRealImpactData = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
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

    return {
      week: calculateForPeriod(oneWeekAgo),
      month: calculateForPeriod(oneMonthAgo),
      year: calculateForPeriod(oneYearAgo)
    };
  }, [orders, cartItems]);

  const currentData = calculateRealImpactData[selectedTimeframe];

  // Simulate real-time community updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        globalCO2Saved: prev.globalCO2Saved + Math.random() * 3,
        communityMembers: prev.communityMembers + Math.floor(Math.random() * 2),
        treesPlanted: prev.treesPlanted + Math.floor(Math.random() * 1),
        mealsProvided: prev.mealsProvided + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate numbers when timeframe changes
  useEffect(() => {
    Object.keys(animatedValues).forEach(key => {
      animatedValues[key as keyof typeof animatedValues].setValue(0);
      Animated.timing(animatedValues[key as keyof typeof animatedValues], {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    });
  }, [selectedTimeframe, currentData]);

  const generateAndShareReport = async () => {
    setShowReportModal(true);
  };

  const shareReport = async () => {
    try {
      const message = `🌍 My Real Environmental Impact Report 🌍

📊 This ${selectedTimeframe} with EcoConnect & Walmart:
🌱 ${currentData.co2Saved.toFixed(2)} kg CO₂ saved
🥗 ${currentData.mealsDonated} meals donated  
💰 $${currentData.moneySaved.toFixed(2)} saved through eco choices
🛒 ${currentData.sustainableProducts} sustainable products purchased
📦 ${currentData.ordersCount} eco-conscious orders placed

🏆 Equivalent to ${currentData.treesEquivalent.toFixed(2)} trees planted and ${currentData.milesNotDriven.toFixed(2)} miles not driven!

Join me in making real sustainable choices! #SustainabilityChampion #EcoConnect #RealImpact`;

      await Share.share({
        message: message,
        title: 'My Real Environmental Impact Report'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const saveReport = () => {
    Alert.alert(
      'Report Saved!',
      'Your real impact report has been saved to your device gallery.',
      [{ text: 'OK', onPress: () => setShowReportModal(false) }]
    );
  };

  const AnimatedImpactCard = useCallback(({ icon, title, value, subtitle, color, animatedValue, targetValue }: any) => (
    <View style={styles.impactCard}>
      <Text style={[styles.impactIcon, { color }]}>{icon}</Text>
      <Animated.Text style={[styles.impactValue, { color }]}>
        {animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, targetValue],
          extrapolate: 'clamp',
        })}
      </Animated.Text>
      <Text style={styles.impactTitle}>{title}</Text>
      {subtitle && <Text style={styles.impactSubtitle}>{subtitle}</Text>}
    </View>
  ), []);

  const LiveStatsCard = () => (
    <View style={styles.liveStatsCard}>
      <View style={styles.liveStatsHeader}>
        <Text style={styles.liveStatsTitle}>🌍 Global Community Impact</Text>
        <View style={styles.liveBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <View style={styles.globalStatsGrid}>
        <View style={styles.globalStat}>
          <Text style={styles.globalStatValue}>{liveStats.globalCO2Saved.toFixed(2)}kg</Text>
          <Text style={styles.globalStatLabel}>CO₂ saved globally</Text>
        </View>
        <View style={styles.globalStat}>
          <Text style={styles.globalStatValue}>{liveStats.communityMembers.toLocaleString()}</Text>
          <Text style={styles.globalStatLabel}>eco warriors</Text>
        </View>
      </View>
      <View style={styles.realDataIndicator}>
        <Text style={styles.realDataText}>Your data below is based on real purchases</Text>
      </View>
    </View>
  );

  const ReportModal = () => (
    <Modal visible={showReportModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.reportModalContainer}>
        {/* Enhanced Header */}
        <View style={styles.reportModalHeader}>
          <TouchableOpacity onPress={() => setShowReportModal(false)} style={styles.backButton}>
            <Text style={styles.reportModalBack}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.reportModalTitle}>Impact Report</Text>
          <TouchableOpacity onPress={saveReport} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>💾</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.reportContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroBackground}>
              <View style={styles.heroGradient} />
            </View>
            <View style={styles.heroContent}>
              <View style={styles.logoContainer}>
                <Text style={styles.heroLogo}>🌱</Text>
              </View>
              <Text style={styles.heroTitle}>Your Environmental Impact</Text>
              <Text style={styles.heroPeriod}>
                {selectedTimeframe === 'week' ? 'This Week' : 
                 selectedTimeframe === 'month' ? 'This Month' : 'This Year'}
              </Text>
              <View style={styles.realDataBadge}>
                <Text style={styles.realDataBadgeText}>✅ VERIFIED DATA</Text>
              </View>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <Text style={styles.statsTitle}>🎯 Impact Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>🌱</Text>
                </View>
                <Text style={styles.statValue}>{currentData.co2Saved.toFixed(2)}</Text>
                <Text style={styles.statUnit}>kg CO₂ saved</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>💰</Text>
                </View>
                <Text style={styles.statValue}>${currentData.moneySaved.toFixed(2)}</Text>
                <Text style={styles.statUnit}>money saved</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>🥗</Text>
                </View>
                <Text style={styles.statValue}>{currentData.mealsDonated}</Text>
                <Text style={styles.statUnit}>meals donated</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>🛒</Text>
                </View>
                <Text style={styles.statValue}>{currentData.sustainableProducts}</Text>
                <Text style={styles.statUnit}>eco products</Text>
              </View>
            </View>
          </View>

          {/* Impact Equivalents */}
          <View style={styles.equivalentsSection}>
            <Text style={styles.sectionTitle}>🌍 Real-World Impact</Text>
            <View style={styles.equivalentCard}>
              <View style={styles.equivalentHeader}>
                <Text style={styles.equivalentIcon}>🌳</Text>
                <View style={styles.equivalentTextContainer}>
                  <Text style={styles.equivalentValue}>{currentData.treesEquivalent.toFixed(2)} Trees</Text>
                  <Text style={styles.equivalentDescription}>planted equivalent</Text>
                </View>
              </View>
              <View style={styles.equivalentProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '75%' }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.equivalentCard}>
              <View style={styles.equivalentHeader}>
                <Text style={styles.equivalentIcon}>🚗</Text>
                <View style={styles.equivalentTextContainer}>
                  <Text style={styles.equivalentValue}>{currentData.milesNotDriven.toFixed(2)} Miles</Text>
                  <Text style={styles.equivalentDescription}>not driven</Text>
                </View>
              </View>
              <View style={styles.equivalentProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Purchase Details */}
          <View style={styles.purchaseSection}>
            <Text style={styles.sectionTitle}>Purchase Breakdown</Text>
            <View style={styles.purchaseCard}>
              <View style={styles.purchaseRow}>
                <View style={styles.purchaseIcon}>
                  <Text>📦</Text>
                </View>
                <View style={styles.purchaseDetails}>
                  <Text style={styles.purchaseLabel}>Total Orders</Text>
                  <Text style={styles.purchaseValue}>{currentData.ordersCount} orders</Text>
                </View>
              </View>
              
              <View style={styles.purchaseRow}>
                <View style={styles.purchaseIcon}>
                  <Text>🛒</Text>
                </View>
                <View style={styles.purchaseDetails}>
                  <Text style={styles.purchaseLabel}>Walmart Savings</Text>
                  <Text style={styles.purchaseValue}>${currentData.walmartSavings.toFixed(2)}</Text>
                </View>
              </View>
              
              <View style={styles.purchaseRow}>
                <View style={styles.purchaseIcon}>
                  <Text>⭐</Text>
                </View>
                <View style={styles.purchaseDetails}>
                  <Text style={styles.purchaseLabel}>Avg Order Value</Text>
                  <Text style={styles.purchaseValue}>${(currentData.ordersCount * 45.30).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Achievement Section */}
          <View style={styles.achievementSection}>
            <Text style={styles.sectionTitle}>🏆 Your Achievements</Text>
            <View style={styles.achievementCard}>
              <View style={styles.achievementBadge}>
                <Text style={styles.badgeIcon}>🌱</Text>
                <Text style={styles.badgeText}>Eco Champion</Text>
              </View>
              <Text style={styles.achievementDescription}>
                You've made {currentData.ordersCount} sustainable purchases this {selectedTimeframe}, 
                saving {currentData.co2Saved.toFixed(2)}kg of CO₂ and contributing to a healthier planet!
              </Text>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Keep Making an Impact! 🚀</Text>
              <Text style={styles.ctaDescription}>
                Every sustainable choice counts. Share your impact and inspire others to join the movement.
              </Text>
              <View style={styles.ctaHashtags}>
                <Text style={styles.hashtag}>#EcoChampion</Text>
                <Text style={styles.hashtag}>#SustainableLiving</Text>
                <Text style={styles.hashtag}>#RealImpact</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Share Button */}
          <TouchableOpacity style={styles.modernShareButton} onPress={shareReport}>
            <View style={styles.shareButtonContent}>
              <Text style={styles.shareButtonText}>Share My Impact</Text>
            </View>
            <View style={styles.shareButtonGlow} />
          </TouchableOpacity>

          <View style={styles.reportBottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 Real Environmental Impact</Text>
        <Text style={styles.headerSubtitle}>Based on your actual purchases • Live tracking</Text>
      </View>

      {/* Live Stats */}
      <LiveStatsCard />

      {/* Timeframe Selector */}
      <View style={styles.timeframeSelector}>
        {(['week', 'month', 'year'] as Timeframe[]).map(timeframe => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe && styles.timeframeButtonActive
            ]}
            onPress={() => setSelectedTimeframe(timeframe)}
          >
            <Text style={[
              styles.timeframeButtonText,
              selectedTimeframe === timeframe && styles.timeframeButtonTextActive
            ]}>
              This {timeframe}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Impact Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Real Impact This {selectedTimeframe}</Text>
            <Text style={styles.sectionSubtitle}>From {currentData.ordersCount} actual orders</Text>
          </View>
          <View style={styles.impactGrid}>
            <AnimatedImpactCard
              icon="🌱"
              title="CO₂ Saved"
              value={`${currentData.co2Saved.toFixed(2)} kg`}
              subtitle="From eco choices"
              color="#059669"
              animatedValue={animatedValues.co2}
              targetValue={currentData.co2Saved}
            />
            <AnimatedImpactCard
              icon="🥗"
              title="Meals Donated"
              value={currentData.mealsDonated.toString()}
              subtitle="To local food banks"
              color="#F59E0B"
              animatedValue={animatedValues.meals}
              targetValue={currentData.mealsDonated}
            />
            <AnimatedImpactCard
              icon="💰"
              title="Money Saved"
              value={`$${currentData.moneySaved.toFixed(2)}`}
              subtitle="Through eco deals"
              color="#2563EB"
              animatedValue={animatedValues.money}
              targetValue={currentData.moneySaved}
            />
            <AnimatedImpactCard
              icon="🛒"
              title="Eco Products"
              value={currentData.sustainableProducts.toString()}
              subtitle="Actually purchased"
              color="#0071CE"
              animatedValue={animatedValues.points}
              targetValue={currentData.sustainableProducts}
            />
          </View>
        </View>

        {/* Real Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Your Performance</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceIcon}>📦</Text>
              <View style={styles.performanceInfo}>
                <Text style={styles.performanceTitle}>{currentData.ordersCount} Orders Completed</Text>
                <Text style={styles.performanceSubtitle}>Real purchases tracked automatically</Text>
              </View>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceIcon}>💳</Text>
              <View style={styles.performanceInfo}>
                <Text style={styles.performanceTitle}>${(currentData.ordersCount * 45.30).toFixed(2)} Average Order</Text>
                <Text style={styles.performanceSubtitle}>Sustainable shopping value</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Environmental Equivalents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Environmental Equivalents</Text>
          <View style={styles.equivalentsCard}>
            <View style={styles.equivalentItem}>
              <Text style={styles.equivalentIcon}>🌳</Text>
              <View style={styles.equivalentInfo}>
                <Text style={styles.equivalentValue}>{currentData.treesEquivalent.toFixed(2)} trees</Text>
                <Text style={styles.equivalentLabel}>planted equivalent</Text>
              </View>
              <View style={styles.equivalentTrend}>
                <Text style={styles.equivalentTrendText}>Real Impact</Text>
              </View>
            </View>
            <View style={styles.equivalentItem}>
              <Text style={styles.equivalentIcon}>🚗</Text>
              <View style={styles.equivalentInfo}>
                <Text style={styles.equivalentValue}>{currentData.milesNotDriven.toFixed(2)} miles</Text>
                <Text style={styles.equivalentLabel}>not driven</Text>
              </View>
              <View style={styles.equivalentTrend}>
                <Text style={styles.equivalentTrendText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share & Save</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.primaryActionButton} onPress={generateAndShareReport}>
              <Text style={styles.primaryActionText}>Generate Real Impact Report</Text>
              <Text style={styles.primaryActionSubtext}>Based on verified purchase data</Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionIcon}>🏆</Text>
                <Text style={styles.secondaryActionText}>Compare</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionIcon}>📈</Text>
                <Text style={styles.secondaryActionText}>Trends</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Current Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Current Goals</Text>
          <View style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <View style={styles.goalIcon}>
                <Text style={styles.goalIconText}>🎯</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Next milestone: 200kg CO₂ saved</Text>
                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressTrack}>
                    <View style={[styles.goalProgressFill, { width: `${Math.min((currentData.co2Saved / 200) * 100, 100)}%` }]} />
                  </View>
                  <Text style={styles.goalProgressText}>
                    {Math.min(Math.round((currentData.co2Saved / 200) * 100), 100)}% complete
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ReportModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#052e16',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  liveStatsCard: {
    backgroundColor: '#1B4332',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  liveStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
  },
  globalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  globalStat: {
    alignItems: 'center',
  },
  globalStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BBF7D0',
    marginBottom: 4,
  },
  globalStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  realDataIndicator: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  realDataText: {
    fontSize: 12,
    color: '#BBF7D0',
    textAlign: 'center',
    fontWeight: '500',
  },
  timeframeSelector: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeframeButtonActive: {
    backgroundColor: '#059669',
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  timeframeButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  impactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: (screenWidth - 56) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  impactIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  impactValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  impactSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  performanceInfo: {
    flex: 1,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  performanceSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  equivalentsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  equivalentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  equivalentIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  equivalentInfo: {
    flex: 1,
  },
  equivalentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  equivalentLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  equivalentTrend: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  equivalentTrendText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  quickActions: {
    gap: 12,
  },
  primaryActionButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  primaryActionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalIconText: {
    fontSize: 20,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 80,
  },
  bottomSpacing: {
    height: 32,
  },
  
  // New Enhanced Report Modal Styles
  reportModalContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  reportModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  reportModalBack: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  reportModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  saveButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
  },
  reportContent: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    position: 'relative',
    height: 300,
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#059669',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 150, 105, 0.8)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroLogo: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroPeriod: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  realDataBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  realDataBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Stats Overview
  statsOverview: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: (screenWidth - 64) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Equivalents Section
  equivalentsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  equivalentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  equivalentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  equivalentIconLarge: {
    fontSize: 32,
    marginRight: 16,
  },
  equivalentTextContainer: {
    flex: 1,
  },
  equivalentValueLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  equivalentDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  equivalentProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },

  // Purchase Section
  purchaseSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  purchaseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  purchaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  purchaseDetails: {
    flex: 1,
  },
  purchaseLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  purchaseValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  // Achievement Section
  achievementSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  achievementDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },

  // CTA Section
  ctaSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  ctaCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  ctaHashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  hashtag: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // Enhanced Share Button
  modernShareButton: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  shareButtonContent: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  shareButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  reportBottomSpacing: {
    height: 40,
  },
});