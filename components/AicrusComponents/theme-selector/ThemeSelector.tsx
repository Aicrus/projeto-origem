import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Pressable, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/ThemeContext';
import { colors } from '../constants/theme';

const THEME_ICONS = {
  system: 'desktop-outline',
  light: 'sunny-outline',
  dark: 'moon-outline',
} as const;

const BUTTON_WIDTH = 32;
const PADDING = 2;
const CONTAINER_WIDTH = BUTTON_WIDTH * 3 + PADDING * 2;

const getInitialPosition = (mode: 'system' | 'light' | 'dark') => {
  return mode === 'light' ? 0 : mode === 'dark' ? 1 : 2;
};

// Configurações específicas para cada plataforma com ajustes para evitar overshooting
const SPRING_CONFIG = Platform.select({
  web: {
    damping: 20,
    stiffness: 180,
    overshootClamping: true,
  },
  default: {
    damping: 25,
    stiffness: 250,
    mass: 0.5,
    overshootClamping: true,
  },
});

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { themeMode, setThemeMode, currentTheme } = useTheme();
  const targetPosition = useSharedValue(getInitialPosition(themeMode));
  
  // Atualiza a posição alvo quando o themeMode muda
  useEffect(() => {
    targetPosition.value = getInitialPosition(themeMode);
  }, [themeMode]);
  
  // Valor derivado para garantir que a animação fique dentro dos limites
  const clampedTranslateX = useDerivedValue(() => {
    const targetX = targetPosition.value * BUTTON_WIDTH;
    // Anima para a posição alvo com spring
    return withSpring(targetX, SPRING_CONFIG);
  });

  const handlePress = useCallback((mode: 'system' | 'light' | 'dark') => {
    if (mode === themeMode) return; // Evita animações desnecessárias
    setThemeMode(mode);
  }, [setThemeMode, themeMode]);

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: clampedTranslateX.value }],
    };
  });

  const isDark = currentTheme === 'dark';

  // Função para determinar a cor do ícone
  const getIconColor = (mode: 'system' | 'light' | 'dark') => {
    // Se for o modo selecionado, sempre branco
    if (mode === themeMode) {
      return '#FFFFFF';
    } 
    // Para os ícones não selecionados
    else {
      return isDark ? colors.gray[400] : colors.gray[600];
    }
  };

  return (
    <View className={`${className}`}>
      <View 
        className="flex-row rounded-md p-[2px] relative"
        style={[
          styles.switchContainer, 
          { backgroundColor: isDark ? colors.gray[800] : colors.gray[200] }
        ]}>
        <Animated.View 
          className="absolute rounded-md"
          style={[
            styles.slider,
            animatedSliderStyle,
            { 
              // Usar a cor principal (main) para o modo claro ao invés da versão suave (light)
              backgroundColor: isDark ? colors.primary.dark : colors.primary.main,
              // Sombra mais sutil
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1,
              elevation: 1,
            }
          ]} 
        />
        {(['light', 'dark', 'system'] as const).map((mode, index) => (
          <Pressable
            key={mode}
            className={`w-8 h-8 items-center justify-center pb-[2px] z-10 ${
              index === 0 ? 'rounded-l-md' : index === 2 ? 'rounded-r-md' : ''
            }`}
            onPress={() => handlePress(mode)}>
            <Ionicons
              name={THEME_ICONS[mode]}
              size={16}
              color={getIconColor(mode)}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    borderRadius: 6,
    padding: PADDING,
    position: 'relative',
    width: CONTAINER_WIDTH,
    height: 32,
  },
  slider: {
    position: 'absolute',
    // Ligeiramente menor para não ficar muito próximo às bordas
    width: BUTTON_WIDTH - 1,
    height: 26,
    borderRadius: 4,
    zIndex: 0,
    left: PADDING + 0.5,
    top: 3,
  },
}); 