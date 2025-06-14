// app/(customer)/(tabs)/scan.tsx - COMPLETE Enhanced with AI Integration & Cart Integration
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppData } from '../../contexts/AppDataContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ScannedProduct {
  name: string;
  brand: string;
  price: number;
  co2Impact: number;
  sustainabilityScore: number;
  ecoPoints: number;
  category: string;
  barcode: string;
}

interface AIRecommendation {
  id: string;
  name: string;
  brand: string;
  price: number;
  co2Impact: number;
  co2Savings: number;
  sustainabilityScore: number;
  aisle: string;
  section: string;
  distance: string;
  features: string[];
  certifications: string[];
  ecoPoints: number;
  ecoBonus: number;
  inStock: boolean;
  reasonForRecommendation: string;
  matchScore: number; // How well it matches the original product (0-100)
}

interface AIAnalysisResult {
  scannedProduct: ScannedProduct;
  aiRecommendations: AIRecommendation[];
  analysisNotes: string;
  sustainabilityTips: string[];
}

export default function EnhancedScanTab() {
  const { 
    addToCart, 
    userEcoPoints, 
    setUserEcoPoints,
    inventory // AI inventory from context
  } = useAppData();

  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Enhanced AI algorithm to find relevant alternatives from inventory
  const generateAIRecommendations = async (barcode: string): Promise<AIAnalysisResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock product recognition based on barcode
    const scannedProducts: { [key: string]: ScannedProduct } = {
      '123456789012': {
        name: "Regular Plastic Water Bottles (24 pack)",
        brand: "AquaPure",
        price: 4.99,
        co2Impact: 5.8,
        sustainabilityScore: 2.1,
        ecoPoints: 0,
        category: 'Beverages',
        barcode: barcode
      },
      '098765432109': {
        name: "Ground Beef (1 lb)",
        brand: "Fresh Choice",
        price: 6.98,
        co2Impact: 27.0,
        sustainabilityScore: 3.2,
        ecoPoints: 0,
        category: 'Meat',
        barcode: barcode
      },
      '111222333444': {
        name: "Regular Paper Towels (8 rolls)",
        brand: "CleanUp",
        price: 12.99,
        co2Impact: 4.2,
        sustainabilityScore: 3.0,
        ecoPoints: 0,
        category: 'Household',
        barcode: barcode
      },
      '555666777888': {
        name: "Regular Laundry Detergent (64 oz)",
        brand: "SudsMaster",
        price: 11.49,
        co2Impact: 6.3,
        sustainabilityScore: 3.8,
        ecoPoints: 0,
        category: 'Household',
        barcode: barcode
      },
      '999888777666': {
        name: "Regular Cotton T-Shirt",
        brand: "BasicWear",
        price: 12.99,
        co2Impact: 8.5,
        sustainabilityScore: 3.5,
        ecoPoints: 0,
        category: 'Clothing',
        barcode: barcode
      },
      '444555666777': {
        name: "Smartphone Charger",
        brand: "TechBasic",
        price: 15.99,
        co2Impact: 4.2,
        sustainabilityScore: 4.0,
        ecoPoints: 0,
        category: 'Electronics',
        barcode: barcode
      }
    };

    // Default scanned product if barcode not found
    const scannedProduct = scannedProducts[barcode] || {
      name: "Plastic Water Bottle",
      brand: "Bisleri",
      price: 0.23,
      co2Impact: 8.5,
      sustainabilityScore: 4.0,
      ecoPoints: 0,
      category: 'General',
      barcode: barcode
    };

    // AI algorithm to find relevant alternatives from inventory
    const findRelevantAlternatives = (product: ScannedProduct): AIRecommendation[] => {
      let relevantItems: AIRecommendation[] = [];

      // Enhanced matching algorithm
      inventory.forEach(item => {
        let matchScore = 0;
        let reasonForRecommendation = '';

        // Category-based matching
        if (product.category.toLowerCase().includes('beverage') || product.name.toLowerCase().includes('water')) {
          if (item.keywords.includes('water') || item.keywords.includes('drink')) {
            matchScore += 40;
            reasonForRecommendation = 'Sustainable hydration alternative';
          }
        }

        if (product.category.toLowerCase().includes('meat') || product.name.toLowerCase().includes('beef')) {
          if (item.keywords.includes('meat') || item.keywords.includes('protein')) {
            matchScore += 45;
            reasonForRecommendation = 'Plant-based protein alternative with 87% less CO₂';
          }
        }

        if (product.name.toLowerCase().includes('paper towel') || product.category.toLowerCase().includes('household')) {
          if (item.keywords.includes('paper') || item.keywords.includes('cleaning')) {
            matchScore += 35;
            reasonForRecommendation = 'Eco-friendly cleaning alternative';
          }
        }

        if (product.category.toLowerCase().includes('clothing') || product.name.toLowerCase().includes('shirt')) {
          if (item.keywords.includes('clothing') || item.keywords.includes('shirt')) {
            matchScore += 40;
            reasonForRecommendation = 'Sustainable clothing alternative with organic materials';
          }
        }

        if (product.category.toLowerCase().includes('electronics') || product.name.toLowerCase().includes('charger')) {
          if (item.keywords.includes('power') || item.keywords.includes('electronics')) {
            matchScore += 35;
            reasonForRecommendation = 'Energy-efficient electronics alternative';
          }
        }

        // Generic eco-friendly alternatives for any product
        if (matchScore === 0 && item.sustainabilityScore > product.sustainabilityScore) {
          matchScore = 25;
          reasonForRecommendation = 'More sustainable option in similar category';
        }

        // Add sustainability boost
        if (item.sustainabilityScore >= 8.0) {
          matchScore += 15;
        }

        // Only include items with decent match score
        if (matchScore >= 25 && item.inStock) {
          const co2Savings = Math.max(0, product.co2Impact - item.co2Impact);
          const ecoBonus = Math.floor(matchScore / 10) + 5; // Bonus points based on match quality

          relevantItems.push({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            co2Impact: item.co2Impact,
            co2Savings: co2Savings,
            sustainabilityScore: item.sustainabilityScore,
            aisle: item.aisle,
            section: item.section,
            distance: `${Math.floor(Math.random() * 200) + 100} ft from scan location`,
            features: item.features,
            certifications: item.certifications,
            ecoPoints: item.ecoPoints,
            ecoBonus: ecoBonus,
            inStock: item.inStock,
            reasonForRecommendation: reasonForRecommendation,
            matchScore: matchScore
          });
        }
      });

      // Sort by match score and return top 3
      return relevantItems
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
    };

    const aiRecommendations = findRelevantAlternatives(scannedProduct);

    // Generate AI analysis notes
    const generateAnalysisNotes = (product: ScannedProduct, recommendations: AIRecommendation[]) => {
      const sustainabilityLevel = product.sustainabilityScore < 4 ? 'low' : 
                                 product.sustainabilityScore < 7 ? 'moderate' : 'high';
      
      const avgCo2Savings = recommendations.length > 0 ? 
        recommendations.reduce((sum, rec) => sum + rec.co2Savings, 0) / recommendations.length : 0;
      
      return `AI Analysis: This product has ${sustainabilityLevel} sustainability (${product.sustainabilityScore}/10). ` +
             `By switching to recommended alternatives, you could save an average of ${avgCo2Savings.toFixed(1)}kg CO₂ ` +
             `and earn up to ${Math.max(...recommendations.map(r => r.ecoPoints + r.ecoBonus), 0)} EcoPoints.`;
    };

    // Generate sustainability tips
    const generateSustainabilityTips = (product: ScannedProduct): string[] => {
      const tips = [
        "Look for products with minimal packaging to reduce waste",
        "Choose locally sourced items to reduce transportation emissions",
        "Consider reusable alternatives to single-use products",
        "Check for certifications like USDA Organic, Fair Trade, or Energy Star"
      ];

      // Add specific tips based on product category
      if (product.category.toLowerCase().includes('beverage')) {
        tips.push("Invest in a reusable water bottle to eliminate plastic waste");
      }
      if (product.category.toLowerCase().includes('meat')) {
        tips.push("Try plant-based proteins 1-2 times per week to reduce carbon footprint");
      }
      if (product.category.toLowerCase().includes('household')) {
        tips.push("Look for biodegradable cleaning products to protect waterways");
      }
      if (product.category.toLowerCase().includes('clothing')) {
        tips.push("Choose organic cotton and sustainable fabrics");
      }
      if (product.category.toLowerCase().includes('electronics')) {
        tips.push("Look for energy-efficient and solar-powered alternatives");
      }

      return tips.slice(0, 3); // Return top 3 relevant tips
    };

    return {
      scannedProduct,
      aiRecommendations,
      analysisNotes: generateAnalysisNotes(scannedProduct, aiRecommendations),
      sustainabilityTips: generateSustainabilityTips(scannedProduct)
    };
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScannedData(data);
    setIsScanning(false);
    setLoading(true);
    
    try {
      const result = await generateAIRecommendations(data);
      setAnalysisResult(result);
      setLoading(false);
      setShowResults(true);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to analyze product. Please try again.');
    }
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to scan product barcodes.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setIsScanning(true);
    setScannedData(null);
    setShowResults(false);
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 8) return '#10B981'; // Green
    if (score >= 6) return '#F59E0B'; // Yellow
    if (score >= 4) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const addToCartWithEcoPoints = (product: any, isAIRecommendation = false) => {
    let pointsEarned = 0;
    let productToAdd: any = {};
    
    if (isAIRecommendation && analysisResult) {
      pointsEarned = product.ecoPoints + product.ecoBonus;
      productToAdd = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: analysisResult.scannedProduct.category,
        ecoPoints: pointsEarned,
        aisle: product.aisle,
        isEcoAlternative: true,
        co2Impact: product.co2Impact,
        sustainabilityScore: product.sustainabilityScore,
        isEcoFriendly: true
      };
      setUserEcoPoints(prev => prev + pointsEarned);
    } else if (analysisResult) {
      pointsEarned = analysisResult.scannedProduct.ecoPoints;
      productToAdd = {
        id: `scanned_${analysisResult.scannedProduct.barcode}`,
        name: analysisResult.scannedProduct.name,
        brand: analysisResult.scannedProduct.brand,
        price: analysisResult.scannedProduct.price,
        category: analysisResult.scannedProduct.category,
        ecoPoints: pointsEarned,
        aisle: 'Scanned Item',
        isScanned: true,
        co2Impact: analysisResult.scannedProduct.co2Impact,
        sustainabilityScore: analysisResult.scannedProduct.sustainabilityScore,
        isEcoFriendly: false
      };
      if (pointsEarned > 0) {
        setUserEcoPoints(prev => prev + pointsEarned);
      }
    }

    // Add to cart using context function
    addToCart(productToAdd);

    Alert.alert(
      isAIRecommendation ? '🌱 AI Recommendation Added!' : 'Scanned Item Added!',
      `${productToAdd.name} has been added to your cart.\n\n💰 Price: $${productToAdd.price}\n🌟 EcoPoints Earned: ${pointsEarned}${isAIRecommendation ? '\n\n🎉 Great choice! AI found you a better alternative!' : ''}${pointsEarned === 0 ? '\n\n💡 Tip: Try our AI recommendations to earn more points!' : ''}`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', onPress: () => {
          // Navigate to cart tab
          // In real app: router.push('/(customer)/(tabs)/cart')
          Alert.alert('Navigation', 'Would navigate to cart tab');
        }}
      ]
    );
    setShowResults(false);
  };

  const ScanningView = () => (
    <View style={styles.scanContainer}>
      <CameraView
        style={styles.camera}
        facing={'back' as CameraType}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128', 'code39'],
        }}
      >
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanInstruction}>
            Point camera at product barcode
          </Text>
          <Text style={styles.scanSubInstruction}>
            AI will find the best eco-friendly alternatives from our inventory
          </Text>
          <TouchableOpacity 
            style={styles.cancelScanButton}
            onPress={() => setIsScanning(false)}
          >
            <Text style={styles.cancelScanText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  const LoadingView = () => (
    <View style={styles.loadingContainer}>

      <Text style={styles.loadingTitle}>WiseBuy Analyzing Product...</Text>
      <Text style={styles.loadingText}>
        • Identifying scanned product{'\n'}
        • Searching inventory for alternatives{'\n'}
        • Calculating environmental impact{'\n'}
        • Generating personalized recommendations
      </Text>
      <View style={styles.loadingPoints}>
        <Text style={styles.loadingPointsText}>💰 Current EcoPoints: {userEcoPoints}</Text>
      </View>
    </View>
  );

  const ResultsModal = () => (
    <Modal visible={showResults} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowResults(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Analysis Results</Text>
          <TouchableOpacity onPress={() => {
            setShowResults(false);
            startScanning();
          }}>
            <Text style={styles.modalScanAgainButton}>Scan Again</Text>
          </TouchableOpacity>
        </View>

        {analysisResult && (
          <ScrollView style={styles.modalContent}>
            {/* AI Analysis Summary */}
            <View style={styles.aiAnalysisCard}>
              <Text style={styles.aiAnalysisTitle}>AI Analysis</Text>
              <Text style={styles.aiAnalysisText}>{analysisResult.analysisNotes}</Text>
            </View>

            {/* Scanned Product */}
            <View style={styles.scannedProductCard}>
              <Text style={styles.scannedProductTitle}>Scanned Product</Text>
              <Text style={styles.productName}>{analysisResult.scannedProduct.name}</Text>
              <Text style={styles.productBrand}>{analysisResult.scannedProduct.brand}</Text>
              <Text style={styles.productBarcode}>Barcode: {analysisResult.scannedProduct.barcode}</Text>
              
              <View style={styles.productMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Price</Text>
                  <Text style={styles.metricValue}>${analysisResult.scannedProduct.price}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>CO₂ Impact</Text>
                  <Text style={[styles.metricValue, { color: '#EF4444' }]}>
                    {analysisResult.scannedProduct.co2Impact} kg
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Eco Score</Text>
                  <Text style={[styles.metricValue, { color: getSustainabilityColor(analysisResult.scannedProduct.sustainabilityScore) }]}>
                    {analysisResult.scannedProduct.sustainabilityScore}/10
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.addOriginalButton}
                onPress={() => addToCartWithEcoPoints(analysisResult.scannedProduct, false)}
              >
                <Text style={styles.addOriginalButtonText}>
                  Add Scanned Item • ${analysisResult.scannedProduct.price}
                  {analysisResult.scannedProduct.ecoPoints > 0 && ` • +${analysisResult.scannedProduct.ecoPoints} points`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* AI Recommendations */}
            {analysisResult.aiRecommendations.length > 0 ? (
              <>
                <Text style={styles.recommendationsTitle}>🌱 AI-Powered Eco Recommendations</Text>
                
                {analysisResult.aiRecommendations.map((recommendation, index) => (
                  <View key={recommendation.id} style={styles.recommendationCard}>
                    <View style={styles.recommendationHeader}>
                      <View style={styles.recommendationInfo}>
                        <Text style={styles.recommendationName}>{recommendation.name}</Text>
                        <Text style={styles.recommendationBrand}>{recommendation.brand}</Text>
                        <Text style={styles.recommendationReason}>{recommendation.reasonForRecommendation}</Text>
                      </View>
                      <View style={styles.matchScoreBadge}>
                        <Text style={styles.matchScoreText}>{recommendation.matchScore}% match</Text>
                      </View>
                    </View>

                    <View style={styles.recommendationMetrics}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Price</Text>
                        <Text style={styles.metricValue}>${recommendation.price}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>CO₂ Savings</Text>
                        <Text style={[styles.metricValue, { color: '#10B981' }]}>
                          -{recommendation.co2Savings.toFixed(1)} kg
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Eco Score</Text>
                        <Text style={[styles.metricValue, { color: getSustainabilityColor(recommendation.sustainabilityScore) }]}>
                          {recommendation.sustainabilityScore}/10
                        </Text>
                      </View>
                    </View>

                    {/* AI Bonus Points */}
                    <View style={styles.aiBonusCard}>
                      <Text style={styles.aiBonusIcon}>🎁</Text>
                      <View style={styles.aiBonusInfo}>
                        <Text style={styles.aiBonusTitle}>AI Recommendation Bonus!</Text>
                        <Text style={styles.aiBonusText}>
                          Total EcoPoints: {recommendation.ecoPoints + recommendation.ecoBonus} 
                          ({recommendation.ecoPoints} base + {recommendation.ecoBonus} AI bonus)
                        </Text>
                      </View>
                    </View>

                    {/* Location & Features */}
                    <View style={styles.locationCard}>
                      <Text style={styles.locationTitle}>📍 Store Location</Text>
                      <Text style={styles.locationText}>
                        <Text style={styles.locationLabel}>Section: </Text>
                        {recommendation.section}
                      </Text>
                      <Text style={styles.locationText}>
                        <Text style={styles.locationLabel}>Distance: </Text>
                        {recommendation.distance}
                      </Text>
                    </View>

                    <View style={styles.featuresSection}>
                      <Text style={styles.featuresTitle}>Key Features</Text>
                      <View style={styles.featuresList}>
                        {recommendation.features.slice(0, 3).map((feature, idx) => (
                          <View key={idx} style={styles.featureItem}>
                            <Text style={styles.featureBullet}>✓</Text>
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.addRecommendationButton}
                      onPress={() => addToCartWithEcoPoints(recommendation, true)}
                    >
                      <Text style={styles.addRecommendationButtonText}>
                        Add AI Recommendation • ${recommendation.price} • +{recommendation.ecoPoints + recommendation.ecoBonus} points
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.noRecommendationsCard}>
                <Text style={styles.noRecommendationsIcon}>🤖</Text>
                <Text style={styles.noRecommendationsTitle}>No Eco Alternatives Found</Text>
                <Text style={styles.noRecommendationsText}>
                  Our AI couldn't find better alternatives for this product in our current inventory. 
                  This might mean it's already a great sustainable choice!
                </Text>
              </View>
            )}

            {/* Sustainability Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 AI Sustainability Tips</Text>
              {analysisResult.sustainabilityTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  if (!permission) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Walmart WiseBuy</Text>
        <Text style={styles.headerSubtitle}>
          Scan products and let WiseBuy find the best eco-friendly alternatives from our inventory
        </Text>
        <View style={styles.headerPoints}>
          <Text style={styles.headerPointsText}>💰 {userEcoPoints} EcoPoints</Text>
        </View>
      </View>

      {isScanning ? (
        <ScanningView />
      ) : loading ? (
        <LoadingView />
      ) : (
        <ScrollView style={styles.content}>
          {/* AI Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What does WiseBuy do?</Text>
            <View style={styles.aiFeaturesContainer}>
              <View style={styles.aiFeatureCard}>
                <Text style={styles.aiFeatureIcon}>🔍</Text>
                <View style={styles.aiFeatureContent}>
                  <Text style={styles.aiFeatureTitle}>Smart Product Recognition</Text>
                  <Text style={styles.aiFeatureText}>
                    AI instantly identifies products and analyzes their environmental impact
                  </Text>
                </View>
              </View>
              <View style={styles.aiFeatureCard}>
                <Text style={styles.aiFeatureIcon}>🌱</Text>
                <View style={styles.aiFeatureContent}>
                  <Text style={styles.aiFeatureTitle}>Inventory-Based Recommendations</Text>
                  <Text style={styles.aiFeatureText}>
                    Find real eco alternatives available in our store right now
                  </Text>
                </View>
              </View>
              <View style={styles.aiFeatureCard}>
                <Text style={styles.aiFeatureIcon}>💰</Text>
                <View style={styles.aiFeatureContent}>
                  <Text style={styles.aiFeatureTitle}>Bonus EcoPoints</Text>
                  <Text style={styles.aiFeatureText}>
                    Earn extra points when you choose WiseBuy-recommended alternatives
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Scan Button */}
          <View style={styles.scanSection}>
            <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
              <Text style={styles.scanButtonIcon}><MaterialCommunityIcons name="barcode-scan" size={32} color="#22C55E" /></Text>
              <Text style={styles.scanButtonText}>Click Me!!</Text>
              <Text style={styles.scanButtonSubtext}>Tap to activate AI-powered analysis</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Scan */}
          {scannedData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent WiseBuy Analysis</Text>
              <TouchableOpacity 
                style={styles.recentScanCard}
                onPress={() => setShowResults(true)}
              >
                <View style={styles.recentScanInfo}>
                  <Text style={styles.recentScanTitle}>WiseBuy Analysis Complete</Text>
                  <Text style={styles.recentScanBarcode}>Barcode: {scannedData}</Text>
                  <Text style={styles.recentScanTime}>
                    {new Date().toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.recentScanArrow}>›</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* How AI Works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How Our AI Works</Text>
            <View style={styles.aiProcessCard}>
              <View style={styles.aiProcessStep}>
                <View style={styles.aiProcessIcon}>
                  <Text style={styles.aiProcessIconText}>1️⃣</Text>
                </View>
                <Text style={styles.aiProcessText}>Scan barcode to identify the product</Text>
              </View>
              <View style={styles.aiProcessStep}>
                <View style={styles.aiProcessIcon}>
                  <Text style={styles.aiProcessIconText}>2️⃣</Text>
                </View>
                <Text style={styles.aiProcessText}>AI analyzes environmental impact & sustainability</Text>
              </View>
              <View style={styles.aiProcessStep}>
                <View style={styles.aiProcessIcon}>
                  <Text style={styles.aiProcessIconText}>3️⃣</Text>
                </View>
                <Text style={styles.aiProcessText}>Search our real inventory for better alternatives</Text>
              </View>
              <View style={styles.aiProcessStep}>
                <View style={styles.aiProcessIcon}>
                  <Text style={styles.aiProcessIconText}>4️⃣</Text>
                </View>
                <Text style={styles.aiProcessText}>Get personalized recommendations & add to cart!</Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scanning Tips</Text>
            <View style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>
                  Hold phone steady and ensure barcode is clearly visible
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>🔦</Text>
                <Text style={styles.tipText}>
                  Use good lighting for better barcode recognition
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>📐</Text>
                <Text style={styles.tipText}>
                  Position camera 6-8 inches away from barcode
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>🌱</Text>
                <Text style={styles.tipText}>
                  Choose eco alternatives to maximize your EcoPoints earnings
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <ResultsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#052e16',
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
    marginBottom: 12,
  },
  headerPoints: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  headerPointsText: {
    color: '#FFC220',
    fontSize: 14,
    fontWeight: 'bold',
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
  aiFeaturesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiFeatureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  aiFeatureIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  aiFeatureContent: {
    flex: 1,
  },
  aiFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  aiFeatureText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  scanSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#059669',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 200,
  },
  scanButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  scanButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  scanContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanInstruction: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 24,
    textAlign: 'center',
  },
  scanSubInstruction: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  cancelScanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 40,
  },
  cancelScanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  loadingPoints: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingPointsText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  recentScanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentScanIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  recentScanInfo: {
    flex: 1,
  },
  recentScanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recentScanBarcode: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  recentScanTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recentScanArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  aiProcessCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiProcessStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiProcessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  aiProcessIconText: {
    fontSize: 18,
  },
  aiProcessText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
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
  modalScanAgainButton: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  aiAnalysisCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 8,
  },
  aiAnalysisText: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  scannedProductCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scannedProductTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  productBarcode: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  productMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addOriginalButton: {
    backgroundColor: '#6B7280',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addOriginalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationBrand: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  recommendationReason: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
  },
  matchScoreBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchScoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  aiBonusCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  aiBonusIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aiBonusInfo: {
    flex: 1,
  },
  aiBonusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  aiBonusText: {
    fontSize: 12,
    color: '#B45309',
  },
  locationCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  locationLabel: {
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureBullet: {
    fontSize: 12,
    color: '#10B981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#4B5563',
  },
  addRecommendationButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addRecommendationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    paddingLeft: 10,
  },
  noRecommendationsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noRecommendationsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noRecommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  noRecommendationsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipBullet: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 12,
    marginTop: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
});