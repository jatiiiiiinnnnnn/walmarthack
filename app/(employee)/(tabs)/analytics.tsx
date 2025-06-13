// analytics.tsx - Real-time Analytics Dashboard connected to Dashboard Actions
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppData } from '../../contexts/AppDataContext';

type Timeframe = 'week' | 'month' | 'quarter' | 'year';

export default function AnalyticsTab() {
  const { 
    getAnalyticsData, 
    dashboardData, 
    todaysStats, 
    activities,
    rescueDeals // Get the actual rescue deals array
  } = useAppData();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('month');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [realTimeStats, setRealTimeStats] = useState({
    dealsCreatedToday: 0,
    totalRevenue: 0,
    totalWasteSaved: 0,
    totalCO2Saved: 0,
    categoryBreakdown: [] as any[]
  });

  // Animation values for real-time updates
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Pulse animation for LIVE badge
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Calculate real-time statistics based on actual data
  useEffect(() => {
    calculateRealTimeStats();
  }, [dashboardData, rescueDeals, activities]);

  const calculateRealTimeStats = () => {
    // Calculate today's deals
    const today = new Date().toISOString().split('T')[0];
    const todaysDeals = rescueDeals?.filter(deal => 
      new Date(deal.createdAt || Date.now()).toISOString().split('T')[0] === today
    ) || [];

    // Calculate category breakdown from actual rescue deals
    const categoryStats = rescueDeals?.reduce((acc: any, deal) => {
      const category = deal.category || 'Other';
      if (!acc[category]) {
        acc[category] = { count: 0, revenue: 0, waste: 0 };
      }
      acc[category].count += 1;
      acc[category].revenue += (deal.originalPrice || 0) * (deal.discount || 0) / 100;
      acc[category].waste += parseFloat(
        (typeof deal.quantity === 'number'
          ? deal.quantity.toString()
          : (deal.quantity ?? '')
        ).replace(/[^\d.]/g, '') || '0'
      );
      return acc;
    }, {}) || {};

    const categoryBreakdown = Object.entries(categoryStats).map(([name, stats]: [string, any]) => ({
      name,
      deals: stats.count,
      percentage: rescueDeals?.length ? Math.round((stats.count / rescueDeals.length) * 100) : 0,
      revenue: stats.revenue,
      wasteSaved: stats.waste
    })).sort((a, b) => b.deals - a.deals);

    // Calculate totals
    const totalRevenue = rescueDeals?.reduce((sum, deal) => 
      sum + ((deal.originalPrice || 0) * (deal.discount || 0) / 100), 0
    ) || 0;

    const totalWasteSaved = rescueDeals?.reduce((sum, deal) => {
      if (typeof deal.quantity === 'number') {
        return sum + deal.quantity;
      } else if (typeof deal.quantity === 'string') {
        return sum + parseFloat(deal.quantity.replace(/[^\d.]/g, '') || '0');
      }
      return sum;
    }, 0) || 0;

    setRealTimeStats({
      dealsCreatedToday: todaysDeals.length,
      totalRevenue: Math.round(totalRevenue),
      totalWasteSaved: Math.round(totalWasteSaved),
      totalCO2Saved: Math.round(totalWasteSaved * 2.5), // Approximate CO2 calculation
      categoryBreakdown
    });

    // Trigger update animation
    if (Date.now() - lastUpdateTime > 1000) { // Prevent too frequent animations
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setLastUpdateTime(Date.now());
    }
  };

  // Get enhanced analytics data with real calculations
  const getEnhancedAnalyticsData = (timeframe: Timeframe) => {
    const currentData = getAnalyticsData(timeframe);
    
    // Override with real-time data
    return {
      ...currentData,
      rescueDeals: {
        created: rescueDeals?.length || 0,
        sold: rescueDeals?.filter(deal => deal.status === 'sold').length || 0,
        donated: rescueDeals?.filter(deal => deal.status === 'donated').length || 0,
      },
      wasteReduction: {
        percentage: Math.min(Math.round((realTimeStats.totalWasteSaved / 1000) * 100), 100),
        totalKg: realTimeStats.totalWasteSaved,
        co2Saved: realTimeStats.totalCO2Saved,
      },
      revenue: {
        rescueDeals: realTimeStats.totalRevenue,
        totalSavings: Math.round(realTimeStats.totalRevenue * 1.3), // Customer savings
        avgDiscount: rescueDeals?.length > 0 
          ? Math.round(rescueDeals.reduce((sum, deal) => sum + (deal.discount || 0), 0) / rescueDeals.length)
          : 0
      },
      topCategories: realTimeStats.categoryBreakdown.slice(0, 4),
      customerEngagement: {
        ...currentData.customerEngagement,
        challengeParticipation: Math.min(70 + (rescueDeals?.length || 0) * 2, 95)
      }
    };
  };

  const currentData = getEnhancedAnalyticsData(selectedTimeframe);

  const timeframes = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' }
  ];

  type MetricCardProps = {
    title: string;
    value: string;
    subtitle?: string;
    trend?: number;
    color: string;
    isUpdated?: boolean;
    onPress?: () => void;
  };

  const MetricCard: React.FC<MetricCardProps> = ({ 
    title, value, subtitle, trend, color, isUpdated, onPress 
  }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity 
        style={[
          styles.metricCard,
          isUpdated && styles.metricCardUpdated
        ]} 
        onPress={onPress}
      >
        <View style={styles.metricHeader}>
          <Text style={styles.metricTitle}>{title}</Text>
          {trend !== undefined && (
            <View style={[
              styles.trendIndicator, 
              { backgroundColor: trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280' }
            ]}>
              <Text style={styles.trendText}>
                {trend > 0 ? '+' : ''}{trend}%
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
        
      </TouchableOpacity>
    </Animated.View>
  );

  const CategoryChart: React.FC<{ categories: any[] }> = ({ categories }) => (
    <Animated.View style={[styles.categoryChart, { opacity: fadeAnim }]}>
      <Text style={styles.chartTitle}>Rescue Deals by Category (Real-time)</Text>
      <View style={styles.chartContainer}>
        {categories.length > 0 ? categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDeals}>{category.deals} deals</Text>
              <Text style={styles.categoryRevenue}>${category.revenue?.toFixed(0) || 0}</Text>
            </View>
            <View style={styles.categoryBarContainer}>
              <View 
                style={[
                  styles.categoryBar, 
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: ['#059669', '#2563EB', '#F59E0B', '#EF4444'][index % 4]
                  }
                ]} 
              />
            </View>
            <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
          </View>
        )) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No deals created yet</Text>
            <Text style={styles.noDataSubtext}>Start creating rescue deals to see analytics</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const showMetricDetails = (metric: any) => {
    setSelectedMetric(metric);
    setShowDetailsModal(true);
  };

  const calculateTrend = (current: number, base: number = 50): number => {
    return Math.round(((current - base) / base) * 100);
  };

  // Real-time status indicator
  const RealTimeIndicator = () => (
    <View style={styles.realTimeIndicator}>
      <View style={styles.realTimeDot} />
      <Text style={styles.realTimeText}>Live Data</Text>
      <Text style={styles.lastUpdated}>
        Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const MetricDetailsModal = () => (
    <Modal visible={showDetailsModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Metric Details</Text>
          <View />
        </View>
        
        {selectedMetric && (
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalMetricTitle}>{selectedMetric.title}</Text>
            <Text style={styles.modalMetricValue}>{selectedMetric.value}</Text>
            
            <View style={styles.modalDetailsSection}>
              <Text style={styles.modalSectionTitle}>Real-time Breakdown</Text>
              {selectedMetric.details && selectedMetric.details.map(
                (detail: { label: string; value: string | number }, index: number) => (
                  <View key={index} style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailLabel}>{detail.label}</Text>
                    <Text style={styles.modalDetailValue}>{detail.value}</Text>
                  </View>
                )
              )}
            </View>
            
            <View style={styles.modalInsightsSection}>
              <Text style={styles.modalSectionTitle}>Smart Insights</Text>
              <Text style={styles.modalInsightText}>
                {selectedMetric.insights || 'Real-time insights based on your current performance.'}
              </Text>
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Analytics Dashboard</Text>
            <Text style={styles.headerSubtitle}>Real-time performance tracking</Text>
          </View>
          <RealTimeIndicator />
        </View>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timeframeButtons}>
            {timeframes.map(timeframe => (
              <TouchableOpacity
                key={timeframe.id}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe.id && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe.id as Timeframe)}
              >
                <Text style={[
                  styles.timeframeButtonText,
                  selectedTimeframe === timeframe.id && styles.timeframeButtonTextActive
                ]}>
                  {timeframe.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={styles.selectedPeriod}>{currentData.period}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Real-time Summary Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Live Performance Metrics</Text>
          <View style={styles.kpiGrid}>
            <MetricCard
              title="Rescue Deals"
              value={currentData.rescueDeals.created.toString()}
              subtitle={`${currentData.rescueDeals.sold} sold • ${currentData.rescueDeals.donated} donated`}
              trend={calculateTrend(currentData.rescueDeals.created, 20)}
              color="#059669"
              isUpdated={realTimeStats.dealsCreatedToday > 0}
              onPress={() => showMetricDetails({
                title: 'Rescue Deals Performance',
                value: `${currentData.rescueDeals.created} total deals`,
                details: [
                  { label: 'Total Created', value: currentData.rescueDeals.created },
                  { label: 'Successfully Sold', value: currentData.rescueDeals.sold },
                  { label: 'Donated to Community', value: currentData.rescueDeals.donated },
                  { label: 'Created Today', value: realTimeStats.dealsCreatedToday },
                  { label: 'Success Rate', value: currentData.rescueDeals.created > 0 ? `${Math.round(((currentData.rescueDeals.sold + currentData.rescueDeals.donated) / currentData.rescueDeals.created) * 100)}%` : '0%' }
                ],
                insights: currentData.rescueDeals.created > 0 
                  ? `Outstanding performance! You've created ${currentData.rescueDeals.created} rescue deals with ${realTimeStats.dealsCreatedToday} deals created today. Your success rate shows strong customer engagement.`
                  : 'Ready to make an impact? Create your first rescue deal to start tracking performance and helping the environment.'
              })}
            />
            
            <MetricCard
              title="Environmental Impact"
              value={`${currentData.wasteReduction.co2Saved}kg`}
              subtitle={`${currentData.wasteReduction.totalKg}kg waste prevented`}
              trend={currentData.wasteReduction.co2Saved > 50 ? 25 : currentData.wasteReduction.co2Saved > 20 ? 15 : 0}
              color="#2563EB"
              isUpdated={realTimeStats.totalCO2Saved > 0}
              onPress={() => showMetricDetails({
                title: 'Environmental Impact',
                value: `${currentData.wasteReduction.co2Saved}kg CO₂ Saved`,
                details: [
                  { label: 'Total CO₂ Prevented', value: `${currentData.wasteReduction.co2Saved}kg` },
                  { label: 'Waste Diverted', value: `${currentData.wasteReduction.totalKg}kg` },
                  { label: 'Waste Reduction Rate', value: `${currentData.wasteReduction.percentage}%` },
                  { label: 'Items Rescued', value: currentData.rescueDeals.created },
                  { label: 'Equivalent Trees Planted', value: Math.round(currentData.wasteReduction.co2Saved / 22) }
                ],
                insights: currentData.wasteReduction.co2Saved > 0
                  ? `Incredible environmental impact! Your efforts have saved ${currentData.wasteReduction.co2Saved}kg of CO₂ - equivalent to planting ${Math.round(currentData.wasteReduction.co2Saved / 22)} trees. Every rescue deal makes a difference!`
                  : 'Your environmental journey starts here. Each rescue deal you create helps reduce waste and CO₂ emissions.'
              })}
            />
            
            <MetricCard
              title="Revenue Generated"
              value={`$${currentData.revenue.rescueDeals.toLocaleString()}`}
              subtitle={`$${currentData.revenue.totalSavings.toLocaleString()} customer savings`}
              trend={calculateTrend(currentData.revenue.rescueDeals, 3000)}
              color="#F59E0B"
              isUpdated={realTimeStats.totalRevenue > 0}
              onPress={() => showMetricDetails({
                title: 'Revenue Impact',
                value: `$${currentData.revenue.rescueDeals.toLocaleString()} generated`,
                details: [
                  { label: 'Total Revenue', value: `$${currentData.revenue.rescueDeals.toLocaleString()}` },
                  { label: 'Customer Savings', value: `$${currentData.revenue.totalSavings.toLocaleString()}` },
                  { label: 'Average Discount', value: `${currentData.revenue.avgDiscount}%` },
                  { label: 'Items Sold', value: currentData.rescueDeals.sold },
                  { label: 'Revenue per Deal', value: currentData.rescueDeals.created > 0 ? `$${Math.round(currentData.revenue.rescueDeals / currentData.rescueDeals.created)}` : '$0' }
                ],
                insights: currentData.revenue.rescueDeals > 0
                  ? `Excellent revenue performance! You've generated $${currentData.revenue.rescueDeals.toLocaleString()} while saving customers $${currentData.revenue.totalSavings.toLocaleString()}. This shows great balance between profitability and value.`
                  : 'Revenue tracking ready. Start creating rescue deals to generate revenue while helping customers save money.'
              })}
            />
            
            <MetricCard
              title="Customer Engagement"
              value={`${currentData.customerEngagement.challengeParticipation}%`}
              subtitle={`${currentData.customerEngagement.activeUsers.toLocaleString()} active users`}
              trend={8}
              color="#7C3AED"
              isUpdated={currentData.customerEngagement.challengeParticipation > 70}
              onPress={() => showMetricDetails({
                title: 'Customer Engagement',
                value: `${currentData.customerEngagement.challengeParticipation}% participation`,
                details: [
                  { label: 'Active Users', value: currentData.customerEngagement.activeUsers.toLocaleString() },
                  { label: 'Challenge Participation', value: `${currentData.customerEngagement.challengeParticipation}%` },
                  { label: 'New Signups', value: currentData.customerEngagement.newSignups },
                  { label: 'Deals per Customer', value: currentData.customerEngagement.activeUsers > 0 ? (currentData.rescueDeals.sold / currentData.customerEngagement.activeUsers * 100).toFixed(1) : '0' },
                  { label: 'Engagement Score', value: 'High' }
                ],
                insights: `Great customer engagement with ${currentData.customerEngagement.challengeParticipation}% participation rate! Your rescue deals are driving strong customer interaction. Keep creating variety to maintain engagement.`
              })}
            />
          </View>
        </View>

        {/* Today's Live Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Today's Live Performance</Text>
          <Animated.View style={[styles.livePerformanceContainer, { opacity: fadeAnim }]}>
            {/* Live Header with Pulse Animation */}
            <View style={styles.liveHeader}>
              <View style={styles.liveHeaderLeft}>
                <Text style={styles.liveHeaderTitle}>Real-time Impact</Text>
                <Text style={styles.liveHeaderSubtitle}>Updates automatically as you create deals</Text>
              </View>
              <View style={styles.liveStatusBadge}>
                <Animated.View style={[styles.pulseDot, { 
                  transform: [{ scale: pulseAnim }] 
                }]} />
                <Text style={styles.liveStatusText}>LIVE</Text>
              </View>
            </View>

            {/* Main Featured Metric */}
            <View style={styles.featuredMetricCard}>
              <View style={styles.featuredMetricHeader}>
                <View style={styles.featuredMetricIcon}>
                  <Text style={styles.featuredMetricEmoji}>🏪</Text>
                </View>
                <View style={styles.featuredMetricContent}>
                  <Text style={styles.featuredMetricValue}>{realTimeStats.dealsCreatedToday}</Text>
                  <Text style={styles.featuredMetricLabel}>Deals Created Today</Text>
                </View>
                <View style={styles.featuredMetricTrend}>
                  <Text style={styles.trendArrow}>↗️</Text>
                  <Text style={styles.trendPercentage}>+{realTimeStats.dealsCreatedToday * 25}%</Text>
                </View>
              </View>
              <View style={styles.featuredMetricFooter}>
                <Text style={styles.featuredMetricFooterText}>
                  {realTimeStats.dealsCreatedToday > 0 
                    ? `Great job! You've created ${realTimeStats.dealsCreatedToday} deal${realTimeStats.dealsCreatedToday > 1 ? 's' : ''} today`
                    : 'Create your first deal today to start tracking progress'
                  }
                </Text>
              </View>
            </View>

            {/* Secondary Metrics Grid */}
            <View style={styles.secondaryMetricsGrid}>
              <View style={[styles.secondaryMetricCard, { backgroundColor: '#FEF3C7' }]}>
                <View style={styles.secondaryMetricHeader}>
                  <Text style={styles.secondaryMetricIcon}>💰</Text>
                  <View style={styles.secondaryMetricBadge}>
                    <Text style={styles.secondaryMetricBadgeText}>Revenue</Text>
                  </View>
                </View>
                <Text style={[styles.secondaryMetricValue, { color: '#D97706' }]}>
                  ${realTimeStats.totalRevenue}
                </Text>
                <Text style={styles.secondaryMetricLabel}>Total Generated</Text>
                <View style={styles.secondaryMetricProgress}>
                  <View style={[styles.secondaryMetricProgressBar, { 
                    width: `${Math.min((realTimeStats.totalRevenue / 5000) * 100, 100)}%`,
                    backgroundColor: '#F59E0B'
                  }]} />
                </View>
              </View>

              <View style={[styles.secondaryMetricCard, { backgroundColor: '#DCFCE7' }]}>
                <View style={styles.secondaryMetricHeader}>
                  <Text style={styles.secondaryMetricIcon}>♻️</Text>
                  <View style={styles.secondaryMetricBadge}>
                    <Text style={styles.secondaryMetricBadgeText}>Waste</Text>
                  </View>
                </View>
                <Text style={[styles.secondaryMetricValue, { color: '#15803D' }]}>
                  {realTimeStats.totalWasteSaved}kg
                </Text>
                <Text style={styles.secondaryMetricLabel}>Prevented</Text>
                <View style={styles.secondaryMetricProgress}>
                  <View style={[styles.secondaryMetricProgressBar, { 
                    width: `${Math.min((realTimeStats.totalWasteSaved / 500) * 100, 100)}%`,
                    backgroundColor: '#10B981'
                  }]} />
                </View>
              </View>

              <View style={[styles.secondaryMetricCard, { backgroundColor: '#DBEAFE' }]}>
                <View style={styles.secondaryMetricHeader}>
                  <Text style={styles.secondaryMetricIcon}>🌱</Text>
                  <View style={styles.secondaryMetricBadge}>
                    <Text style={styles.secondaryMetricBadgeText}>CO₂</Text>
                  </View>
                </View>
                <Text style={[styles.secondaryMetricValue, { color: '#1D4ED8' }]}>
                  {realTimeStats.totalCO2Saved}kg
                </Text>
                <Text style={styles.secondaryMetricLabel}>Saved</Text>
                <View style={styles.secondaryMetricProgress}>
                  <View style={[styles.secondaryMetricProgressBar, { 
                    width: `${Math.min((realTimeStats.totalCO2Saved / 1000) * 100, 100)}%`,
                    backgroundColor: '#2563EB'
                  }]} />
                </View>
              </View>
            </View>

            {/* Impact Summary Bar */}
            <View style={styles.impactSummaryBar}>
              <View style={styles.impactSummaryItem}>
                <Text style={styles.impactSummaryIcon}>🎯</Text>
                <View style={styles.impactSummaryContent}>
                  <Text style={styles.impactSummaryLabel}>Daily Goal</Text>
                  <Text style={styles.impactSummaryValue}>
                    {Math.min(Math.round((realTimeStats.dealsCreatedToday / 5) * 100), 100)}%
                  </Text>
                </View>
              </View>
              <View style={styles.impactSummaryDivider} />
              <View style={styles.impactSummaryItem}>
                <Text style={styles.impactSummaryIcon}>⚡</Text>
                <View style={styles.impactSummaryContent}>
                  <Text style={styles.impactSummaryLabel}>Impact Score</Text>
                  <Text style={styles.impactSummaryValue}>
                    {realTimeStats.dealsCreatedToday * 20 + Math.round(realTimeStats.totalCO2Saved / 10)}
                  </Text>
                </View>
              </View>
              <View style={styles.impactSummaryDivider} />
              <View style={styles.impactSummaryItem}>
                <Text style={styles.impactSummaryIcon}>🏆</Text>
                <View style={styles.impactSummaryContent}>
                  <Text style={styles.impactSummaryLabel}>Rank</Text>
                  <Text style={styles.impactSummaryValue}>
                    {realTimeStats.dealsCreatedToday >= 3 ? '#1' : realTimeStats.dealsCreatedToday >= 1 ? '#2' : '#3'}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Dynamic Category Performance */}
        <View style={styles.section}>
          <CategoryChart categories={currentData.topCategories} />
        </View>

        {/* Recent Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Recent Activity</Text>
          <View style={styles.activityFeed}>
            {activities && activities.length > 0 ? activities.slice(0, 5).map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>
                    {activity.type === 'rescue_deal_created' ? '🏪' : 
                     activity.type === 'rescue_deal_sold' ? '🛒' : 
                     activity.type === 'donation_completed' ? '🤝' : '📊'}
                  </Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.action}</Text>
                  <Text style={styles.activityCustomer}>{activity.customer}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View style={styles.activityImpact}>
                  {'co2Saved' in activity.impact && (
                    <Text style={styles.activityImpactText}>🌱 {activity.impact.co2Saved}kg</Text>
                  )}
                  {'moneySaved' in activity.impact && (
                    <Text style={styles.activityImpactText}>💰 ${activity.impact.moneySaved}</Text>
                  )}
                </View>
              </View>
            )) : (
              <View style={styles.noActivityContainer}>
                <Text style={styles.noActivityText}>No recent activity</Text>
                <Text style={styles.noActivitySubtext}>Activity will appear here as you create rescue deals</Text>
              </View>
            )}
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Smart Insights</Text>
          <View style={styles.insightsCard}>
            {currentData.rescueDeals.created === 0 ? (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>🚀</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Ready to Make an Impact?</Text>
                  <Text style={styles.insightDescription}>
                    Start creating rescue deals to see real-time analytics, track environmental impact, and help customers save money while reducing waste.
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.insightItem}>
                  <Text style={styles.insightIcon}>🎯</Text>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Performance Summary</Text>
                    <Text style={styles.insightDescription}>
                      You've created {currentData.rescueDeals.created} rescue deals, saving {currentData.wasteReduction.co2Saved}kg of CO₂ and generating ${currentData.revenue.rescueDeals.toLocaleString()} in revenue. 
                      {currentData.rescueDeals.created >= 10 ? ' Excellent work!' : ' Keep it up!'}
                    </Text>
                  </View>
                </View>
                
                {realTimeStats.categoryBreakdown.length > 0 && (
                  <View style={styles.insightItem}>
                    <Text style={styles.insightIcon}>📊</Text>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>Top Category: {realTimeStats.categoryBreakdown[0].name}</Text>
                      <Text style={styles.insightDescription}>
                        {realTimeStats.categoryBreakdown[0].name} is your strongest category with {realTimeStats.categoryBreakdown[0].deals} deals. 
                        Consider expanding this category during peak hours.
                      </Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.insightItem}>
                  <Text style={styles.insightIcon}>🌟</Text>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Next Steps</Text>
                    <Text style={styles.insightDescription}>
                      {currentData.rescueDeals.created < 5 
                        ? 'Try creating more rescue deals in different categories to diversify your impact.'
                        : currentData.rescueDeals.donated === 0
                        ? 'Consider partnering with local food banks to increase donation opportunities.'
                        : 'You\'re doing great! Focus on maintaining consistent deal creation to maximize impact.'
                      }
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <MetricDetailsModal />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  realTimeIndicator: {
    alignItems: 'flex-end',
  },
  realTimeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginBottom: 4,
  },
  realTimeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeframeSelector: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeframeButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  timeframeButtonActive: {
    backgroundColor: '#047857',
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeframeButtonTextActive: {
    color: 'white',
  },
  selectedPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 8,
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: 150,
    height: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metricCardUpdated: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    fontWeight: '600',
  },
  trendIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  updateIndicator: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  updateText: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
  },
  livePerformanceContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveHeaderLeft: {
    flex: 1,
  },
  liveHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  liveHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  liveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  liveStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  featuredMetricCard: {
    backgroundColor: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  featuredMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredMetricIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredMetricEmoji: {
    fontSize: 28,
  },
  featuredMetricContent: {
    flex: 1,
  },
  featuredMetricValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#047857',
    marginBottom: 4,
  },
  featuredMetricLabel: {
    fontSize: 16,
    color: '#065F46',
    fontWeight: '600',
  },
  featuredMetricTrend: {
    alignItems: 'center',
  },
  trendArrow: {
    fontSize: 24,
    marginBottom: 4,
  },
  trendPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  featuredMetricFooter: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  featuredMetricFooterText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryMetricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  secondaryMetricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryMetricIcon: {
    fontSize: 20,
  },
  secondaryMetricBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  secondaryMetricBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#374151',
  },
  secondaryMetricValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  secondaryMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  secondaryMetricProgress: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  secondaryMetricProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  impactSummaryBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  impactSummaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactSummaryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  impactSummaryContent: {
    flex: 1,
  },
  impactSummaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  impactSummaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  impactSummaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  categoryChart: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryInfo: {
    width: 90,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryDeals: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryRevenue: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  categoryBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
  },
  categoryBar: {
    height: '100%',
    borderRadius: 5,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityCustomer: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  activityImpact: {
    alignItems: 'flex-end',
  },
  activityImpactText: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 2,
  },
  noActivityContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noActivityText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  noActivitySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  insightsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalMetricTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalMetricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 24,
  },
  modalDetailsSection: {
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
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalInsightsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalInsightText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
});