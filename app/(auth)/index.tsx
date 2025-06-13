// app/(auth)/index.tsx - Fixed to Save Real User Data
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppData } from '../contexts/AppDataContext';

const { height: screenHeight } = Dimensions.get('window');

export default function AuthPage() {
  const { updateUserProfile } = useAppData();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'employee'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        Alert.alert('Error', 'Please enter your full name');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      console.log('Form submitted:', { userType, isLogin, formData });

      // Update user profile with real data from form
      const userData = {
        name: isLogin ? 
          formData.email.split('@')[0] : // For login, use email prefix as name if no first/last name
          `${formData.firstName} ${formData.lastName}`, // For signup, use first + last name
        email: formData.email,
        phone: '+91 98765 43210', // Default phone, can be updated later
        location: 'Delhi, India', // Default location, can be updated later
      };

      updateUserProfile(userData);

      // Navigate to appropriate dashboard based on user type
      if (userType === 'customer') {
        router.replace('/(customer)/(tabs)/dashboard');
      } else {
        router.replace('/(employee)/(tabs)/dashboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        {/* Compact Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🌱</Text>
          </View>
          <Text style={styles.title}>WGreen</Text>
          <Text style={styles.subtitle}>Sustainable future starts here</Text>
        </View>

        {/* User Type Selection - Compact */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            onPress={() => setUserType('customer')}
            style={[
              styles.userTypeButton,
              userType === 'customer' ? styles.userTypeButtonActive : styles.userTypeButtonInactive
            ]}
          >
            <Text style={styles.userTypeIcon}>👤</Text>
            <Text style={[
              styles.userTypeText,
              userType === 'customer' ? styles.userTypeTextActive : styles.userTypeTextInactive
            ]}>
              Customer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setUserType('employee')}
            style={[
              styles.userTypeButton,
              userType === 'employee' ? styles.userTypeButtonActive : styles.userTypeButtonInactive
            ]}
          >
            <Text style={styles.userTypeIcon}>👔</Text>
            <Text style={[
              styles.userTypeText,
              userType === 'employee' ? styles.userTypeTextActive : styles.userTypeTextInactive
            ]}>
              Employee
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Form Card - Compact */}
        <View style={styles.formCard}>
          {/* Login/Signup Toggle */}
          <View style={styles.authToggle}>
            <TouchableOpacity
              onPress={() => setIsLogin(true)}
              style={[
                styles.authToggleButton,
                isLogin ? styles.authToggleActive : styles.authToggleInactive
              ]}
            >
              <Text style={[
                styles.authToggleText,
                isLogin ? styles.authToggleTextActive : styles.authToggleTextInactive
              ]}>
                Sign In
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setIsLogin(false)}
              style={[
                styles.authToggleButton,
                !isLogin ? styles.authToggleActive : styles.authToggleInactive
              ]}
            >
              <Text style={[
                styles.authToggleText,
                !isLogin ? styles.authToggleTextActive : styles.authToggleTextInactive
              ]}>
                Join Us
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields - Compact */}
          <View style={styles.formFields}>
            {/* Name fields for signup */}
            {!isLogin && (
              <View style={styles.nameFieldsContainer}>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      value={formData.firstName}
                      onChangeText={(value) => handleInputChange('firstName', value)}
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="#8B9A8B"
                    />
                  </View>
                </View>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      value={formData.lastName}
                      onChangeText={(value) => handleInputChange('lastName', value)}
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="#8B9A8B"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                style={styles.input}
                placeholder={userType === 'employee' ? 'employee@company.com' : 'your@email.com'}
                placeholderTextColor="#8B9A8B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#8B9A8B"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Password for signup */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#8B9A8B"
                  secureTextEntry
                />
              </View>
            )}

            {/* Forgot Password Link */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
              <Text style={styles.submitButtonIcon}>🌿</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoText}>
              {isLogin ? "New to EcoConnect? " : "Already have an account? "}
              <Text 
                style={styles.linkText}
                onPress={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Join us' : 'Sign in'}
              </Text>
            </Text>
          </View>
        </View>

        {/* Environmental Footer Badge */}
        <View style={styles.environmentalFooter}>
          <Text style={styles.environmentalText}>🌍 50K+ eco-warriors joined</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332', // Deep forest green
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    maxHeight: screenHeight,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 65,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#52B788',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAF8',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#A7C9A7',
    textAlign: 'center',
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  userTypeButtonActive: {
    backgroundColor: '#2D5A3D',
    borderWidth: 2,
    borderColor: '#52B788',
  },
  userTypeButtonInactive: {
    backgroundColor: 'rgba(45, 90, 61, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(167, 201, 167, 0.3)',
  },
  userTypeIcon: {
    fontSize: 16,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: '#F8FAF8',
  },
  userTypeTextInactive: {
    color: '#A7C9A7',
  },
  formCard: {
    backgroundColor: '#F8FAF8',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 16,
  },
  authToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 3,
  },
  authToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  authToggleActive: {
    backgroundColor: '#52B788',
  },
  authToggleInactive: {
    backgroundColor: 'transparent',
  },
  authToggleText: {
    fontWeight: '600',
    fontSize: 14,
  },
  authToggleTextActive: {
    color: 'white',
  },
  authToggleTextInactive: {
    color: '#6B7280',
  },
  formFields: {
    gap: 16,
  },
  nameFieldsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5F3E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  inputIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#52B788',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#52B788',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#52B788',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  submitButtonIcon: {
    fontSize: 14,
  },
  additionalInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  linkText: {
    color: '#52B788',
    fontWeight: '600',
  },
  environmentalFooter: {
    alignItems: 'center',
    backgroundColor: 'rgba(167, 201, 167, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 201, 167, 0.3)',
  },
  environmentalText: {
    fontSize: 12,
    color: '#A7C9A7',
    fontWeight: '500',
  },
});