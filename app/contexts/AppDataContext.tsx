// contexts/AppDataContext.tsx - Fixed with proper date handling
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
type RescueDealCategory = 'Produce' | 'Bakery' | 'Dairy' | 'Meat';

type RescueDeal = {
  id: number;
  category: RescueDealCategory;
  description: string;
  discount: number;
  quantity: string;
  status: 'pending' | 'sold' | 'donated' | 'expired';
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
};

type DashboardData = {
  rescueDeals: { total: number; sold: number; donated: number; pending: number };
  wasteReduction: { percentage: number; totalKg: number; co2Saved: number };
  customerEngagement: { activeUsers: number; newSignups: number; challengeParticipation: number };
  revenue: { total: number; customerSavings: number; avgDiscount: number };
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

type AppDataContextType = {
  // Rescue Deals
  rescueDeals: RescueDeal[];
  createRescueDeal: (deal: Omit<RescueDeal, 'id' | 'createdAt' | 'status' | 'estimatedCO2Saved' | 'estimatedWastePrevented' | 'expiresAt'>) => void;
  updateRescueDealStatus: (id: number, status: 'sold' | 'donated', customerName?: string, price?: number) => void;
  
  // Dashboard Data
  dashboardData: DashboardData;
  
  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Analytics
  getAnalyticsData: (timeframe: Timeframe) => AnalyticsData;
  
  // Real-time stats
  todaysStats: {
    co2Saved: number;
    wastePrevented: number;
    customerSavings: number;
    dealsCreated: number;
  };
};

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
const calculateCO2Saved = (category: RescueDealCategory, quantity: string): number => {
  const baseRates = {
    'Produce': 2.5,
    'Bakery': 1.8,
    'Dairy': 3.2,
    'Meat': 5.4
  };
  
  const numericQuantity = parseFloat(quantity) || 1;
  return Math.round(baseRates[category] * numericQuantity * 10) / 10;
};

const calculateWastePrevented = (category: RescueDealCategory, quantity: string): number => {
  const baseRates = {
    'Produce': 1.2,
    'Bakery': 0.8,
    'Dairy': 1.5,
    'Meat': 2.1
  };
  
  const numericQuantity = parseFloat(quantity) || 1;
  return Math.round(baseRates[category] * numericQuantity * 10) / 10;
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

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with empty rescue deals - only employee-created deals will appear
  const [rescueDeals, setRescueDeals] = useState<RescueDeal[]>([]);

  // Start with empty activities - only real employee/customer actions will appear
  const [activities, setActivities] = useState<Activity[]>([]);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    rescueDeals: { total: 0, sold: 0, donated: 0, pending: 0 },
    wasteReduction: { percentage: 0, totalKg: 0, co2Saved: 0 },
    customerEngagement: { activeUsers: 3247, newSignups: 234, challengeParticipation: 72 },
    revenue: { total: 0, customerSavings: 0, avgDiscount: 0 }
  });

  const [todaysStats, setTodaysStats] = useState({
    co2Saved: 0,
    wastePrevented: 0,
    customerSavings: 0,
    dealsCreated: 0
  });

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

      setDashboardData({
        rescueDeals: { total, sold, donated, pending },
        wasteReduction: { 
          percentage: Math.round(wasteReductionPercentage), 
          totalKg: Math.round(totalWastePrevented * 10) / 10, 
          co2Saved: Math.round(totalCO2Saved * 10) / 10 
        },
        customerEngagement: { activeUsers: 3247, newSignups: 234, challengeParticipation: 72 },
        revenue: { 
          total: Math.round(totalRevenue * 100) / 100, 
          customerSavings: Math.round(totalSavings * 100) / 100, 
          avgDiscount: Math.round(avgDiscount) 
        }
      });

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

      setTodaysStats({
        co2Saved: Math.round(todaysCO2 * 10) / 10,
        wastePrevented: Math.round(todaysWaste * 10) / 10,
        customerSavings: Math.round(todaysSavings * 100) / 100,
        dealsCreated: todaysDeals.length
      });
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  }, [rescueDeals]);

  const createRescueDeal = (dealData: Omit<RescueDeal, 'id' | 'createdAt' | 'status' | 'estimatedCO2Saved' | 'estimatedWastePrevented' | 'expiresAt'>) => {
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
      
      const newDeal: RescueDeal = {
        ...dealData,
        id: Date.now() + Math.random(), // Ensure unique ID
        createdAt: now,
        status: 'pending',
        estimatedCO2Saved: calculateCO2Saved(dealData.category, dealData.quantity),
        estimatedWastePrevented: calculateWastePrevented(dealData.category, dealData.quantity),
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
        priority
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

  const updateRescueDealStatus = (id: number, status: 'sold' | 'donated', customerName?: string, price?: number) => {
    try {
      setRescueDeals(prev => prev.map(deal => {
        if (deal.id === id) {
          const now = new Date();
          const updatedDeal = {
            ...deal,
            status,
            ...(status === 'sold' ? { soldAt: now, customerName, price } : {}),
            ...(status === 'donated' ? { donatedAt: now } : {})
          };

          // Add activity for status change
          if (status === 'sold') {
            addActivity({
              type: 'rescue_deal_sold',
              customer: customerName || 'Customer',
              action: `Purchased ${deal.category} rescue deal`,
              details: `${deal.description} - ${deal.discount}% off`,
              impact: { co2Saved: deal.estimatedCO2Saved, moneySaved: price || 0 },
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
              impact: { co2Saved: deal.estimatedCO2Saved, itemCount: parseInt(deal.quantity) || 1 },
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
      const sold = filteredDeals.filter(deal => deal.status === 'sold').length;
      const donated = filteredDeals.filter(deal => deal.status === 'donated').length;

      const totalCO2 = filteredDeals.reduce((sum, deal) => sum + (deal.estimatedCO2Saved || 0), 0);
      const totalWaste = filteredDeals.reduce((sum, deal) => sum + (deal.estimatedWastePrevented || 0), 0);
      
      const revenue = filteredDeals
        .filter(deal => deal.status === 'sold' && deal.price)
        .reduce((sum, deal) => sum + (deal.price || 0), 0);
      
      const totalSavings = filteredDeals
        .filter(deal => deal.status === 'sold' && deal.price)
        .reduce((sum, deal) => {
          const originalPrice = (deal.price || 0) / (1 - (deal.discount || 30) / 100);
          return sum + (originalPrice - (deal.price || 0));
        }, 0);

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

  return (
    <AppDataContext.Provider value={{
      rescueDeals,
      createRescueDeal,
      updateRescueDealStatus,
      dashboardData,
      activities,
      addActivity,
      getAnalyticsData,
      todaysStats
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};