import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/ThemeContext';
import { colors } from '../../../constants/theme';

export type GradientType = 'primary' | 'secondary' | 'tertiary' | 'custom';

export interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  type?: GradientType;
  colors?: [string, string]; // Tipado corretamente para dois valores
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

/**
 * Componente de gradiente que se adapta para web e nativo
 * Com suporte a tema claro/escuro
 * 
 * @param {GradientViewProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente GradientView
 */
export const GradientView: React.FC<GradientViewProps> = ({
  children,
  style,
  type = 'primary',
  colors: customColors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => {
  // Obter o tema atual
  const { currentTheme, getColorByMode } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Definir gradientes com base nas cores do tema
  const GRADIENTS_LIGHT: Record<Exclude<GradientType, 'custom'>, [string, string]> = {
    primary: [getColorByMode('primary'), colors['gradient-primary-end']],
    secondary: [getColorByMode('secondary'), colors['gradient-secondary-end']],
    tertiary: [getColorByMode('tertiary'), colors['gradient-tertiary-end']],
  };

  const GRADIENTS_DARK: Record<Exclude<GradientType, 'custom'>, [string, string]> = {
    primary: [getColorByMode('primary'), colors['gradient-primary-end']],
    secondary: [getColorByMode('secondary'), colors['gradient-secondary-end']],
    tertiary: [getColorByMode('tertiary'), colors['gradient-tertiary-end']],
  };
  
  // Selecionar o conjunto de gradientes com base no tema
  const GRADIENTS = isDark ? GRADIENTS_DARK : GRADIENTS_LIGHT;
  
  // Usar cores personalizadas ou pegar do objeto GRADIENTS
  const gradientColors = customColors || (type !== 'custom' ? GRADIENTS[type] : GRADIENTS.primary);

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundImage: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
}); 