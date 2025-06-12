// app/(customer)/(tabs)/dashboard.tsx - Enhanced Shopping Experience
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
  ecoPoints: number;
  aisle: string;
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
  ]);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Expanded product catalog
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
      aisle: 'Garden Center - Aisle 20B'
    },
    {
      id: 'sustain_3',
      name: 'Organic Cotton Bed Sheets',
      brand: 'Pure Earth',
      price: 79.99,
      originalPrice: 119.99,
      co2Impact: 4.2,
      sustainabilityScore: 8.8,
      category: 'Home',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 25,
      aisle: 'Home - Aisle 15C'
    },
    {
      id: 'sustain_4',
      name: 'Solar Power Bank',
      brand: 'SunCharge',
      price: 39.99,
      originalPrice: 59.99,
      co2Impact: 2.1,
      sustainabilityScore: 9.1,
      category: 'Electronics',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 30,
      aisle: 'Electronics - Aisle 2C'
    },
    {
      id: 'sustain_5',
      name: 'Bamboo Dinnerware Set',
      brand: 'EcoTable',
      price: 24.99,
      originalPrice: 39.99,
      co2Impact: 1.8,
      sustainabilityScore: 8.7,
      category: 'Kitchen',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 20,
      aisle: 'Kitchen - Aisle 17A'
    },
    {
      id: 'sustain_6',
      name: 'Reusable Food Storage Containers',
      brand: 'ZeroWaste',
      price: 34.99,
      originalPrice: 49.99,
      co2Impact: 3.2,
      sustainabilityScore: 8.9,
      category: 'Kitchen',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 28,
      aisle: 'Kitchen - Aisle 17B'
    },
    {
      id: 'sustain_7',
      name: 'Electric Bike (Refurbished)',
      brand: 'GreenRide',
      price: 899.99,
      originalPrice: 1299.99,
      co2Impact: 45.3,
      sustainabilityScore: 9.5,
      category: 'Transportation',
      inStock: true,
      isEcoFriendly: true,
      isRefurbished: true,
      ecoPoints: 80,
      aisle: 'Sports & Outdoors - Aisle 28A'
    },
    {
      id: 'sustain_8',
      name: 'Compost Bin System',
      brand: 'GreenCycle',
      price: 59.99,
      originalPrice: 89.99,
      co2Impact: 5.1,
      sustainabilityScore: 9.3,
      category: 'Garden',
      inStock: true,
      isEcoFriendly: true,
      ecoPoints: 35,
      aisle: 'Garden Center - Aisle 20C'
    },
    
    // Regular products with eco alternatives (NO ECO POINTS for regular items)
    {
      id: 'reg_1',
      name: 'Regular Pasta (1 lb)',
      brand: 'PastaPlus',
      price: 1.49,
      co2Impact: 1.8,
      sustainabilityScore: 4.2,
      category: 'Food',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Pasta & Rice - Aisle 14A',
      ecoAlternative: {
        id: 'reg_1_alt',
        name: 'Organic Whole Wheat Pasta',
        brand: 'Nature\'s Best',
        price: 2.29,
        priceIncrease: 0.80,
        co2Impact: 0.9,
        ecoPoints: 8,
        features: ['Organic certified', 'Whole grain', 'Sustainable farming']
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
      name: 'Regular Detergent',
      brand: 'CleanMax',
      price: 8.99,
      co2Impact: 3.4,
      sustainabilityScore: 4.1,
      category: 'Household',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Household - Aisle 18B',
      ecoAlternative: {
        id: 'reg_3_alt',
        name: 'Concentrated Eco Detergent',
        brand: 'GreenClean',
        price: 7.49,
        priceIncrease: -1.50,
        co2Impact: 1.1,
        ecoPoints: 15,
        features: ['Biodegradable', 'Plant-based', 'Concentrated formula', 'Less packaging']
      }
    },
    {
      id: 'reg_4',
      name: 'Cotton T-Shirt',
      brand: 'BasicWear',
      price: 9.99,
      co2Impact: 8.1,
      sustainabilityScore: 3.8,
      category: 'Clothing',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Clothing - Aisle 25A',
      ecoAlternative: {
        id: 'reg_4_alt',
        name: 'Organic Cotton T-Shirt',
        brand: 'EarthWear',
        price: 16.99,
        priceIncrease: 7.00,
        co2Impact: 3.2,
        ecoPoints: 18,
        features: ['GOTS certified', 'Fair trade', 'Pesticide-free']
      }
    },
    {
      id: 'reg_5',
      name: 'Regular Notebook Pack',
      brand: 'SchoolPlus',
      price: 5.99,
      co2Impact: 2.8,
      sustainabilityScore: 3.5,
      category: 'School & Office',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'School Supplies - Aisle 22B',
      ecoAlternative: {
        id: 'reg_5_alt',
        name: 'Recycled Paper Notebook Pack',
        brand: 'TreeSaver',
        price: 4.99,
        priceIncrease: -1.00,
        co2Impact: 1.1,
        ecoPoints: 12,
        features: ['100% recycled paper', 'FSC certified', 'Plastic-free']
      }
    },
    {
      id: 'reg_6',
      name: 'Regular Shampoo',
      brand: 'HairCare',
      price: 6.49,
      co2Impact: 2.3,
      sustainabilityScore: 3.9,
      category: 'Personal Care',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Personal Care - Aisle 19A',
      ecoAlternative: {
        id: 'reg_6_alt',
        name: 'Solid Shampoo Bar',
        brand: 'EcoHair',
        price: 8.99,
        priceIncrease: 2.50,
        co2Impact: 0.8,
        ecoPoints: 14,
        features: ['Zero plastic', 'Natural ingredients', 'Lasts 2x longer']
      }
    },
    {
      id: 'reg_7',
      name: 'Regular Coffee (Ground)',
      brand: 'MorningBrew',
      price: 7.99,
      co2Impact: 4.2,
      sustainabilityScore: 3.7,
      category: 'Beverages',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Coffee & Tea - Aisle 13B',
      ecoAlternative: {
        id: 'reg_7_alt',
        name: 'Fair Trade Organic Coffee',
        brand: 'EthicalBeans',
        price: 11.99,
        priceIncrease: 4.00,
        co2Impact: 2.1,
        ecoPoints: 16,
        features: ['Fair trade certified', 'Organic', 'Carbon neutral shipping']
      }
    },
    {
      id: 'reg_8',
      name: 'Disposable Razors (Pack)',
      brand: 'QuickShave',
      price: 3.99,
      co2Impact: 1.9,
      sustainabilityScore: 2.8,
      category: 'Personal Care',
      inStock: true,
      isEcoFriendly: false,
      ecoPoints: 0,
      aisle: 'Personal Care - Aisle 19C',
      ecoAlternative: {
        id: 'reg_8_alt',
        name: 'Safety Razor + Blades',
        brand: 'LastingShave',
        price: 24.99,
        priceIncrease: 21.00,
        co2Impact: 0.4,
        ecoPoints: 22,
        features: ['Lifetime razor', 'Recyclable blades', 'Plastic-free', 'Saves money long-term']
      }
    }
  ];

  // Filter products based on search and active filters
  const getFilteredProducts = () => {
    let filtered = allProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    const sustainShopActive = activeFilters.find(f => f.id === 'sustainshop')?.active;
    const organicActive = activeFilters.find(f => f.id === 'organic')?.active;
    const localActive = activeFilters.find(f => f.id === 'local')?.active;
    const saleActive = activeFilters.find(f => f.id === 'sale')?.active;

    if (sustainShopActive) {
      filtered = filtered.filter(product => 
        product.isEcoFriendly || product.isRecycled || product.isRefurbished
      );
    }

    if (organicActive) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes('organic')
      );
    }

    if (saleActive) {
      filtered = filtered.filter(product => product.originalPrice);
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

  const showEcoAlternative = (product: Product) => {
    setSelectedProduct(product);
    setShowEcoModal(true);
  };

  const addToCart = (product: Product, isEcoAlternative = false) => {
    const productToAdd = isEcoAlternative && product.ecoAlternative ? 
      { ...product, ...product.ecoAlternative } : product;
    
    Alert.alert(
      'Added to Cart! 🛒',
      `${productToAdd.name} has been added to your cart.\n\n💰 Price: ${productToAdd.price}\n💰 EcoCoins: +${productToAdd.ecoPoints}${productToAdd.ecoPoints > 0 ? ' (Spend in EcoRewards!)' : ''}`,
      [{ text: 'Continue Shopping', style: 'default' }]
    );
    setShowEcoModal(false);
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
        {product.isEcoFriendly && (
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
        
        <View style={styles.productMetrics}>
          <View style={styles.priceRow}>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            <Text style={styles.currentPrice}>${product.price}</Text>
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
          <Text style={styles.addToCartText}>Add to Cart</Text>
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
          <View style={styles.modalHeaderRight} />
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
                    ? `Only ${selectedProduct.ecoAlternative.priceIncrease.toFixed(2)} more for sustainability`
                    : `Save ${Math.abs(selectedProduct.ecoAlternative.priceIncrease).toFixed(2)} while being eco-friendly`
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
                    ? `(+${selectedProduct.ecoAlternative.priceIncrease.toFixed(2)})` 
                    : `(-${Math.abs(selectedProduct.ecoAlternative.priceIncrease).toFixed(2)})`
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.storeText}>Walmart</Text>
        <Text style={styles.locationText}>📍 Supercenter - Delhi</Text>
        <Text style={styles.tagline}>Save Money. Live Better. Go Green.</Text>
        
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
            placeholder="Search products, brands, categories..."
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

        {/* View Mode Toggle */}
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
            {getFilteredProducts().length} items
          </Text>
        </View>
        
        <View style={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
          {getFilteredProducts().map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  modalHeaderRight: {
    width: 60,
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