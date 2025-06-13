// app/(employee)/(tabs)/_layout.tsx - Updated with all tabs
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


export default function EmployeeTabsLayout() {
  return (

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#047857',
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
            fontSize: 10,
            fontWeight: '500',
            marginTop: 4,
          },
          headerStyle: {
            backgroundColor: '#047857',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            headerTitle: 'Employee Portal',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            headerTitle: 'Performance Analytics',
            tabBarIcon: ({ color, size }) => (
              <Feather name="bar-chart-2" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            title: 'Customers',
            headerTitle: 'Customer Management',
            tabBarIcon: ({ color, size }) => (
              <Feather name="users" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            headerTitle: 'Task Management',
            tabBarIcon: ({ color, size }) => (
              <Feather name="check-square" color={color} size={size} />
            ),
          }}
        />
      </Tabs>

  );
}