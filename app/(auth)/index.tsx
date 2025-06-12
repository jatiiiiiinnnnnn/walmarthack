// app/(auth)/index.tsx - REACT NATIVE VERSION
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Note: You'll need to install react-native-vector-icons or use expo-vector-icons
// For now, I'll use text instead of icons

export default function AuthPage() {
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
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>EC</Text>
          </View>
          <Text style={styles.title}>EcoConnect</Text>
          <Text style={styles.subtitle}>Together for a greener tomorrow</Text>
        </View>

        {/* User Type Toggle */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            onPress={() => setUserType('customer')}
            style={[
              styles.userTypeButton,
              userType === 'customer' ? styles.userTypeButtonActive : styles.userTypeButtonInactive
            ]}
          >
            <View style={[styles.userTypeIconContainer, userType === 'customer' && styles.userTypeIconActive]}>
              <Text style={[styles.userTypeIconText, userType === 'customer' && styles.userTypeIconTextActive]}>C</Text>
            </View>
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
            <View style={[styles.userTypeIconContainer, userType === 'employee' && styles.userTypeIconActive]}>
              <Text style={[styles.userTypeIconText, userType === 'employee' && styles.userTypeIconTextActive]}>E</Text>
            </View>
            <Text style={[
              styles.userTypeText,
              userType === 'employee' ? styles.userTypeTextActive : styles.userTypeTextInactive
            ]}>
              Employee
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Form Card */}
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
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formFields}>
            {/* Name fields for signup */}
            {!isLogin && (
              <View style={styles.nameFieldsContainer}>
                <View style={styles.nameField}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.nameField}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                style={styles.input}
                placeholder={userType === 'employee' ? 'employee@company.com' : 'your@email.com'}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password for signup */}
            {!isLogin && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
            )}

            {/* Forgot Password Link */}
            {isLogin && (
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text 
                style={styles.linkText}
                onPress={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </Text>
            </Text>
          </View>

          {/* Environment Message */}
          
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#ECFDF5', // Light green background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: '#059669',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  userTypeContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  userTypeButtonActive: {
    backgroundColor: '#059669',
  },
  userTypeButtonInactive: {
    backgroundColor: 'transparent',
  },
  userTypeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userTypeIconActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userTypeIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  userTypeIconTextActive: {
    color: 'white',
  },
  userTypeText: {
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: 'white',
  },
  userTypeTextInactive: {
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  authToggle: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  authToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  authToggleActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#059669',
  },
  authToggleInactive: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  authToggleText: {
    fontWeight: '600',
  },
  authToggleTextActive: {
    color: '#059669',
  },
  authToggleTextInactive: {
    color: '#9CA3AF',
  },
  formFields: {
    gap: 24,
  },
  nameFieldsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  nameField: {
    flex: 1,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    paddingRight: 16,
  },
  eyeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  submitButton: {
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
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  additionalInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    color: '#059669',
    fontWeight: '600',
  },
  environmentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    paddingRight: 0,
  },
  environmentIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  environmentIconText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  environmentText: {
    fontSize: 14,
    color: '#15803D',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});