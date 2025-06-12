// app/(customer)/(tabs)/_layout.tsx - Updated with all tabs
import { Tabs } from 'expo-router';
import { Text } from 'react-native';


export default function CustomerTabsLayout() {
  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 84,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#059669',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Shop',
          headerTitle: 'EcoCart',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size * 0.8, color }}>🛒</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Challenges',
          headerTitle: 'Environmental Challenges',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size * 0.8, color }}>🎯</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: 'Impact',
          headerTitle: 'My Environmental Impact',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size * 0.8, color }}>🌍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size * 0.8, color }}>👤</Text>
          ),
        }}
      />
   
    
    </Tabs>
 
  );
}