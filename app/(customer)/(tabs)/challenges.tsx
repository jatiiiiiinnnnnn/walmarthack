// app/(customer)/(tabs)/challenges.tsx - Walmart-Trackable Sustainability Challenges
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Simulated Walmart API integration for trackable challenges
const simulateWalmartAIAPI = async (context: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const walmartTrackableChallenges = {
    purchase_behavior: {
      title: "Great Value Green Week",
      description: "Choose Walmart's sustainable Great Value products for 80% of your grocery purchases this week",
      category: "Sustainable Shopping",
      difficulty: "Easy",
      target: 20,
      unit: "sustainable products",
      reward: 300,
      trackingMethod: "Receipt scanning & loyalty program data",
      walmartBenefit: "Promotes Walmart's eco-friendly private label products",
      aiTips: [
        "Great Value Organic products have 30% lower carbon footprint",
        "Look for 'Project Gigaton' partner products in your cart",
        "Walmart tracks your sustainable choices automatically",
        "Every Great Value sustainable purchase = 5 bonus EcoPoints"
      ]
    },
    packaging_reduction: {
      title: "Zero Plastic Bag Champion",
      description: "Complete 10 shopping trips using only reusable bags at Walmart checkouts",
      category: "Packaging Reduction",
      difficulty: "Medium",
      target: 10,
      unit: "bag-free trips",
      reward: 250,
      trackingMethod: "Checkout system plastic bag usage tracking",
      walmartBenefit: "Reduces Walmart's plastic bag costs and environmental impact",
      aiTips: [
        "Walmart saves $0.05 per avoided plastic bag",
        "Keep reusable bags in your car for convenience",
        "Walmart+ members get bag reminder notifications",
        "Self-checkout stations track and reward bag-free purchases"
      ]
    },
    digital_engagement: {
      title: "Digital Receipt Earth Saver",
      description: "Use digital receipts for all Walmart purchases to eliminate paper waste",
      category: "Digital Sustainability",
      difficulty: "Easy",
      target: 15,
      unit: "digital receipts",
      reward: 200,
      trackingMethod: "Walmart app digital receipt usage analytics",
      walmartBenefit: "Reduces paper costs and improves customer data insights",
      aiTips: [
        "Each digital receipt saves 0.01kg of paper waste",
        "Access receipts instantly in Walmart app",
        "Digital receipts enable better return tracking",
        "Automatic expense categorization for budgeting"
      ]
    },
    local_sourcing: {
      title: "Local Heroes Walmart Challenge",
      description: "Purchase 25 locally-sourced products available at your Walmart store",
      category: "Local Impact",
      difficulty: "Medium",
      target: 25,
      unit: "local products",
      reward: 350,
      trackingMethod: "Product origin tracking via UPC codes and receipts",
      walmartBenefit: "Supports Walmart's local sourcing initiatives and reduces transport costs",
      aiTips: [
        "Look for 'Local' tags in Walmart app product descriptions",
        "Local products have 50% lower transport emissions",
        "Support farmers within 250 miles of your store",
        "Seasonal local produce has higher freshness and nutrition"
      ]
    },
    food_waste_reduction: {
      title: "Smart Shopping Waste Warrior",
      description: "Reduce food waste by using Walmart's meal planning and smaller package options",
      category: "Food Waste Prevention",
      difficulty: "Smart",
      target: 30,
      unit: "% waste reduction",
      reward: 400,
      trackingMethod: "Purchase pattern analysis and app-based meal planning usage",
      walmartBenefit: "Increases customer satisfaction and reduces markdown costs",
      aiTips: [
        "Use Walmart's meal planning feature in the app",
        "Buy 'ugly' produce at 30% discount to prevent waste",
        "Choose family-size vs individual packages for better value",
        "Walmart tracks your purchase patterns to suggest optimal quantities"
      ]
    },
    pickup_optimization: {
      title: "Pickup Planet Protector",
      description: "Choose curbside pickup for 8 out of 10 orders to reduce delivery emissions",
      category: "Carbon Reduction",
      difficulty: "Easy",
      target: 8,
      unit: "pickup orders",
      reward: 275,
      trackingMethod: "Order fulfillment method tracking in Walmart systems",
      walmartBenefit: "Reduces delivery costs and consolidates trips for efficiency",
      aiTips: [
        "Pickup has 60% lower carbon footprint than individual delivery",
        "Consolidate orders to maximize trip efficiency",
        "Walmart optimizes pickup routes for minimal environmental impact",
        "Pickup slots during off-peak hours reduce traffic congestion"
      ]
    }
  };

  const responses = Object.values(walmartTrackableChallenges);
  return responses[Math.floor(Math.random() * responses.length)];
};

// Community stats with Walmart-specific metrics
const walmartCommunityStats = {
  totalCustomers: 89432,
  sustainableProductsSold: 15847,
  plasticBagsSaved: 23891,
  localProductsPurchased: 8934
};

// Walmart-trackable active challenges
const activeWalmartChallenges = [
  {
    id: 1,
    title: 'Organic Walmart Week',
    description: 'Choose organic products for 70% of your grocery purchases at Walmart',
    progress: 75,
    target: 20,
    current: 15,
    unit: 'organic items',
    reward: 280,
    difficulty: 'Medium',
    category: 'Organic Shopping',
    timeLeft: '4 days',
    impactValue: 8.2,
    impactUnit: 'kg CO₂',
    participants: 4521,
    streak: 4,
    trackingMethod: 'Receipt analysis & UPC code tracking',
    walmartBenefit: 'Promotes Walmart\'s organic product line'
  },
  {
    id: 2,
    title: 'Walmart+ Eco Optimizer',
    description: 'Use Walmart+ benefits to reduce shopping trips and choose sustainable delivery options',
    progress: 60,
    target: 12,
    current: 7,
    unit: 'optimized trips',
    reward: 320,
    difficulty: 'Smart',
    category: 'Trip Optimization',
    timeLeft: '1 week',
    impactValue: 12.4,
    impactUnit: 'kg CO₂',
    participants: 2847,
    streak: 2,
    trackingMethod: 'Walmart+ app usage analytics and order consolidation tracking',
    walmartBenefit: 'Increases Walmart+ engagement and reduces operational costs'
  }
];

export default function ChallengesTab() {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [liveStats, setLiveStats] = useState(walmartCommunityStats);
  const [aiChallenges, setAiChallenges] = useState<any[]>([]);
  const [availableAiChallenges, setAvailableAiChallenges] = useState<any[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<any>(null);
  const [slideAnimation] = useState(new Animated.Value(-100));

  useEffect(() => {
    generateWalmartSmartChallenges();
    generateWalmartAvailableChallenges();
  }, []);

  // Simulate real-time Walmart stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        sustainableProductsSold: prev.sustainableProductsSold + Math.floor(Math.random() * 5),
        plasticBagsSaved: prev.plasticBagsSaved + Math.floor(Math.random() * 8),
        localProductsPurchased: prev.localProductsPurchased + Math.floor(Math.random() * 3)
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const generateWalmartSmartChallenges = async () => {
    setIsGeneratingAI(true);
    try {
      const challenge1 = await simulateWalmartAIAPI("customer purchase behavior analysis");
      const challenge2 = await simulateWalmartAIAPI("store traffic optimization");
      
      setAiChallenges([
        { id: 'walmart_ai_1', ...challenge1, aiGenerated: true },
        { id: 'walmart_ai_2', ...challenge2, aiGenerated: true, isTeamChallenge: true, currentParticipants: 1247, targetParticipants: 2000 }
      ]);
    } catch (error) {
      console.error('Walmart AI generation failed:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateWalmartAvailableChallenges = async () => {
    try {
      const challenge1 = await simulateWalmartAIAPI("digital engagement optimization");
      const challenge2 = await simulateWalmartAIAPI("local sourcing promotion");
      const challenge3 = await simulateWalmartAIAPI("food waste reduction");
      
      setAvailableAiChallenges([
        { id: 'walmart_available_1', ...challenge1, aiGenerated: true, duration: '2 weeks' },
        { id: 'walmart_available_2', ...challenge2, aiGenerated: true, duration: '3 weeks' },
        { id: 'walmart_available_3', ...challenge3, aiGenerated: true, duration: '1 month', trending: true }
      ]);
    } catch (error) {
      console.error('Walmart AI generation failed:', error);
    }
  };

  const showJoinNotification = (challenge: any) => {
    setNotificationData(challenge);
    setShowNotification(true);
    
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(4000),
      Animated.timing(slideAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowNotification(false);
    });
  };

  const joinChallenge = (challenge: any) => {
    showJoinNotification(challenge);
    setShowChallengeModal(false);
    console.log(`Joined Walmart trackable challenge: ${challenge.title}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      case 'Smart': return '#8B5CF6';
      case 'Community': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sustainable Shopping': return '🛒';
      case 'Packaging Reduction': return '♻️';
      case 'Digital Sustainability': return '📱';
      case 'Local Impact': return '🏘️';
      case 'Food Waste Prevention': return '🥗';
      case 'Carbon Reduction': return '🌍';
      case 'Organic Shopping': return '🌱';
      case 'Trip Optimization': return '🚗';
      default: return '🎯';
    }
  };

  const JoinNotification = () => {
    if (!showNotification || !notificationData) return null;

    return (
      <Animated.View 
        style={[
          styles.notificationContainer,
          {
            transform: [{ translateY: slideAnimation }]
          }
        ]}
      >
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationIcon}>🎉</Text>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Walmart Challenge Joined!</Text>
              <Text style={styles.notificationMessage}>
                "{notificationData.title}" - Walmart will track your progress automatically
              </Text>
            </View>
            <View style={styles.notificationReward}>
              <Text style={styles.notificationRewardText}>+{notificationData.reward}</Text>
              <Text style={styles.notificationRewardLabel}>pts potential</Text>
            </View>
          </View>
          <View style={styles.notificationFooter}>
            <Text style={styles.notificationFooterText}>
              🛒 Your purchases at Walmart will automatically count towards this challenge!
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const WalmartStatsCard = () => (
    <View style={styles.liveStatsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.liveStatsTitle}>Live Walmart Sustainability</Text>
        <View style={styles.walmartBadge}>
          <Text style={styles.walmartBadgeText}>Walmart Tracked</Text>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{liveStats.sustainableProductsSold.toLocaleString()}</Text>
          <Text style={styles.statLabel}>sustainable products sold today</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{liveStats.plasticBagsSaved.toLocaleString()}</Text>
          <Text style={styles.statLabel}>plastic bags saved today</Text>
        </View>
      </View>
      <View style={styles.liveDot}>
        <View style={styles.pulseDot} />
        <Text style={styles.liveText}>Real-time Walmart data</Text>
      </View>
    </View>
  );

  const WalmartSmartCard = ({ challenge }: { challenge: any }) => (
    <TouchableOpacity 
      style={styles.smartCard}
      onPress={() => {
        setSelectedChallenge(challenge);
        setShowChallengeModal(true);
      }}
    >
      <View style={styles.smartCardHeader}>
        <Text style={styles.smartCardIcon}>{getCategoryIcon(challenge.category)}</Text>
        <View style={styles.smartBadge}>
          <Text style={styles.smartBadgeText}>AI + 🛒</Text>
        </View>
      </View>
      <Text style={styles.smartCardTitle}>{challenge.title}</Text>
      <Text style={styles.smartCardDesc}>{challenge.description}</Text>
      
      {/* Walmart Tracking Info */}
      <View style={styles.trackingInfo}>
        <Text style={styles.trackingLabel}>📊 Tracking:</Text>
        <Text style={styles.trackingMethod}>{challenge.trackingMethod}</Text>
      </View>
      
      <View style={styles.smartCardFooter}>
        <Text style={styles.smartReward}>🏆 {challenge.reward} pts</Text>
        <Text style={styles.walmartBenefit}>🛒 Auto-tracked</Text>
      </View>
      
      {challenge.isTeamChallenge && (
        <View style={styles.teamProgress}>
          <Text style={styles.teamProgressText}>
            {challenge.currentParticipants}/{challenge.targetParticipants} Walmart customers joined
          </Text>
          <View style={styles.teamProgressBar}>
            <View 
              style={[
                styles.teamProgressFill, 
                { width: `${(challenge.currentParticipants / challenge.targetParticipants) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const WalmartChallengeCard = ({ challenge, isAvailable = false }: { challenge: any, isAvailable?: boolean }) => (
    <TouchableOpacity 
      style={[styles.challengeCard, challenge.trending && styles.trendingCard]}
      onPress={() => {
        setSelectedChallenge(challenge);
        setShowChallengeModal(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardIcon}>{getCategoryIcon(challenge.category)}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{challenge.title}</Text>
            <Text style={styles.cardCategory}>{challenge.category}</Text>
          </View>
        </View>
        <View style={styles.cardBadges}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(challenge.difficulty) }]}>
              {challenge.difficulty}
            </Text>
          </View>
          <View style={styles.walmartTrackingBadge}>
            <Text style={styles.walmartTrackingText}>🛒 Tracked</Text>
          </View>
          {challenge.streak && !isAvailable && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {challenge.streak}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.cardDescription}>{challenge.description}</Text>

      {/* Walmart Benefit */}
      <View style={styles.walmartBenefitBox}>
        <Text style={styles.walmartBenefitLabel}>🛒 Walmart Benefit:</Text>
        <Text style={styles.walmartBenefitText}>{challenge.walmartBenefit}</Text>
      </View>

      {!isAvailable ? (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {challenge.current} / {challenge.target} {challenge.unit}
            </Text>
            <Text style={styles.progressPercentage}>{challenge.progress}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${challenge.progress}%` }
              ]} 
            />
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.impactInfo}>
              <Text style={styles.impactText}>
                💚 {challenge.impactValue} {challenge.impactUnit} saved
              </Text>
              <Text style={styles.participantsText}>
                👥 {challenge.participants.toLocaleString()} customers participating
              </Text>
            </View>
            <View style={styles.rewardInfo}>
              <Text style={styles.timeLeft}>⏰ {challenge.timeLeft}</Text>
              <Text style={styles.rewardText}>🏆 {challenge.reward} pts</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.availableChallengeFooter}>
          <View style={styles.challengeDetails}>
            <Text style={styles.challengeTarget}>
              Target: {challenge.target} {challenge.unit}
            </Text>
            <Text style={styles.challengeDuration}>
              ⏱️ Duration: {challenge.duration}
            </Text>
          </View>
          <Text style={styles.rewardText}>🏆 {challenge.reward} pts</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const WalmartChallengeModal = () => (
    <Modal visible={showChallengeModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowChallengeModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Walmart Challenge</Text>
          <TouchableOpacity>
            <Text style={styles.shareButton}>Share</Text>
          </TouchableOpacity>
        </View>

        {selectedChallenge && (
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalChallengeHeader}>
              <Text style={styles.modalChallengeIcon}>
                {getCategoryIcon(selectedChallenge.category)}
              </Text>
              <Text style={styles.modalChallengeTitle}>{selectedChallenge.title}</Text>
              <View style={styles.modalBadgesRow}>
                <View style={[
                  styles.modalDifficultyBadge, 
                  { backgroundColor: getDifficultyColor(selectedChallenge.difficulty) }
                ]}>
                  <Text style={styles.modalDifficultyText}>{selectedChallenge.difficulty}</Text>
                </View>
                <View style={styles.modalWalmartBadge}>
                  <Text style={styles.modalWalmartBadgeText}>🛒 Walmart Tracked</Text>
                </View>
              </View>
            </View>

            <Text style={styles.modalDescription}>{selectedChallenge.description}</Text>

            {/* Walmart Tracking Explanation */}
            <View style={styles.trackingSection}>
              <Text style={styles.sectionTitle}>How Walmart Tracks This</Text>
              <View style={styles.trackingCard}>
                <Text style={styles.trackingExplanation}>{selectedChallenge.trackingMethod}</Text>
                <Text style={styles.trackingBenefit}>
                  <Text style={styles.trackingBenefitLabel}>Business Impact: </Text>
                  {selectedChallenge.walmartBenefit}
                </Text>
              </View>
            </View>

            {/* AI Tips Section */}
            {selectedChallenge.aiTips && (
              <View style={styles.aiTipsSection}>
                <Text style={styles.sectionTitle}>AI-Powered Tips</Text>
                <View style={styles.aiTipsContainer}>
                  {selectedChallenge.aiTips.map((tip: string, index: number) => (
                    <View key={index} style={styles.aiTipItem}>
                      <Text style={styles.aiTipBullet}>💡</Text>
                      <Text style={styles.aiTipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Impact Section */}
            {selectedChallenge.impactValue && (
              <View style={styles.impactSection}>
                <Text style={styles.sectionTitle}>🌍 Environmental Impact</Text>
                <View style={styles.impactCard}>
                  <Text style={styles.impactNumber}>{selectedChallenge.impactValue}</Text>
                  <Text style={styles.impactUnit}>{selectedChallenge.impactUnit}</Text>
                  <Text style={styles.impactLabel}>You'll help save</Text>
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => joinChallenge(selectedChallenge)}
            >
              <Text style={styles.actionButtonText}>
                {selectedChallenge.progress !== undefined ? 'Continue Walmart Challenge' : 'Join Walmart Challenge'}
              </Text>
            </TouchableOpacity>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>
                🛒 This challenge will automatically track your Walmart purchases and activities. 
                Progress updates in real-time through your Walmart account.
              </Text>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GreenMind Sustainability Challenges</Text>
        <Text style={styles.headerSubtitle}>AI-powered • Automatically tracked • Real impact</Text>
      </View>

      <JoinNotification />

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <WalmartStatsCard />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>GreenMind Challenges</Text>
            <TouchableOpacity onPress={generateWalmartSmartChallenges} disabled={isGeneratingAI}>
              <Text style={styles.regenerateButton}>
                {isGeneratingAI ? 'Generating...' : '⚡ New Challenges'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Personalized challenges based on your Walmart shopping data</Text>
          
          {isGeneratingAI ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>GreenMind analyzing your Walmart shopping patterns...</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {aiChallenges.map(challenge => (
                <WalmartSmartCard key={challenge.id} challenge={challenge} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              My Challenges ({activeWalmartChallenges.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.tabActive]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>
              Available ({availableAiChallenges.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.challengesList}>
          {activeTab === 'active' ? (
            activeWalmartChallenges.map(challenge => (
              <WalmartChallengeCard key={challenge.id} challenge={challenge} isAvailable={false} />
            ))
          ) : (
            availableAiChallenges.map(challenge => (
              <WalmartChallengeCard key={challenge.id} challenge={challenge} isAvailable={true} />
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <WalmartChallengeModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0071CE', // Walmart blue
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
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0071CE',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationReward: {
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  notificationRewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0071CE',
  },
  notificationRewardLabel: {
    fontSize: 10,
    color: '#0071CE',
  },
  notificationFooter: {
    marginTop: 8,
  },
  notificationFooterText: {
    fontSize: 12,
    color: '#0071CE',
    fontStyle: 'italic',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  liveStatsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  walmartBadge: {
    backgroundColor: '#0071CE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  walmartBadgeText: {
    color: 'white',
    fontSize: 7,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0071CE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  regenerateButton: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F0FF',
    borderRadius: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  smartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: screenWidth * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  smartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  smartCardIcon: {
    fontSize: 24,
  },
  smartBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  smartCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  smartCardDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  trackingInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  trackingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 2,
  },
  trackingMethod: {
    fontSize: 11,
    color: '#0369A1',
    lineHeight: 16,
  },
  smartCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smartReward: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  walmartBenefit: {
    fontSize: 10,
    color: '#0071CE',
    fontWeight: '500',
  },
  teamProgress: {
    marginTop: 12,
  },
  teamProgressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  teamProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  teamProgressFill: {
    height: '100%',
    backgroundColor: '#0071CE',
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#0071CE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: 'white',
  },
  challengesList: {
    gap: 16,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendingCard: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  walmartTrackingBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  walmartTrackingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0071CE',
  },
  streakBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  streakText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  cardDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  walmartBenefitBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0071CE',
  },
  walmartBenefitLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  walmartBenefitText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0071CE',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0071CE',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  impactInfo: {
    flex: 1,
  },
  impactText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 4,
  },
  participantsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  rewardInfo: {
    alignItems: 'flex-end',
  },
  timeLeft: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  availableChallengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  challengeDetails: {
    flex: 1,
  },
  challengeTarget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  challengeDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  shareButton: {
    fontSize: 14,
    color: '#0071CE',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalChallengeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalChallengeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalChallengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalBadgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalDifficultyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalDifficultyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalWalmartBadge: {
    backgroundColor: '#0071CE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalWalmartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  trackingSection: {
    marginBottom: 24,
  },
  trackingCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0071CE',
  },
  trackingExplanation: {
    fontSize: 14,
    color: '#0369A1',
    marginBottom: 8,
    lineHeight: 20,
  },
  trackingBenefit: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  trackingBenefitLabel: {
    fontWeight: '600',
  },
  aiTipsSection: {
    marginBottom: 24,
  },
  aiTipsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  aiTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  aiTipBullet: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  aiTipText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  impactSection: {
    marginBottom: 24,
  },
  impactCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  impactNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  impactUnit: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 8,
  },
  impactLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButton: {
    backgroundColor: '#0071CE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimerBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
  },
});