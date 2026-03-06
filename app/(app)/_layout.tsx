import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AppLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Si no hay usuario, ir al login
        router.replace('/(auth)/login');
      } else {
        // Si hay usuario, redirigir según su rol
        if (user.role === 'driver') {
          router.replace('/(app)/driver');
        } else if (user.role === 'student') {
          router.replace('/(app)/student');
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Este Stack solo se muestra si hay usuario
  return (
    <Stack>
      <Stack.Screen 
        name="driver/index" 
        options={{ 
          title: 'Conductor',
          headerLeft: () => null
        }} 
      />
      <Stack.Screen 
        name="student/index" 
        options={{ 
          title: 'Seguimiento de Autobús',
          headerLeft: () => null
        }} 
      />
    </Stack>
  );
}