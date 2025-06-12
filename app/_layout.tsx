// app/_layout.tsx - Updated Root Layout with Enhanced Configuration
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppDataProvider } from './contexts/AppDataContext';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="light" backgroundColor="#059669" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          headerStyle: {
            backgroundColor: '#059669',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'EcoCart - Welcome',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            title: 'Authentication',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(customer)" 
          options={{ 
            title: 'EcoCart - Smart Shopping',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(employee)" 
          options={{ 
            title: 'EcoCart - Employee Dashboard',
            headerShown: false 
          }} 
        />
      </Stack>
    </AppDataProvider>
  );
}