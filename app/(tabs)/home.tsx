import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Classe de fundo baseada no tema
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';

  return (
    <View className={`flex-1 ${bgPrimary}`} />
  );
} 