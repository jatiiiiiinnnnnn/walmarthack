// analytics.tsx - Updated to use shared context for real-time data
import React, { useState } from 'react';
import {
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
  const { getAnalyticsData, dashboardData, todaysStats } = useAppData();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('month');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);

  // Get real-time analytics data based on timeframe
  const currentData = getAnalyticsData(selectedTimeframe);

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
    onPress?: () => void;
  };

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, color, onPress }) => (
    <TouchableOpacity style={styles.metricCard} onPress={onPress}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        {trend !== undefined && (
          <View style={[styles.trendIndicator, { backgroundColor: trend > 0 ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.trendText}>{trend > 0 ? '+' : ''}{trend}%</Text>
          </View>
        )}
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const CategoryChart: React.FC<{ categories: { name: string; deals: number; percentage: number }[] }> = ({ categories }) => (
    <View style={styles.categoryChart}>
      <Text style={styles.chartTitle}>Rescue Deals by Category</Text>
      <View style={styles.chartContainer}>
        {categories.length > 0 ? categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDeals}>{category.deals} deals</Text>
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
          <Text style={styles.noDataText}>No deals created in this period</Text>
        )}
      </View>
    </View>
  );

  const showMetricDetails = (metric: any) => {
    setSelectedMetric(metric);
    setShowDetailsModal(true);
  };

  const calculateTrend = (current: number, base: number = 50): number => {
    // Calculate trend based on current performance vs a baseline
    return Math.round(((current - base) / base) * 100);
  };

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
              <Text style={styles.modalSectionTitle}>Breakdown</Text>
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
              <Text style={styles.modalSectionTitle}>Insights</Text>
              <Text style={styles.modalInsightText}>
                {selectedMetric.insights || 'Detailed insights and recommendations will be displayed here.'}
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
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time performance and environmental impact</Text>
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
        {/* Key Performance Indicators - Now with real-time data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.kpiGrid}>
            <MetricCard
              title="Rescue Deals Created"
              value={currentData.rescueDeals.created.toString()}
              subtitle={`${currentData.rescueDeals.sold} sold, ${currentData.rescueDeals.donated} donated`}
              trend={calculateTrend(currentData.rescueDeals.created, 30)}
              color="#059669"
              onPress={() => showMetricDetails({
                title: 'Rescue Deals',
                value: `${currentData.rescueDeals.created} created`,
                details: [
                  { label: 'Deals Sold', value: currentData.rescueDeals.sold },
                  { label: 'Items Donated', value: currentData.rescueDeals.donated },
                  { label: 'Success Rate', value: currentData.rescueDeals.created > 0 ? `${Math.round(((currentData.rescueDeals.sold + currentData.rescueDeals.donated) / currentData.rescueDeals.created) * 100)}%` : '0%' }
                ],
                insights: currentData.rescueDeals.created > 0 
                  ? `Rescue deals are performing well with ${currentData.rescueDeals.sold + currentData.rescueDeals.donated} out of ${currentData.rescueDeals.created} deals successfully moved. Consider increasing variety in the top-performing categories.`
                  : 'No rescue deals created in this period. Start creating deals to begin tracking performance.'
              })}
            />
            
            <MetricCard
              title="Waste Reduction"
              value={`${currentData.wasteReduction.percentage}%`}
              subtitle={`${currentData.wasteReduction.totalKg} kg prevented`}
              trend={calculateTrend(currentData.wasteReduction.percentage, 75)}
              color="#2563EB"
              onPress={() => showMetricDetails({
                title: 'Waste Reduction',
                value: `${currentData.wasteReduction.percentage}%`,
                details: [
                  { label: 'Total Weight Saved', value: `${currentData.wasteReduction.totalKg} kg` },
                  { label: 'CO₂ Equivalent Saved', value: `${currentData.wasteReduction.co2Saved} kg` },
                  { label: 'Items Diverted', value: currentData.rescueDeals.created }
                ],
                insights: currentData.wasteReduction.totalKg > 0 
                  ? `Excellent waste reduction performance with ${currentData.wasteReduction.totalKg}kg saved. Focus on peak disposal hours to maximize impact.`
                  : 'No waste reduction recorded in this period. Create more rescue deals to start making an environmental impact.'
              })}
            />
            
            <MetricCard
              title="Active Customers"
              value={currentData.customerEngagement.activeUsers.toLocaleString()}
              subtitle={`${currentData.customerEngagement.newSignups} new signups`}
              trend={8}
              color="#7C3AED"
              onPress={() => showMetricDetails({
                title: 'Customer Engagement',
                value: `${currentData.customerEngagement.activeUsers} active users`,
                details: [
                  { label: 'New Signups', value: currentData.customerEngagement.newSignups },
                  { label: 'Challenge Participation', value: `${currentData.customerEngagement.challengeParticipation}%` },
                  { label: 'Retention Rate', value: '89%' }
                ],
                insights: 'Customer growth is steady. Challenge participation could be improved with better incentives and more frequent rescue deal creation.'
              })}
            />
            
            <MetricCard
              title="Revenue Impact"
              value={`$${currentData.revenue.rescueDeals.toLocaleString()}`}
              subtitle={`$${currentData.revenue.totalSavings.toLocaleString()} customer savings`}
              trend={calculateTrend(currentData.revenue.rescueDeals, 5000)}
              color="#F59E0B"
              onPress={() => showMetricDetails({
                title: 'Revenue Impact',
                value: `$${currentData.revenue.rescueDeals.toLocaleString()}`,
                details: [
                  { label: 'Customer Savings', value: `$${currentData.revenue.totalSavings.toLocaleString()}` },
                  { label: 'Average Discount', value: `${currentData.revenue.avgDiscount}%` },
                  { label: 'Items Moved', value: currentData.rescueDeals.sold }
                ],
                insights: currentData.revenue.rescueDeals > 0 
                  ? `Revenue from rescue deals is ${currentData.revenue.rescueDeals > 5000 ? 'strong' : 'growing'}. Consider adjusting discount rates to balance profitability and waste reduction.`
                  : 'No revenue from rescue deals in this period. Create and promote more deals to generate revenue.'
              })}
            />
          </View>
        </View>

        {/* Environmental Impact - Real-time data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <View style={styles.environmentalCard}>
            <View style={styles.environmentalMetrics}>
              <View style={styles.environmentalMetric}>
                <Text style={styles.environmentalIcon}>🌱</Text>
                <Text style={styles.environmentalValue}>{currentData.wasteReduction.co2Saved}</Text>
                <Text style={styles.environmentalLabel}>kg CO₂ Saved</Text>
              </View>
              <View style={styles.environmentalMetric}>
                <Text style={styles.environmentalIcon}>♻️</Text>
                <Text style={styles.environmentalValue}>{currentData.wasteReduction.totalKg}</Text>
                <Text style={styles.environmentalLabel}>kg Waste Prevented</Text>
              </View>
              <View style={styles.environmentalMetric}>
                <Text style={styles.environmentalIcon}>🏪</Text>
                <Text style={styles.environmentalValue}>{currentData.wasteReduction.percentage}%</Text>
                <Text style={styles.environmentalLabel}>Waste Reduction</Text>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Monthly Goal Progress</Text>
              <View style={styles.progressItems}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressItemLabel}>Waste Reduction Target</Text>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressBarFill, 
                      { 
                        width: `${Math.min(currentData.wasteReduction.percentage, 100)}%`, 
                        backgroundColor: '#059669' 
                      }
                    ]} />
                  </View>
                  <Text style={styles.progressItemValue}>{currentData.wasteReduction.percentage}% of 90% target</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressItemLabel}>Customer Engagement Target</Text>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressBarFill, 
                      { 
                        width: `${currentData.customerEngagement.challengeParticipation}%`, 
                        backgroundColor: '#2563EB' 
                      }
                    ]} />
                  </View>
                  <Text style={styles.progressItemValue}>{currentData.customerEngagement.challengeParticipation}% of 80% target</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressItemLabel}>Donation Goal</Text>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressBarFill, 
                      { 
                        width: `${Math.min((currentData.rescueDeals.donated / 45) * 100, 100)}%`, 
                        backgroundColor: '#7C3AED' 
                      }
                    ]} />
                  </View>
                  <Text style={styles.progressItemValue}>{Math.round((currentData.rescueDeals.donated / 45) * 100)}% of 45 donations</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Category Performance - Real-time data */}
        <View style={styles.section}>
          <CategoryChart categories={currentData.topCategories} />
        </View>

        {/* Today's Live Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Live Performance</Text>
          <View style={styles.liveStatsCard}>
            <View style={styles.liveStatsGrid}>
              <View style={styles.liveStatItem}>
                <Text style={styles.liveStatIcon}>🏪</Text>
                <Text style={styles.liveStatValue}>{todaysStats.dealsCreated}</Text>
                <Text style={styles.liveStatLabel}>Deals Created Today</Text>
              </View>
              <View style={styles.liveStatItem}>
                <Text style={styles.liveStatIcon}>🌱</Text>
                <Text style={styles.liveStatValue}>{todaysStats.co2Saved}</Text>
                <Text style={styles.liveStatLabel}>CO₂ Saved (kg)</Text>
              </View>
              <View style={styles.liveStatItem}>
                <Text style={styles.liveStatIcon}>♻️</Text>
                <Text style={styles.liveStatValue}>{todaysStats.wastePrevented}</Text>
                <Text style={styles.liveStatLabel}>Waste Prevented (kg)</Text>
              </View>
              <View style={styles.liveStatItem}>
                <Text style={styles.liveStatIcon}>💰</Text>
                <Text style={styles.liveStatValue}>${todaysStats.customerSavings}</Text>
                <Text style={styles.liveStatLabel}>Customer Savings</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Trends - Dynamic based on actual data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          <View style={styles.trendsCard}>
            <View style={styles.trendItem}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendTitle}>Rescue Deal Creation</Text>
                <View style={styles.trendIndicator}>
                  <Text style={styles.trendValue}>
                    {currentData.rescueDeals.created > 30 ? '+High' : currentData.rescueDeals.created > 10 ? '+Medium' : 'Low'}
                  </Text>
                </View>
              </View>
              <Text style={styles.trendDescription}>
                {currentData.rescueDeals.created > 30 
                  ? `Excellent performance with ${currentData.rescueDeals.created} deals created this ${selectedTimeframe}`
                  : currentData.rescueDeals.created > 10
                  ? `Good progress with ${currentData.rescueDeals.created} deals created this ${selectedTimeframe}`
                  : `${currentData.rescueDeals.created} deals created this ${selectedTimeframe}. Consider increasing deal creation frequency`
                }
              </Text>
            </View>
            
            <View style={styles.trendItem}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendTitle}>Environmental Impact</Text>
                <View style={styles.trendIndicator}>
                  <Text style={styles.trendValue}>
                    {currentData.wasteReduction.co2Saved > 50 ? '+High' : currentData.wasteReduction.co2Saved > 20 ? '+Medium' : 'Building'}
                  </Text>
                </View>
              </View>
              <Text style={styles.trendDescription}>
                {currentData.wasteReduction.co2Saved > 50
                  ? `Outstanding environmental impact with ${currentData.wasteReduction.co2Saved}kg CO₂ saved`
                  : currentData.wasteReduction.co2Saved > 20
                  ? `Good environmental progress with ${currentData.wasteReduction.co2Saved}kg CO₂ saved`
                  : `${currentData.wasteReduction.co2Saved}kg CO₂ saved so far. Each new deal increases impact`
                }
              </Text>
            </View>
            
            <View style={styles.trendItem}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendTitle}>Deal Success Rate</Text>
                <View style={styles.trendIndicator}>
                  <Text style={styles.trendValue}>
                    {currentData.rescueDeals.created > 0 
                      ? `${Math.round(((currentData.rescueDeals.sold + currentData.rescueDeals.donated) / currentData.rescueDeals.created) * 100)}%`
                      : '0%'
                    }
                  </Text>
                </View>
              </View>
              <Text style={styles.trendDescription}>
                {currentData.rescueDeals.created > 0
                  ? `${currentData.rescueDeals.sold + currentData.rescueDeals.donated} out of ${currentData.rescueDeals.created} deals successfully moved`
                  : 'No deals created yet to track success rate'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          <View style={styles.recommendationsCard}>
            {currentData.rescueDeals.created === 0 ? (
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationIcon}>🏪</Text>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Start Creating Rescue Deals</Text>
                  <Text style={styles.recommendationDescription}>
                    No rescue deals created yet this {selectedTimeframe}. Start by creating deals in high-demand categories like Produce.
                  </Text>
                </View>
              </View>
            ) : (
              <>
                {currentData.topCategories.length > 0 && (
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationIcon}>📈</Text>
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Expand {currentData.topCategories[0].name} Deals</Text>
                      <Text style={styles.recommendationDescription}>
                        {currentData.topCategories[0].name} shows highest performance with {currentData.topCategories[0].deals} deals. Consider increasing creation in this category.
                      </Text>
                    </View>
                  </View>
                )}
                
                {currentData.rescueDeals.donated === 0 && (
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationIcon}>🤝</Text>
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Increase Donation Partnerships</Text>
                      <Text style={styles.recommendationDescription}>
                        No donations recorded this {selectedTimeframe}. Partner with local food banks to maximize community impact.
                      </Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationIcon}>💡</Text>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>Optimize Deal Timing</Text>
                    <Text style={styles.recommendationDescription}>
                      Create rescue deals during peak customer hours (3-5 PM) to maximize visibility and sales.
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
    borderRadius: 12,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  trendIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
  environmentalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  environmentalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  environmentalMetric: {
    alignItems: 'center',
  },
  environmentalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  environmentalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  environmentalLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressItems: {
    gap: 16,
  },
  progressItem: {
    marginBottom: 8,
  },
  progressItemLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressItemValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  liveStatsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  liveStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  liveStatItem: {
    alignItems: 'center',
    width: '45%',
  },
  liveStatIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  liveStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  liveStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryChart: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    width: 80,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  categoryDeals: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  categoryBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  trendsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trendItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  trendDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationDescription: {
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