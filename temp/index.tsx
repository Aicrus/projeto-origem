import { Platform, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

/**
 * Componente que seleciona automaticamente a implementação de TabBar adequada 
 * para a plataforma atual (iOS, Android ou web)
 */
export const TabBarBackground = (props: any) => {
  // Importação dinâmica baseada na plataforma
  if (Platform.OS === 'ios') {
    const IOSTabBar = require('./iOSTabBar').default;
    return <IOSTabBar {...props} />;
  } else if (Platform.OS === 'web') {
    const WebTabBar = require('./WebTabBar').default;
    return <WebTabBar {...props} />;
  } else {
    // Android ou outros
    const AndroidTabBar = require('./AndroidTabBar').default;
    return <AndroidTabBar {...props} />;
  }
};

// Exporta o componente de Tab com feedback háptico
export const HapticTab = (props: BottomTabBarButtonProps) => {
  const { HapticTab: HapticComponent } = require('./HapticTab');
  return <HapticComponent {...props} />;
};

// Hook para lidar com o overflow da tab bar em diferentes plataformas
export function useBottomTabOverflow() {
  if (Platform.OS === 'ios') {
    // No iOS, importa e retorna a implementação que considera a área segura
    const { useBottomTabOverflow: iOSOverflow } = require('./iOSTabBar');
    return iOSOverflow();
  }
  
  // Para Android e web, retorna 0 (sem overflow)
  return 0;
} 