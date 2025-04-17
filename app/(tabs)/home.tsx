import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Classe de fundo baseada no tema
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';

  return (
    <View className={`flex-1 ${bgPrimary}`} style={styles.container}>
      <Header />
      {/* Resto do conteúdo da página */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 