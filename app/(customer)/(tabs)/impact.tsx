// app/(customer)/(tabs)/impact.tsx
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Timeframe = 'week' | 'month' | 'year';

export default function ImpactTab() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('month');
  const [showShareModal, setShowShareModal] = useState(false);

  const impactData = {
    week: {
      co2Saved: 12.3,
      mealsDonated: 2,
      moneySaved: 34.50,
      points: 87,
      treesEquivalent: 0.2,
      milesNotDriven: 28.5
    },
    month: {
      co2Saved: 156.3,
      mealsDonated: 12,
      moneySaved: 234.50,
      points: 847,
      treesEquivalent: 2.1,
      milesNotDriven: 362.4
    },
    year: {
      co2Saved: 1247.8,
      mealsDonated: 89,
      moneySaved: 1856.75,
      points: 6234,
      treesEquivalent: 18.7,
      milesNotDriven: 2891.2
    }
  };

  const currentData = impactData[selectedTimeframe];

  const achievements = [
    { id: 1, title: 'Carbon Saver', description: 'Saved 100+ kg CO₂', icon: '🌱', unlocked: true },
    { id: 2, title: 'Waste Warrior', description: 'Prevented 50+ items from waste', icon: '♻️', unlocked: true },
    { id: 3, title: 'Community Helper', description: 'Donated 10+ meals', icon: '🤝', unlocked: true },
    { id: 4, title: 'Green Shopper', description: 'Made 100+ eco-friendly swaps', icon: '🛒', unlocked: false },
    { id: 5, title: 'Planet Protector', description: 'Reached 5000+ points', icon: '🌍', unlocked: false },
    { id: 6, title: 'Sustainability Master', description: 'Saved 1000+ kg CO₂', icon: '🏆', unlocked: false }
  ];

  const monthlyProgress = [
    { month: 'Jan', co2: 89.2, meals: 6 },
    { month: 'Feb', co2: 112.5, meals: 8 },
    { month: 'Mar', co2: 134.7, meals: 11 },
    { month: 'Apr', co2: 145.3, meals: 9 },
    { month: 'May', co2: 167.8, meals: 13 },
    { month: 'Jun', co2: 156.3, meals: 12 }
  ];

  const shareImpact = () => {
    Alert.alert(
      'Share Your Impact',
      `I've saved ${currentData.co2Saved} kg of CO₂ this ${selectedTimeframe} with EcoCart! 🌱`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Shared!', 'Your impact has been shared!') }
      ]
    );
  };

  type ImpactCardProps = {
    icon: string;
    title: string;
    value: string;
    subtitle?: string;
    color: string;
  };

  const ImpactCard: React.FC<ImpactCardProps> = ({ icon, title, value, subtitle, color }) => (
    <View style={styles.impactCard}>
      <Text style={[styles.impactIcon, { color }]}>{icon}</Text>
      <Text style={[styles.impactValue, { color }]}>{value}</Text>
      <Text style={styles.impactTitle}>{title}</Text>
      {subtitle && <Text style={styles.impactSubtitle}>{subtitle}</Text>}
    </View>
  );

  type ProgressChartData = { month: string; co2: number; meals: number };

  const ProgressChart: React.FC<{ data: ProgressChartData[] }> = ({ data }) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Monthly CO₂ Savings</Text>
      <View style={styles.chartBars}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartBar}>
            <View 
              style={[
                styles.chartBarFill, 
                { 
                  height: `${(item.co2 / 200) * 100}%`,
                  backgroundColor: index === data.length - 1 ? '#059669' : '#BBF7D0'
                }
              ]} 
            />
            <Text style={styles.chartBarLabel}>{item.month}</Text>
            <Text style={styles.chartBarValue}>{item.co2}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 Environmental Impact</Text>
        <Text style={styles.headerSubtitle}>See the positive change you're making</Text>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeSelector}>
        {['week', 'month', 'year'].map(timeframe => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe && styles.timeframeButtonActive
            ]}
            onPress={() => setSelectedTimeframe(timeframe as Timeframe)}
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

      <ScrollView style={styles.content}>
        {/* Main Impact Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact This {selectedTimeframe}</Text>
          <View style={styles.impactGrid}>
            <ImpactCard
              icon="🌱"
              title="CO₂ Saved"
              value={`${currentData.co2Saved} kg`}
              subtitle="Carbon footprint reduced"
              color="#059669"
            />
            <ImpactCard
              icon="🥗"
              title="Meals Donated"
              value={currentData.mealsDonated.toString()}
              subtitle="To local food banks"
              color="#F59E0B"
            />
            <ImpactCard
              icon="💰"
              title="Money Saved"
              value={`$${currentData.moneySaved}`}
              subtitle="Through rescue deals"
              color="#2563EB"
            />
            <ImpactCard
              icon="⭐"
              title="Points Earned"
              value={currentData.points.toString()}
              subtitle="Eco points collected"
              color="#7C3AED"
            />
          </View>
        </View>

        {/* Environmental Equivalents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Equivalents</Text>
          <View style={styles.equivalentsCard}>
            <View style={styles.equivalentItem}>
              <Text style={styles.equivalentIcon}>🌳</Text>
              <View style={styles.equivalentInfo}>
                <Text style={styles.equivalentValue}>{currentData.treesEquivalent} trees</Text>
                <Text style={styles.equivalentLabel}>planted equivalent</Text>
              </View>
            </View>
            <View style={styles.equivalentItem}>
              <Text style={styles.equivalentIcon}>🚗</Text>
              <View style={styles.equivalentInfo}>
                <Text style={styles.equivalentValue}>{currentData.milesNotDriven} miles</Text>
                <Text style={styles.equivalentLabel}>not driven</Text>
              </View>
            </View>
            <View style={styles.equivalentItem}>
              <Text style={styles.equivalentIcon}>💡</Text>
              <View style={styles.equivalentInfo}>
                <Text style={styles.equivalentValue}>{Math.round(currentData.co2Saved * 2.2)} hours</Text>
                <Text style={styles.equivalentLabel}>of LED bulb energy saved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Chart */}
        <View style={styles.section}>
          <ProgressChart data={monthlyProgress} />
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked
                ]}
              >
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.achievementIconLocked
                ]}>
                  {achievement.icon}
                </Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTextLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementTextLocked
                ]}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>✓ Unlocked</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Impact Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Impact</Text>
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Your rank among all users</Text>
              <Text style={styles.comparisonValue}>Top 15%</Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Total community CO₂ saved</Text>
              <Text style={styles.comparisonValue}>2,847 kg</Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Your contribution</Text>
              <Text style={styles.comparisonValue}>5.5%</Text>
            </View>
          </View>
        </View>

        {/* Share Impact */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.shareButton} onPress={shareImpact}>
            <Text style={styles.shareButtonText}>📱 Share Your Impact</Text>
          </TouchableOpacity>
          <Text style={styles.shareSubtext}>
            Inspire friends and family to join the sustainability movement
          </Text>
        </View>

        {/* Future Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Goals</Text>
          <View style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <View style={styles.goalIcon}>
                <Text style={styles.goalIconText}>🎯</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Save 200kg CO₂ this month</Text>
                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressTrack}>
                    <View style={[styles.goalProgressFill, { width: '78%' }]} />
                  </View>
                  <Text style={styles.goalProgressText}>78% complete</Text>
                </View>
              </View>
            </View>
            <View style={styles.goalItem}>
              <View style={styles.goalIcon}>
                <Text style={styles.goalIconText}>🏆</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Reach Climate Champion level</Text>
                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressTrack}>
                    <View style={[styles.goalProgressFill, { width: '45%' }]} />
                  </View>
                  <Text style={styles.goalProgressText}>45% complete</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#059669',
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
  timeframeSelector: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  timeframeButtonActive: {
    backgroundColor: '#F0FDF4',
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  timeframeButtonTextActive: {
    color: '#059669',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
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
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  impactIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  impactValue: {
    fontSize: 24,
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
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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
  },
  equivalentLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  chartBarFill: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  chartBarValue: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
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
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementTextLocked: {
    opacity: 0.7,
  },
  unlockedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unlockedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  comparisonItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  comparisonDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  shareButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shareSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
    marginBottom: 16,
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
    fontWeight: '500',
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
});