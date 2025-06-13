// app/(customer)/(tabs)/cart.tsx - Enhanced Cart with AI Optimizer & Payment Gateway
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CartItem, Order, useAppData } from '../../contexts/AppDataContext';

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

interface AIOptimization {
  type: 'savings' | 'sustainability' | 'nutrition' | 'bundle';
  title: string;
  description: string;
  impact: string;
  actionText: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  potentialSavings?: number;
  sustainabilityImprovement?: number;
}

interface DigitalReceipt {
  id: string;
  orderNumber: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cardLast4?: string;
  ecoPointsEarned: number;
  co2Impact: number;
  storeInfo: {
    name: string;
    address: string;
    phone: string;
  };
}



export default function CartTab() {
  const { 
    cartItems, 
    userEcoPoints, 
    setUserEcoPoints,
    orders,
    addOrder,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
  } = useAppData();

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [showAIOptimizerModal, setShowAIOptimizerModal] = useState(false);
  const [aiOptimizations, setAiOptimizations] = useState<AIOptimization[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingZip: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [digitalReceipt, setDigitalReceipt] = useState<DigitalReceipt | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [processingAnimation] = useState(new Animated.Value(0));

  // FIXED: Memoize static data to prevent recreation on every render
  const ecoDiscounts: EcoDiscount[] = useMemo(() => [
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
  ], []);

  const promoCodes = useMemo(() => [
    { code: 'EARTHDAY', discount: 0.15, description: 'Earth Day Special - 15% off eco products' },
    { code: 'NEWECO', discount: 0.10, description: 'New Eco Customer - 10% off first eco purchase' },
    { code: 'GREENLIVING', discount: 5.00, description: 'Green Living - $5 off orders over $30' }
  ], []);

  // FIXED: Memoize cart items transformation to prevent unnecessary recalculations
  const localCartItems: CartItem[] = useMemo(() => 
    cartItems.map(item => ({
      id: item.id,
      name: item.name,
      brand: item.brand || 'Unknown',
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity || 1,
      co2Impact: item.co2Impact || 0,
      sustainabilityScore: item.sustainabilityScore || 5,
      category: item.category,
      isEcoFriendly: item.isEcoFriendly || false,
      ecoPoints: item.ecoPoints || 0,
      aisle: item.aisle || 'Unknown',
      image: item.image,
      isRescueDeal: item.isRescueDeal || false,
      isEcoAlternative: item.isEcoAlternative || false,
      isScanned: item.isScanned || false
    }))
  , [cartItems]);

  // FIXED: Memoize expensive calculations
  const subtotal = useMemo(() => 
    localCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  , [localCartItems]);

  const totalEcoPoints = useMemo(() => 
    localCartItems.reduce((sum, item) => sum + (item.ecoPoints * item.quantity), 0)
  , [localCartItems]);

  const totalCO2 = useMemo(() => 
    localCartItems.reduce((sum, item) => sum + (item.co2Impact * item.quantity), 0)
  , [localCartItems]);

  const avgSustainabilityScore = useMemo(() => {
    if (localCartItems.length === 0) return 0;
    const totalScore = localCartItems.reduce((sum, item) => sum + item.sustainabilityScore, 0);
    return totalScore / localCartItems.length;
  }, [localCartItems]);

  // AI Cart Optimizer Logic
  const generateAIOptimizations = useCallback((cartItems: CartItem[]): AIOptimization[] => {
    if (cartItems.length === 0) return [];

    const optimizations: AIOptimization[] = [];
    const currentSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const ecoItemsCount = cartItems.filter(item => item.isEcoFriendly).length;
    const avgSustainability = cartItems.reduce((sum, item) => sum + item.sustainabilityScore, 0) / cartItems.length;

    // Savings Optimization
    if (currentSubtotal < 50 && currentSubtotal > 40) {
      optimizations.push({
        type: 'savings',
        title: 'Unlock Free Shipping',
        description: `Add $${(50 - currentSubtotal).toFixed(2)} more to get free shipping and save $4.99`,
        impact: `Save $4.99 on shipping`,
        actionText: 'Add qualifying items',
        icon: '🚚',
        priority: 'high',
        potentialSavings: 4.99
      });
    }

    // Sustainability Optimization
    if (ecoItemsCount < cartItems.length * 0.5) {
      optimizations.push({
        type: 'sustainability',
        title: 'Boost Your Eco Impact',
        description: `${cartItems.length - ecoItemsCount} items could be swapped for eco-friendly alternatives`,
        impact: `Reduce CO₂ by ~2.3kg and earn +${(cartItems.length - ecoItemsCount) * 15} EcoPoints`,
        actionText: 'View eco alternatives',
        icon: '🌱',
        priority: 'medium',
        sustainabilityImprovement: 2.3
      });
    }

    // Bundle Optimization
    if (cartItems.some(item => item.category.includes('produce')) && 
        !cartItems.some(item => item.category.includes('dairy'))) {
      optimizations.push({
        type: 'bundle',
        title: 'Complete Your Meal',
        description: 'Add dairy products to complement your fresh produce',
        impact: 'Save 15% on dairy when bundled with produce',
        actionText: 'Browse dairy products',
        icon: '🥛',
        priority: 'low',
        potentialSavings: currentSubtotal * 0.15
      });
    }

    // EcoPoints Optimization
    if (userEcoPoints >= 250 && currentSubtotal >= 25) {
      optimizations.push({
        type: 'savings',
        title: 'Use Your EcoPoints',
        description: 'You can save money using your accumulated EcoPoints',
        impact: `Save up to $${Math.min(10, currentSubtotal * 0.05).toFixed(2)} with Eco Champion discount`,
        actionText: 'Apply EcoPoints discount',
        icon: '💰',
        priority: 'high',
        potentialSavings: Math.min(10, currentSubtotal * 0.05)
      });
    }

    // Nutrition Optimization
    if (!cartItems.some(item => item.category.includes('produce'))) {
      optimizations.push({
        type: 'nutrition',
        title: 'Add Fresh Nutrition',
        description: 'Your cart lacks fresh fruits and vegetables',
        impact: 'Boost nutrition and earn extra EcoPoints for fresh produce',
        actionText: 'Browse fresh produce',
        icon: '🥕',
        priority: 'medium'
      });
    }

    return optimizations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [userEcoPoints]);

  // Generate AI optimizations when cart changes
  useEffect(() => {
    if (localCartItems.length > 0) {
      const optimizations = generateAIOptimizations(localCartItems);
      setAiOptimizations(optimizations);
    } else {
      setAiOptimizations([]);
    }
  }, [localCartItems, generateAIOptimizations]);

  // FIXED: Memoize calculation functions to prevent recreation
  const calculateEcoDiscount = useCallback((discount: EcoDiscount) => {
    const ecoProductsTotal = localCartItems
      .filter(item => item.isEcoFriendly)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const baseAmount = discount.ecoProductsOnly ? ecoProductsTotal : subtotal;
    
    if (discount.discountType === 'percentage') {
      const discountAmount = baseAmount * (discount.discountValue / 100);
      return Math.min(discountAmount, discount.maxDiscount || discountAmount);
    } else {
      return discount.discountValue;
    }
  }, [localCartItems, subtotal]);

  const calculatePromoDiscount = useCallback(() => {
    const foundPromo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!foundPromo) return 0;
    
    if (typeof foundPromo.discount === 'number' && foundPromo.discount < 1) {
      return subtotal * foundPromo.discount;
    } else {
      return foundPromo.discount as number;
    }
  }, [promoCodes, promoCode, subtotal]);

  const getTotalDiscount = useCallback(() => {
    let totalDiscount = 0;
    appliedDiscounts.forEach(discountId => {
      const discount = ecoDiscounts.find(d => d.id === discountId);
      if (discount) {
        totalDiscount += calculateEcoDiscount(discount);
      }
    });
    totalDiscount += calculatePromoDiscount();
    return totalDiscount;
  }, [appliedDiscounts, ecoDiscounts, calculateEcoDiscount, calculatePromoDiscount]);

  // Navigation functions
  const navigateToShopping = () => {
    router.push('./dashboard');
  };

  const navigateToScanner = () => {
    router.push('./scan');
  };

  // AI Optimizer Action Functions
  // (Removed duplicate handleOptimizationAction declaration)

  // Memoized payment input handlers to prevent form fluctuation
  const updatePaymentField = useCallback((field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCardNumberChange = useCallback((text: string) => {
    // Format card number with spaces
    const formatted = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    updatePaymentField('cardNumber', formatted);
  }, [updatePaymentField]);

  const handleExpiryDateChange = useCallback((text: string) => {
    // Format expiry date as MM/YY
    const formatted = text.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    updatePaymentField('expiryDate', formatted);
  }, [updatePaymentField]);

  const handleCvvChange = useCallback((text: string) => {
    updatePaymentField('cvv', text.replace(/\D/g, ''));
  }, [updatePaymentField]);

  const handleCardholderNameChange = useCallback((text: string) => {
    updatePaymentField('cardholderName', text);
  }, [updatePaymentField]);

  const handleBillingZipChange = useCallback((text: string) => {
    updatePaymentField('billingZip', text.replace(/\D/g, ''));
  }, [updatePaymentField]);

  const applyEcoDiscount = useCallback((discountId: string) => {
    const discount = ecoDiscounts.find(d => d.id === discountId);
    if (!discount) return;

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
  }, [ecoDiscounts, subtotal, userEcoPoints, setUserEcoPoints]);

  const handleOptimizationAction = useCallback((optimization: AIOptimization) => {
    switch (optimization.type) {
      case 'savings':
        if (optimization.title.includes('Free Shipping')) {
          // Navigate to shopping to add more items
          Alert.alert(
            'Add More Items 🛒',
            `Add ${(50 - subtotal).toFixed(2)} more to unlock free shipping and save $4.99!`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Shop Now', onPress: () => {
                setShowAIOptimizerModal(false);
                navigateToShopping();
              }}
            ]
          );
        } else if (optimization.title.includes('EcoPoints')) {
          // Apply the best available EcoPoints discount
          const bestDiscount = ecoDiscounts.find(d => 
            userEcoPoints >= d.pointsRequired && 
            (!d.minCartValue || subtotal >= d.minCartValue) &&
            !appliedDiscounts.includes(d.id)
          );
          if (bestDiscount) {
            applyEcoDiscount(bestDiscount.id);
            setShowAIOptimizerModal(false);
          } else {
            Alert.alert('No Available Discounts', 'No EcoPoints discounts are currently available for your cart.');
          }
        }
        break;
        
      case 'sustainability':
        // Show eco-friendly alternatives or apply eco discount
        Alert.alert(
          'Eco-Friendly Alternatives 🌱',
          'Switch to eco-friendly versions of your items to reduce CO₂ impact and earn more EcoPoints!',
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Show Eco Products', onPress: () => {
              setShowAIOptimizerModal(false);
              // Here you could navigate to a filtered eco products view
              navigateToShopping();
            }}
          ]
        );
        break;
        
      case 'bundle':
        // Navigate to suggested category
        Alert.alert(
          'Complete Your Bundle 🥛',
          'Add dairy products to get 15% off when bundled with your produce items!',
          [
            { text: 'Skip', style: 'cancel' },
            { text: 'Browse Dairy', onPress: () => {
              setShowAIOptimizerModal(false);
              navigateToShopping();
            }}
          ]
        );
        break;
        
      case 'nutrition':
        // Navigate to produce section
        Alert.alert(
          'Add Fresh Nutrition 🥕',
          'Fresh fruits and vegetables will boost your nutrition and earn extra EcoPoints!',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Browse Produce', onPress: () => {
              setShowAIOptimizerModal(false);
              navigateToShopping();
            }}
          ]
        );
        break;
        
      default:
        Alert.alert('Coming Soon!', 'This optimization feature is coming soon.');
    }
  }, [subtotal, userEcoPoints, ecoDiscounts, appliedDiscounts, applyEcoDiscount, navigateToShopping]);

  const applyPromoCode = useCallback(() => {
    const foundPromo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!foundPromo) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }
    Alert.alert('Promo Applied! 🎉', foundPromo.description);
  }, [promoCodes, promoCode]);


  const handleCloseReceipt = () => {
  setShowReceiptModal(false);
  setDigitalReceipt(null);
  clearCart();
  setAppliedDiscounts([]);
  setPromoCode('');
};
  // Payment processing
  const processPayment = useCallback(async () => {
    setPaymentProcessing(true);
    
    // Animate processing
    Animated.loop(
      Animated.sequence([
        Animated.timing(processingAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(processingAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const discount = getTotalDiscount();
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + tax;
    const ecoPoints = totalEcoPoints;
    
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      date: new Date(),
      items: localCartItems,
      subtotal,
      discount,
      total,
      ecoPointsEarned: ecoPoints,
      status: 'Processing'
    };

    // Generate digital receipt
    const receipt: DigitalReceipt = {
      id: `receipt_${Date.now()}`,
      orderNumber: newOrder.id.replace('order_', 'WMT-'),
      date: new Date(),
      items: localCartItems,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: 'Credit Card',
      cardLast4: paymentData.cardNumber.slice(-4),
      ecoPointsEarned: ecoPoints,
      co2Impact: totalCO2,
      storeInfo: {
        name: 'Walmart EcoConnect',
        address: '123 Green Street, Eco City, EC 12345',
        phone: '(555) 123-4567'
      }
    };

    setDigitalReceipt(receipt);
    setShowReceiptModal(true);

    addOrder(newOrder);
    setUserEcoPoints(prev => prev + ecoPoints);
    

    setPaymentProcessing(false);
    setShowPaymentModal(false);

    
    // clearCart();
    // setAppliedDiscounts([]);
    // setPromoCode('');
    // setTimeout(() => {
    //     clearCart();
    //     setAppliedDiscounts([]);
    //     setPromoCode('');
    // }, 500);
    
    processingAnimation.stopAnimation();
    processingAnimation.setValue(0);
  }, [localCartItems, getTotalDiscount, subtotal, totalEcoPoints, totalCO2, paymentData, addOrder, setUserEcoPoints, clearCart, processingAnimation]);

  const proceedToCheckout = useCallback(() => {
    if (localCartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before proceeding.');
      return;
    }
    setDigitalReceipt(null);
    setShowPaymentModal(true);
    // setShowReceiptModal(true);
  }, [localCartItems]);

  const downloadReceipt = useCallback(async () => {
    if (!digitalReceipt) return;

    const receiptText = `
WALMART ECOCONNECT
Digital Receipt
${digitalReceipt.storeInfo.address}
${digitalReceipt.storeInfo.phone}

Order #: ${digitalReceipt.orderNumber}
Date: ${digitalReceipt.date.toLocaleDateString()} ${digitalReceipt.date.toLocaleTimeString()}

ITEMS:
${digitalReceipt.items.map(item => 
  `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

SUMMARY:
Subtotal: $${digitalReceipt.subtotal.toFixed(2)}
Discount: -$${digitalReceipt.discount.toFixed(2)}
Tax: $${digitalReceipt.tax.toFixed(2)}
TOTAL: $${digitalReceipt.total.toFixed(2)}

Payment: ${digitalReceipt.paymentMethod} ****${digitalReceipt.cardLast4}

ECO IMPACT:
EcoPoints Earned: +${digitalReceipt.ecoPointsEarned}
CO₂ Impact: ${digitalReceipt.co2Impact.toFixed(2)}kg

Thank you for shopping sustainably!
    `.trim();

    try {
      await Share.share({
        message: receiptText,
        title: `Receipt - ${digitalReceipt.orderNumber}`
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  }, [digitalReceipt]);

  // FIXED: Memoize component functions
  const CartItemCard = useCallback(({ item }: { item: CartItem }) => (
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
          {item.isRescueDeal && (
            <View style={styles.rescueBadge}>
              <Text style={styles.rescueBadgeText}>🚨 Rescue</Text>
            </View>
          )}
          {item.isEcoAlternative && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>CartAI Pick</Text>
            </View>
          )}
          {item.isScanned && (
            <View style={styles.scannedBadge}>
              <Text style={styles.scannedBadgeText}>📱 Scanned</Text>
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
        {item.co2Impact > 0 && (
          <Text style={styles.itemCO2}>🌍 {item.co2Impact} kg CO₂</Text>
        )}
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [updateCartItemQuantity, removeFromCart]);

  const EmptyCartView = useCallback(() => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyCartIcon}>🛒</Text>
      <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyCartText}>
        Start shopping to add items to your cart!{'\n'}
        Try scanning products or browse our dashboard for great deals.
      </Text>
      <View style={styles.emptyCartActions}>
        <TouchableOpacity style={styles.emptyCartButton} onPress={navigateToShopping}>
          <Text style={styles.emptyCartButtonText}>Start Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emptyCartButton} onPress={navigateToScanner}>
          <Text style={styles.emptyCartButtonText}>Scan Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  const AIOptimizerModal = useCallback(() => (
    <Modal visible={showAIOptimizerModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAIOptimizerModal(false)}>
            <Text style={styles.modalBackButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>AI Cart Optimizer</Text>
          <View />
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.optimizationIntroTitle}>Smart Cart Analysis</Text>
          <Text style={styles.optimizationIntroText}>
            Our AI analyzed your cart and found {aiOptimizations.length} opportunities to optimize your shopping!
          </Text>

          {/* Cart Stats */}
          <View style={styles.cartStatsCard}>
            <Text style={styles.cartStatsTitle}>📊 Cart Overview</Text>
            <View style={styles.cartStatsGrid}>
              <View style={styles.cartStatItem}>
                <Text style={styles.cartStatValue}>${subtotal.toFixed(2)}</Text>
                <Text style={styles.cartStatLabel}>Cart Value</Text>
              </View>
              <View style={styles.cartStatItem}>
                <Text style={styles.cartStatValue}>{avgSustainabilityScore.toFixed(1)}/10</Text>
                <Text style={styles.cartStatLabel}>Sustainability</Text>
              </View>
              <View style={styles.cartStatItem}>
                <Text style={styles.cartStatValue}>{localCartItems.filter(i => i.isEcoFriendly).length}</Text>
                <Text style={styles.cartStatLabel}>Eco Items</Text>
              </View>
              <View style={styles.cartStatItem}>
                <Text style={styles.cartStatValue}>+{totalEcoPoints}</Text>
                <Text style={styles.cartStatLabel}>EcoPoints</Text>
              </View>
            </View>
          </View>

          {aiOptimizations.map((optimization, index) => (
            <View key={index} style={[
              styles.optimizationCard,
              optimization.priority === 'high' && styles.optimizationCardHigh,
              optimization.priority === 'medium' && styles.optimizationCardMedium
            ]}>
              <View style={styles.optimizationHeader}>
                <Text style={styles.optimizationIcon}>{optimization.icon}</Text>
                <View style={styles.optimizationInfo}>
                  <Text style={styles.optimizationTitle}>{optimization.title}</Text>
                  <Text style={styles.optimizationDescription}>{optimization.description}</Text>
                </View>
                <View style={[
                  styles.priorityBadge,
                  optimization.priority === 'high'
                    ? styles.priorityHigh
                    : optimization.priority === 'medium'
                    ? styles.priorityMedium
                    : styles.priorityLow
                ]}>
                  <Text style={styles.priorityText}>{optimization.priority.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.optimizationImpact}>
                <Text style={styles.optimizationImpactText}>💡 {optimization.impact}</Text>
              </View>

              <TouchableOpacity 
                style={styles.optimizationActionButton}
                onPress={() => handleOptimizationAction(optimization)}
              >
                <Text style={styles.optimizationActionText}>{optimization.actionText}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {aiOptimizations.length === 0 && (
            <View style={styles.noOptimizationsCard}>
              <Text style={styles.noOptimizationsIcon}>✨</Text>
              <Text style={styles.noOptimizationsTitle}>Your Cart is Optimized!</Text>
              <Text style={styles.noOptimizationsText}>
                Great job! Your cart is already well-optimized for savings and sustainability.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  ), [showAIOptimizerModal, aiOptimizations, subtotal, avgSustainabilityScore, localCartItems, totalEcoPoints, handleOptimizationAction]);

  const PaymentModal = useCallback(() => (
  <Modal visible={showPaymentModal} animationType="slide" presentationStyle="fullScreen">
    <SafeAreaView style={styles.paymentModalContainer}>
      <View style={styles.paymentHeader}>
        <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
          <Text style={styles.paymentBackButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.paymentTitle}>Secure Checkout</Text>
        
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.paymentContent} keyboardShouldPersistTaps="handled">
          {/* Order Summary */}
          <View style={styles.paymentSummaryCard}>
            <Text style={styles.paymentSummaryTitle}>Order Summary</Text>
            <View style={styles.paymentSummaryRow}>
              <Text style={styles.paymentSummaryLabel}>Subtotal</Text>
              <Text style={styles.paymentSummaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            {getTotalDiscount() > 0 && (
              <View style={styles.paymentSummaryRow}>
                <Text style={styles.paymentSummaryLabel}>Discounts</Text>
                <Text style={[styles.paymentSummaryValue, styles.discountText]}>-${getTotalDiscount().toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.paymentSummaryRow}>
              <Text style={styles.paymentSummaryLabel}>Tax</Text>
              <Text style={styles.paymentSummaryValue}>${((subtotal - getTotalDiscount()) * 0.08).toFixed(2)}</Text>
            </View>
            <View style={styles.paymentSummaryDivider} />
            <View style={styles.paymentSummaryRow}>
              <Text style={styles.paymentSummaryTotalLabel}>Total</Text>
              <Text style={styles.paymentSummaryTotalValue}>${(subtotal - getTotalDiscount() + (subtotal - getTotalDiscount()) * 0.08).toFixed(2)}</Text>
            </View>
          </View>

          {/* Payment Form */}
          <View style={styles.paymentFormCard}>
            <Text style={styles.paymentFormTitle}>💳 Payment Information</Text>
            
            <View style={styles.paymentInputGroup}>
              <Text style={styles.paymentInputLabel}>Card Number</Text>
              <TextInput
                style={styles.paymentInput}
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.paymentInputRow}>
              <View style={styles.paymentInputHalf}>
                <Text style={styles.paymentInputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={styles.paymentInputHalf}>
                <Text style={styles.paymentInputLabel}>CVV</Text>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="123"
                  value={paymentData.cvv}
                  onChangeText={handleCvvChange}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.paymentInputGroup}>
              <Text style={styles.paymentInputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.paymentInput}
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChangeText={handleCardholderNameChange}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.paymentInputGroup}>
              <Text style={styles.paymentInputLabel}>Billing ZIP Code</Text>
              <TextInput
                style={styles.paymentInput}
                placeholder="12345"
                value={paymentData.billingZip}
                onChangeText={handleBillingZipChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity 
          style={[styles.paymentButton, paymentProcessing && styles.paymentButtonProcessing]}
          onPress={processPayment}
          disabled={paymentProcessing}
        >
          {paymentProcessing ? (
            <View style={styles.processingContainer}>
              <Animated.View style={[
                styles.processingDot,
                {
                  opacity: processingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ]} />
              <Text style={styles.paymentButtonText}>Processing Payment...</Text>
            </View>
          ) : (
            <Text style={styles.paymentButtonText}>
              Complete Purchase • ${(subtotal - getTotalDiscount() + (subtotal - getTotalDiscount()) * 0.08).toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </Modal>
), [
  showPaymentModal, 
  subtotal, 
  getTotalDiscount, 
  paymentData, 
  paymentProcessing, 
  processPayment, 
  processingAnimation,
  handleCardNumberChange,
  handleExpiryDateChange,
  handleCvvChange,
  handleCardholderNameChange,
  handleBillingZipChange
]);

  const ReceiptModal = useCallback(() => (
    <Modal visible={showReceiptModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.receiptModalContainer}>
        <View style={styles.receiptHeader}>
          {/* <TouchableOpacity onPress={() => setShowReceiptModal(false)}>
            <Text style={styles.receiptCloseButton}>✕</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={handleCloseReceipt}>
            <Text style={styles.receiptCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.receiptTitle}>Digital Receipt</Text>
          <TouchableOpacity onPress={downloadReceipt}>
            <Text style={styles.receiptDownloadButton}>Share</Text>
          </TouchableOpacity>
        </View>

        {digitalReceipt && (
          <ScrollView style={styles.receiptContent}>
            {/* Success Animation */}
            <View style={styles.receiptSuccessSection}>
          
              <Text style={styles.receiptSuccessTitle}>Payment Successful!</Text>
              <Text style={styles.receiptSuccessSubtitle}>
                Your order has been placed and is being processed.
              </Text>
            </View>

            {/* Receipt Details */}
            <View style={styles.receiptDetailsCard}>
              <View style={styles.receiptStoreHeader}>
                <Text style={styles.receiptStoreName}>{digitalReceipt.storeInfo.name}</Text>
                <Text style={styles.receiptStoreAddress}>{digitalReceipt.storeInfo.address}</Text>
                <Text style={styles.receiptStorePhone}>{digitalReceipt.storeInfo.phone}</Text>
              </View>

              <View style={styles.receiptOrderInfo}>
                <View style={styles.receiptInfoRow}>
                  <Text style={styles.receiptInfoLabel}>Order Number:</Text>
                  <Text style={styles.receiptInfoValue}>{digitalReceipt.orderNumber}</Text>
                </View>
                <View style={styles.receiptInfoRow}>
                  <Text style={styles.receiptInfoLabel}>Date & Time:</Text>
                  <Text style={styles.receiptInfoValue}>
                    {digitalReceipt.date.toLocaleDateString()} {digitalReceipt.date.toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.receiptInfoRow}>
                  <Text style={styles.receiptInfoLabel}>Payment Method:</Text>
                  <Text style={styles.receiptInfoValue}>
                    {digitalReceipt.paymentMethod} ****{digitalReceipt.cardLast4}
                  </Text>
                </View>
              </View>

              {/* Items */}
              <View style={styles.receiptItemsSection}>
                <Text style={styles.receiptSectionTitle}>Items Purchased</Text>
                {digitalReceipt.items.map((item, index) => (
                  <View key={index} style={styles.receiptItem}>
                    <View style={styles.receiptItemInfo}>
                      <Text style={styles.receiptItemName}>{item.name}</Text>
                      <Text style={styles.receiptItemDetails}>
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.receiptItemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Totals */}
              <View style={styles.receiptTotalsSection}>
                <View style={styles.receiptTotalRow}>
                  <Text style={styles.receiptTotalLabel}>Subtotal:</Text>
                  <Text style={styles.receiptTotalValue}>${digitalReceipt.subtotal.toFixed(2)}</Text>
                </View>
                {digitalReceipt.discount > 0 && (
                  <View style={styles.receiptTotalRow}>
                    <Text style={[styles.receiptTotalLabel, styles.discountLabel]}>Discounts:</Text>
                    <Text style={[styles.receiptTotalValue, styles.discountValue]}>
                      -${digitalReceipt.discount.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.receiptTotalRow}>
                  <Text style={styles.receiptTotalLabel}>Tax:</Text>
                  <Text style={styles.receiptTotalValue}>${digitalReceipt.tax.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptTotalDivider} />
                <View style={styles.receiptTotalRow}>
                  <Text style={styles.receiptGrandTotalLabel}>TOTAL:</Text>
                  <Text style={styles.receiptGrandTotalValue}>${digitalReceipt.total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Eco Impact */}
              <View style={styles.receiptEcoSection}>
                <Text style={styles.receiptSectionTitle}>🌱 Environmental Impact</Text>
                <View style={styles.receiptEcoGrid}>
                  <View style={styles.receiptEcoItem}>
                    <Text style={styles.receiptEcoValue}>+{digitalReceipt.ecoPointsEarned}</Text>
                    <Text style={styles.receiptEcoLabel}>EcoPoints Earned</Text>
                  </View>
                  <View style={styles.receiptEcoItem}>
                    <Text style={styles.receiptEcoValue}>{digitalReceipt.co2Impact.toFixed(2)}kg</Text>
                    <Text style={styles.receiptEcoLabel}>CO₂ Impact</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Thank You Message */}
            <View style={styles.receiptThankYouSection}>
              <Text style={styles.receiptThankYouTitle}>Thank you for shopping sustainably! 🌍</Text>
              <Text style={styles.receiptThankYouText}>
                Your purchase helps support eco-friendly practices and reduces environmental impact.
              </Text>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  ), [showReceiptModal, digitalReceipt, downloadReceipt]);

  const OrdersModal = useCallback(() => (
    <Modal visible={showOrdersModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowOrdersModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>📦 My Orders</Text>
          <View />
        </View>

        <ScrollView style={styles.modalContent}>
          {orders.map((order, index) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <Text style={styles.orderCardId}>Order #{order.id.slice(-8)}</Text>
                <Text style={styles.orderCardStatus}>{order.status}</Text>
              </View>
              <Text style={styles.orderCardDate}>
                {order.date.toLocaleDateString()} at {order.date.toLocaleTimeString()}
              </Text>
              <View style={styles.orderCardInfo}>
                <Text style={styles.orderCardItems}>{order.items.length} items</Text>
                <Text style={styles.orderCardTotal}>${order.total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.viewOrderDetailsButton}>
                <Text style={styles.viewOrderDetailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}

          {orders.length === 0 && (
            <View style={styles.noOrdersCard}>
              <Text style={styles.noOrdersIcon}>📦</Text>
              <Text style={styles.noOrdersTitle}>No Orders Yet</Text>
              <Text style={styles.noOrdersText}>
                Your order history will appear here once you make your first purchase.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  ), [showOrdersModal, orders]);

  const DiscountModal = useCallback(() => (
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
  ), [showDiscountModal, userEcoPoints, ecoDiscounts, subtotal, appliedDiscounts, calculateEcoDiscount, applyEcoDiscount]);

  // Calculate final values
  const totalDiscount = getTotalDiscount();
  const total = subtotal - totalDiscount;

  if (localCartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubtitle}>Your cart is empty</Text>
        </View>
        <EmptyCartView />
      </SafeAreaView>
    );
  }

  return (
  <SafeAreaView style={styles.container}>
    {localCartItems.length === 0 ? (
      <>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubtitle}>Your cart is empty</Text>
        </View>
        <EmptyCartView />
      </>
    ) : (
      <>
        <ScrollView style={styles.content}>
          {/* Cart Items */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Cart</Text>
            <Text style={styles.headerSubtitle}>
              {localCartItems.length} items • ${subtotal.toFixed(2)} total
            </Text>
          </View>
          <View style={styles.cartItemsSection}>
            {localCartItems.map(item => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </View>
          {/* AI Optimizer Section */}
          {aiOptimizations.length > 0 && (
            <View style={styles.aiOptimizerSection}>
              <View style={styles.aiOptimizerHeader}>
                <Text style={styles.aiOptimizerTitle}>AI Cart Optimizer</Text>
                <Text style={styles.aiOptimizerSubtitle}>
                  {aiOptimizations.length} optimization{aiOptimizations.length > 1 ? 's' : ''} found
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.viewOptimizationsButton}
                onPress={() => setShowAIOptimizerModal(true)}
              >
                <Text style={styles.viewOptimizationsButtonText}>
                  💡 View Optimizations • Save up to ${aiOptimizations.reduce((sum, opt) => sum + (opt.potentialSavings || 0), 0).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
                <Text style={styles.impactValue}>{totalCO2.toFixed(2)} kg</Text>
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
        <View style={styles.checkoutSection}>
          <TouchableOpacity style={styles.checkoutButton} onPress={proceedToCheckout}>
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout • ${total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )}
    {/* Modals are now always rendered */}
    <AIOptimizerModal />
    <PaymentModal />
    <ReceiptModal />
    <OrdersModal />
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyCartIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyCartActions: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyCartButton: {
    backgroundColor: '#0071CE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyCartButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    alignItems: 'flex-end',
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
  rescueBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rescueBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  aiBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aiBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scannedBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scannedBadgeText: {
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
  
  // AI Optimizer Section
  aiOptimizerSection: {
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
  aiOptimizerHeader: {
    marginBottom: 12,
  },
  aiOptimizerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  aiOptimizerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewOptimizationsButton: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewOptimizationsButtonText: {
    color: '#0071CE',
    fontSize: 14,
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

  // AI Optimizer Modal Styles
  optimizationIntroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  optimizationIntroText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  cartStatsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  cartStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cartStatItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  cartStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cartStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  optimizationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optimizationCardHigh: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  optimizationCardMedium: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  optimizationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  optimizationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optimizationInfo: {
    flex: 1,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optimizationDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  priorityBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
  },
  priorityLow: {
    backgroundColor: '#F0FDF4',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  optimizationImpact: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  optimizationImpactText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
  },
  optimizationActionButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  optimizationActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noOptimizationsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noOptimizationsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noOptimizationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  noOptimizationsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Payment Modal Styles
  paymentModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  paymentHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentBackButton: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paymentSecure: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  paymentContent: {
    flex: 1,
    padding: 20,
  },
  paymentSummaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentSummaryValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  discountText: {
    color: '#059669',
  },
  paymentSummaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  paymentSummaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paymentSummaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paymentFormCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  paymentInputGroup: {
    marginBottom: 16,
  },
  paymentInputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  paymentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  paymentInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentInputHalf: {
    flex: 1,
  },
  securityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  securityFeatures: {
    gap: 8,
  },
  securityFeature: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  paymentButtonContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  paymentButton: {
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
  paymentButtonProcessing: {
    backgroundColor: '#9CA3AF',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  processingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },

  // Receipt Modal Styles
  receiptModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  receiptHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptCloseButton: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  receiptDownloadButton: {
    fontSize: 14,
    color: '#0071CE',
    fontWeight: '600',
  },
  receiptContent: {
    flex: 1,
    padding: 20,
  },
  receiptSuccessSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  receiptSuccessIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  receiptSuccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  receiptSuccessSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  receiptDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  receiptStoreHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  receiptStoreName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  receiptStoreAddress: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  receiptStorePhone: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  receiptOrderInfo: {
    marginBottom: 16,
  },
  receiptInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  receiptInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  receiptInfoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  receiptItemsSection: {
    marginBottom: 16,
  },
  receiptSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  receiptItemInfo: {
    flex: 1,
  },
  receiptItemName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  receiptItemDetails: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  receiptItemTotal: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  receiptTotalsSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 16,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  receiptTotalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  receiptTotalValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  receiptTotalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  receiptGrandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  receiptGrandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  receiptEcoSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  receiptEcoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  receiptEcoItem: {
    flex: 1,
    alignItems: 'center',
  },
  receiptEcoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  receiptEcoLabel: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
  },
  receiptThankYouSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  receiptThankYouTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  receiptThankYouText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Order Card Styles
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCardId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderCardStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderCardDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  orderCardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderCardItems: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderCardTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewOrderDetailsButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewOrderDetailsButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  noOrdersCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noOrdersIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noOrdersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  noOrdersText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Discount Modal Styles
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