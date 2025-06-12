import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppDataProvider } from './contexts/AppDataContext';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(employee)" />
      </Stack>
    </AppDataProvider>
  );
}