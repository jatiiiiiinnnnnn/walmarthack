// app/(customer)/(tabs)/challenges.tsx
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const activeChallenges = [
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
    timeLeft: '3 days',
    tips: [
      'Plan your meals in advance',
      'Buy only what you need',
      'Use leftovers creatively',
      'Compost organic waste'
    ]
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
    timeLeft: '1 week',
    tips: [
      'Walk or bike to nearby stores',
      'Use public transportation',
      'Combine multiple errands',
      'Shop during off-peak hours'
    ]
  },
  {
    id: 3,
    title: 'Plant-Based Pioneer',
    description: 'Choose plant-based alternatives for 80% of your protein purchases',
    progress: 45,
    target: 20,
    current: 9,
    unit: 'items',
    reward: 300,
    difficulty: 'Medium',
    category: 'Diet Impact',
    timeLeft: '2 weeks',
    tips: [
      'Try lentils and beans',
      'Explore tofu and tempeh',
      'Consider plant-based milk',
      'Read about protein combinations'
    ]
  }
];

const availableChallenges = [
  {
    id: 4,
    title: 'Local Hero',
    description: 'Support local businesses by buying 15 locally-sourced products',
    target: 15,
    unit: 'products',
    reward: 200,
    difficulty: 'Easy',
    category: 'Community',
    duration: '2 weeks',
    requirements: ['Must be first-time local purchase', 'Products must be from within 50 miles']
  },
  {
    id: 5,
    title: 'Packaging Warrior',
    description: 'Choose products with minimal or recyclable packaging',
    target: 25,
    unit: 'products',
    reward: 180,
    difficulty: 'Medium',
    category: 'Waste Reduction',
    duration: '10 days',
    requirements: ['Focus on bulk items', 'Avoid single-use plastics']
  },
  {
    id: 6,
    title: 'Energy Saver',
    description: 'Reduce your shopping carbon footprint by 30%',
    target: 30,
    unit: 'percent',
    reward: 400,
    difficulty: 'Hard',
    category: 'Energy',
    duration: '1 month',
    requirements: ['Track all purchases', 'Focus on low-impact items']
  }
];

export default function ChallengesTab() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'available'

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Waste Reduction': return '♻️';
      case 'Transportation': return '🚲';
      case 'Diet Impact': return '🌱';
      case 'Community': return '🏘️';
      case 'Energy': return '⚡';
      default: return '🎯';
    }
  };

  const joinChallenge = (challenge: any) => {
    Alert.alert(
      'Join Challenge',
      `Are you ready to start "${challenge.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            Alert.alert('Success!', `You've joined the ${challenge.title} challenge. Good luck!`);
            setShowChallengeModal(false);
          }
        }
      ]
    );
  };

  type Challenge = {
    id: number;
    title: string;
    description: string;
    target: number;
    unit: string;
    reward: number;
    difficulty: string;
    category: string;
    // Optional fields for active challenges
    progress?: number;
    current?: number;
    timeLeft?: string;
    tips?: string[];
    // Optional fields for available challenges
    duration?: string;
    requirements?: string[];
  };

  const ChallengeCard = ({
    challenge,
    isActive = true,
  }: {
    challenge: Challenge;
    isActive?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.challengeCard}
      onPress={() => {
        setSelectedChallenge(challenge);
        setShowChallengeModal(true);
      }}
    >
      <View style={styles.challengeHeader}>
        <View style={styles.challengeHeaderLeft}>
          <Text style={styles.challengeIcon}>{getCategoryIcon(challenge.category)}</Text>
          <View style={styles.challengeHeaderText}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeCategory}>{challenge.category}</Text>
          </View>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(challenge.difficulty) }]}>
            {challenge.difficulty}
          </Text>
        </View>
      </View>

      <Text style={styles.challengeDescription}>{challenge.description}</Text>

      {isActive ? (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {'current' in challenge && typeof challenge.current !== 'undefined'
                ? `${challenge.current} / ${challenge.target} ${challenge.unit}`
                : `${challenge.target} ${challenge.unit}`}
            </Text>
            {'progress' in challenge && typeof challenge.progress !== 'undefined' && (
              <Text style={styles.progressPercentage}>{challenge.progress}%</Text>
            )}
          </View>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${'progress' in challenge && typeof challenge.progress !== 'undefined' ? challenge.progress : 0}%` }
              ]} 
            />
          </View>
          <View style={styles.challengeFooter}>
            {'timeLeft' in challenge && (
              <Text style={styles.timeLeft}>⏰ {challenge.timeLeft} left</Text>
            )}
            <Text style={styles.rewardText}>🏆 {challenge.reward} points</Text>
          </View>
        </View>
      ) : (
        <View style={styles.availableChallengeFooter}>
          <View style={styles.challengeDetails}>
            <Text style={styles.challengeTarget}>{challenge.target} {challenge.unit}</Text>
            <Text style={styles.challengeDuration}>📅 {challenge.duration}</Text>
          </View>
          <Text style={styles.rewardText}>🏆 {challenge.reward} points</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ChallengeModal = () => (
    <Modal visible={showChallengeModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowChallengeModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Challenge Details</Text>
          <View />
        </View>

        {selectedChallenge && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalChallengeHeader}>
              <Text style={styles.modalChallengeIcon}>
                {getCategoryIcon(selectedChallenge.category)}
              </Text>
              <Text style={styles.modalChallengeTitle}>{selectedChallenge.title}</Text>
              <View style={[
                styles.modalDifficultyBadge, 
                { backgroundColor: getDifficultyColor(selectedChallenge.difficulty) }
              ]}>
                <Text style={styles.modalDifficultyText}>{selectedChallenge.difficulty}</Text>
              </View>
            </View>

            <Text style={styles.modalDescription}>{selectedChallenge.description}</Text>

            {selectedChallenge.progress !== undefined ? (
              // Active challenge details
              <View style={styles.modalProgressSection}>
                <Text style={styles.modalSectionTitle}>Your Progress</Text>
                <View style={styles.modalProgressCard}>
                  <View style={styles.modalProgressHeader}>
                    <Text style={styles.modalProgressText}>
                      {selectedChallenge.current} / {selectedChallenge.target} {selectedChallenge.unit}
                    </Text>
                    <Text style={styles.modalProgressPercentage}>{selectedChallenge.progress}%</Text>
                  </View>
                  <View style={styles.modalProgressTrack}>
                    <View 
                      style={[styles.modalProgressFill, { width: `${selectedChallenge.progress}%` }]} 
                    />
                  </View>
                  <Text style={styles.modalTimeLeft}>⏰ {selectedChallenge.timeLeft} remaining</Text>
                </View>

                <Text style={styles.modalSectionTitle}>Tips for Success</Text>
                <View style={styles.tipsContainer}>
                  {selectedChallenge.tips && selectedChallenge.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <Text style={styles.tipBullet}>💡</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              // Available challenge details
              <View style={styles.modalDetailsSection}>
                <View style={styles.modalInfoGrid}>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Target</Text>
                    <Text style={styles.modalInfoValue}>
                      {selectedChallenge.target} {selectedChallenge.unit}
                    </Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Duration</Text>
                    <Text style={styles.modalInfoValue}>{selectedChallenge.duration}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Reward</Text>
                    <Text style={styles.modalInfoValue}>{selectedChallenge.reward} points</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Category</Text>
                    <Text style={styles.modalInfoValue}>{selectedChallenge.category}</Text>
                  </View>
                </View>

                {selectedChallenge.requirements && (
                  <View style={styles.requirementsSection}>
                    <Text style={styles.modalSectionTitle}>Requirements</Text>
                    {selectedChallenge.requirements.map((requirement, index) => (
                      <View key={index} style={styles.requirementItem}>
                        <Text style={styles.requirementBullet}>✓</Text>
                        <Text style={styles.requirementText}>{requirement}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => joinChallenge(selectedChallenge)}
                >
                  <Text style={styles.joinButtonText}>Join This Challenge</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Environmental Challenges</Text>
        <Text style={styles.headerSubtitle}>Take on challenges to earn points and help the planet!</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'active' && styles.tabButtonTextActive]}>
            Active ({activeChallenges.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'available' && styles.tabButtonActive]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'available' && styles.tabButtonTextActive]}>
            Available ({availableChallenges.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'active' ? (
          <View>
            {activeChallenges.length > 0 ? (
              <View style={styles.challengesContainer}>
                {activeChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} isActive={true} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyChallenges}>
                <Text style={styles.emptyChallengesIcon}>🎯</Text>
                <Text style={styles.emptyChallengesTitle}>No Active Challenges</Text>
                <Text style={styles.emptyChallengesText}>
                  Browse available challenges to start your eco-journey!
                </Text>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={() => setActiveTab('available')}
                >
                  <Text style={styles.browseButtonText}>Browse Challenges</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View style={styles.availableHeader}>
              <Text style={styles.availableHeaderTitle}>Available Challenges</Text>
              <Text style={styles.availableHeaderSubtitle}>
                Choose challenges that match your lifestyle and goals
              </Text>
            </View>
            
            <View style={styles.challengesContainer}>
              {availableChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} isActive={false} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <ChallengeModal />
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
  tabNavigation: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#059669',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: '#059669',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  challengesContainer: {
    gap: 16,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  challengeHeaderText: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  challengeCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLeft: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  rewardText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  availableChallengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  challengeDetails: {
    flex: 1,
  },
  challengeTarget: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  challengeDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyChallenges: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyChallengesIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyChallengesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyChallengesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  availableHeader: {
    marginBottom: 24,
  },
  availableHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  availableHeaderSubtitle: {
    fontSize: 16,
    color: '#6B7280',
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalChallengeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalChallengeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalChallengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDifficultyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalDifficultyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 18,
    color: '#4B5563',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 32,
  },
  modalProgressSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  modalProgressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalProgressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalProgressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  modalProgressTrack: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 6,
  },
  modalTimeLeft: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '500',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalDetailsSection: {
    marginBottom: 24,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  modalInfoItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  requirementsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementBullet: {
    fontSize: 16,
    color: '#059669',
    marginRight: 12,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  joinButton: {
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
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});