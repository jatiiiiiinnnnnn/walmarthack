// app/index.tsx - Welcome Screen
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppData } from './contexts/AppDataContext';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { userProfile, userEcoPoints } = useAppData();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome to EcoCart',
      description: 'Shop smarter, save money, and help the planet with every purchase. Discover eco-friendly alternatives and earn rewards!',
      icon: '🌍',
      color: '#059669'
    },
    {
      id: 2,
      title: 'Earn EcoPoints',
      description: 'Choose sustainable products and earn EcoPoints. Use them for discounts on future purchases and unlock exclusive rewards!',
      icon: '💰',
      color: '#F59E0B'
    },
    {
      id: 3,
      title: 'Smart Scanning',
      description: 'Scan any product barcode to get instant eco-friendly recommendations with store directions and sustainability scores.',
      icon: '📱',
      color: '#3B82F6'
    },
    {
      id: 4,
      title: 'Rescue Deals',
      description: 'Save money and reduce food waste with our rescue deals. Get fresh products at discounted prices before they expire.',
      icon: '🛟',
      color: '#EF4444'
    },
    {
      id: 5,
      title: 'Environmental Impact',
      description: 'Track your positive environmental impact, earn achievements, and see how your choices make a difference for the planet.',
      icon: '🌱',
      color: '#10B981'
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/(customer)/(tabs)/dashboard');
    }
  };

  const skipOnboarding = () => {
    router.push('/(customer)/(tabs)/dashboard');
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {userProfile.name.split(' ')[0]}! 👋</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>💰 {userEcoPoints}</Text>
            <Text style={styles.statLabel}>EcoPoints</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🌍 {userProfile.co2Saved.toFixed(1)}kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🏆 {userProfile.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      </View>

      {/* Onboarding Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.onboardingCard, { backgroundColor: currentStepData.color + '10', borderColor: currentStepData.color + '30' }]}>
          <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
          <Text style={[styles.stepTitle, { color: currentStepData.color }]}>
            {currentStepData.title}
          </Text>
          <Text style={styles.stepDescription}>
            {currentStepData.description}
          </Text>
        </View>

        {/* Features Overview */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you can do today:</Text>
          
          <View style={styles.featuresList}>
            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(customer)/(tabs)/dashboard')}>
              <Text style={styles.featureIcon}>🛒</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Smart Shopping</Text>
                <Text style={styles.featureDescription}>Browse 1000+ products with eco alternatives</Text>
              </View>
              <Text style={styles.featureArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(customer)/(tabs)/scan')}>
              <Text style={styles.featureIcon}>📱</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Scan Products</Text>
                <Text style={styles.featureDescription}>Get instant eco recommendations</Text>
              </View>
              <Text style={styles.featureArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(customer)/(tabs)/cart' as any)}>
              <Text style={styles.featureIcon}>🛍️</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Smart Cart</Text>
                <Text style={styles.featureDescription}>Use EcoPoints for discounts</Text>
              </View>
              <Text style={styles.featureArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(customer)/(tabs)/challenges')}>
              <Text style={styles.featureIcon}>🎯</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Eco Challenges</Text>
                <Text style={styles.featureDescription}>Complete challenges, earn rewards</Text>
              </View>
              <Text style={styles.featureArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(customer)/(tabs)/impact')}>
              <Text style={styles.featureIcon}>🌍</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Your Impact</Text>
                <Text style={styles.featureDescription}>Track your environmental contribution</Text>
              </View>
              <Text style={styles.featureArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>Your Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityIcon}>🌱</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>You chose 3 eco-friendly products this week</Text>
              <Text style={styles.activityPoints}>+45 EcoPoints earned</Text>
            </View>
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityIcon}>♻️</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Saved 2.6kg CO₂ from sustainable choices</Text>
              <Text style={styles.activityImpact}>Environmental Impact</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Step Indicators */}
      <View style={styles.stepIndicators}>
        {onboardingSteps.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stepDot,
              currentStep === index && styles.stepDotActive,
              { backgroundColor: currentStep === index ? currentStepData.color : '#E5E7EB' }
            ]}
            onPress={() => goToStep(index)}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipButtonText}>Skip Tour</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: currentStepData.color }]} 
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Start Shopping' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFC220',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  onboardingCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  stepIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
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
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  featureArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  activityPoints: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  activityImpact: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  stepDotActive: {
    transform: [{ scale: 1.2 }],
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});