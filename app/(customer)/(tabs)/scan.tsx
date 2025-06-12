// app/(customer)/(tabs)/scan.tsx
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
  }>;
}

export default function ScanTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ProductRecommendation | null>(null);

  // Mock product database - In real app, this would be an API call
  const getProductRecommendation = (barcode: string): ProductRecommendation => {
    // Simulate different products based on barcode
    const productDatabase: { [key: string]: ProductRecommendation } = {
      '123456789012': {
        scannedProduct: {
          name: "Regular Plastic Water Bottles (24 pack)",
          brand: "AquaPure",
          price: 4.99,
          co2Impact: 5.8,
          sustainabilityScore: 2.1
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
            features: ["BPA-free", "Insulated", "Dishwasher safe"],
            certifications: ["Carbon Neutral", "Recycled Materials"]
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
            features: ["100% Glass", "Leak-proof", "Easy grip"],
            certifications: ["Eco-Friendly", "Recyclable"]
          }
        ]
      },
      '098765432109': {
        scannedProduct: {
          name: "Ground Beef (1 lb)",
          brand: "Fresh Choice",
          price: 6.98,
          co2Impact: 27.0,
          sustainabilityScore: 3.2
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
            features: ["20g protein", "No cholesterol", "Non-GMO"],
            certifications: ["Plant-Based", "Climate-Friendly"]
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
            features: ["High protein", "High fiber", "Organic"],
            certifications: ["USDA Organic", "Non-GMO"]
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
        sustainabilityScore: 4.0
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
          certifications: ["Green Certified"]
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
        Finding eco-friendly alternatives for you
      </Text>
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
                  <Text style={styles.metricLabel}>Eco Score</Text>
                  <Text style={[
                    styles.metricValue, 
                    { color: getSustainabilityColor(recommendation.scannedProduct.sustainabilityScore) }
                  ]}>
                    {recommendation.scannedProduct.sustainabilityScore}/10
                  </Text>
                </View>
              </View>
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

                {/* Eco Points Reward */}
                <View style={styles.ecoPointsCard}>
                  <Text style={styles.ecoPointsIcon}>⭐</Text>
                  <View style={styles.ecoPointsInfo}>
                    <Text style={styles.ecoPointsTitle}>Eco Reward</Text>
                    <Text style={styles.ecoPointsText}>Receive 20 eco points on this purchase</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.navigateButton}>
                  <Text style={styles.navigateButtonText}>
                    🧭 Navigate to {alternative.section}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Impact Summary */}
            <View style={styles.impactSummary}>
              <Text style={styles.impactTitle}>🌍 Environmental Impact</Text>
              <Text style={styles.impactText}>
                By choosing the best eco alternative, you could save up to{' '}
                <Text style={styles.impactHighlight}>
                  {Math.max(...recommendation.ecoAlternatives.map(alt => alt.co2Savings)).toFixed(1)} kg CO₂
                </Text>
                {' '}per purchase!
              </Text>
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
          Scan products to discover eco-friendly alternatives
        </Text>
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
                <Text style={styles.stepText}>Find alternatives with store directions</Text>
              </View>
            </View>
          </View>

          {/* Scan Button */}
          <View style={styles.scanSection}>
            <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
              <Text style={styles.scanButtonIcon}>📷</Text>
              <Text style={styles.scanButtonText}>Start Scanning</Text>
              <Text style={styles.scanButtonSubtext}>Tap to open camera</Text>
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
    justifyContent: 'space-between',
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
  ecoPointsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  ecoPointsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  ecoPointsInfo: {
    flex: 1,
  },
  ecoPointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  ecoPointsText: {
    fontSize: 14,
    color: '#B45309',
  },
  navigateButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  impactSummary: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  impactText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  impactHighlight: {
    fontWeight: 'bold',
    color: '#059669',
  },
});