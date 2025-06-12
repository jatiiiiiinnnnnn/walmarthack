// app/(customer)/(tabs)/cart.tsx - Smart Cart with Eco Swaps & Discounts
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
    View,
} from 'react-native';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  co2Impact: number;
  sustainabilityScore: number;
  category: string;
  isEcoFriendly: boolean;
  ecoPoints: number;
  aisle: string;
  image?: string;
  ecoAlternative?: {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceIncrease: number;
    co2Impact: number;
    ecoPoints: number;
    features: string[];
    sustainabilityScore: number;
  };
}

interface EcoDiscount {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  minCartValue?: number;
  maxDiscount?: number;
  ecoProductsOnly?: boolean;
  icon: string;
}

export default function CartTab() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Regular Plastic Water Bottles (24pk)',
      brand: 'AquaPure',
      price: 4.99,
      quantity: 1,
      co2Impact: 5.8,
      sustainabilityScore: 2.1,
      category: 'Beverages',
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Beverages - Aisle 12A',
      ecoAlternative: {
        id: '1_alt',
        name: 'Stainless Steel Water Bottle',
        brand: 'EcoFlow',
        price: 19.99,
        priceIncrease: 15.00,
        co2Impact: 1.2,
        ecoPoints: 25,
        sustainabilityScore: 9.2,
        features: ['Reusable', 'BPA-free', 'Insulated', 'Lifetime use']
      }
    },
    {
      id: '2',
      name: 'Regular Detergent',
      brand: 'CleanMax',
      price: 8.99,
      quantity: 2,
      co2Impact: 3.4,
      sustainabilityScore: 4.1,
      category: 'Household',
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Household - Aisle 18B',
      ecoAlternative: {
        id: '2_alt',
        name: 'Concentrated Eco Detergent',
        brand: 'GreenClean',
        price: 7.49,
        priceIncrease: -1.50,
        co2Impact: 1.1,
        ecoPoints: 15,
        sustainabilityScore: 8.5,
        features: ['Biodegradable', 'Plant-based', 'Concentrated formula']
      }
    },
    {
      id: '3',
      name: 'Organic Cotton Bed Sheets',
      brand: 'Pure Earth',
      price: 79.99,
      originalPrice: 119.99,
      quantity: 1,
      co2Impact: 4.2,
      sustainabilityScore: 8.8,
      category: 'Home',
      isEcoFriendly: true,
      ecoPoints: 25,
      aisle: 'Home - Aisle 15C'
    }
  ]);

  const [userEcoPoints, setUserEcoPoints] = useState(847);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');

  // Realistic eco discount schemes
  const ecoDiscounts: EcoDiscount[] = [
    {
      id: 'eco_starter',
      name: 'Eco Starter Reward',
      description: 'Get $1 off your purchase',
      pointsRequired: 100,
      discountValue: 1.00,
      discountType: 'fixed',
      minCartValue: 10,
      icon: '🌱'
    },
    {
      id: 'eco_champion',
      name: 'Eco Champion Discount',
      description: '5% off eco-friendly products',
      pointsRequired: 250,
      discountValue: 5,
      discountType: 'percentage',
      minCartValue: 25,
      maxDiscount: 10,
      ecoProductsOnly: true,
      icon: '🏆'
    },
    {
      id: 'eco_master',
      name: 'Eco Master Savings',
      description: '$5 off any purchase over $50',
      pointsRequired: 500,
      discountValue: 5.00,
      discountType: 'fixed',
      minCartValue: 50,
      icon: '💚'
    },
    {
      id: 'eco_legend',
      name: 'Eco Legend Bonus',
      description: '10% off entire cart (max $15)',
      pointsRequired: 750,
      discountValue: 10,
      discountType: 'percentage',
      minCartValue: 75,
      maxDiscount: 15,
      icon: '🌟'
    }
  ];

  const promoCodes = [
    { code: 'EARTHDAY', discount: 0.15, description: 'Earth Day Special - 15% off eco products' },
    { code: 'NEWECO', discount: 0.10, description: 'New Eco Customer - 10% off first eco purchase' },
    { code: 'GREENLIVING', discount: 5.00, description: 'Green Living - $5 off orders over $30' }
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateEcoDiscount = (discount: EcoDiscount) => {
    const subtotal = calculateSubtotal();
    const ecoProductsTotal = cartItems
      .filter(item => item.isEcoFriendly)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const baseAmount = discount.ecoProductsOnly ? ecoProductsTotal : subtotal;
    
    if (discount.discountType === 'percentage') {
      const discountAmount = baseAmount * (discount.discountValue / 100);
      return Math.min(discountAmount, discount.maxDiscount || discountAmount);
    } else {
      return discount.discountValue;
    }
  };

  const calculatePromoDiscount = () => {
    const foundPromo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!foundPromo) return 0;
    
    const subtotal = calculateSubtotal();
    if (typeof foundPromo.discount === 'number' && foundPromo.discount < 1) {
      return subtotal * foundPromo.discount;
    } else {
      return foundPromo.discount as number;
    }
  };

  const getTotalDiscount = () => {
    let totalDiscount = 0;
    appliedDiscounts.forEach(discountId => {
      const discount = ecoDiscounts.find(d => d.id === discountId);
      if (discount) {
        totalDiscount += calculateEcoDiscount(discount);
      }
    });
    totalDiscount += calculatePromoDiscount();
    return totalDiscount;
  };

  const getTotalEcoPoints = () => {
    return cartItems.reduce((sum, item) => sum + (item.ecoPoints * item.quantity), 0);
  };

  const getTotalCO2Impact = () => {
    return cartItems.reduce((sum, item) => sum + (item.co2Impact * item.quantity), 0);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const swapToEcoAlternative = (itemId: string) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === itemId && item.ecoAlternative) {
          const alt = item.ecoAlternative;
          return {
            ...item,
            name: alt.name,
            brand: alt.brand,
            price: alt.price,
            co2Impact: alt.co2Impact,
            sustainabilityScore: alt.sustainabilityScore,
            isEcoFriendly: true,
            ecoPoints: alt.ecoPoints,
            ecoAlternative: undefined
          };
        }
        return item;
      })
    );
    setShowSwapModal(false);
    Alert.alert('Swapped! 🌱', 'You\'ve chosen the eco-friendly option and will earn extra EcoPoints!');
  };

  const applyEcoDiscount = (discountId: string) => {
    const discount = ecoDiscounts.find(d => d.id === discountId);
    if (!discount) return;

    const subtotal = calculateSubtotal();
    if (discount.minCartValue && subtotal < discount.minCartValue) {
      Alert.alert(
        'Minimum Cart Value',
        `You need at least $${discount.minCartValue} in your cart to use this discount.`
      );
      return;
    }

    if (userEcoPoints < discount.pointsRequired) {
      Alert.alert(
        'Insufficient EcoPoints',
        `You need ${discount.pointsRequired} EcoPoints to use this discount. You have ${userEcoPoints} points.`
      );
      return;
    }

    setAppliedDiscounts(prev => [...prev, discountId]);
    setUserEcoPoints(prev => prev - discount.pointsRequired);
    setShowDiscountModal(false);
    Alert.alert('Discount Applied! 💚', `${discount.name} has been applied to your cart.`);
  };

  const applyPromoCode = () => {
    const foundPromo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!foundPromo) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }
    Alert.alert('Promo Applied! 🎉', foundPromo.description);
  };

  const proceedToCheckout = () => {
    const subtotal = calculateSubtotal();
    const discount = getTotalDiscount();
    const total = subtotal - discount;
    const ecoPoints = getTotalEcoPoints();
    
    Alert.alert(
      'Order Summary',
      `Subtotal: $${subtotal.toFixed(2)}\nDiscount: -$${discount.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\nYou'll earn ${ecoPoints} EcoPoints!`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'Checkout', onPress: () => Alert.alert('Success!', 'Order placed successfully!') }
      ]
    );
  };

  const CartItemCard = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemBrand}>{item.brand}</Text>
          <Text style={styles.itemAisle}>📍 {item.aisle}</Text>
        </View>
        <View style={styles.itemBadges}>
          {item.isEcoFriendly && (
            <View style={styles.ecoBadge}>
              <Text style={styles.ecoBadgeText}>🌱 Eco</Text>
            </View>
          )}
          {item.originalPrice && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>
                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.itemMetrics}>
        <View style={styles.itemPricing}>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
          <Text style={styles.currentPrice}>${item.price}</Text>
          <Text style={styles.itemPoints}>💰 {item.ecoPoints} points</Text>
        </View>
        <Text style={styles.itemCO2}>🌍 {item.co2Impact} kg CO₂</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {item.ecoAlternative && (
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => {
              setSelectedItem(item);
              setShowSwapModal(true);
            }}
          >
            <Text style={styles.swapButtonText}>
              🌱 Eco Swap {item.ecoAlternative.priceIncrease >= 0 ? 
                `(+$${item.ecoAlternative.priceIncrease.toFixed(2)})` : 
                `(-$${Math.abs(item.ecoAlternative.priceIncrease).toFixed(2)})`}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => updateQuantity(item.id, 0)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SwapModal = () => (
    <Modal visible={showSwapModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSwapModal(false)}>
            <Text style={styles.modalBackButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Eco Swap Suggestion</Text>
          <View />
        </View>

        {selectedItem?.ecoAlternative && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.swapComparisonCard}>
              <Text style={styles.swapTitle}>🌱 Better Choice Available!</Text>
              
              <View style={styles.comparisonGrid}>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonLabel}>Current</Text>
                  <Text style={styles.comparisonName}>{selectedItem.name}</Text>
                  <Text style={styles.comparisonPrice}>${selectedItem.price}</Text>
                  <Text style={styles.comparisonCO2}>🌍 {selectedItem.co2Impact} kg CO₂</Text>
                  <Text style={styles.comparisonPoints}>💰 {selectedItem.ecoPoints} points</Text>
                </View>

                <View style={styles.comparisonDivider}>
                  <Text style={styles.comparisonVs}>VS</Text>
                </View>

                <View style={[styles.comparisonItem, styles.ecoComparisonItem]}>
                  <Text style={styles.comparisonLabel}>🌱 Eco Choice</Text>
                  <Text style={styles.comparisonName}>{selectedItem.ecoAlternative.name}</Text>
                  <Text style={styles.comparisonPrice}>${selectedItem.ecoAlternative.price}</Text>
                  <Text style={[styles.comparisonCO2, styles.betterCO2]}>
                    🌍 {selectedItem.ecoAlternative.co2Impact} kg CO₂
                  </Text>
                  <Text style={[styles.comparisonPoints, styles.betterPoints]}>
                    💰 {selectedItem.ecoAlternative.ecoPoints} points
                  </Text>
                </View>
              </View>

              <View style={styles.benefitsCard}>
                <Text style={styles.benefitsTitle}>💚 Benefits</Text>
                <Text style={styles.benefitText}>
                  • Save {(selectedItem.co2Impact - selectedItem.ecoAlternative.co2Impact).toFixed(1)} kg CO₂
                </Text>
                <Text style={styles.benefitText}>
                  • Earn {selectedItem.ecoAlternative.ecoPoints - selectedItem.ecoPoints} more EcoPoints
                </Text>
                <Text style={styles.benefitText}>
                  • {selectedItem.ecoAlternative.priceIncrease >= 0 
                    ? `Only $${selectedItem.ecoAlternative.priceIncrease.toFixed(2)} more` 
                    : `Save $${Math.abs(selectedItem.ecoAlternative.priceIncrease).toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.swapActions}>
                <TouchableOpacity 
                  style={styles.keepButton}
                  onPress={() => setShowSwapModal(false)}
                >
                  <Text style={styles.keepButtonText}>Keep Current</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.swapConfirmButton}
                  onPress={() => swapToEcoAlternative(selectedItem.id)}
                >
                  <Text style={styles.swapConfirmButtonText}>🌱 Make Swap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const DiscountModal = () => (
    <Modal visible={showDiscountModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowDiscountModal(false)}>
            <Text style={styles.modalBackButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>EcoPoints Rewards</Text>
          <Text style={styles.modalPoints}>💰 {userEcoPoints} points</Text>
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.discountsTitle}>Available Discounts</Text>
          {ecoDiscounts.map(discount => {
            const canUse = userEcoPoints >= discount.pointsRequired;
            const subtotal = calculateSubtotal();
            const meetsMinimum = !discount.minCartValue || subtotal >= discount.minCartValue;
            
            return (
              <View key={discount.id} style={[
                styles.discountCard,
                !canUse && styles.discountCardDisabled
              ]}>
                <View style={styles.discountHeader}>
                  <Text style={styles.discountIcon}>{discount.icon}</Text>
                  <View style={styles.discountInfo}>
                    <Text style={styles.discountName}>{discount.name}</Text>
                    <Text style={styles.discountDescription}>{discount.description}</Text>
                  </View>
                  <View style={styles.discountCost}>
                    <Text style={styles.discountPoints}>{discount.pointsRequired}</Text>
                    <Text style={styles.discountPointsLabel}>points</Text>
                  </View>
                </View>
                
                <View style={styles.discountDetails}>
                  <Text style={styles.discountSavings}>
                    Save: ${calculateEcoDiscount(discount).toFixed(2)}
                  </Text>
                  {discount.minCartValue && (
                    <Text style={[
                      styles.discountRequirement,
                      !meetsMinimum && styles.discountRequirementUnmet
                    ]}>
                      Min. cart: ${discount.minCartValue}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.applyDiscountButton,
                    (!canUse || !meetsMinimum || appliedDiscounts.includes(discount.id)) && 
                    styles.applyDiscountButtonDisabled
                  ]}
                  disabled={!canUse || !meetsMinimum || appliedDiscounts.includes(discount.id)}
                  onPress={() => applyEcoDiscount(discount.id)}
                >
                  <Text style={styles.applyDiscountButtonText}>
                    {appliedDiscounts.includes(discount.id) ? 'Applied ✓' :
                     !canUse ? 'Not Enough Points' :
                     !meetsMinimum ? 'Minimum Not Met' : 'Apply Discount'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const subtotal = calculateSubtotal();
  const totalDiscount = getTotalDiscount();
  const total = subtotal - totalDiscount;
  const totalEcoPoints = getTotalEcoPoints();
  const totalCO2 = getTotalCO2Impact();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Cart Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🛍️ My Cart</Text>
          <Text style={styles.headerSubtitle}>
            {cartItems.length} items • ${subtotal.toFixed(2)} total
          </Text>
        </View>

        {/* Cart Items */}
        <View style={styles.cartItemsSection}>
          {cartItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </View>

        {/* Promo Code Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Promo Code</Text>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.promoButton} onPress={applyPromoCode}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EcoPoints Section */}
        <View style={styles.ecoPointsSection}>
          <View style={styles.ecoPointsHeader}>
            <Text style={styles.ecoPointsTitle}>💰 EcoPoints Rewards</Text>
            <Text style={styles.ecoPointsBalance}>{userEcoPoints} points available</Text>
          </View>
          <TouchableOpacity 
            style={styles.ecoPointsButton}
            onPress={() => setShowDiscountModal(true)}
          >
            <Text style={styles.ecoPointsButtonText}>Use EcoPoints for Discounts</Text>
          </TouchableOpacity>
        </View>

        {/* Impact Summary */}
        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>🌍 Environmental Impact</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactCard}>
              <Text style={styles.impactValue}>{totalCO2.toFixed(1)} kg</Text>
              <Text style={styles.impactLabel}>CO₂ Impact</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactValue}>+{totalEcoPoints}</Text>
              <Text style={styles.impactLabel}>EcoPoints Earned</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>Discounts</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>-${totalDiscount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
          </View>
          <Text style={styles.summaryEcoPoints}>You'll earn {totalEcoPoints} EcoPoints!</Text>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutSection}>
        <TouchableOpacity style={styles.checkoutButton} onPress={proceedToCheckout}>
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout • ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      <SwapModal />
      <DiscountModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0071CE',
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
  cartItemsSection: {
    padding: 16,
    gap: 16,
  },
  cartItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemAisle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemBadges: {
    gap: 4,
  },
  ecoBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ecoBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  saleBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saleBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0071CE',
  },
  itemPoints: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  itemCO2: {
    fontSize: 12,
    color: '#EF4444',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 16,
  },
  swapButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
  },
  swapButtonText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  promoSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  promoButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ecoPointsSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ecoPointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ecoPointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  ecoPointsBalance: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  ecoPointsButton: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ecoPointsButtonText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  impactSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  impactCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  summarySection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  discountLabel: {
    color: '#059669',
  },
  discountValue: {
    color: '#059669',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryEcoPoints: {
    fontSize: 12,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  checkoutSection: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  checkoutButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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
  modalPoints: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  swapComparisonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  swapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  comparisonGrid: {
    marginBottom: 20,
  },
  comparisonItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  ecoComparisonItem: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  comparisonName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  comparisonPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0071CE',
    marginBottom: 4,
  },
  comparisonCO2: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 4,
  },
  betterCO2: {
    color: '#10B981',
  },
  comparisonPoints: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  betterPoints: {
    color: '#10B981',
  },
  comparisonDivider: {
    alignItems: 'center',
    marginVertical: 8,
  },
  comparisonVs: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  swapActions: {
    flexDirection: 'row',
    gap: 12,
  },
  keepButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  keepButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  swapConfirmButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  swapConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  discountsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  discountCard: {
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
  discountCardDisabled: {
    opacity: 0.6,
  },
  discountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  discountInfo: {
    flex: 1,
  },
  discountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  discountDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  discountCost: {
    alignItems: 'center',
  },
  discountPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  discountPointsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  discountDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountSavings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  discountRequirement: {
    fontSize: 12,
    color: '#6B7280',
  },
  discountRequirementUnmet: {
    color: '#EF4444',
  },
  applyDiscountButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyDiscountButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  applyDiscountButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});