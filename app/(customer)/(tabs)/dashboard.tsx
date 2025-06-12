// CustomerDashboard.tsx - Fixed with date safety checks
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppData } from '../../contexts/AppDataContext';



export default function WalmartEcoDashboard() {
  const { 
    rescueDeals, 
    updateRescueDealStatus, 
    dashboardData,
    todaysStats 
  } = useAppData();

  // Filter for available rescue deals (pending status) with date safety
  const availableRescueDeals = rescueDeals.filter(deal => 
    deal && deal.status === 'pending'
  );
  
  // Calculate customer savings and environmental impact
  const [customerStats, setCustomerStats] = useState({
    totalSavings: 0,
    co2Saved: 0,
    itemsPurchased: 0
  });

  // Helper function to safely handle dates
  const safeDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') return new Date(dateValue);
    return new Date();
  };

  // Helper function to get time difference safely
  const getTimeDifference = (dateValue: any): number => {
    const date = safeDate(dateValue);
    return Date.now() - date.getTime();
  };

  // Regular products that are always available
  const regularProducts = [
    {
      id: 'reg_1',
      name: "Free Range Eggs (12 ct)",
      price: 4.12,
      co2: "2.1 kg CO₂",
      alternative: "Plant-based egg substitute",
      altCo2: "0.9 kg CO₂",
    },
    {
      id: 'reg_2',
      name: "Ground Beef (1 lb)",
      price: 6.98,
      co2: "27.0 kg CO₂",
      alternative: "Plant-based ground meat",
      altCo2: "3.5 kg CO₂",
    },
    {
      id: 'reg_3',
      name: "Plastic Water Bottles (24 pk)",
      price: 3.97,
      co2: "5.8 kg CO₂",
      alternative: "Reusable water bottle",
      altCo2: "1.2 kg CO₂",
    },
  ];

  // Convert rescue deal to display format with date safety
  const formatRescueDeal = (deal: any) => {
    if (!deal) return null;

    // Generate a realistic discounted price based on category
    const basePrices = {
      'Produce': 3.99,
      'Bakery': 2.84,
      'Dairy': 4.50,
      'Meat': 8.99
    };
    
    const basePrice = basePrices[deal.category as keyof typeof basePrices] || 4.99;
    const discountedPrice = +(basePrice * (1 - (deal.discount || 30) / 100)).toFixed(2);
    const originalPrice = +basePrice.toFixed(2);
    
    // Calculate days until expiry with safety
    const expiryDate = safeDate(deal.expiresAt);
    const now = new Date();
    const hoursUntilExpiry = Math.max(1, Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
    const daysUntilExpiry = Math.max(1, Math.ceil(hoursUntilExpiry / 24));
    
    return {
      id: deal.id || Date.now(),
      name: deal.description || 'Rescue Deal',
      originalPrice,
      discountedPrice,
      expiryDays: daysUntilExpiry,
      co2: `${deal.estimatedCO2Saved || 2.5} kg CO₂`,
      discount: `${deal.discount || 30}%`,
      category: deal.category || 'Produce',
      quantity: deal.quantity || '1 item',
      priority: deal.priority || 'medium'
    };
  };

  // Handle purchasing a rescue deal
  const handlePurchaseRescueDeal = (deal: any) => {
    const formattedDeal = formatRescueDeal(deal);
    if (!formattedDeal) return;
    
    Alert.alert(
      'Purchase Rescue Deal',
      `Buy ${formattedDeal.name} for $${formattedDeal.discountedPrice}?\n\nOriginal Price: $${formattedDeal.originalPrice}\nYou Save: $${(formattedDeal.originalPrice - formattedDeal.discountedPrice).toFixed(2)}\nCO₂ Impact Prevented: ${formattedDeal.co2}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            try {
              // Simulate customer purchase
              updateRescueDealStatus(
                deal.id, 
                'sold', 
                'Customer App User', 
                formattedDeal.discountedPrice
              );
              
              // Update customer stats
              setCustomerStats(prev => ({
                totalSavings: prev.totalSavings + (formattedDeal.originalPrice - formattedDeal.discountedPrice),
                co2Saved: prev.co2Saved + (deal.estimatedCO2Saved || 2.5),
                itemsPurchased: prev.itemsPurchased + 1
              }));
              
              Alert.alert(
                'Purchase Successful! 🎉',
                `You saved $${(formattedDeal.originalPrice - formattedDeal.discountedPrice).toFixed(2)} and prevented ${formattedDeal.co2} of waste!\n\nYour order will be ready for pickup in 15 minutes.`
              );
            } catch (error) {
              console.error('Purchase error:', error);
              Alert.alert('Error', 'Something went wrong with your purchase. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle requesting donation
  const handleRequestDonation = (deal: any) => {
    if (!deal) return;
    
    Alert.alert(
      'Request Donation',
      `Would you like to request that "${deal.description || 'this item'}" be donated to a local food bank instead of being discarded?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Donation',
          onPress: () => {
            try {
              updateRescueDealStatus(deal.id, 'donated');
              Alert.alert(
                'Donation Requested',
                'Thank you for helping reduce food waste! This item will be donated to a local food bank.'
              );
            } catch (error) {
              console.error('Donation error:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Get priority color for rescue deals
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e17055';
      case 'medium': return '#f39c12';
      case 'low': return '#00b894';
      default: return '#74b9ff';
    }
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    const emojis = {
      'Produce': '🥬',
      'Bakery': '🍞',
      'Dairy': '🥛',
      'Meat': '🥩'
    };
    return emojis[category as keyof typeof emojis] || '🛒';
  };

  // Safe stats calculations
  const safeStats = {
    totalSavings: (customerStats.totalSavings + (todaysStats?.customerSavings || 0)) || 0,
    co2Saved: (customerStats.co2Saved + (todaysStats?.co2Saved || 0)) || 0,
    itemsPurchased: (customerStats.itemsPurchased + (dashboardData?.rescueDeals?.sold || 0)) || 0
  };

  return (
    <ScrollView style={styles.container}>
    
      <View style={styles.header}>
        <Text style={styles.storeText}>Walmart</Text>
        <Text style={styles.locationText}>📍 Supercenter - Delhi</Text>
        <Text style={styles.tagline}>Save Money. Live Better. Go Green.</Text>
        
        {/* Live rescue deals counter */}
        {availableRescueDeals.length > 0 && (
          <View style={styles.liveCounter}>
            <Text style={styles.liveCounterText}>
              🔥 {availableRescueDeals.length} rescue deals available!
            </Text>
          </View>
        )}
      </View>

      {/* Rescue Deals Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⏰ Rescue Deals - Save & Help!</Text>
          <Text style={styles.sectionSubtitle}>
            {availableRescueDeals.length > 0 
              ? `${availableRescueDeals.length} deals available • Buy discounted or request donation`
              : 'No rescue deals available right now'
            }
          </Text>
        </View>
        
        {availableRescueDeals.length > 0 ? (
          availableRescueDeals.map((deal) => {
            const formattedDeal = formatRescueDeal(deal);
            if (!formattedDeal) return null;
            
            return (
              <View 
                key={deal.id || Math.random()} 
                style={[
                  styles.expiryCard,
                  { borderLeftColor: getPriorityColor(deal.priority || 'medium') }
                ]}
              >
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{formattedDeal.discount} OFF</Text>
                </View>
                
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {getCategoryEmoji(deal.category || 'Produce')} {deal.category || 'Produce'}
                  </Text>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{formattedDeal.name}</Text>
                  <Text style={styles.quantityText}>Quantity: {deal.quantity || '1 item'}</Text>
                  <Text style={[
                    styles.expiryWarning,
                    { color: getPriorityColor(deal.priority || 'medium') }
                  ]}>
                    {formattedDeal.expiryDays === 1 
                      ? 'Expires today!' 
                      : `Expires in ${formattedDeal.expiryDays} day(s)`
                    }
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>${formattedDeal.originalPrice}</Text>
                    <Text style={styles.discountedPrice}>${formattedDeal.discountedPrice}</Text>
                    <Text style={styles.co2Text}>{formattedDeal.co2} saved</Text>
                  </View>
                  <Text style={styles.savingsText}>
                    You save: ${(formattedDeal.originalPrice - formattedDeal.discountedPrice).toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={() => handlePurchaseRescueDeal(deal)}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.donateButton}
                    onPress={() => handleRequestDonation(deal)}
                  >
                    <Text style={styles.donateButtonText}>Request Donation</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dealMeta}>
                  <Text style={styles.dealMetaText}>
                    ⏱️ Created {Math.floor(getTimeDifference(deal.createdAt) / (1000 * 60))} minutes ago
                  </Text>
                  <Text style={styles.dealMetaText}>
                    🌱 Prevents {deal.estimatedWastePrevented || 1.5}kg waste
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No rescue deals available</Text>
            <Text style={styles.emptyStateText}>
              Check back soon! Our team is always working to prevent food waste.
            </Text>
          </View>
        )}
      </View>

      {/* Regular Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛒 All Products</Text>
        
        {regularProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </View>
            
            <View style={styles.emissionRow}>
              <Text style={styles.emissionLabel}>CO₂ Impact:</Text>
              <Text style={styles.emissionValue}>{product.co2}</Text>
            </View>

            {product.alternative && (
              <View style={styles.alternativeSection}>
                <Text style={styles.alternativeTitle}>🌱 Eco Alternative:</Text>
                <Text style={styles.alternativeText}>{product.alternative}</Text>
                <View style={styles.alternativeComparison}>
                  <Text style={styles.alternativeEmission}>CO₂: {product.altCo2}</Text>
                  <Text style={styles.savingsText}>
                    Save {(parseFloat(product.co2) - parseFloat(product.altCo2)).toFixed(1)} kg CO₂
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.productActions}>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              {product.alternative && (
                <TouchableOpacity style={styles.chooseEcoButton}>
                  <Text style={styles.chooseEcoText}>Choose Eco</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Environmental Impact Summary - Now with real-time data and safety */}
      <View style={styles.section}>
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>🌍 Your Environmental Impact</Text>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>
                ${safeStats.totalSavings.toFixed(2)}
              </Text>
              <Text style={styles.impactLabel}>Total savings</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>
                {safeStats.co2Saved.toFixed(1)} kg
              </Text>
              <Text style={styles.impactLabel}>CO₂ prevented</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>
                {safeStats.itemsPurchased}
              </Text>
              <Text style={styles.impactLabel}>Rescue deals bought</Text>
            </View>
          </View>
          
          {/* Community impact with safety */}
          <View style={styles.communityImpact}>
            <Text style={styles.communityTitle}>🏪 Store Impact Today</Text>
            <View style={styles.communityStats}>
              <Text style={styles.communityText}>
                🔥 {dashboardData?.rescueDeals?.total || 0} rescue deals created
              </Text>
              <Text style={styles.communityText}>
                ♻️ {dashboardData?.wasteReduction?.totalKg || 0}kg waste prevented
              </Text>
              <Text style={styles.communityText}>
                🤝 {dashboardData?.rescueDeals?.donated || 0} items donated
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.offsetButton}>
            <Text style={styles.offsetButtonText}>Offset Remaining CO₂</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Achievement badges based on activity */}
      {customerStats.itemsPurchased > 0 && (
        <View style={styles.achievementSection}>
          <Text style={styles.achievementTitle}>🏆 Your Achievements</Text>
          <View style={styles.achievementBadges}>
            {customerStats.itemsPurchased >= 1 && (
              <View style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>🌱</Text>
                <Text style={styles.achievementText}>Eco Warrior</Text>
              </View>
            )}
            {customerStats.itemsPurchased >= 5 && (
              <View style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>♻️</Text>
                <Text style={styles.achievementText}>Waste Reducer</Text>
              </View>
            )}
            {customerStats.co2Saved >= 10 && (
              <View style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>🌍</Text>
                <Text style={styles.achievementText}>Planet Protector</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Styles remain exactly the same as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    backgroundColor: '#0071CE',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  storeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  locationText: {
    color: '#E6F3FF',
    fontSize: 16,
    marginTop: 4,
  },
  tagline: {
    color: '#FFC220',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  liveCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  liveCounterText: {
    color: '#FFC220',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#636e72',
  },
  expiryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#e17055',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 16,
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3436',
  },
  productInfo: {
    marginTop: 32,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#636e72',
    marginBottom: 4,
  },
  expiryWarning: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: '#636e72',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b894',
  },
  co2Text: {
    fontSize: 12,
    color: '#6c5ce7',
    fontWeight: '500',
  },
  savingsText: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  donateButton: {
    backgroundColor: '#00b894',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  donateButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  dealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  dealMetaText: {
    fontSize: 11,
    color: '#636e72',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0071CE',
  },
  emissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emissionLabel: {
    fontSize: 14,
    color: '#636e72',
  },
  emissionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e17055',
  },
  alternativeSection: {
    backgroundColor: '#d1f2eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00695c',
    marginBottom: 4,
  },
  alternativeText: {
    fontSize: 14,
    color: '#00695c',
    marginBottom: 8,
  },
  alternativeComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alternativeEmission: {
    fontSize: 12,
    color: '#00695c',
    fontWeight: '500',
  },
  productActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  chooseEcoButton: {
    backgroundColor: '#00b894',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  chooseEcoText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  impactStat: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  impactLabel: {
    fontSize: 12,
    color: '#636e72',
    textAlign: 'center',
    marginTop: 4,
  },
  communityImpact: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  communityStats: {
    gap: 8,
  },
  communityText: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
  },
  offsetButton: {
    backgroundColor: '#00b894',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  offsetButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  achievementSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
  },
});