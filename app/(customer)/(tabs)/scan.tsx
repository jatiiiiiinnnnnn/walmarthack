// app/(customer)/(tabs)/scan.tsx - Enhanced with EcoPoints Integration
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProductRecommendation {
  scannedProduct: {
    name: string;
    brand: string;
    price: number;
    co2Impact: number;
    sustainabilityScore: number;
    ecoPoints: number;
  };
  ecoAlternatives: Array<{
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
    ecoBonus: number; // Extra points for choosing eco alternative
  }>;
}

export default function EnhancedScanTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ProductRecommendation | null>(null);
  const [userEcoPoints, setUserEcoPoints] = useState(847);

  // Enhanced product database with eco points
  const getProductRecommendation = (barcode: string): ProductRecommendation => {
    const productDatabase: { [key: string]: ProductRecommendation } = {
      '123456789012': {
        scannedProduct: {
          name: "Regular Plastic Water Bottles (24 pack)",
          brand: "AquaPure",
          price: 4.99,
          co2Impact: 5.8,
          sustainabilityScore: 2.1,
          ecoPoints: 0 // No points for regular products
        },
        ecoAlternatives: [
          {
            id: 'eco_1',
            name: "Stainless Steel Water Bottle",
            brand: "EcoFlow",
            price: 19.99,
            co2Impact: 1.2,
            co2Savings: 4.6,
            sustainabilityScore: 9.2,
            aisle: "Health & Wellness",
            section: "Aisle 12B",
            distance: "150 ft from scan location",
            features: ["BPA-free", "Insulated", "Dishwasher safe", "Lifetime warranty"],
            certifications: ["Carbon Neutral", "Recycled Materials"],
            ecoPoints: 25,
            ecoBonus: 10 // Extra 10 points for scanning and choosing eco option
          },
          {
            id: 'eco_2',
            name: "Glass Water Bottle with Silicone Sleeve",
            brand: "PureGlass",
            price: 14.99,
            co2Impact: 1.8,
            co2Savings: 4.0,
            sustainabilityScore: 8.5,
            aisle: "Health & Wellness",
            section: "Aisle 12A",
            distance: "120 ft from scan location",
            features: ["100% Glass", "Leak-proof", "Easy grip", "Dishwasher safe"],
            certifications: ["Eco-Friendly", "Recyclable"],
            ecoPoints: 18,
            ecoBonus: 8
          }
        ]
      },
      '098765432109': {
        scannedProduct: {
          name: "Ground Beef (1 lb)",
          brand: "Fresh Choice",
          price: 6.98,
          co2Impact: 27.0,
          sustainabilityScore: 3.2,
          ecoPoints: 0
        },
        ecoAlternatives: [
          {
            id: 'eco_3',
            name: "Plant-Based Ground Meat",
            brand: "Beyond",
            price: 7.99,
            co2Impact: 3.5,
            co2Savings: 23.5,
            sustainabilityScore: 8.9,
            aisle: "Refrigerated",
            section: "Aisle 8C",
            distance: "200 ft from scan location",
            features: ["20g protein", "No cholesterol", "Non-GMO", "Plant-based"],
            certifications: ["Plant-Based", "Climate-Friendly"],
            ecoPoints: 30,
            ecoBonus: 15
          },
          {
            id: 'eco_4',
            name: "Organic Lentils (1 lb)",
            brand: "Organic Valley",
            price: 3.49,
            co2Impact: 0.9,
            co2Savings: 26.1,
            sustainabilityScore: 9.5,
            aisle: "Pantry",
            section: "Aisle 15A",
            distance: "300 ft from scan location",
            features: ["High protein", "High fiber", "Organic", "Versatile"],
            certifications: ["USDA Organic", "Non-GMO"],
            ecoPoints: 20,
            ecoBonus: 12
          }
        ]
      },
      '111222333444': {
        scannedProduct: {
          name: "Regular Paper Towels (8 rolls)",
          brand: "CleanUp",
          price: 12.99,
          co2Impact: 4.2,
          sustainabilityScore: 3.0,
          ecoPoints: 0
        },
        ecoAlternatives: [
          {
            id: 'eco_5',
            name: "Bamboo Paper Towels (8 rolls)",
            brand: "EcoClean",
            price: 15.99,
            co2Impact: 1.8,
            co2Savings: 2.4,
            sustainabilityScore: 8.7,
            aisle: "Household",
            section: "Aisle 18A",
            distance: "180 ft from scan location",
            features: ["100% Bamboo", "Biodegradable", "Super absorbent", "Plastic-free packaging"],
            certifications: ["FSC Certified", "Compostable"],
            ecoPoints: 22,
            ecoBonus: 10
          }
        ]
      },
      '555666777888': {
        scannedProduct: {
          name: "Regular Laundry Detergent (64 oz)",
          brand: "SudsMaster",
          price: 11.49,
          co2Impact: 6.3,
          sustainabilityScore: 3.8,
          ecoPoints: 0
        },
        ecoAlternatives: [
          {
            id: 'eco_6',
            name: "Concentrated Eco Detergent Pods",
            brand: "GreenWash",
            price: 13.99,
            co2Impact: 2.1,
            co2Savings: 4.2,
            sustainabilityScore: 9.1,
            aisle: "Household",
            section: "Aisle 18C",
            distance: "160 ft from scan location",
            features: ["Plant-based", "Concentrated", "Plastic-free packaging", "Cold water effective"],
            certifications: ["EPA Safer Choice", "Leaping Bunny"],
            ecoPoints: 28,
            ecoBonus: 12
          }
        ]
      }
    };

    // Return a default recommendation for unknown barcodes
    return productDatabase[barcode] || {
      scannedProduct: {
        name: "Scanned Product",
        brand: "Unknown Brand",
        price: 5.99,
        co2Impact: 8.5,
        sustainabilityScore: 4.0,
        ecoPoints: 0
      },
      ecoAlternatives: [
        {
          id: 'eco_default',
          name: "Eco-Friendly Alternative",
          brand: "Green Choice",
          price: 6.99,
          co2Impact: 2.1,
          co2Savings: 6.4,
          sustainabilityScore: 8.0,
          aisle: "Organic Foods",
          section: "Aisle 10B",
          distance: "180 ft from scan location",
          features: ["Sustainable", "Eco-friendly", "Better choice"],
          certifications: ["Green Certified"],
          ecoPoints: 15,
          ecoBonus: 8
        }
      ]
    };
  };

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScannedData(data);
    setIsScanning(false);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const productRecommendation = getProductRecommendation(data);
      setRecommendation(productRecommendation);
      setLoading(false);
      setShowResults(true);
    }, 1500);
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

  const addToCartWithEcoPoints = (product: any, isEcoAlternative = false) => {
    let pointsEarned = 0;
    let productName = '';
    
    if (isEcoAlternative && recommendation) {
      pointsEarned = product.ecoPoints + product.ecoBonus;
      productName = product.name;
      setUserEcoPoints(prev => prev + pointsEarned);
    } else if (recommendation) {
      pointsEarned = recommendation.scannedProduct.ecoPoints;
      productName = recommendation.scannedProduct.name;
      if (pointsEarned > 0) {
        setUserEcoPoints(prev => prev + pointsEarned);
      }
    }

    Alert.alert(
      isEcoAlternative ? '🌱 Eco Choice Added!' : 'Added to Cart!',
      `${productName} has been added to your cart.\n\n💰 Price: $${product.price}\n🌟 EcoPoints Earned: ${pointsEarned}${pointsEarned > 0 ? '\n\n🎉 Great eco-friendly choice!' : '\n\n💡 Tip: Choose eco alternatives to earn more points!'}`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', onPress: () => {
          // Navigate to cart - in real app would use navigation
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
            Get instant eco-friendly recommendations and earn EcoPoints!
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
      <Text style={styles.loadingIcon}>🔍</Text>
      <Text style={styles.loadingTitle}>Analyzing Product...</Text>
      <Text style={styles.loadingText}>
        Finding eco-friendly alternatives and calculating EcoPoints rewards
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
          <Text style={styles.modalTitle}>Scan Results</Text>
          <TouchableOpacity onPress={() => {
            setShowResults(false);
            startScanning();
          }}>
            <Text style={styles.modalScanAgainButton}>Scan Again</Text>
          </TouchableOpacity>
        </View>

        {recommendation && (
          <ScrollView style={styles.modalContent}>
            {/* User EcoPoints Display */}
            <View style={styles.ecoPointsHeader}>
              <Text style={styles.ecoPointsTitle}>💰 Your EcoPoints</Text>
              <Text style={styles.ecoPointsBalance}>{userEcoPoints} points</Text>
            </View>

            {/* Scanned Product */}
            <View style={styles.scannedProductCard}>
              <Text style={styles.scannedProductTitle}>Scanned Product</Text>
              <Text style={styles.productName}>{recommendation.scannedProduct.name}</Text>
              <Text style={styles.productBrand}>{recommendation.scannedProduct.brand}</Text>
              
              <View style={styles.productMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Price</Text>
                  <Text style={styles.metricValue}>${recommendation.scannedProduct.price}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>CO₂ Impact</Text>
                  <Text style={[styles.metricValue, { color: '#EF4444' }]}>
                    {recommendation.scannedProduct.co2Impact} kg
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>EcoPoints</Text>
                  <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
                    {recommendation.scannedProduct.ecoPoints}
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.addOriginalButton}
                onPress={() => addToCartWithEcoPoints(recommendation.scannedProduct, false)}
              >
                <Text style={styles.addOriginalButtonText}>
                  Add to Cart • ${recommendation.scannedProduct.price}
                  {recommendation.scannedProduct.ecoPoints > 0 && ` • +${recommendation.scannedProduct.ecoPoints} points`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Eco Alternatives */}
            <Text style={styles.alternativesTitle}>🌱 Better Eco Alternatives</Text>
            
            {recommendation.ecoAlternatives.map((alternative, index) => (
              <View key={alternative.id} style={styles.alternativeCard}>
                <View style={styles.alternativeHeader}>
                  <View style={styles.alternativeInfo}>
                    <Text style={styles.alternativeName}>{alternative.name}</Text>
                    <Text style={styles.alternativeBrand}>{alternative.brand}</Text>
                  </View>
                  <View style={styles.ecoScoreBadge}>
                    <Text style={[
                      styles.ecoScoreText,
                      { color: getSustainabilityColor(alternative.sustainabilityScore) }
                    ]}>
                      {alternative.sustainabilityScore}/10
                    </Text>
                  </View>
                </View>

                <View style={styles.alternativeMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Price</Text>
                    <Text style={styles.metricValue}>${alternative.price}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>CO₂ Savings</Text>
                    <Text style={[styles.metricValue, { color: '#10B981' }]}>
                      -{alternative.co2Savings} kg
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>EcoPoints</Text>
                    <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
                      {alternative.ecoPoints}
                    </Text>
                  </View>
                </View>

                {/* EcoPoints Bonus Card */}
                <View style={styles.bonusPointsCard}>
                  <Text style={styles.bonusPointsIcon}>🎁</Text>
                  <View style={styles.bonusPointsInfo}>
                    <Text style={styles.bonusPointsTitle}>Scan Bonus!</Text>
                    <Text style={styles.bonusPointsText}>
                      Choose this eco option and earn {alternative.ecoPoints + alternative.ecoBonus} total points
                      ({alternative.ecoPoints} base + {alternative.ecoBonus} scan bonus)
                    </Text>
                  </View>
                </View>

                {/* Location Information */}
                <View style={styles.locationCard}>
                  <Text style={styles.locationTitle}>📍 Store Location</Text>
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationText}>
                      <Text style={styles.locationLabel}>Aisle: </Text>
                      {alternative.aisle}
                    </Text>
                    <Text style={styles.locationText}>
                      <Text style={styles.locationLabel}>Section: </Text>
                      {alternative.section}
                    </Text>
                    <Text style={styles.locationText}>
                      <Text style={styles.locationLabel}>Distance: </Text>
                      {alternative.distance}
                    </Text>
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featuresSection}>
                  <Text style={styles.featuresTitle}>Key Features</Text>
                  <View style={styles.featuresList}>
                    {alternative.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓</Text>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Certifications */}
                <View style={styles.certificationsSection}>
                  <Text style={styles.certificationsTitle}>Certifications</Text>
                  <View style={styles.certificationsList}>
                    {alternative.certifications.map((cert, idx) => (
                      <View key={idx} style={styles.certificationBadge}>
                        <Text style={styles.certificationText}>{cert}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.alternativeActions}>
                  <TouchableOpacity style={styles.navigateButton}>
                    <Text style={styles.navigateButtonText}>
                      🧭 Navigate to {alternative.section}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.addEcoButton}
                    onPress={() => addToCartWithEcoPoints(alternative, true)}
                  >
                    <Text style={styles.addEcoButtonText}>
                      🌱 Add Eco Choice • ${alternative.price} • +{alternative.ecoPoints + alternative.ecoBonus} points
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Impact Summary */}
            <View style={styles.impactSummary}>
              <Text style={styles.impactTitle}>🌍 Your Potential Impact</Text>
              <Text style={styles.impactText}>
                By choosing the best eco alternative, you could:
              </Text>
              <View style={styles.impactStats}>
                <View style={styles.impactStat}>
                  <Text style={styles.impactStatValue}>
                    -{Math.max(...recommendation.ecoAlternatives.map(alt => alt.co2Savings)).toFixed(1)} kg
                  </Text>
                  <Text style={styles.impactStatLabel}>CO₂ Saved</Text>
                </View>
                <View style={styles.impactStat}>
                  <Text style={styles.impactStatValue}>
                    +{Math.max(...recommendation.ecoAlternatives.map(alt => alt.ecoPoints + alt.ecoBonus))}
                  </Text>
                  <Text style={styles.impactStatLabel}>EcoPoints Earned</Text>
                </View>
              </View>
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
        <Text style={styles.headerTitle}>📱 Smart Eco Scanner</Text>
        <Text style={styles.headerSubtitle}>
          Scan products to discover eco-friendly alternatives and earn EcoPoints
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
          {/* Getting Started Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How it works</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.stepItem}>
                <View style={styles.stepIcon}>
                  <Text style={styles.stepIconText}>1️⃣</Text>
                </View>
                <Text style={styles.stepText}>Scan the barcode of any product</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepIcon}>
                  <Text style={styles.stepIconText}>2️⃣</Text>
                </View>
                <Text style={styles.stepText}>Get AI-powered eco recommendations</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepIcon}>
                  <Text style={styles.stepIconText}>3️⃣</Text>
                </View>
                <Text style={styles.stepText}>Earn EcoPoints for eco-friendly choices</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepIcon}>
                  <Text style={styles.stepIconText}>4️⃣</Text>
                </View>
                <Text style={styles.stepText}>Use points for discounts in your cart</Text>
              </View>
            </View>
          </View>

          {/* EcoPoints Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EcoPoints Benefits</Text>
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>💰</Text>
                <Text style={styles.benefitTitle}>Earn & Save</Text>
                <Text style={styles.benefitText}>
                  Earn points for eco choices, use them for discounts
                </Text>
              </View>
              <View style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>🌱</Text>
                <Text style={styles.benefitTitle}>Eco Bonuses</Text>
                <Text style={styles.benefitText}>
                  Get bonus points when you scan and choose eco alternatives
                </Text>
              </View>
              <View style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>🏆</Text>
                <Text style={styles.benefitTitle}>Rewards Tiers</Text>
                <Text style={styles.benefitText}>
                  Unlock better discounts as you collect more points
                </Text>
              </View>
            </View>
          </View>

          {/* Scan Button */}
          <View style={styles.scanSection}>
            <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
              <Text style={styles.scanButtonIcon}>📷</Text>
              <Text style={styles.scanButtonText}>Start Scanning</Text>
              <Text style={styles.scanButtonSubtext}>Tap to open camera & earn points</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Scans */}
          {scannedData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Scan</Text>
              <TouchableOpacity 
                style={styles.recentScanCard}
                onPress={() => setShowResults(true)}
              >
                <Text style={styles.recentScanIcon}>🔍</Text>
                <View style={styles.recentScanInfo}>
                  <Text style={styles.recentScanTitle}>Product Scanned</Text>
                  <Text style={styles.recentScanBarcode}>Barcode: {scannedData}</Text>
                  <Text style={styles.recentScanTime}>
                    {new Date().toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.recentScanArrow}>›</Text>
              </TouchableOpacity>
            </View>
          )}

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
    backgroundColor: '#059669',
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
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepIconText: {
    fontSize: 20,
  },
  stepText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  benefitsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    flex: 1,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
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
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  ecoPointsHeader: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  ecoPointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  ecoPointsBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
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
  alternativesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  alternativeCard: {
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
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  alternativeBrand: {
    fontSize: 14,
    color: '#6B7280',
  },
  ecoScoreBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ecoScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alternativeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  bonusPointsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  bonusPointsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  bonusPointsInfo: {
    flex: 1,
  },
  bonusPointsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  bonusPointsText: {
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
  locationDetails: {
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
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
  certificationsSection: {
    marginBottom: 16,
  },
  certificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  certificationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  certificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  alternativeActions: {
    gap: 12,
  },
  navigateButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addEcoButton: {
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
  addEcoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  impactSummary: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    margin: 8,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  impactText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStat: {
    alignItems: 'center',
  },
  impactStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  impactStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});