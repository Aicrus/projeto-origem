import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'web' ? 'none' : 'fade',
        animationDuration: Platform.OS === 'web' ? 0 : 200,
        contentStyle: {
          backgroundColor: 'transparent'
        }
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login'
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Cadastro'
        }}
      />
    </Stack>
  );
} 