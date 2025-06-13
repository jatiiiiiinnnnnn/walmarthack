// app/contexts/AppDataContext.tsx - FIXED: Prevents Maximum Depth Error
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  donationEcoPoints?: number;
};

type DashboardData = {
  rescueDeals: { total: number; sold: number; donated: number; pending: number };
  wasteReduction: { percentage: number; totalKg: number; co2Saved: number };
  customerEngagement: { activeUsers: number; newSignups: number; challengeParticipation: number };
  revenue: { total: number; customerSavings: number; avgDiscount: number };
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

export interface CartItem {
  image: any;
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  co2Impact: number;
  sustainabilityScore: number;
  ecoPoints: number;
  category: string;
  isEcoFriendly: boolean;
  aisle: string;
  isRescueDeal?: boolean;
  isEcoAlternative?: boolean;
  isScanned?: boolean;
}
export interface DonationItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  aisle: string;
  co2Impact: number;
  sustainabilityScore: number;
  isEcoFriendly: boolean;
  isDonation: true;
  donationDetails: {
    cashbackPoints: number;
    donatedTo: string;
    impactMessage: string;
  };
}
export interface Order {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  ecoPointsEarned: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';
}

interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  co2Impact: number;
  sustainabilityScore: number;
  aisle: string;
  section: string;
  ecoPoints: number;
  inStock: boolean;
  features: string[];
  certifications: string[];
  keywords: string[];
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
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  userEcoPoints: number;
  donations: any[];
  addDonation: (donation: any) => void;
  removeDonation: (id: string) => void;
  clearDonations: () => void;
  setUserEcoPoints: (points: number | ((prev: number) => number)) => void;
  addEcoPoints: (points: number) => void;
  spendEcoPoints: (points: number) => boolean;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  addToCart: (item: Partial<CartItem>) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  orders: Order[];
  addOrder: (order: Order) => void;
  rescueDeals: RescueDeal[];
  createRescueDeal: (deal: Omit<RescueDeal, 'id' | 'createdAt' | 'status' | 'estimatedCO2Saved' | 'estimatedWastePrevented' | 'expiresAt' | 'title' | 'originalPrice' | 'discountedPrice' | 'savings' | 'timeLeft' | 'co2Impact' | 'sustainabilityScore' | 'ecoPoints' | 'store'>) => void;
  updateRescueDealStatus: (id: number | string, status: RescueDeal['status'], customerName?: string, price?: number) => void;
  dashboardData: DashboardData;
  todaysStats: TodaysStats;
  updateDashboardData: (updates: Partial<DashboardData>) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getAnalyticsData: (timeframe: Timeframe) => AnalyticsData;
  availableDiscounts: EcoDiscount[];
  appliedDiscounts: string[];
  applyDiscount: (discountId: string) => boolean;
  removeDiscount: (discountId: string) => void;
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  updateImpactStats: (co2Saved: number, moneySaved: number, pointsEarned: number) => void;
  inventory: InventoryItem[];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Move helper functions OUTSIDE of component to prevent recreation
const createSafeDate = (dateInput?: any): Date => {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;
  if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  return new Date();
};

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

  const [userEcoPoints, setUserEcoPoints] = useState(847);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);

  // Static data - move to useMemo to prevent recreation
  const inventory = useMemo(() => [
    {
      id: 'inv_1',
      name: 'Stainless Steel Water Bottle',
      brand: 'EcoFlow',
      price: 19.99,
      category: 'Health & Wellness',
      co2Impact: 1.2,
      sustainabilityScore: 9.2,
      aisle: 'Health & Wellness',
      section: 'Aisle 12B',
      ecoPoints: 25,
      inStock: true,
      features: ['BPA-free', 'Insulated', 'Dishwasher safe', 'Lifetime warranty'],
      certifications: ['Carbon Neutral', 'Recycled Materials'],
      keywords: ['water', 'bottle', 'drink', 'beverage', 'hydration']
    },
    // ... other inventory items (keeping it short for brevity)
  ], []);

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
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estimatedCO2Saved: 2.5,
      estimatedWastePrevented: 1.2,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      priority: 'medium',
      discount: 50,
      quantity: 5,
      store: 'Walmart Supercenter',
      aisle: 'Produce - Aisle 1A',
      co2Impact: 0.8,
      sustainabilityScore: 8.9,
      ecoPoints: 18,
      donationEcoPoints: 25
    },
    // ... other rescue deals
  ]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    rescueDeals: { total: 3, sold: 0, donated: 0, pending: 3 },
    wasteReduction: { percentage: 85, totalKg: 0, co2Saved: 0 },
    customerEngagement: { activeUsers: 3247, newSignups: 234, challengeParticipation: 72 },
    revenue: { total: 0, customerSavings: 0, avgDiscount: 0 },
    totalSavings: 234.50,
    ecoPointsEarned: 847,
    mealsDonated: 12
  });

  const [todaysStats, setTodaysStats] = useState<TodaysStats>({
    rescuesCompleted: 3,
    moneySaved: 12.48,
    co2Saved: 2.6,
    pointsEarned: 45,
    wastePrevented: 0,
    customerSavings: 0,
    dealsCreated: 3
  });

  // Static data
  const availableDiscounts: EcoDiscount[] = useMemo(() => [
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
    // ... other discounts
  ], []);

  const activeChallenges = useMemo(() => [
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
    // ... other challenges
  ], []);

  const completedChallenges = useMemo(() => [
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
  ], []);

  // CRITICAL FIX: Memoize functions to prevent recreation on every render
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);
  const addDonation = useCallback((donation: DonationItem) => {
    setDonations(prev => [donation, ...prev]);
  }, []);
  // Remove a donation by id
  const removeDonation = useCallback((id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
  }, []);
  const clearDonations = useCallback(() => {
    setDonations([]);
  }, []);

  const addEcoPoints = useCallback((points: number) => {
    setUserEcoPoints(prev => prev + points);
    setUserProfile(prev => ({ ...prev, ecoPoints: prev.ecoPoints + points }));
  }, []);

  const spendEcoPoints = useCallback((points: number): boolean => {
    if (userEcoPoints >= points) {
      setUserEcoPoints(prev => prev - points);
      setUserProfile(prev => ({ ...prev, ecoPoints: prev.ecoPoints - points }));
      return true;
    }
    return false;
  }, [userEcoPoints]);

  const addToCart = useCallback((item: Partial<CartItem>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      } else {
        const newItem: CartItem = {
          id: item.id || `item_${Date.now()}`,
          name: item.name || 'Unknown Product',
          brand: item.brand || 'Unknown Brand',
          price: item.price || 0,
          originalPrice: item.originalPrice,
          quantity: item.quantity || 1,
          co2Impact: item.co2Impact || 0,
          sustainabilityScore: item.sustainabilityScore || 5,
          ecoPoints: item.ecoPoints || 0,
          category: item.category || 'General',
          isEcoFriendly: item.isEcoFriendly || false,
          aisle: item.aisle || 'Unknown',
          isRescueDeal: item.isRescueDeal || false,
          isEcoAlternative: item.isEcoAlternative || false,
          isScanned: item.isScanned || false,
          image: undefined
        };
        return [...prev, newItem];
      }
    });
  }, []);

  const updateCartItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getCartItemCount = useCallback((): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  // FIXED: Prevent infinite loops by using functional updates and proper dependencies
  const createRescueDeal = useCallback((dealData: Omit<RescueDeal, 'id' | 'createdAt' | 'status' | 'estimatedCO2Saved' | 'estimatedWastePrevented' | 'expiresAt' | 'title' | 'originalPrice' | 'discountedPrice' | 'savings' | 'timeLeft' | 'co2Impact' | 'sustainabilityScore' | 'ecoPoints' | 'store'>) => {
    try {
      const now = new Date();
      
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (dealData.category === 'Meat' || dealData.category === 'Dairy') {
        priority = 'high';
      } else if (dealData.discount >= 50) {
        priority = 'high';
      } else if (dealData.discount <= 25) {
        priority = 'low';
      }

      const discountedPrice = dealData.price ? dealData.price * (1 - dealData.discount / 100) : 0;
      const savings = dealData.price ? dealData.price - discountedPrice : 0;
      const hoursLeft = dealData.category === 'Meat' ? 4 : dealData.category === 'Dairy' ? 8 : 12;
      const timeLeft = `${hoursLeft} hours`;
      
      const newDeal: RescueDeal = {
        ...dealData,
        id: Date.now() + Math.random(),
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
        donationEcoPoints: calculateEcoPoints(dealData.category, dealData.discount) + 10,
        store: 'Walmart Supercenter'
      };

      setRescueDeals(prev => [newDeal, ...prev]);
    } catch (error) {
      console.error('Error creating rescue deal:', error);
    }
  }, []);

  const updateRescueDealStatus = useCallback((id: number | string, status: RescueDeal['status'], customerName?: string, price?: number) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id) : id;
      
      setRescueDeals(prev => prev.map(deal => {
        if (deal.id === numericId || deal.id.toString() === id.toString()) {
          const now = new Date();
          return {
            ...deal,
            status,
            ...(status === 'sold' ? { soldAt: now, customerName, price } : {}),
            ...(status === 'donated' ? { donatedAt: now } : {}),
            ...(status === 'claimed' ? { soldAt: now, customerName } : {}),
            ...(status === 'expired' ? { expiredAt: now } : {})
          };
        }
        return deal;
      }));
    } catch (error) {
      console.error('Error updating rescue deal status:', error);
    }
  }, []);

  const addActivity = useCallback((activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const newActivity: Activity = {
        ...activityData,
        id: Date.now(),
        timestamp: new Date()
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  }, []);

  const getAnalyticsData = useCallback((timeframe: Timeframe): AnalyticsData => {
    try {
      const { start, end } = getDateRange(timeframe);
      const filteredDeals = rescueDeals.filter(deal => {
        const dealDate = createSafeDate(deal.createdAt);
        return dealDate >= start && dealDate <= end;
      });

      const created = filteredDeals.length;
      const sold = filteredDeals.filter(deal => deal.status === 'sold' || deal.status === 'claimed').length;
      const donated = filteredDeals.filter(deal => deal.status === 'donated').length;

      // ... rest of analytics calculation logic

      return {
        period: timeframe === 'week' ? 'This Week' : timeframe === 'month' ? 'This Month' : timeframe === 'quarter' ? 'This Quarter' : 'This Year',
        rescueDeals: { created, sold, donated },
        wasteReduction: { percentage: 85, totalKg: 0, co2Saved: 0 },
        customerEngagement: { activeUsers: 3247, newSignups: 234, challengeParticipation: 72 },
        revenue: { rescueDeals: 0, totalSavings: 0, avgDiscount: 0 },
        topCategories: []
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return {
        period: 'This Month',
        rescueDeals: { created: 0, sold: 0, donated: 0 },
        wasteReduction: { percentage: 0, totalKg: 0, co2Saved: 0 },
        customerEngagement: { activeUsers: 0, newSignups: 0, challengeParticipation: 0 },
        revenue: { rescueDeals: 0, totalSavings: 0, avgDiscount: 0 },
        topCategories: []
      };
    }
  }, [rescueDeals]);

  const updateDashboardData = useCallback((updates: Partial<DashboardData>) => {
    setDashboardData(prev => ({ ...prev, ...updates }));
  }, []);

  const applyDiscount = useCallback((discountId: string): boolean => {
    const discount = availableDiscounts.find(d => d.id === discountId);
    if (!discount) return false;

    const cartTotal = getCartTotal();
    const hasMinimum = !discount.minCartValue || cartTotal >= discount.minCartValue;
    const hasPoints = userEcoPoints >= discount.pointsRequired;
    const notAlreadyApplied = !appliedDiscounts.includes(discountId);

    if (hasMinimum && hasPoints && notAlreadyApplied) {
      setAppliedDiscounts(prev => [...prev, discountId]);
      return spendEcoPoints(discount.pointsRequired);
    }
    return false;
  }, [availableDiscounts, getCartTotal, userEcoPoints, appliedDiscounts, spendEcoPoints]);

  const removeDiscount = useCallback((discountId: string) => {
    setAppliedDiscounts(prev => prev.filter(id => id !== discountId));
  }, []);

  const updateImpactStats = useCallback((co2Saved: number, moneySaved: number, pointsEarned: number) => {
    setTodaysStats(prev => ({
      ...prev,
      co2Saved: prev.co2Saved + co2Saved,
      moneySaved: prev.moneySaved + moneySaved,
      pointsEarned: prev.pointsEarned + pointsEarned
    }));

    setUserProfile(prev => ({
      ...prev,
      co2Saved: prev.co2Saved + co2Saved,
      moneySaved: prev.moneySaved + moneySaved,
      ecoPoints: prev.ecoPoints + pointsEarned
    }));
  }, []);

  // FIXED: Only update dashboard when rescueDeals actually changes (not on every render)
  useEffect(() => {
    try {
      const total = rescueDeals.length;
      const sold = rescueDeals.filter(deal => deal.status === 'sold').length;
      const donated = rescueDeals.filter(deal => deal.status === 'donated').length;
      const pending = rescueDeals.filter(deal => deal.status === 'pending').length;

      setDashboardData(prev => ({
        ...prev,
        rescueDeals: { total, sold, donated, pending }
      }));
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  }, [rescueDeals]); // Only depend on rescueDeals

  // CRITICAL FIX: Memoize the context value to prevent infinite re-renders
  const contextValue = useMemo<AppDataContextType>(() => ({
    userProfile,
    updateUserProfile,
    userEcoPoints,
    setUserEcoPoints,
    addEcoPoints,
    spendEcoPoints,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    orders,
    addOrder,
    rescueDeals,
    createRescueDeal,
    donations,
    addDonation,
    removeDonation,
    clearDonations,
    updateRescueDealStatus,
    dashboardData,
    todaysStats,
    updateDashboardData,
    activities,
    addActivity,
    getAnalyticsData,
    availableDiscounts,
    appliedDiscounts,
    applyDiscount,
    removeDiscount,
    activeChallenges,
    completedChallenges,
    updateImpactStats,
    inventory
  }), [
    userProfile,
    updateUserProfile,
    userEcoPoints,
    donations,
    addDonation,
    removeDonation,
    clearDonations,
    setUserEcoPoints,
    addEcoPoints,
    spendEcoPoints,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    orders,
    addOrder,
    rescueDeals,
    createRescueDeal,
    updateRescueDealStatus,
    dashboardData,
    todaysStats,
    updateDashboardData,
    activities,
    addActivity,
    getAnalyticsData,
    availableDiscounts,
    appliedDiscounts,
    applyDiscount,
    removeDiscount,
    activeChallenges,
    completedChallenges,
    updateImpactStats,
    inventory
  ]);

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};