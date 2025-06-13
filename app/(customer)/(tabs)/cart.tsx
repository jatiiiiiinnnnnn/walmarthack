// app/(customer)/(tabs)/cart.tsx - COMPLETE FIXED VERSION
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

interface AIRecipe {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: string;
  servings: number;
  matchScore: number;
  ingredients: string[];
  availableIngredients: string[];
  missingIngredients: string[];
  instructions: string[];
  nutritionHighlights: string[];
  sustainabilityNotes: string;
  category: string;
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
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [aiRecipes, setAiRecipes] = useState<AIRecipe[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

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

  // FIXED: Move recipe generation to useCallback to prevent recreation
  const generateAIRecipes = useCallback((cartItems: CartItem[]): AIRecipe[] => {
    if (cartItems.length === 0) return [];

    const baseRecipes: Omit<AIRecipe, 'availableIngredients' | 'missingIngredients' | 'matchScore'>[] = [
      {
        id: 'recipe_1',
        name: 'Eco-Friendly Stir Fry',
        description: 'Quick and healthy vegetable stir fry using sustainable ingredients',
        difficulty: 'Easy',
        cookTime: '15 minutes',
        servings: 2,
        ingredients: ['Organic vegetables', 'Plant-based protein', 'Coconut oil', 'Soy sauce', 'Garlic', 'Ginger'],
        instructions: [
          'Heat coconut oil in a large pan',
          'Add garlic and ginger, stir for 30 seconds',
          'Add vegetables and protein, stir fry for 8-10 minutes',
          'Season with soy sauce and serve hot'
        ],
        nutritionHighlights: ['High in protein', 'Rich in vitamins', 'Low in calories'],
        sustainabilityNotes: 'This recipe uses locally sourced organic vegetables and plant-based proteins to minimize environmental impact.',
        category: 'Dinner'
      },
      {
        id: 'recipe_2',
        name: 'Sustainable Smoothie Bowl',
        description: 'Nutritious breakfast bowl with organic fruits and nuts',
        difficulty: 'Easy',
        cookTime: '5 minutes',
        servings: 1,
        ingredients: ['Organic berries', 'Banana', 'Organic yogurt', 'Granola', 'Nuts', 'Honey'],
        instructions: [
          'Blend berries, banana, and yogurt until smooth',
          'Pour into bowl',
          'Top with granola, nuts, and honey',
          'Enjoy immediately'
        ],
        nutritionHighlights: ['High in fiber', 'Rich in antioxidants', 'Probiotic benefits'],
        sustainabilityNotes: 'Made with organic ingredients that support sustainable farming practices.',
        category: 'Breakfast'
      },
      {
        id: 'recipe_3',
        name: 'Zero-Waste Pasta',
        description: 'Delicious pasta using whole ingredients with minimal waste',
        difficulty: 'Medium',
        cookTime: '25 minutes',
        servings: 4,
        ingredients: ['Whole wheat pasta', 'Organic tomatoes', 'Basil', 'Garlic', 'Olive oil', 'Parmesan'],
        instructions: [
          'Cook pasta according to package directions',
          'Sauté garlic in olive oil',
          'Add tomatoes and simmer for 15 minutes',
          'Toss with pasta, basil, and cheese',
          'Serve hot'
        ],
        nutritionHighlights: ['Whole grain goodness', 'Rich in lycopene', 'Good source of fiber'],
        sustainabilityNotes: 'Uses whole wheat pasta and organic tomatoes. Food scraps can be composted.',
        category: 'Dinner'
      },
      {
        id: 'recipe_4',
        name: 'Plant-Based Power Bowl',
        description: 'Nutritious bowl packed with plant proteins and fresh vegetables',
        difficulty: 'Easy',
        cookTime: '20 minutes',
        servings: 2,
        ingredients: ['Quinoa', 'Black beans', 'Avocado', 'Sweet potato', 'Spinach', 'Tahini'],
        instructions: [
          'Cook quinoa according to package directions',
          'Roast sweet potato cubes at 400°F for 20 minutes',
          'Arrange quinoa, beans, and vegetables in bowls',
          'Drizzle with tahini dressing',
          'Serve immediately'
        ],
        nutritionHighlights: ['Complete protein', 'Rich in fiber', 'Packed with vitamins'],
        sustainabilityNotes: 'Plant-based proteins have a much lower carbon footprint than animal proteins.',
        category: 'Lunch'
      },
      {
        id: 'recipe_5',
        name: 'Sustainable Seafood Tacos',
        description: 'Eco-friendly fish tacos with seasonal vegetables',
        difficulty: 'Medium',
        cookTime: '30 minutes',
        servings: 3,
        ingredients: ['Sustainable fish', 'Corn tortillas', 'Cabbage', 'Lime', 'Cilantro', 'Greek yogurt'],
        instructions: [
          'Season and grill fish for 4-5 minutes per side',
          'Warm tortillas in a dry pan',
          'Shred cabbage and mix with lime juice',
          'Assemble tacos with fish, slaw, and yogurt',
          'Garnish with cilantro and serve'
        ],
        nutritionHighlights: ['Omega-3 fatty acids', 'Lean protein', 'Rich in vitamins'],
        sustainabilityNotes: 'Choose sustainably caught fish to support ocean conservation.',
        category: 'Dinner'
      }
    ];

    // Analyze cart contents
    const hasOrganic = cartItems.some(item => item.name.toLowerCase().includes('organic') || item.isEcoFriendly);
    const hasVegetables = cartItems.some(item => 
      item.category.toLowerCase().includes('produce') || 
      item.name.toLowerCase().includes('vegetable') ||
      item.name.toLowerCase().includes('carrot') ||
      item.name.toLowerCase().includes('pepper') ||
      item.name.toLowerCase().includes('greens')
    );
    const hasDairy = cartItems.some(item => 
      item.category.toLowerCase().includes('dairy') ||
      item.name.toLowerCase().includes('milk') ||
      item.name.toLowerCase().includes('yogurt') ||
      item.name.toLowerCase().includes('cheese')
    );
    const hasGrains = cartItems.some(item =>
      item.name.toLowerCase().includes('pasta') ||
      item.name.toLowerCase().includes('bread') ||
      item.name.toLowerCase().includes('quinoa') ||
      item.name.toLowerCase().includes('rice')
    );
    const hasProtein = cartItems.some(item =>
      item.name.toLowerCase().includes('meat') ||
      item.name.toLowerCase().includes('protein') ||
      item.name.toLowerCase().includes('beans') ||
      item.name.toLowerCase().includes('eggs')
    );

    return baseRecipes.map(recipe => {
      let availableIngredients: string[] = [];
      let missingIngredients: string[] = [];
      let matchScore = 60; // Base score

      // Check which ingredients are available in cart
      recipe.ingredients.forEach(ingredient => {
        const isAvailable = cartItems.some(item => {
          const itemName = item.name.toLowerCase();
          const ingredientName = ingredient.toLowerCase();
          return itemName.includes(ingredientName.split(' ')[0]) || 
                 itemName.includes(ingredientName.split(' ')[1] || '') ||
                 (ingredientName.includes('organic') && item.isEcoFriendly) ||
                 (ingredientName.includes('vegetables') && hasVegetables) ||
                 (ingredientName.includes('protein') && hasProtein);
        });

        if (isAvailable) {
          availableIngredients.push(ingredient);
        } else {
          missingIngredients.push(ingredient);
        }
      });

      // Calculate match score based on available ingredients
      const availabilityScore = availableIngredients.length > 0 ? 
        (availableIngredients.length / recipe.ingredients.length) * 100 : 0;
      matchScore = Math.floor((matchScore * 0.4) + (availabilityScore * 0.6));

      // Boost score for relevant categories
      if (hasOrganic) matchScore += 15;
      if (hasVegetables && recipe.category === 'Dinner') matchScore += 10;
      if (hasDairy && recipe.name.includes('Smoothie')) matchScore += 20;
      if (hasGrains && recipe.name.includes('Pasta')) matchScore += 25;
      if (hasProtein && recipe.name.includes('Power Bowl')) matchScore += 20;

      // Ensure minimum match score for cart with items
      if (cartItems.length > 0 && matchScore < 30) {
        matchScore = 30 + Math.floor(Math.random() * 20);
      }

      return {
        ...recipe,
        availableIngredients,
        missingIngredients,
        matchScore: Math.min(matchScore, 100)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  // FIXED: Only generate recipes when cart actually changes
  useEffect(() => {
    if (localCartItems.length > 0) {
      const recipes = generateAIRecipes(localCartItems);
      setAiRecipes(recipes);
    } else {
      setAiRecipes([]);
    }
  }, [localCartItems, generateAIRecipes]);

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

  // FIXED: Memoize action functions
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

  const applyPromoCode = useCallback(() => {
    const foundPromo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!foundPromo) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }
    Alert.alert('Promo Applied! 🎉', foundPromo.description);
  }, [promoCodes, promoCode]);

  const proceedToCheckout = useCallback(() => {
    if (localCartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before proceeding.');
      return;
    }

    const discount = getTotalDiscount();
    const total = subtotal - discount;
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

    addOrder(newOrder);
    setUserEcoPoints(prev => prev + ecoPoints);
    setOrderConfirmation(newOrder);
    setShowOrderModal(true);
    clearCart();
    setAppliedDiscounts([]);
    setPromoCode('');
  }, [localCartItems, getTotalDiscount, subtotal, totalEcoPoints, addOrder, setUserEcoPoints, clearCart]);

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
              <Text style={styles.aiBadgeText}>🤖 AI Pick</Text>
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
        <TouchableOpacity style={styles.emptyCartButton}>
          <Text style={styles.emptyCartButtonText}>🛍️ Start Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emptyCartButton}>
          <Text style={styles.emptyCartButtonText}>📱 Scan Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  const RecipeModal = useCallback(() => (
    <Modal visible={showRecipeModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowRecipeModal(false)}>
            <Text style={styles.modalBackButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>🤖 AI Recipe Suggestions</Text>
          <View />
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.recipesIntroTitle}>Recipes Based on Your Cart</Text>
          <Text style={styles.recipesIntroText}>
            Our AI analyzed your cart and found {aiRecipes.length} recipes you can make with your items!
          </Text>

          {aiRecipes.map((recipe, index) => (
            <View key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <View style={styles.recipeMatchBadge}>
                  <Text style={styles.recipeMatchText}>{recipe.matchScore}% match</Text>
                </View>
              </View>
              
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
              
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeInfoItem}>⏱️ {recipe.cookTime}</Text>
                <Text style={styles.recipeInfoItem}>👥 {recipe.servings} servings</Text>
                <Text style={styles.recipeInfoItem}>📊 {recipe.difficulty}</Text>
              </View>

              <View style={styles.recipeIngredients}>
                <Text style={styles.recipeIngredientsTitle}>Ingredients:</Text>
                {recipe.availableIngredients.length > 0 && (
                  <>
                    <Text style={styles.recipeAvailableText}>✅ You have ({recipe.availableIngredients.length}):</Text>
                    {recipe.availableIngredients.map((ingredient, idx) => (
                      <Text key={idx} style={styles.recipeAvailableIngredient}>• {ingredient}</Text>
                    ))}
                  </>
                )}
                
                {recipe.missingIngredients.length > 0 && (
                  <>
                    <Text style={styles.recipeMissingText}>🛒 You need ({recipe.missingIngredients.length}):</Text>
                    {recipe.missingIngredients.map((ingredient, idx) => (
                      <Text key={idx} style={styles.recipeMissingIngredient}>• {ingredient}</Text>
                    ))}
                  </>
                )}
              </View>

              <View style={styles.recipeSustainability}>
                <Text style={styles.recipeSustainabilityTitle}>🌱 Sustainability Notes:</Text>
                <Text style={styles.recipeSustainabilityText}>{recipe.sustainabilityNotes}</Text>
              </View>

              <TouchableOpacity style={styles.viewRecipeButton}>
                <Text style={styles.viewRecipeButtonText}>View Full Recipe</Text>
              </TouchableOpacity>
            </View>
          ))}

          {aiRecipes.length === 0 && (
            <View style={styles.noRecipesCard}>
              <Text style={styles.noRecipesIcon}>🤖</Text>
              <Text style={styles.noRecipesTitle}>No Recipes Found</Text>
              <Text style={styles.noRecipesText}>
                Add more items to your cart to get AI recipe suggestions!
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  ), [showRecipeModal, aiRecipes]);

  const OrderConfirmationModal = useCallback(() => (
    <Modal visible={showOrderModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.orderModalContent}>
          <Text style={styles.orderSuccessIcon}>✅</Text>
          <Text style={styles.orderSuccessTitle}>Order Placed Successfully!</Text>
          <Text style={styles.orderSuccessSubtitle}>
            Thank you for your purchase! Your order is being processed.
          </Text>

          {orderConfirmation && (
            <View style={styles.orderSummaryCard}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Order ID:</Text>
                <Text style={styles.orderSummaryValue}>{orderConfirmation.id}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Items:</Text>
                <Text style={styles.orderSummaryValue}>{orderConfirmation.items.length}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Total:</Text>
                <Text style={styles.orderSummaryValue}>${orderConfirmation.total.toFixed(2)}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>EcoPoints Earned:</Text>
                <Text style={styles.orderSummaryValue}>+{orderConfirmation.ecoPointsEarned}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Status:</Text>
                <Text style={styles.orderSummaryValue}>{orderConfirmation.status}</Text>
              </View>
            </View>
          )}

          <View style={styles.orderModalActions}>
            <TouchableOpacity 
              style={styles.viewOrdersButton}
              onPress={() => {
                setShowOrderModal(false);
                setShowOrdersModal(true);
              }}
            >
              <Text style={styles.viewOrdersButtonText}>📦 View My Orders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => setShowOrderModal(false)}
            >
              <Text style={styles.continueShoppingButtonText}>🛍️ Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  ), [showOrderModal, orderConfirmation]);

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
      <ScrollView style={styles.content}>
        {/* Cart Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubtitle}>
            {localCartItems.length} items • ${subtotal.toFixed(2)} total
          </Text>
        </View>

        {/* Cart Items */}
        <View style={styles.cartItemsSection}>
          {localCartItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </View>

        {/* AI Recipe Suggestions */}
        {aiRecipes.length > 0 && (
          <View style={styles.recipeSection}>
            <View style={styles.recipeSectionHeader}>
              <Text style={styles.recipeSectionTitle}>🤖 AI Recipe Suggestions</Text>
              <Text style={styles.recipeSectionSubtitle}>
                Based on your cart items
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewRecipesButton}
              onPress={() => setShowRecipeModal(true)}
            >
              <Text style={styles.viewRecipesButtonText}>
                🍳 View {aiRecipes.length} Recipe{aiRecipes.length > 1 ? 's' : ''} • AI Matched: {aiRecipes[0]?.matchScore}%
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
            Place Order • ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      <RecipeModal />
      <OrderConfirmationModal />
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
  recipeSection: {
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
  recipeSectionHeader: {
    marginBottom: 12,
  },
  recipeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recipeSectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewRecipesButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewRecipesButtonText: {
    color: '#059669',
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
  recipesIntroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recipesIntroText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  recipeMatchBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipeMatchText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  recipeInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  recipeInfoItem: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  recipeIngredients: {
    marginBottom: 16,
  },
  recipeIngredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  recipeAvailableText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  recipeAvailableIngredient: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 8,
    marginBottom: 2,
  },
  recipeMissingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 8,
    marginBottom: 4,
  },
  recipeMissingIngredient: {
    fontSize: 12,
    color: '#D97706',
    marginLeft: 8,
    marginBottom: 2,
  },
  recipeSustainability: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  recipeSustainabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  recipeSustainabilityText: {
    fontSize: 12,
    color: '#047857',
  },
  viewRecipeButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewRecipeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noRecipesCard: {
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
  noRecipesIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noRecipesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  noRecipesText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  orderModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  orderSuccessIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  orderSuccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  orderSuccessSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  orderSummaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderSummaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderSummaryValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  orderModalActions: {
    width: '100%',
    gap: 12,
  },
  viewOrdersButton: {
    backgroundColor: '#0071CE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewOrdersButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueShoppingButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueShoppingButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
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