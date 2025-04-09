import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import React from 'react';

export default function NotFoundScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className={`flex-1 items-center justify-center p-5 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Esta tela não existe.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className={`text-base font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Voltar para a tela inicial!
          </Text>
        </Link>
      </View>
    </>
  );
}
