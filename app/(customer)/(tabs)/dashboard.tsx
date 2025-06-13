// app/(customer)/(tabs)/dashboard.tsx - Enhanced with More Organic Products & Cart Integration
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useAppData } from '../../contexts/AppDataContext';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  co2Impact: number;
  sustainabilityScore: number;
  category: string;
  image?: string;
  inStock: boolean;
  isEcoFriendly: boolean;
  isRecycled?: boolean;
  isRefurbished?: boolean;
  isOrganic?: boolean;
  isLocal?: boolean;
  ecoPoints: number;
  aisle: string;
  nutritionScore?: string; // A, B, C, D, E for food products
  origin?: string; // For local products
  certifications?: string[];
  ecoAlternative?: {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceIncrease: number;
    co2Impact: number;
    ecoPoints: number;
    features: string[];
  };
}

interface Filter {
  id: string;
  name: string;
  active: boolean;
  icon: string;
  count?: number;
}

export default function EnhancedShopTab() {
  const { 
    rescueDeals, 
    updateRescueDealStatus, 
    dashboardData,
    todaysStats 
  } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([
    { id: 'all', name: 'All Items', active: true, icon: '🛒' },
    { id: 'sustainshop', name: 'SustainShop', active: false, icon: '🌱' },
    { id: 'organic', name: 'Organic', active: false, icon: '🥬' },
    { id: 'local', name: 'Local', active: false, icon: '🏘️' },
    { id: 'sale', name: 'On Sale', active: false, icon: '🏷️' },
    { id: 'eco-friendly', name: 'Eco-Friendly', active: false, icon: '♻️' },
  ]);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'eco-score'>('relevance');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [userEcoPoints, setUserEcoPoints] = useState(847);

  // Massively expanded product catalog with focus on organic section
  const allProducts: Product[] = [
    // SustainShop deals (recycled/refurbished/eco-friendly with super savings)
    {
      id: 'sustain_1',
      name: 'Refurbished iPhone 13',
      brand: 'Apple Certified',
      price: 499.99,
      originalPrice: 699.99,
      co2Impact: 15.2,
      sustainabilityScore: 8.5,
      category: 'Electronics',
      inStock: true,
      isEcoFriendly: true,
      isRefurbished: true,
      ecoPoints: 35,
      aisle: 'Electronics - Aisle 2A',
      certifications: ['Apple Certified', 'Climate Neutral']
    },
    {
      id: 'sustain_2',
      name: 'Recycled Plastic Outdoor Furniture Set',
      brand: 'EcoLiving',
      price: 299.99,
      originalPrice: 459.99,
      co2Impact: 12.8,
      sustainabilityScore: 9.2,
      category: 'Home & Garden',
      inStock: true,
      isEcoFriendly: true,
      isRecycled: true,
      ecoPoints: 45,
      aisle: 'Garden Center - Aisle 20B',
      certifications: ['100% Recycled Materials', 'Weather Resistant']
    },
    {
      id: 'sustain_3',
      name: 'Solar Power Bank 20000mAh',
      brand: 'SunCharge Pro',
      price: 39.99,
      originalPrice: 59.99,
      co2Impact: 2.1,
      sustainabilityScore: 9.1,
      category: 'Electronics',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 30,
      aisle: 'Electronics - Aisle 2C',
      certifications: ['Solar Powered', 'Fast Charge Compatible']
    },
    {
      id: 'sustain_4',
      name: 'Bamboo Complete Dinnerware Set (16 pieces)',
      brand: 'EcoTable',
      price: 34.99,
      originalPrice: 49.99,
      co2Impact: 1.8,
      sustainabilityScore: 8.7,
      category: 'Kitchen',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 25,
      aisle: 'Kitchen - Aisle 17A',
      certifications: ['100% Bamboo', 'Dishwasher Safe']
    },

    // EXPANDED ORGANIC SECTION - Fresh Produce
    {
      id: 'organic_1',
      name: 'Organic Bananas (2 lbs)',
      brand: 'Nature\'s Promise',
      price: 2.48,
      co2Impact: 0.8,
      sustainabilityScore: 8.9,
      category: 'Fresh Produce',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 8,
      aisle: 'Produce - Aisle 1A',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'Fair Trade'],
      origin: 'Ecuador'
    },
    {
      id: 'organic_2',
      name: 'Organic Mixed Greens (5 oz)',
      brand: 'Earthbound Farm',
      price: 4.98,
      co2Impact: 0.6,
      sustainabilityScore: 9.2,
      category: 'Fresh Produce',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 12,
      aisle: 'Produce - Aisle 1B',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'California Certified Organic'],
      origin: 'California, USA'
    },
    {
      id: 'organic_3',
      name: 'Organic Avocados (4 count)',
      brand: 'Simple Truth Organic',
      price: 5.98,
      co2Impact: 1.2,
      sustainabilityScore: 8.5,
      category: 'Fresh Produce',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 15,
      aisle: 'Produce - Aisle 1A',
      nutritionScore: 'A',
      certifications: ['USDA Organic'],
      origin: 'Mexico'
    },
    {
      id: 'organic_4',
      name: 'Organic Baby Carrots (2 lbs)',
      brand: 'Grimmway Farms',
      price: 3.48,
      co2Impact: 0.9,
      sustainabilityScore: 8.8,
      category: 'Fresh Produce',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 10,
      aisle: 'Produce - Aisle 1C',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'Non-GMO Project'],
      origin: 'California, USA'
    },
    {
      id: 'organic_5',
      name: 'Organic Sweet Bell Peppers (3 pack)',
      brand: 'Nature\'s Promise',
      price: 4.48,
      co2Impact: 1.1,
      sustainabilityScore: 8.6,
      category: 'Fresh Produce',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 12,
      aisle: 'Produce - Aisle 1B',
      nutritionScore: 'A',
      certifications: ['USDA Organic'],
      origin: 'Canada'
    },
    {
      id: 'organic_6',
      name: 'Organic Strawberries (1 lb)',
      brand: 'Driscoll\'s Organic',
      price: 5.98,
      co2Impact: 1.0,
      sustainabilityScore: 8.7,
      category: 'Fresh Produce',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 18,
      aisle: 'Produce - Aisle 1A',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'California Certified Organic'],
      origin: 'California, USA'
    },

    // ORGANIC DAIRY & EGGS
    {
      id: 'organic_7',
      name: 'Organic Whole Milk (Half Gallon)',
      brand: 'Horizon Organic',
      price: 4.98,
      co2Impact: 2.1,
      sustainabilityScore: 7.8,
      category: 'Dairy',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 15,
      aisle: 'Dairy - Aisle 9A',
      nutritionScore: 'B',
      certifications: ['USDA Organic', 'DHA Omega-3'],
      origin: 'Local Dairy Farms'
    },
    {
      id: 'organic_8',
      name: 'Organic Large Eggs (12 count)',
      brand: 'Vital Farms',
      price: 6.48,
      co2Impact: 1.8,
      sustainabilityScore: 8.9,
      category: 'Dairy',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 20,
      aisle: 'Dairy - Aisle 9B',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'Pasture-Raised', 'Certified Humane'],
      origin: 'Family Farms, USA'
    },
    {
      id: 'organic_9',
      name: 'Organic Greek Yogurt (32 oz)',
      brand: 'Stonyfield Organic',
      price: 5.98,
      co2Impact: 1.6,
      sustainabilityScore: 8.4,
      category: 'Dairy',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 18,
      aisle: 'Dairy - Aisle 9A',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'Live Active Cultures'],
      origin: 'New Hampshire, USA'
    },

    // ORGANIC PANTRY STAPLES
    {
      id: 'organic_10',
      name: 'Organic Quinoa (2 lbs)',
      brand: 'Ancient Harvest',
      price: 8.98,
      co2Impact: 1.4,
      sustainabilityScore: 9.1,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 22,
      aisle: 'Pantry - Aisle 15B',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'Gluten-Free', 'Non-GMO'],
      origin: 'Bolivia'
    },
    {
      id: 'organic_11',
      name: 'Organic Brown Rice (2 lbs)',
      brand: 'Lundberg Family Farms',
      price: 4.98,
      co2Impact: 1.2,
      sustainabilityScore: 8.8,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 15,
      aisle: 'Pantry - Aisle 15A',
      nutritionScore: 'B',
      certifications: ['USDA Organic', 'Eco-Farmed'],
      origin: 'California, USA'
    },
    {
      id: 'organic_12',
      name: 'Organic Whole Wheat Pasta (1 lb)',
      brand: 'Bionaturae',
      price: 3.48,
      co2Impact: 0.8,
      sustainabilityScore: 8.6,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 12,
      aisle: 'Pantry - Aisle 14A',
      nutritionScore: 'B',
      certifications: ['USDA Organic', 'Bronze Die Cut'],
      origin: 'Italy'
    },
    {
      id: 'organic_13',
      name: 'Organic Black Beans (15 oz can)',
      brand: 'Amy\'s Organic',
      price: 2.48,
      co2Impact: 0.6,
      sustainabilityScore: 8.9,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 10,
      aisle: 'Pantry - Aisle 16A',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'BPA-Free Can'],
      origin: 'USA'
    },
    {
      id: 'organic_14',
      name: 'Organic Coconut Oil (14 oz)',
      brand: 'Spectrum Organic',
      price: 7.98,
      co2Impact: 1.1,
      sustainabilityScore: 8.3,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 20,
      aisle: 'Pantry - Aisle 16B',
      nutritionScore: 'C',
      certifications: ['USDA Organic', 'Unrefined', 'Fair Trade'],
      origin: 'Philippines'
    },

    // ORGANIC SNACKS & BEVERAGES
    {
      id: 'organic_15',
      name: 'Organic Apple Juice (64 oz)',
      brand: 'Simply Organic',
      price: 4.98,
      co2Impact: 1.3,
      sustainabilityScore: 8.2,
      category: 'Beverages',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 15,
      aisle: 'Beverages - Aisle 13A',
      nutritionScore: 'C',
      certifications: ['USDA Organic', 'Not From Concentrate'],
      origin: 'Washington State, USA'
    },
    {
      id: 'organic_16',
      name: 'Organic Green Tea (20 bags)',
      brand: 'Traditional Medicinals',
      price: 5.48,
      co2Impact: 0.4,
      sustainabilityScore: 9.0,
      category: 'Beverages',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 18,
      aisle: 'Beverages - Aisle 13B',
      nutritionScore: 'A',
      certifications: ['USDA Organic', 'Fair Trade', 'Non-GMO'],
      origin: 'China'
    },
    {
      id: 'organic_17',
      name: 'Organic Granola Bars (6 count)',
      brand: 'Kashi Organic',
      price: 4.98,
      co2Impact: 1.0,
      sustainabilityScore: 8.4,
      category: 'Snacks',
      inStock: true,
      isEcoFriendly: true,
      isOrganic: true,
      ecoPoints: 15,
      aisle: 'Snacks - Aisle 11A',
      nutritionScore: 'B',
      certifications: ['USDA Organic', 'Non-GMO Project'],
      origin: 'USA'
    },

    // LOCAL PRODUCTS
    {
      id: 'local_1',
      name: 'Local Honey (12 oz)',
      brand: 'Delhi Bee Farm',
      price: 8.98,
      co2Impact: 0.3,
      sustainabilityScore: 9.3,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: true,
      isLocal: true,
      ecoPoints: 25,
      aisle: 'Pantry - Aisle 16C',
      nutritionScore: 'C',
      certifications: ['Raw Honey', 'Local Producer'],
      origin: 'Delhi, India (5 miles away)'
    },
    {
      id: 'local_2',
      name: 'Local Farm Fresh Eggs (12 count)',
      brand: 'Gurgaon Family Farm',
      price: 4.98,
      co2Impact: 0.8,
      sustainabilityScore: 9.0,
      category: 'Dairy',
      inStock: true,
      isEcoFriendly: true,
      isLocal: true,
      ecoPoints: 20,
      aisle: 'Dairy - Aisle 9C',
      nutritionScore: 'A',
      certifications: ['Free Range', 'Local Farm'],
      origin: 'Gurgaon, India (15 miles away)'
    },

    // REGULAR PRODUCTS WITH ECO ALTERNATIVES
    {
      id: 'reg_1',
      name: 'Regular Pasta (1 lb)',
      brand: 'Barilla',
      price: 1.49,
      co2Impact: 1.8,
      sustainabilityScore: 4.2,
      category: 'Pantry',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Pasta & Rice - Aisle 14A',
      nutritionScore: 'C',
      ecoAlternative: {
        id: 'reg_1_alt',
        name: 'Organic Whole Wheat Pasta',
        brand: 'Bionaturae',
        price: 3.48,
        priceIncrease: 1.99,
        co2Impact: 0.8,
        ecoPoints: 12,
        features: ['USDA Organic', 'Whole grain', 'Sustainable farming', 'Better nutrition']
      }
    },
    {
      id: 'reg_2',
      name: 'Plastic Water Bottles (24pk)',
      brand: 'AquaPure',
      price: 4.99,
      co2Impact: 5.8,
      sustainabilityScore: 2.1,
      category: 'Beverages',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Beverages - Aisle 12A',
      ecoAlternative: {
        id: 'reg_2_alt',
        name: 'Stainless Steel Water Bottle',
        brand: 'EcoFlow',
        price: 19.99,
        priceIncrease: 15.00,
        co2Impact: 1.2,
        ecoPoints: 25,
        features: ['Reusable', 'BPA-free', 'Insulated', 'Lifetime use']
      }
    },
    {
      id: 'reg_3',
      name: 'Regular Ground Coffee (12 oz)',
      brand: 'Folgers',
      price: 4.98,
      co2Impact: 4.2,
      sustainabilityScore: 3.7,
      category: 'Beverages',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Coffee & Tea - Aisle 13B',
      nutritionScore: 'C',
      ecoAlternative: {
        id: 'reg_3_alt',
        name: 'Fair Trade Organic Coffee',
        brand: 'Equal Exchange',
        price: 8.98,
        priceIncrease: 4.00,
        co2Impact: 2.1,
        ecoPoints: 20,
        features: ['Fair trade certified', 'USDA Organic', 'Carbon neutral shipping', 'Small farmer support']
      }
    },
    {
      id: 'reg_4',
      name: 'Regular Toilet Paper (12 rolls)',
      brand: 'Charmin',
      price: 12.99,
      co2Impact: 3.8,
      sustainabilityScore: 3.5,
      category: 'Household',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Household - Aisle 18A',
      ecoAlternative: {
        id: 'reg_4_alt',
        name: 'Bamboo Toilet Paper',
        brand: 'Cloud Paper',
        price: 15.99,
        priceIncrease: 3.00,
        co2Impact: 1.2,
        ecoPoints: 18,
        features: ['100% Bamboo', 'Plastic-free packaging', 'Tree-free', 'Hypoallergenic']
      }
    }
  ];

  // Update filter counts
  useEffect(() => {
    const updatedFilters = activeFilters.map(filter => {
      let count = 0;
      switch (filter.id) {
        case 'all':
          count = allProducts.length;
          break;
        case 'sustainshop':
          count = allProducts.filter(p => p.isEcoFriendly || p.isRecycled || p.isRefurbished).length;
          break;
        case 'organic':
          count = allProducts.filter(p => p.isOrganic).length;
          break;
        case 'local':
          count = allProducts.filter(p => p.isLocal).length;
          break;
        case 'sale':
          count = allProducts.filter(p => p.originalPrice).length;
          break;
        case 'eco-friendly':
          count = allProducts.filter(p => p.isEcoFriendly).length;
          break;
      }
      return { ...filter, count };
    });
    setActiveFilters(updatedFilters);
  }, []);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = allProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.certifications && product.certifications.some(cert => 
          cert.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Apply category filters
    const activeFilterIds = activeFilters.filter(f => f.active && f.id !== 'all').map(f => f.id);
    
    if (activeFilterIds.length > 0) {
      filtered = filtered.filter(product => {
        return activeFilterIds.some(filterId => {
          switch (filterId) {
            case 'sustainshop':
              return product.isEcoFriendly || product.isRecycled || product.isRefurbished;
            case 'organic':
              return product.isOrganic;
            case 'local':
              return product.isLocal;
            case 'sale':
              return !!product.originalPrice;
            case 'eco-friendly':
              return product.isEcoFriendly;
            default:
              return false;
          }
        });
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'eco-score':
        filtered.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
        break;
      default:
        // Keep relevance order (default order)
        break;
    }

    return filtered;
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => prev.map(filter => ({
      ...filter,
      active: filterId === 'all' ? filter.id === 'all' : 
              filter.id === 'all' ? false : 
              filter.id === filterId ? !filter.active : filter.active
    })));
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 8) return '#10B981';
    if (score >= 6) return '#F59E0B';
    if (score >= 4) return '#F97316';
    return '#EF4444';
  };

  const getNutritionColor = (score: string) => {
    switch (score) {
      case 'A': return '#10B981';
      case 'B': return '#22C55E';
      case 'C': return '#F59E0B';
      case 'D': return '#F97316';
      case 'E': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const showEcoAlternative = (product: Product) => {
    setSelectedProduct(product);
    setShowEcoModal(true);
  };

  const addToCart = (product: Product, isEcoAlternative = false) => {
    const productToAdd = isEcoAlternative && product.ecoAlternative ? 
      { ...product, ...product.ecoAlternative } : product;
    
    const currentQuantity = cartItems[productToAdd.id] || 0;
    setCartItems(prev => ({
      ...prev,
      [productToAdd.id]: currentQuantity + 1
    }));

    // Award EcoPoints
    if (productToAdd.ecoPoints > 0) {
      setUserEcoPoints(prev => prev + productToAdd.ecoPoints);
    }
    
    Alert.alert(
      isEcoAlternative ? '🌱 Eco Choice Added!' : 'Added to Cart! 🛒',
      `${productToAdd.name} has been added to your cart.\n\n💰 Price: $${productToAdd.price}${productToAdd.ecoPoints > 0 ? `\n🌟 EcoPoints: +${productToAdd.ecoPoints}` : ''}${isEcoAlternative ? '\n\n🎉 Great eco-friendly choice!' : ''}`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', onPress: () => {
          // Navigate to cart - in real app would use router
          Alert.alert('Navigation', 'Would navigate to cart tab');
        }}
      ]
    );
    setShowEcoModal(false);
  };

  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <View style={viewMode === 'grid' ? styles.productCardGrid : styles.productCardList}>
      {/* Badges */}
      <View style={styles.productBadges}>
        {product.originalPrice && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Text>
          </View>
        )}
        {product.isOrganic && (
          <View style={styles.organicBadge}>
            <Text style={styles.organicBadgeText}>🥬 Organic</Text>
          </View>
        )}
        {product.isLocal && (
          <View style={styles.localBadge}>
            <Text style={styles.localBadgeText}>🏘️ Local</Text>
          </View>
        )}
        {product.isEcoFriendly && !product.isOrganic && (
          <View style={styles.ecoBadge}>
            <Text style={styles.ecoBadgeText}>🌱 Eco</Text>
          </View>
        )}
        {product.isRefurbished && (
          <View style={styles.refurbishedBadge}>
            <Text style={styles.refurbishedBadgeText}>♻️ Refurb</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.productName}>{product.name}</Text>
        
        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <View style={styles.certificationsContainer}>
            {product.certifications.slice(0, 2).map((cert, index) => (
              <View key={index} style={styles.certificationTag}>
                <Text style={styles.certificationText}>{cert}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Origin for local/organic products */}
        {product.origin && (
          <Text style={styles.originText}>📍 {product.origin}</Text>
        )}
        
        <View style={styles.productMetrics}>
          <View style={styles.priceRow}>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            <Text style={styles.currentPrice}>${product.price}</Text>
            {product.nutritionScore && (
              <View style={[styles.nutritionBadge, { backgroundColor: getNutritionColor(product.nutritionScore) + '20', borderColor: getNutritionColor(product.nutritionScore) }]}>
                <Text style={[styles.nutritionText, { color: getNutritionColor(product.nutritionScore) }]}>
                  {product.nutritionScore}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.sustainabilityRow}>
            {product.ecoPoints > 0 ? (
              <Text style={styles.ecoPointsText}>💰 {product.ecoPoints} EcoCoins</Text>
            ) : (
              <Text style={styles.noEcoPointsText}>💰 0 EcoCoins</Text>
            )}
            <Text style={[
              styles.sustainabilityScore,
              { color: getSustainabilityColor(product.sustainabilityScore) }
            ]}>
              🌍 {product.sustainabilityScore}/10
            </Text>
          </View>
        </View>

        <Text style={styles.aisleLocation}>📍 {product.aisle}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addToCartText}>
            Add to Cart{cartItems[product.id] ? ` (${cartItems[product.id]})` : ''}
          </Text>
        </TouchableOpacity>
        
        {product.ecoAlternative && (
          <TouchableOpacity 
            style={styles.ecoAlternativeButton}
            onPress={() => showEcoAlternative(product)}
          >
            <Text style={styles.ecoAlternativeText}>
              🌱 Eco Alt {product.ecoAlternative.priceIncrease >= 0 ? `(+${product.ecoAlternative.priceIncrease.toFixed(2)})` : `(-${Math.abs(product.ecoAlternative.priceIncrease).toFixed(2)})`} • 💰{product.ecoAlternative.ecoPoints} EcoCoins
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const EcoAlternativeModal = () => (
    <Modal visible={showEcoModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEcoModal(false)}>
            <Text style={styles.modalBackButton}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Eco Alternative</Text>
          <Text style={styles.modalPoints}>💰 {userEcoPoints} points</Text>
        </View>

        {selectedProduct?.ecoAlternative && (
          <ScrollView style={styles.modalContent}>
            {/* Comparison Card */}
            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>🌱 Better Choice Available!</Text>
              
              {/* Original Product */}
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Current Choice</Text>
                <Text style={styles.comparisonProductName}>{selectedProduct.name}</Text>
                <View style={styles.comparisonMetrics}>
                  <Text style={styles.comparisonPrice}>${selectedProduct.price}</Text>
                  <Text style={styles.comparisonCO2}>🌍 {selectedProduct.co2Impact} kg CO₂</Text>
                  <Text style={styles.comparisonPoints}>💰 {selectedProduct.ecoPoints} EcoCoins</Text>
                </View>
              </View>

              <View style={styles.comparisonDivider}>
                <Text style={styles.comparisonVs}>VS</Text>
              </View>

              {/* Eco Alternative */}
              <View style={[styles.comparisonItem, styles.ecoComparisonItem]}>
                <Text style={styles.comparisonLabel}>🌱 Eco Alternative</Text>
                <Text style={styles.comparisonProductName}>{selectedProduct.ecoAlternative.name}</Text>
                <View style={styles.comparisonMetrics}>
                  <Text style={styles.comparisonPrice}>${selectedProduct.ecoAlternative.price}</Text>
                  <Text style={[styles.comparisonCO2, styles.betterCO2]}>
                    🌍 {selectedProduct.ecoAlternative.co2Impact} kg CO₂
                  </Text>
                  <Text style={[styles.comparisonPoints, styles.betterPoints]}>
                    💰 {selectedProduct.ecoAlternative.ecoPoints} EcoCoins
                  </Text>
                </View>
              </View>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>💚 Environmental Benefits</Text>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🌱</Text>
                <Text style={styles.benefitText}>
                  Save {(selectedProduct.co2Impact - selectedProduct.ecoAlternative.co2Impact).toFixed(1)} kg CO₂
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>💰</Text>
                <Text style={styles.benefitText}>
                  Earn {selectedProduct.ecoAlternative.ecoPoints} EcoCoins (vs {selectedProduct.ecoPoints} on regular)
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>💸</Text>
                <Text style={styles.benefitText}>
                  {selectedProduct.ecoAlternative.priceIncrease >= 0 
                    ? `Only $${selectedProduct.ecoAlternative.priceIncrease.toFixed(2)} more for sustainability`
                    : `Save $${Math.abs(selectedProduct.ecoAlternative.priceIncrease).toFixed(2)} while being eco-friendly`
                  }
                </Text>
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresCard}>
              <Text style={styles.featuresTitle}>✨ Key Features</Text>
              {selectedProduct.ecoAlternative.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.keepOriginalButton}
                onPress={() => addToCart(selectedProduct)}
              >
                <Text style={styles.keepOriginalText}>Keep Original Choice</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.chooseEcoButton}
                onPress={() => addToCart(selectedProduct, true)}
              >
                <Text style={styles.chooseEcoText}>
                  🌱 Choose Eco Alternative {selectedProduct.ecoAlternative.priceIncrease >= 0 
                    ? `(+$${selectedProduct.ecoAlternative.priceIncrease.toFixed(2)})` 
                    : `(-$${Math.abs(selectedProduct.ecoAlternative.priceIncrease).toFixed(2)})`
                  } • 💰{selectedProduct.ecoAlternative.ecoPoints} EcoCoins
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const availableRescueDeals = rescueDeals.filter(deal => 
    deal && deal.status === 'pending'
  );

  const filteredProducts = getFilteredProducts();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.storeText}>Walmart</Text>
        <Text style={styles.locationText}>📍 Supercenter - Delhi</Text>
        <Text style={styles.tagline}>Save Money. Live Better. Go Green.</Text>
        
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>💰 {userEcoPoints}</Text>
            <Text style={styles.headerStatLabel}>EcoPoints</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>🛒 {getCartItemCount()}</Text>
            <Text style={styles.headerStatLabel}>Cart Items</Text>
          </View>
        </View>
        
        {availableRescueDeals.length > 0 && (
          <View style={styles.liveCounter}>
            <Text style={styles.liveCounterText}>
              🔥 {availableRescueDeals.length} rescue deals available!
            </Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands, certifications..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* View Mode & Sort Toggle */}
        <View style={styles.controlsContainer}>
          <View style={styles.viewModeContainer}>
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeActive]}
              onPress={() => setViewMode('grid')}
            >
              <Text style={styles.viewModeIcon}>⊞</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeActive]}
              onPress={() => setViewMode('list')}
            >
              <Text style={styles.viewModeIcon}>☰</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sortContainer}>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => {
                const sortOptions = [
                  { id: 'relevance', name: 'Relevance' },
                  { id: 'price-low', name: 'Price: Low to High' },
                  { id: 'price-high', name: 'Price: High to Low' },
                  { id: 'eco-score', name: 'Eco Score: High to Low' }
                ];
                Alert.alert(
                  'Sort by',
                  'Choose sorting option',
                  sortOptions.map(option => ({
                    text: option.name,
                    onPress: () => setSortBy(option.id as any)
                  }))
                );
              }}
            >
              <Text style={styles.sortText}>Sort ↕️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {activeFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, filter.active && styles.filterChipActive]}
              onPress={() => toggleFilter(filter.id)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text style={[styles.filterText, filter.active && styles.filterTextActive]}>
                {filter.name}
                {filter.count !== undefined && ` (${filter.count})`}
              </Text>
              {filter.id === 'sustainshop' && filter.active && (
                <View style={styles.sustainShopBadge}>
                  <Text style={styles.sustainShopBadgeText}>Super Savings!</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid/List */}
      <View style={styles.productsSection}>
        <View style={styles.productsSectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeFilters.find(f => f.active && f.id !== 'all')?.name || 'All Products'}
          </Text>
          <Text style={styles.resultsCount}>
            {filteredProducts.length} items {sortBy !== 'relevance' && `• Sorted by ${sortBy.replace('-', ' ')}`}
          </Text>
        </View>
        
        <View style={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsTitle}>No products found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </View>

      <EcoAlternativeModal />
    </ScrollView>
  );
}

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
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 12,
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatValue: {
    color: '#FFC220',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatLabel: {
    color: '#E6F3FF',
    fontSize: 12,
  },
  liveCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  liveCounterText: {
    color: '#FFC220',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#6B7280',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearSearchIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewModeActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewModeIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
  sortContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sortButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filtersSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    position: 'relative',
  },
  filterChipActive: {
    backgroundColor: '#059669',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: 'white',
  },
  sustainShopBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sustainShopBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  productsSection: {
    padding: 16,
  },
  productsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productsList: {
    gap: 12,
  },
  productCardGrid: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  productCardList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  productBadges: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    gap: 4,
  },
  saleBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  organicBadge: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  organicBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  localBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  localBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ecoBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ecoBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  refurbishedBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  refurbishedBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    marginTop: 20,
    marginBottom: 12,
  },
  productBrand: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  certificationTag: {
    backgroundColor: '#F0FDF4',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  certificationText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '500',
  },
  originText: {
    fontSize: 11,
    color: '#3B82F6',
    marginBottom: 6,
    fontWeight: '500',
  },
  productMetrics: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0071CE',
  },
  nutritionBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  nutritionText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sustainabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ecoPointsText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  noEcoPointsText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sustainabilityScore: {
    fontSize: 12,
    fontWeight: '600',
  },
  aisleLocation: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  productActions: {
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: '#0071CE',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ecoAlternativeButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  ecoAlternativeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
  comparisonCard: {
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
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  comparisonItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
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
  comparisonProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  comparisonMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0071CE',
  },
  comparisonCO2: {
    fontSize: 12,
    color: '#EF4444',
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
    paddingVertical: 12,
  },
  comparisonVs: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  benefitsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 14,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  modalActions: {
    gap: 12,
    paddingBottom: 20,
  },
  keepOriginalButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  keepOriginalText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  chooseEcoButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chooseEcoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});