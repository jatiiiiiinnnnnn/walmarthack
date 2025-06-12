// app/contexts/AppDataContext.tsx - Merged Complete Global State Management
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Employee-facing Types (Rescue Deals Management)
type RescueDealCategory = 'Produce' | 'Bakery' | 'Dairy' | 'Meat';

type RescueDeal = {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  timeLeft: string;
  category: RescueDealCategory;
  status: 'pending' | 'sold' | 'donated' | 'expired' | 'claimed';
  createdAt: Date;
  soldAt?: Date;
  donatedAt?: Date;
  expiredAt?: Date;
  customerName?: string;
  price?: number;
  estimatedCO2Saved: number;
  estimatedWastePrevented: number;
  expiresAt: Date;
  priority: 'low' | 'medium' | 'high';
  discount: number;
  quantity: number | string;
  store: string;
  aisle: string;
  co2Impact: number;
  sustainabilityScore: number;
  ecoPoints: number;
};

type DashboardData = {
  rescueDeals: { total: number; sold: number; donated: number; pending: number };
  wasteReduction: { percentage: number; totalKg: number; co2Saved: number };
  customerEngagement: { activeUsers: number; newSignups: number; challengeParticipation: number };
  revenue: { total: number; customerSavings: number; avgDiscount: number };
  // Customer-facing dashboard data
  totalSavings: number;
  ecoPointsEarned: number;
  mealsDonated: number;
};

type ActivityImpact = 
  | { co2Saved: number; moneySaved: number; }
  | { co2Saved: number; itemCount: number; }
  | { co2Saved: number; wasteAvoided: number; }
  | { totalCo2Saved: number; badgeEarned: string; }
  | { co2Saved: number; dealCategory: string; };

type Activity = {
  id: number;
  type: string;
  customer: string;
  action: string;
  details: string;
  impact: ActivityImpact;
  time: string;
  status: string;
  category: string;
  timestamp: Date;
};

type Timeframe = 'week' | 'month' | 'quarter' | 'year';

type AnalyticsData = {
  period: string;
  rescueDeals: { created: number; sold: number; donated: number };
  wasteReduction: { percentage: number; totalKg: number; co2Saved: number };
  customerEngagement: { activeUsers: number; newSignups: number; challengeParticipation: number };
  revenue: { rescueDeals: number; totalSavings: number; avgDiscount: number };
  topCategories: { name: string; deals: number; percentage: number }[];
};

// Customer-facing Types
interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  co2Impact: number;
  sustainabilityScore: number;
  ecoPoints: number;
  category: string;
  isEcoFriendly: boolean;
  aisle: string;
}

interface TodaysStats {
  rescuesCompleted: number;
  moneySaved: number;
  co2Saved: number;
  pointsEarned: number;
  wastePrevented: number;
  customerSavings: number;
  dealsCreated: number;
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

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  ecoPoints: number;
  totalPurchases: number;
  co2Saved: number;
  mealsDonated: number;
  moneySaved: number;
  level: string;
  streak: number;
  badges: string[];
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress?: number;
  target: number;
  current?: number;
  unit: string;
  reward: number;
  difficulty: string;
  category: string;
  timeLeft?: string;
  completedDate?: string;
}

interface AppDataContextType {
  // User Data
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // EcoPoints
  userEcoPoints: number;
  addEcoPoints: (points: number) => void;
  spendEcoPoints: (points: number) => boolean;
  
  // Cart Management
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  
  // Rescue Deals (Both Employee & Customer)
  rescueDeals: RescueDeal[];
  createRescueDeal: (deal: Omit<RescueDeal, 'id' | 'createdAt' | 'status' | 'estimatedCO2Saved' | 'estimatedWastePrevented' | 'expiresAt' | 'title' | 'originalPrice' | 'discountedPrice' | 'savings' | 'timeLeft' | 'co2Impact' | 'sustainabilityScore' | 'ecoPoints' | 'store'>) => void;
  updateRescueDealStatus: (id: number | string, status: RescueDeal['status'], customerName?: string, price?: number) => void;
  
  // Dashboard Data
  dashboardData: DashboardData;
  todaysStats: TodaysStats;
  updateDashboardData: (updates: Partial<DashboardData>) => void;
  
  // Activities (Employee-facing)
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Analytics (Employee-facing)
  getAnalyticsData: (timeframe: Timeframe) => AnalyticsData;
  
  // Discounts (Customer-facing)
  availableDiscounts: EcoDiscount[];
  appliedDiscounts: string[];
  applyDiscount: (discountId: string) => boolean;
  removeDiscount: (discountId: string) => void;
  
  // Challenges (Customer-facing)
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  
  // Impact Tracking
  updateImpactStats: (co2Saved: number, moneySaved: number, pointsEarned: number) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Safe date creation helper
const createSafeDate = (dateInput?: any): Date => {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;
  if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  return new Date();
};

// Helper functions with safety checks
const calculateCO2Saved = (category: RescueDealCategory, quantity: string | number): number => {
  const baseRates = {
    'Produce': 2.5,
    'Bakery': 1.8,
    'Dairy': 3.2,
    'Meat': 5.4
  };
  
  const numericQuantity = typeof quantity === 'number' ? quantity : parseFloat(quantity.toString()) || 1;
  return Math.round(baseRates[category] * numericQuantity * 10) / 10;
};

const calculateWastePrevented = (category: RescueDealCategory, quantity: string | number): number => {
  const baseRates = {
    'Produce': 1.2,
    'Bakery': 0.8,
    'Dairy': 1.5,
    'Meat': 2.1
  };
  
  const numericQuantity = typeof quantity === 'number' ? quantity : parseFloat(quantity.toString()) || 1;
  return Math.round(baseRates[category] * numericQuantity * 10) / 10;
};

const calculateEcoPoints = (category: RescueDealCategory, discount: number): number => {
  const basePoints = {
    'Produce': 12,
    'Bakery': 15,
    'Dairy': 18,
    'Meat': 25
  };
  
  const multiplier = discount >= 50 ? 1.5 : discount >= 30 ? 1.2 : 1.0;
  return Math.round(basePoints[category] * multiplier);
};

const getDateRange = (timeframe: Timeframe): { start: Date; end: Date } => {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  
  switch (timeframe) {
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return { start, end };
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Green',
    email: 'alex.green@email.com',
    phone: '+91 98765 43210',
    location: 'Pitampura, Delhi, IN',
    ecoPoints: 847,
    totalPurchases: 47,
    co2Saved: 156.3,
    mealsDonated: 12,
    moneySaved: 234.50,
    level: 'Green Warrior',
    streak: 28,
    badges: ['Carbon Saver', 'Waste Reducer', 'Plant Pioneer', 'Community Helper']
  });

  // EcoPoints State
  const [userEcoPoints, setUserEcoPoints] = useState(847);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Applied Discounts State
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);

  // Rescue Deals State - Start with sample data
  const [rescueDeals, setRescueDeals] = useState<RescueDeal[]>([
    {
      id: 1,
      title: 'Organic Bananas (2 lbs)',
      description: 'Fresh organic bananas, slightly overripe but perfect for smoothies',
      originalPrice: 2.48,
      discountedPrice: 1.24,
      savings: 1.24,
      timeLeft: '2 hours',
      category: 'Produce',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedCO2Saved: 2.5,
      estimatedWastePrevented: 1.2,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      priority: 'medium',
      discount: 50,
      quantity: 5,
      store: 'Walmart Supercenter',
      aisle: 'Produce - Aisle 1A',
      co2Impact: 0.8,
      sustainabilityScore: 8.9,
      ecoPoints: 18
    },
    {
      id: 2,
      title: 'Day-Old Artisan Bread',
      description: 'Fresh baked yesterday, still delicious and perfect for toast',
      originalPrice: 4.98,
      discountedPrice: 2.49,
      savings: 2.49,
      timeLeft: '4 hours',
      category: 'Bakery',
      status: 'pending',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      estimatedCO2Saved: 1.8,
      estimatedWastePrevented: 0.8,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      priority: 'low',
      discount: 50,
      quantity: 3,
      store: 'Walmart Supercenter',
      aisle: 'Bakery - Aisle 23A',
      co2Impact: 1.2,
      sustainabilityScore: 7.5,
      ecoPoints: 22
    },
    {
      id: 3,
      title: 'Organic Mixed Greens',
      description: 'Best by today, great for salads and cooking',
      originalPrice: 4.98,
      discountedPrice: 1.99,
      savings: 2.99,
      timeLeft: '1 hour',
      category: 'Produce',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      estimatedCO2Saved: 2.5,
      estimatedWastePrevented: 1.2,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      priority: 'high',
      discount: 60,
      quantity: 2,
      store: 'Walmart Supercenter',
      aisle: 'Produce - Aisle 1B',
      co2Impact: 0.6,
      sustainabilityScore: 9.2,
      ecoPoints: 27
    }
  ]);

  // Activities State
  const [activities, setActivities] = useState<Activity[]>([]);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    rescueDeals: { total: 3, sold: 0, donated: 0, pending: 3 },
    wasteReduction: { percentage: 85, totalKg: 0, co2Saved: 0 },
    customerEngagement: { activeUsers: 3247, newSignups: 234, challengeParticipation: 72 },
    revenue: { total: 0, customerSavings: 0, avgDiscount: 0 },
    totalSavings: 234.50,
    ecoPointsEarned: 847,
    mealsDonated: 12
  });

  // Today's Stats State
  const [todaysStats, setTodaysStats] = useState<TodaysStats>({
    rescuesCompleted: 3,
    moneySaved: 12.48,
    co2Saved: 2.6,
    pointsEarned: 45,
    wastePrevented: 0,
    customerSavings: 0,
    dealsCreated: 3
  });

  // Available EcoDiscounts
  const availableDiscounts: EcoDiscount[] = [
    {
      id: 'eco_starter',
      name: 'Eco Starter Reward',
      description: 'Get ₹75 off your purchase',
      pointsRequired: 100,
      discountValue: 75,
      discountType: 'fixed',
      minCartValue: 750,
      icon: '🌱'
    },
    {
      id: 'eco_champion',
      name: 'Eco Champion Discount',
      description: '5% off eco-friendly products',
      pointsRequired: 250,
      discountValue: 5,
      discountType: 'percentage',
      minCartValue: 1875,
      maxDiscount: 750,
      ecoProductsOnly: true,
      icon: '🏆'
    },
    {
      id: 'eco_master',
      name: 'Eco Master Savings',
      description: '₹375 off any purchase over ₹3750',
      pointsRequired: 500,
      discountValue: 375,
      discountType: 'fixed',
      minCartValue: 3750,
      icon: '💚'
    },
    {
      id: 'eco_legend',
      name: 'Eco Legend Bonus',
      description: '10% off entire cart (max ₹1125)',
      pointsRequired: 750,
      discountValue: 10,
      discountType: 'percentage',
      minCartValue: 5625,
      maxDiscount: 1125,
      icon: '🌟'
    }
  ];

  // Challenges State
  const [activeChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: 'Zero Waste Week',
      description: 'Reduce your grocery waste to zero for 7 consecutive days',
      progress: 65,
      target: 7,
      current: 4.5,
      unit: 'days',
      reward: 250,
      difficulty: 'Hard',
      category: 'Waste Reduction',
      timeLeft: '3 days'
    },
    {
      id: 2,
      title: 'Green Commute Challenge',
      description: 'Use eco-friendly transportation for your shopping trips',
      progress: 80,
      target: 10,
      current: 8,
      unit: 'trips',
      reward: 150,
      difficulty: 'Medium',
      category: 'Transportation',
      timeLeft: '1 week'
    }
  ]);

  const [completedChallenges] = useState<Challenge[]>([
    {
      id: 3,
      title: 'Plant-Based Pioneer',
      description: 'Choose plant-based alternatives for protein purchases',
      target: 20,
      unit: 'items',
      reward: 300,
      difficulty: 'Medium',
      category: 'Diet Impact',
      completedDate: '2024-06-10'
    }
  ]);

  // Update dashboard data whenever rescue deals change
  useEffect(() => {
    try {
      const total = rescueDeals.length;
      const sold = rescueDeals.filter(deal => deal.status === 'sold').length;
      const donated = rescueDeals.filter(deal => deal.status === 'donated').length;
      const pending = rescueDeals.filter(deal => deal.status === 'pending').length;

      const totalCO2Saved = rescueDeals.reduce((sum, deal) => sum + (deal.estimatedCO2Saved || 0), 0);
      const totalWastePrevented = rescueDeals.reduce((sum, deal) => sum + (deal.estimatedWastePrevented || 0), 0);
      const totalRevenue = rescueDeals
        .filter(deal => deal.status === 'sold' && deal.price)
        .reduce((sum, deal) => sum + (deal.price || 0), 0);
      
      const totalSavings = rescueDeals
        .filter(deal => deal.status === 'sold' && deal.price)
        .reduce((sum, deal) => {
          const originalPrice = (deal.price || 0) / (1 - (deal.discount || 30) / 100);
          return sum + (originalPrice - (deal.price || 0));
        }, 0);

      const avgDiscount = total > 0 
        ? rescueDeals.reduce((sum, deal) => sum + (deal.discount || 0), 0) / total 
        : 0;

      const wasteReductionPercentage = Math.min(85 + (totalWastePrevented / 100) * 5, 95);

      setDashboardData(prev => ({
        ...prev,
        rescueDeals: { total, sold, donated, pending },
        wasteReduction: { 
          percentage: Math.round(wasteReductionPercentage), 
          totalKg: Math.round(totalWastePrevented * 10) / 10, 
          co2Saved: Math.round(totalCO2Saved * 10) / 10 
        },
        revenue: { 
          total: Math.round(totalRevenue * 100) / 100, 
          customerSavings: Math.round(totalSavings * 100) / 100, 
          avgDiscount: Math.round(avgDiscount) 
        }
      }));

      // Update today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaysDeals = rescueDeals.filter(deal => {
        const dealDate = createSafeDate(deal.createdAt);
        return dealDate >= today;
      });
      
      const todaysCO2 = todaysDeals.reduce((sum, deal) => sum + (deal.estimatedCO2Saved || 0), 0);
      const todaysWaste = todaysDeals.reduce((sum, deal) => sum + (deal.estimatedWastePrevented || 0), 0);
      const todaysSavings = todaysDeals
        .filter(deal => deal.status === 'sold' && deal.price)
        .reduce((sum, deal) => {
          const originalPrice = (deal.price || 0) / (1 - (deal.discount || 30) / 100);
          return sum + (originalPrice - (deal.price || 0));
        }, 0);

      setTodaysStats(prev => ({
        ...prev,
        co2Saved: Math.round(todaysCO2 * 10) / 10,
        wastePrevented: Math.round(todaysWaste * 10) / 10,
        customerSavings: Math.round(todaysSavings * 100) / 100,
        dealsCreated: todaysDeals.length
      }));
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  }, [rescueDeals]);

  // Functions
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addEcoPoints = (points: number) => {
    setUserEcoPoints(prev => prev + points);
    setUserProfile(prev => ({ ...prev, ecoPoints: prev.ecoPoints + points }));
  };

  const spendEcoPoints = (points: number): boolean => {
    if (userEcoPoints >= points) {
      setUserEcoPoints(prev => prev - points);
      setUserProfile(prev => ({ ...prev, ecoPoints: prev.ecoPoints - points }));
      return true;
    }
    return false;
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const createRescueDeal = (dealData: Omit<RescueDeal, 'id' | 'createdAt' | 'status' | 'estimatedCO2Saved' | 'estimatedWastePrevented' | 'expiresAt' | 'title' | 'originalPrice' | 'discountedPrice' | 'savings' | 'timeLeft' | 'co2Impact' | 'sustainabilityScore' | 'ecoPoints' | 'store'>) => {
    try {
      const now = new Date();
      
      // Auto-assign priority based on category and urgency
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (dealData.category === 'Meat' || dealData.category === 'Dairy') {
        priority = 'high'; // Perishable items get high priority
      } else if (dealData.discount >= 50) {
        priority = 'high'; // High discounts get high priority
      } else if (dealData.discount <= 25) {
        priority = 'low'; // Low discounts get low priority
      }

      // Calculate derived values
      const discountedPrice = dealData.price ? dealData.price * (1 - dealData.discount / 100) : 0;
      const savings = dealData.price ? dealData.price - discountedPrice : 0;
      const hoursLeft = dealData.category === 'Meat' ? 4 : dealData.category === 'Dairy' ? 8 : 12;
      const timeLeft = `${hoursLeft} hours`;
      
      const newDeal: RescueDeal = {
        ...dealData,
        id: Date.now() + Math.random(), // Ensure unique ID
        title: dealData.description,
        originalPrice: dealData.price || 0,
        discountedPrice,
        savings,
        timeLeft,
        createdAt: now,
        status: 'pending',
        estimatedCO2Saved: calculateCO2Saved(dealData.category, dealData.quantity),
        estimatedWastePrevented: calculateWastePrevented(dealData.category, dealData.quantity),
        expiresAt: new Date(now.getTime() + hoursLeft * 60 * 60 * 1000),
        priority,
        co2Impact: calculateCO2Saved(dealData.category, dealData.quantity),
        sustainabilityScore: dealData.category === 'Produce' ? 9.0 : dealData.category === 'Dairy' ? 7.5 : 8.0,
        ecoPoints: calculateEcoPoints(dealData.category, dealData.discount),
        store: 'Walmart Supercenter'
      };

      setRescueDeals(prev => [newDeal, ...prev]);

      // Add activity for deal creation
      addActivity({
        type: 'rescue_deal_created',
        customer: 'Store System',
        action: `New ${dealData.category} rescue deal created`,
        details: `${dealData.description} - ${dealData.discount}% off`,
        impact: { co2Saved: newDeal.estimatedCO2Saved, dealCategory: dealData.category },
        time: 'Just now',
        status: 'new',
        category: dealData.category
      });
      
      console.log('✅ Rescue deal created:', newDeal.description);
    } catch (error) {
      console.error('Error creating rescue deal:', error);
    }
  };

  const updateRescueDealStatus = (id: number | string, status: RescueDeal['status'], customerName?: string, price?: number) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id) : id;
      
      setRescueDeals(prev => prev.map(deal => {
        if (deal.id === numericId || deal.id.toString() === id.toString()) {
          const now = new Date();
          const updatedDeal = {
            ...deal,
            status,
            ...(status === 'sold' ? { soldAt: now, customerName, price } : {}),
            ...(status === 'donated' ? { donatedAt: now } : {}),
            ...(status === 'claimed' ? { soldAt: now, customerName } : {}),
            ...(status === 'expired' ? { expiredAt: now } : {})
          };

          // Add activity for status change
          if (status === 'sold' || status === 'claimed') {
            addActivity({
              type: 'rescue_deal_sold',
              customer: customerName || 'Customer',
              action: `Purchased ${deal.category} rescue deal`,
              details: `${deal.description} - ${deal.discount}% off`,
              impact: { co2Saved: deal.estimatedCO2Saved, moneySaved: price || deal.discountedPrice },
              time: 'Just now',
              status: 'new',
              category: deal.category
            });
            console.log('💰 Deal sold:', deal.description, 'to', customerName);
          } else if (status === 'donated') {
            addActivity({
              type: 'donation_completed',
              customer: 'Store System',
              action: `${deal.category} items donated to local food bank`,
              details: deal.description,
              impact: { co2Saved: deal.estimatedCO2Saved, itemCount: typeof deal.quantity === 'number' ? deal.quantity : parseInt(deal.quantity.toString()) || 1 },
              time: 'Just now',
              status: 'new',
              category: deal.category
            });
            console.log('🤝 Deal donated:', deal.description);
          }

          return updatedDeal;
        }
        return deal;
      }));
    } catch (error) {
      console.error('Error updating rescue deal status:', error);
    }
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const newActivity: Activity = {
        ...activityData,
        id: Date.now(),
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const getAnalyticsData = (timeframe: Timeframe): AnalyticsData => {
    try {
      const { start, end } = getDateRange(timeframe);
      const filteredDeals = rescueDeals.filter(deal => {
        const dealDate = createSafeDate(deal.createdAt);
        return dealDate >= start && dealDate <= end;
      });

      const created = filteredDeals.length;
      const sold = filteredDeals.filter(deal => deal.status === 'sold' || deal.status === 'claimed').length;
      const donated = filteredDeals.filter(deal => deal.status === 'donated').length;

      const totalCO2 = filteredDeals.reduce((sum, deal) => sum + (deal.estimatedCO2Saved || 0), 0);
      const totalWaste = filteredDeals.reduce((sum, deal) => sum + (deal.estimatedWastePrevented || 0), 0);
      
      const revenue = filteredDeals
        .filter(deal => (deal.status === 'sold' || deal.status === 'claimed') && deal.price)
        .reduce((sum, deal) => sum + (deal.price || deal.discountedPrice), 0);
      
      const totalSavings = filteredDeals
        .filter(deal => (deal.status === 'sold' || deal.status === 'claimed'))
        .reduce((sum, deal) => sum + deal.savings, 0);

      const avgDiscount = created > 0 
        ? filteredDeals.reduce((sum, deal) => sum + (deal.discount || 0), 0) / created 
        : 0;

      // Calculate category distribution
      const categoryMap = filteredDeals.reduce((acc, deal) => {
        acc[deal.category] = (acc[deal.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCategories = Object.entries(categoryMap)
        .map(([name, deals]) => ({
          name,
          deals,
          percentage: created > 0 ? Math.round((deals / created) * 100) : 0
        }))
        .sort((a, b) => b.deals - a.deals);

      const periodLabels = {
        week: 'This Week',
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year'
      };

      return {
        period: periodLabels[timeframe],
        rescueDeals: { created, sold, donated },
        wasteReduction: { 
          percentage: Math.min(85 + (totalWaste / 100) * 5, 95), 
          totalKg: Math.round(totalWaste * 10) / 10, 
          co2Saved: Math.round(totalCO2 * 10) / 10 
        },
        customerEngagement: { activeUsers: 3247, newSignups: 234, challengeParticipation: 72 },
        revenue: { 
          rescueDeals: Math.round(revenue * 100) / 100, 
          totalSavings: Math.round(totalSavings * 100) / 100, 
          avgDiscount: Math.round(avgDiscount) 
        },
        topCategories
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      // Return safe default data
      return {
        period: 'This Month',
        rescueDeals: { created: 0, sold: 0, donated: 0 },
        wasteReduction: { percentage: 0, totalKg: 0, co2Saved: 0 },
        customerEngagement: { activeUsers: 0, newSignups: 0, challengeParticipation: 0 },
        revenue: { rescueDeals: 0, totalSavings: 0, avgDiscount: 0 },
        topCategories: []
      };
    }
  };

  const updateDashboardData = (updates: Partial<DashboardData>) => {
    setDashboardData(prev => ({ ...prev, ...updates }));
  };

  const applyDiscount = (discountId: string): boolean => {
    const discount = availableDiscounts.find(d => d.id === discountId);
    if (!discount) return false;

    const cartTotal = getCartTotal();
    const hasMinimum = !discount.minCartValue || cartTotal >= discount.minCartValue;
    const hasPoints = userEcoPoints >= discount.pointsRequired;
    const notAlreadyApplied = !appliedDiscounts.includes(discountId);

    if (hasMinimum && hasPoints && notAlreadyApplied) {
      setAppliedDiscounts(prev => [...prev, discountId]);
      spendEcoPoints(discount.pointsRequired);
      return true;
    }
    return false;
  };

  const removeDiscount = (discountId: string) => {
    setAppliedDiscounts(prev => prev.filter(id => id !== discountId));
  };

  const updateImpactStats = (co2Saved: number, moneySaved: number, pointsEarned: number) => {
    setTodaysStats(prev => ({
      ...prev,
      co2Saved: prev.co2Saved + co2Saved,
      moneySaved: prev.moneySaved + moneySaved,
      pointsEarned: prev.pointsEarned + pointsEarned
    }));

    setDashboardData(prev => ({
      ...prev,
      co2Saved: prev.wasteReduction.co2Saved + co2Saved,
      totalSavings: prev.totalSavings + moneySaved,
      ecoPointsEarned: prev.ecoPointsEarned + pointsEarned,
      wasteReduction: {
        ...prev.wasteReduction,
        co2Saved: prev.wasteReduction.co2Saved + co2Saved
      }
    }));

    setUserProfile(prev => ({
      ...prev,
      co2Saved: prev.co2Saved + co2Saved,
      moneySaved: prev.moneySaved + moneySaved,
      ecoPoints: prev.ecoPoints + pointsEarned
    }));
  };

  const value: AppDataContextType = {
    // User Data
    userProfile,
    updateUserProfile,
    
    // EcoPoints
    userEcoPoints,
    addEcoPoints,
    spendEcoPoints,
    
    // Cart Management
    cartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    
    // Rescue Deals
    rescueDeals,
    createRescueDeal,
    updateRescueDealStatus,
    
    // Dashboard Data
    dashboardData,
    todaysStats,
    updateDashboardData,
    
    // Activities
    activities,
    addActivity,
    
    // Analytics
    getAnalyticsData,
    
    // Discounts
    availableDiscounts,
    appliedDiscounts,
    applyDiscount,
    removeDiscount,
    
    // Challenges
    activeChallenges,
    completedChallenges,
    
    // Impact Tracking
    updateImpactStats
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};